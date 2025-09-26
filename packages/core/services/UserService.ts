import type { User } from "types/entities/user";
import hc from "../helpers/api";
import { apiCall } from "../helpers/apiInterceptor";

export interface StreakData {
	currentWorkoutStreak: number;
	longestWorkoutStreak: number;
	currentFoodStreak: number;
	longestFoodStreak: number;
	lastWorkoutDate: string | null;
	lastFoodLogDate: string | null;
	lastActiveAt: string;
}

export const UserService = {
	list: async (
		params: { page?: number; limit?: number; filter?: string },
		apiKey: string,
	) => {
		return apiCall(
			() =>
				hc.user.$get({
					header: {
						"x-api-key": apiKey,
					},
					query: {
						page: params.page?.toString(),
						limit: params.limit?.toString(),
						filter: params.filter,
					},
				}),
			(response) => response.json(),
		);
	},

	get: async (id: string, apiKey: string) => {
		return apiCall(
			() =>
				hc.user[":id"].$get({
					header: {
						"x-api-key": apiKey,
					},
					param: {
						id,
					},
				}),
			(response) => response.json(),
		);
	},

	create: async (
		values: {
			email: string;
			password: string;
			first_name: string;
			last_name: string;
			dob: Date | null;
			gender: string | null;
			height: number | null;
			weight: number | null;
			is3PTPatient: boolean | null;
			patientId: string | null;
			isMultidisciplinaryPatient: boolean | null;
			rmr: number | null;
			prescribedExerciseHR: number | null;
			vo2Max: number | null;
			hourlyCaloriesAtHR: number | null;
			prescribedDailyCalories: number | null;
			user_agreement: string | null;
		},
		apiKey: string,
	) => {
		return apiCall(
			() =>
				hc.user.$post({
					header: {
						"x-api-key": apiKey,
					},
					json: values,
				}),
			(response) => response.json(),
		);
	},

	update: async (
		id: string,
		values: {
			email?: string;
			first_name?: string;
			last_name?: string;
			dob?: string | null;
			gender?: string | null;
			height?: number | null;
			weight?: number | null;
			is3PTPatient?: boolean | null;
			patientId?: string | null;
			isMultidisciplinaryPatient?: boolean | null;
			rmr?: number | null;
			prescribedExerciseHR?: number | null;
			vo2Max?: number | null;
			hourlyCaloriesAtHR?: number | null;
			prescribedDailyCalories?: number | null;
			calorieCountingMethod?: "MODEL1" | "MODEL2" | "MODEL3" | "MODEL4";
		},
		apiKey: string,
	) => {
		return apiCall(
			() =>
				hc.user[":id"].$put({
					header: {
						"x-api-key": apiKey,
					},
					param: {
						id,
					},
					json: values,
				}),
			(response) => response.json(),
		);
	},
	getUser: async (apiKey: string): Promise<User> => {
		return apiCall(
			() =>
				hc.user.me.$get({
					header: {
						"x-api-key": apiKey,
					},
				}),
			(response) => response.json(),
		);
	},

	getUserStreaks: async (
		userId: string,
		apiKey: string,
	): Promise<{ streaks: StreakData }> => {
		return apiCall<{ streaks: StreakData }>(
			() =>
				hc.user[":id"].streaks.$get({
					header: {
						"x-api-key": apiKey,
					},
					param: { id: userId },
				}),
			(response) => response.json(),
		);
	},

	updateUserStreaks: async (
		userId: string,
		apiKey: string,
	): Promise<{ streaks: StreakData }> => {
		return apiCall<{ streaks: StreakData }>(
			() =>
				hc.user[":id"].streaks.update.$post({
					header: {
						"x-api-key": apiKey,
					},
					param: { id: userId },
				}),
			(response) => response.json(),
		);
	},
};
