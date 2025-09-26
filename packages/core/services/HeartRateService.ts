import hc from "../helpers/api";
import { apiCall } from "../helpers/apiInterceptor";
import { toUTCForStorage } from "../helpers/dateUtils";

export const HeartRateService = {
	list: async (
		params: { page?: number; limit?: number; filter?: string },
		apiKey: string,
	) => {
		return apiCall(
			() =>
				hc["heart-rate"].$get({
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
				hc["heart-rate"][":id"].$get({
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
			workoutId?: string;
			userId: string;
			timestamp: Date;
			heartRateBPM: number;
			hkId?: string;
		},
		apiKey: string,
	) => {
		return apiCall(
			() =>
				hc["heart-rate"].$post({
					header: {
						"x-api-key": apiKey,
					},
					json: {
						...values,
						timestamp: toUTCForStorage(values.timestamp),
					},
				}),
			(response) => response.json(),
		);
	},

	update: async (
		id: string,
		values: {
			workoutId?: string;
			userId?: string;
			timestamp?: Date;
			heartRateBPM?: number;
		},
		apiKey: string,
	) => {
		const updatedValues = { ...values };
		if (updatedValues.timestamp) {
			updatedValues.timestamp = toUTCForStorage(updatedValues.timestamp) as any;
		}

		return apiCall(
			() =>
				hc["heart-rate"][":id"].$put({
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

	createBulkHeartRate: async (
		heartRates: {
			timestamp: string;
			heartRateBPM: number;
			hkId?: string;
			source: string;
			device: string;
		}[],
		apiKey: string,
	) => {
		return apiCall(
			() =>
				hc["heart-rate"].bulk.$post({
					header: { "x-api-key": apiKey },
					json: heartRates,
				}),
			(response) => response.json(),
		);
	},
};
