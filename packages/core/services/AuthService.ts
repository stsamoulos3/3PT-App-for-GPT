import hc from "../helpers/api";
import { apiCall } from "../helpers/apiInterceptor";

export const AuthService = {
  login: async (values: { email: string; password: string }) => {
    return apiCall(
      () =>
        hc.auth["sign-in"].$post({
          json: { email: values.email, password: values.password },
        }),
      (response) => response.json()
    );
  },
  signup: async (values: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    user_agreement?: boolean;
  }) => {
    return apiCall(
      () =>
        hc.auth["sign-up"].$post({
          json: {
            email: values.email,
            password: values.password,
            first_name: values.first_name,
            last_name: values.last_name,
            user_agreement: values.user_agreement,
          },
        }),
      (response) => response.json()
    );
  },
  changePassword: async (
    values: {
      currentPassword: string;
      newPassword: string;
    },
    apiKey: string
  ) => {
    return apiCall(
      () =>
        hc.auth["change-password"].$post({
          header: {
            "x-api-key": apiKey,
          },
          json: values,
        }),
      (response) => response.json()
    );
  },
  forgotPassword: async (values: { email: string }) => {
    return apiCall(
      () =>
        hc.auth["forgot-password"].$post({
          json: { email: values.email },
        }),
      (response) => response.json()
    );
  },
  resetPassword: async (values: { token: string; newPassword: string }) => {
    return apiCall(
      () =>
        hc.auth["reset-password"].$post({
          json: { token: values.token, newPassword: values.newPassword },
        }),
      (response) => response.json()
    );
  },
  verifyEmail: async (values: { token: string }) => {
    return apiCall(
      () =>
        hc.auth["verify-email"].$post({
          json: { token: values.token },
        }),
      (response) => response.json()
    );
  },
  resendVerification: async (values: { email: string }) => {
    return apiCall(
      () =>
        hc.auth["resend-verification"].$post({
          json: { email: values.email },
        }),
      (response) => response.json()
    );
  },
};
