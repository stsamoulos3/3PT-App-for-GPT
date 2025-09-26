import hc from "../helpers/api";
import { apiCall } from "../helpers/apiInterceptor";
import { toUTCForStorage } from "../helpers/dateUtils";

export const StepsService = {
  list: async (
    params: { page?: number; limit?: number; filter?: string },
    apiKey: string
  ) => {
    return apiCall(
      () =>
        hc.steps.$get({
          header: {
            "x-api-key": apiKey,
          },
          query: {
            page: params.page?.toString(),
            limit: params.limit?.toString(),
            filter: params.filter,
          },
        }),
      (response) => response.json()
    );
  },

  get: async (id: string, apiKey: string) => {
    return apiCall(
      () =>
        hc.steps[":id"].$get({
          header: {
            "x-api-key": apiKey,
          },
          param: {
            id,
          },
        }),
      (response) => response.json()
    );
  },

  create: async (
    values: {
      workoutId?: string;
      userId: string;
      timestamp: Date;
      stepsCount: number;
    },
    apiKey: string
  ) => {
    return apiCall(
      () =>
        hc.steps.$post({
          header: {
            "x-api-key": apiKey,
          },
          json: {
            ...values,
            timestamp: toUTCForStorage(values.timestamp),
          },
        }),
      (response) => response.json()
    );
  },

  update: async (
    id: string,
    values: {
      workoutId?: string;
      userId?: string;
      timestamp?: Date;
      stepsCount?: number;
    },
    apiKey: string
  ) => {
    const updatedValues = { ...values };
    if (updatedValues.timestamp) {
      updatedValues.timestamp = toUTCForStorage(updatedValues.timestamp) as any;
    }

    return apiCall(
      () =>
        hc.steps[":id"].$put({
          header: {
            "x-api-key": apiKey,
          },
          param: {
            id,
          },
          json: updatedValues,
        }),
      (response) => response.json()
    );
  },

  createBulkSteps: async (
    steps: {
      timestamp: Date;
      stepsCount: number;
    }[],
    apiKey: string
  ) => {
    const stepsWithUTC = steps.map((step) => ({
      ...step,
      timestamp: toUTCForStorage(step.timestamp),
    }));

    return apiCall(
      () =>
        hc.steps.bulk.$post({
          header: { "x-api-key": apiKey },
          json: stepsWithUTC,
        }),
      (response) => response.json()
    );
  },
};
