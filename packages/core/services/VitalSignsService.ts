import hc from "../helpers/api";
import { apiCall } from "../helpers/apiInterceptor";
import { toUTCForStorage } from "../helpers/dateUtils";

export const VitalSignsService = {
  list: async (
    params: { page?: number; limit?: number; filter?: string },
    apiKey: string
  ) => {
    return apiCall(
      () =>
        hc["vital-signs"].$get({
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
        hc["vital-signs"][":id"].$get({
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
      userId: string;
      vitalType: string;
      vitalValue: number;
      vitalUnit: string;
      timestamp: Date;
    },
    apiKey: string
  ) => {
    return apiCall(
      () =>
        hc["vital-signs"].$post({
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
      vitalType?: string;
      vitalValue?: number;
      vitalUnit?: string;
      timestamp?: Date;
    },
    apiKey: string
  ) => {
    const updatedValues = { ...values };
    if (updatedValues.timestamp) {
      updatedValues.timestamp = toUTCForStorage(updatedValues.timestamp) as any;
    }

    return apiCall(
      () =>
        hc["vital-signs"][":id"].$put({
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
};
