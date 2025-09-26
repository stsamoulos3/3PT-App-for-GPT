import hc from "../helpers/api";
import { apiCall } from "../helpers/apiInterceptor";
import { toUTCForStorage } from "../helpers/dateUtils";
import { Food, FoodLog } from "../types/entities/food";

export const NutritionService = {
  list: async (
    params: { page?: number; limit?: number; filter?: string },
    apiKey: string
  ) => {
    return apiCall(
      () =>
        hc.nutrition.$get({
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
        hc.nutrition[":id"].$get({
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
    nutritions: {
      date: Date;
      hkId: string;
      quantity: number;
      quantityType: string;
      quantityUnit: string;
    }[],
    apiKey: string
  ) => {
    const nutritionsWithUTC = nutritions.map((nutrition) => ({
      ...nutrition,
      date: toUTCForStorage(nutrition.date) as any,
    }));

    return apiCall(
      () =>
        hc.nutrition.$post({
          header: {
            "x-api-key": apiKey,
          },
          json: nutritionsWithUTC,
        }),
      (response) => response.json()
    );
  },

  update: async (
    id: string,
    values: {
      date?: Date;
      caloriesConsumedKcal?: number;
      proteinGrams?: number;
      carbohydratesGrams?: number;
      fatGrams?: number;
    },
    apiKey: string
  ) => {
    const updatedValues = { ...values };
    if (updatedValues.date) {
      updatedValues.date = toUTCForStorage(updatedValues.date) as any;
    }

    return apiCall(
      () =>
        hc.nutrition[":id"].$put({
          header: {
            "x-api-key": apiKey,
          },
          json: updatedValues,
          param: {
            id,
          },
        }),
      (response) => response.json()
    );
  },

  // Food-related endpoints
  searchFoods: async (
    query: string,
    apiKey: string,
    barcode?: string,
    hardFetch?: boolean
  ) => {
    return apiCall(
      () =>
        hc.foods.search.$get({
          header: {
            "x-api-key": apiKey,
          },
          query: barcode
            ? { barcode }
            : { q: query, hardFetch: hardFetch ? "true" : undefined },
        }),
      (response) => response.json()
    );
  },

  getFoodById: async (id: string, apiKey: string, hardFetch?: boolean) => {
    return apiCall<Food>(
      () =>
        hc.foods[":id"].$get({
          header: {
            "x-api-key": apiKey,
          },
          param: {
            id,
          },
          query: { hardFetch: hardFetch ? "true" : undefined },
        }),
      (response) => response.json()
    );
  },

  createFood: async (food: Omit<Food, "id">, apiKey: string) => {
    return apiCall(
      () =>
        hc.foods.$post({
          header: {
            "x-api-key": apiKey,
          },
          json: food,
        }),
      (response) => response.json()
    );
  },

  recordFoodConsumption: async (
    data: {
      foodId: string;
      servings: number;
      servingSize: string;
      meal: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
      date: Date;
    },
    apiKey: string
  ) => {
    return apiCall(
      () =>
        hc.foods.log.$post({
          header: {
            "x-api-key": apiKey,
          },
          json: {
            ...data,
            date: toUTCForStorage(data.date) as any,
          },
        }),
      (response) => response.json()
    );
  },

  getFoodLogs: async (
    params: {
      startDate?: string;
      endDate?: string;
      meal?: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
    },
    apiKey: string
  ) => {
    return apiCall<FoodLog[]>(
      () =>
        hc.foods.log.$get({
          header: {
            "x-api-key": apiKey,
          },
          query: {
            startDate: params.startDate,
            endDate: params.endDate,
            meal: params.meal,
          },
        }),
      (response) => response.json()
    );
  },
  getFoodLog: async (id: string, apiKey: string) => {
    return apiCall<FoodLog>(
      () =>
        hc.foods.log[":id"].$get({
          header: { "x-api-key": apiKey },
          param: { id },
        }),
      (response) => response.json()
    );
  },

  updateFoodLog: async (
    id: string,
    data: Partial<Pick<FoodLog, "servings" | "servingSize" | "meal">>,
    apiKey: string
  ) => {
    return apiCall(
      () =>
        hc.foods.log[":id"].$put({
          header: {
            "x-api-key": apiKey,
          },
          param: { id },
          json: data,
        }),
      (response) => response.json()
    );
  },

  deleteFoodLog: async (id: string, apiKey: string) => {
    return apiCall(
      () =>
        hc.foods.log[":id"].$delete({
          header: {
            "x-api-key": apiKey,
          },
          param: { id },
        }),
      (response) => response.json()
    );
  },

  getRecentFoods: async (limit?: number, apiKey?: string, search?: string) => {
    return apiCall<Food[]>(
      () =>
        hc.foods.recent.$get({
          header: {
            "x-api-key": apiKey!,
          },
          query: { limit: limit?.toString(), search },
        }),
      (response) => response.json()
    );
  },
};
