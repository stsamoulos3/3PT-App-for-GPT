import hc from "../helpers/api";
import { apiCall } from "../helpers/apiInterceptor";
import { toUTCForStorage } from "../helpers/dateUtils";

export const BodyMeasurementService = {
  list: async (
    params: { page?: number; limit?: number; filter?: string },
    apiKey: string
  ) => {
    return apiCall(
      () =>
        hc["body-measurement"].$get({
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
        hc["body-measurement"][":id"].$get({
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
      measurementType: string;
      measurementValue: number;
      measurementUnit: string;
      timestamp: Date;
    },
    apiKey: string
  ) => {
    return apiCall(
      () =>
        hc["body-measurement"].$post({
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
      measurementType?: string;
      measurementValue?: number;
      measurementUnit?: string;
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
        hc["body-measurement"][":id"].$put({
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
