import type { Workout } from "types/entities/workout";
import hc from "../helpers/api";
import { apiCall } from "../helpers/apiInterceptor";
import { toUTCForStorage } from "../helpers/dateUtils";

export const WorkoutService = {
	list: async (
		params: {
			page?: number;
			limit?: number;
			filter?: {
				startDate?: string;
				endDate?: string;
			};
		},
		apiKey: string,
	): Promise<{ data: Workout[]; total: number }> => {
		console.log("list", params);
		const filter = {
			...params.filter,
			startDate: {
				gte: params.filter?.startDate,
				lte: params.filter?.endDate,
			},
			endDate: {
				gte: params.filter?.startDate,
				lte: params.filter?.endDate,
			},
		};

		return apiCall(
			() =>
				hc.workout.$get({
					header: {
						"x-api-key": apiKey,
					},
					query: {
						page: params.page?.toString(),
						limit: params.limit?.toString(),
						filter: JSON.stringify(filter),
					},
				}),
			(response) => response.json(),
		);
	},

	get: async (id: string, apiKey: string) => {
		return apiCall(
			() =>
				hc.workout[":id"].$get({
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

	create: async (values: Workout, apiKey: string) => {
		const updatedValues = { ...values };
		updatedValues.startDate = toUTCForStorage(updatedValues.startDate) as any;
		updatedValues.endDate = toUTCForStorage(updatedValues.endDate) as any;

		if (updatedValues.firstHeartRateTime) {
			updatedValues.firstHeartRateTime = toUTCForStorage(
				updatedValues.firstHeartRateTime,
			) as any;
		}

		if (updatedValues.lastHeartRateTime) {
			updatedValues.lastHeartRateTime = toUTCForStorage(
				updatedValues.lastHeartRateTime,
			) as any;
		}

		return apiCall(
			() =>
				hc.workout.$post({
					header: {
						"x-api-key": apiKey,
					},
					json: updatedValues,
				}),
			(response) => response.json(),
		);
	},

	update: async (
		id: string,
		values: Partial<Omit<Workout, "id">>,
		apiKey: string,
	) => {
		const updatedValues = { ...values };

		if (updatedValues.startDate) {
			updatedValues.startDate = toUTCForStorage(updatedValues.startDate) as any;
		}

		if (updatedValues.endDate) {
			updatedValues.endDate = toUTCForStorage(updatedValues.endDate) as any;
		}

		return apiCall(
			() =>
				hc.workout[":id"].$put({
					header: {
						"x-api-key": apiKey,
					},
					param: {
						id,
					},
					json: updatedValues,
				}),
			(response) => response.json(),
		);
	},

	delete: async (hkId: string, apiKey: string) => {
		return apiCall(
			() =>
				hc.workout[":hkId"].$delete({
					header: { "x-api-key": apiKey },
					param: { hkId },
				}),
			(response) => response.json(),
		);
	},

	getRecentWorkoutTypes: async (limit?: number, apiKey?: string) => {
		return apiCall<string[]>(
			() =>
				hc.workout["recent-types"].$get({
					header: {
						"x-api-key": apiKey!,
					},
					query: { limit: limit?.toString() },
				}),
			(response) => response.json(),
		);
	},
};
