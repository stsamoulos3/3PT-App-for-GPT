import hc from "../helpers/api";
import { apiCall } from "../helpers/apiInterceptor";

export type CalorieCountingMethod = "MODEL1" | "MODEL2" | "MODEL3" | "MODEL4";

export interface HrCalorieZone {
	id: string;
	hrMin: number;
	hrMax: number;
	caloriesPerMinute: number;
	fatPercentage: number | null;
	carbPercentage: number | null;
}

export interface UserCalProfile {
	id: string;
	estimatedVo2Max: number;
	vo2EfficiencyCoefficient: number;
	restingMetabolicRate: number | null;
	hrVo2Slope: number;
	hrVo2Intercept: number;
	hrRerIntercept: number;
	hrRerSlope: number;
	hrEeSlope: number;
	hrEeIntercept: number;
	o2RerSlope: number;
	o2RerIntercept: number;
	calorieCountingMethod?: CalorieCountingMethod;
}

export interface PersonalizedCalorieResult {
	calculatedCalories: number;
	method: CalorieCountingMethod;
	heartRate: number;
	durationMinutes: number;
	hasPnoeData: boolean;
}

export interface PnoeDataStatus {
	hasPnoeData: boolean;
	lastProcessedAt: string | null;
	availableMethods: CalorieCountingMethod[];
}

export const PersonalizedCalorieCalculator = {
	/**
	 * Calculate personalized calories based on user's selected method
	 */
	calculateCalories: async (
		currentHeartRate: number,
		durationMinutes: number,
		apiKey: string,
	): Promise<PersonalizedCalorieResult> => {
		return apiCall(
			() =>
				hc.user.me.calories.calculate.$post({
					header: {
						"x-api-key": apiKey,
					},
					json: {
						currentHeartRate,
						durationMinutes,
					},
				}),
			(response) => response.json(),
		);
	},

	/**
	 * Process PNOE CSV data for the current user
	 */
	processPnoeData: async (apiKey: string) => {
		return apiCall(
			() =>
				hc.user.me.pnoe.process.$post({
					header: {
						"x-api-key": apiKey,
					},
				}),
			(response) => response.json(),
		);
	},

	/**
	 * Get user's PNOE data status
	 */
	getPnoeDataStatus: async (apiKey: string): Promise<PnoeDataStatus> => {
		return apiCall(
			() =>
				hc.user.me.pnoe.status.$get({
					header: {
						"x-api-key": apiKey,
					},
				}),
			(response) => response.json(),
		);
	},

	/**
	 * Get user's coefficient data for a specific calculation method
	 */
	getUserCoefficients: async (
		apiKey: string,
	): Promise<UserCalProfile | null> => {
		return apiCall(
			() =>
				hc.user.me.pnoe.coefficients.$get({
					header: {
						"x-api-key": apiKey,
					},
				}),
			(response) => response.json(),
		);
	},

	/**
	 * Client-side fallback calculation when no personalized data is available
	 */
	calculateFallbackCalories: (
		heartRate: number,
		durationMinutes: number,
	): number => {
		// Basic calorie calculation fallback (simplified Karvonen-style formula)
		// This matches the backend fallback logic
		const baseCaloriesPerMinute = Math.max(1, (heartRate - 60) * 0.1);
		return baseCaloriesPerMinute * durationMinutes;
	},

	/**
	 * Real-time calorie calculation for workout cards
	 * This method handles both personalized and fallback calculations
	 */
	calculateRealTimeCalories: (
		heartRate: number,
		elapsedTimeSeconds: number,
		userCalProfile: UserCalProfile,
	): { model1: number; model2: number; model3: number } => {
		try {
			const model1 = PersonalizedCalorieCalculator.getCaloriesByModel1({
				hrRerIntercept: userCalProfile.hrRerIntercept,
				hrRerSlope: userCalProfile.hrRerSlope,
				hrVo2Intercept: userCalProfile.hrVo2Intercept,
				hrVo2Slope: userCalProfile.hrVo2Slope,
				heartRate,
				duration: elapsedTimeSeconds,
			});

			const model2 = PersonalizedCalorieCalculator.getCaloriesByModel2({
				hrEeSlope: userCalProfile.hrEeSlope,
				hrEeIntercept: userCalProfile.hrEeIntercept,
				heartRate,
				duration: elapsedTimeSeconds,
			});

			const model3 = PersonalizedCalorieCalculator.getCaloriesByModel3({
				hrRerIntercept: userCalProfile.hrRerIntercept,
				hrRerSlope: userCalProfile.hrRerSlope,
				hrVo2Intercept: userCalProfile.hrVo2Intercept,
				hrVo2Slope: userCalProfile.hrVo2Slope,
				o2RerSlope: userCalProfile.o2RerSlope,
				o2RerIntercept: userCalProfile.o2RerIntercept,
				heartRate,
				duration: elapsedTimeSeconds,
			});

			return {
				model1,
				model2,
				model3,
			};
		} catch (error) {
			// Fall back to client-side calculation if API fails
			console.warn(
				"Failed to get personalized calories, using fallback:",
				error,
			);
			return {
				model1: 0,
				model2: 0,
				model3: 0,
			};
		}
	},

	/**
	 * Get recommended calorie counting method based on available data
	 */
	getRecommendedMethod: async (
		apiKey: string,
	): Promise<CalorieCountingMethod | null> => {
		try {
			const status =
				await PersonalizedCalorieCalculator.getPnoeDataStatus(apiKey);

			if (!status.hasPnoeData || status.availableMethods.length === 0) {
				return null; // No personalized data available
			}

			// Prioritize methods based on accuracy
			const methodPriority: CalorieCountingMethod[] = [
				"MODEL1",
				"MODEL2",
				"MODEL3",
				"MODEL4",
			];

			for (const method of methodPriority) {
				if (status.availableMethods.includes(method)) {
					return method;
				}
			}

			return status.availableMethods[0]; // Fallback to first available
		} catch (error) {
			console.error("Error getting recommended method:", error);
			return null;
		}
	},

	/**
	 * Validate heart rate for calculation
	 */
	isValidHeartRate: (heartRate: number): boolean => {
		return heartRate > 0 && heartRate < 300; // Reasonable bounds
	},

	/**
	 * Get estimated calories per minute for a given heart rate (for preview purposes)
	 */
	getEstimatedCaloriesPerMinute: async (
		heartRate: number,
		apiKey: string,
	): Promise<number> => {
		try {
			if (!PersonalizedCalorieCalculator.isValidHeartRate(heartRate)) {
				return 0;
			}

			const result = await PersonalizedCalorieCalculator.calculateCalories(
				heartRate,
				1, // 1 minute
				apiKey,
			);

			return result.calculatedCalories;
		} catch (error) {
			// Fallback calculation
			return PersonalizedCalorieCalculator.calculateFallbackCalories(
				heartRate,
				1,
			);
		}
	},

	getCaloriesByModel1: ({
		hrVo2Intercept,
		hrRerIntercept,
		hrRerSlope,
		hrVo2Slope,
		heartRate,
		duration,
	}: {
		hrVo2Intercept: number;
		hrVo2Slope: number;
		hrRerSlope: number;
		hrRerIntercept: number;
		heartRate: number;
		duration: number;
	}) => {
		const predictedVo2 = hrVo2Slope * heartRate + hrVo2Intercept;
		const predictedRer = hrRerSlope * heartRate + hrRerIntercept;

		const kcalPerMin = Math.max(
			0.9,
			(predictedVo2 / 1000) * (3.941 + 1.106 * predictedRer),
		);

		return (kcalPerMin / 60) * duration;
	},

	getCaloriesByModel2: ({
		hrEeSlope,
		hrEeIntercept,
		heartRate,
		duration,
	}: {
		hrEeSlope: number;
		hrEeIntercept: number;
		heartRate: number;
		duration: number;
	}) => {
		const kcalPerMin = Math.max(0.9, heartRate * hrEeSlope + hrEeIntercept);

		return (kcalPerMin / 60) * duration;
	},

	getCaloriesByModel3: ({
		hrVo2Intercept,
		hrRerIntercept,
		hrRerSlope,
		hrVo2Slope,
		o2RerSlope,
		o2RerIntercept,
		heartRate,
		duration,
	}: {
		hrVo2Intercept: number;
		hrVo2Slope: number;
		hrRerSlope: number;
		hrRerIntercept: number;
		o2RerSlope: number;
		o2RerIntercept: number;
		heartRate: number;
		duration: number;
	}) => {
		const predictedVo2 = hrVo2Slope * heartRate + hrVo2Intercept;
		const predictedRer = hrRerSlope * heartRate + hrRerIntercept;

		const kcalPerMin = Math.max(
			0.9,
			(predictedVo2 / 1000) * (o2RerIntercept + o2RerSlope * predictedRer),
		);

		return (kcalPerMin / 60) * duration;
	},
};
