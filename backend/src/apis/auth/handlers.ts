import AuthHelper from "../../helpers/auth";
import type { AppRouteHandler } from "../../lib/types";
import type {
	ChangePasswordRoute,
	CheckEmailRoute,
	SignInRoute,
	SignUpRoute,
	ForgotPasswordRoute,
	ResetPasswordRoute,
	VerifyEmailRoute,
	ResendVerificationRoute,
} from "./routes";
import AuthService from "./service";

const checkEmailHandler: AppRouteHandler<CheckEmailRoute> = async (c) => {
	const params = await c.req.json();

	return c.json(await AuthService.checkEmail(params), 200);
};

const signInHandler: AppRouteHandler<SignInRoute> = async (c) => {
	const { email, password } = await c.req.json();

	try {
		return c.json(await AuthService.signIn({ email, password }), 200);
	} catch (error) {
		console.log(error);
		return c.json({ cause: "Sign in failed" }, 400);
	}
};

const signUpHandler: AppRouteHandler<SignUpRoute> = async (c) => {
	const { email, password, first_name, last_name, user_agreement } =
		await c.req.json();

	try {
		return c.json(
			await AuthService.signUp({
				email,
				password,
				first_name,
				last_name,
				user_agreement,
			}),
			200,
		);
	} catch (error) {
		return c.json(
			{ cause: ((error as Error).cause as string) || "Sign up failed" },
			400,
		);
	}
};

const changePasswordHandler: AppRouteHandler<ChangePasswordRoute> = async (
	c,
) => {
	const { currentPassword, newPassword } = await c.req.json();
	const xApiKey = c.req.header("x-api-key");
	if (!xApiKey) {
		throw new Error("x-api-key header is required", {
			cause: "AUTHORIZATION_HEADER_REQUIRED",
		});
	}
	const user = await AuthHelper.verifyToken(xApiKey).catch(() => {
		throw new Error("Invalid x-api-key header", {
			cause: "INVALID_API_KEY",
		});
	});

	const result = await AuthService.changePassword(user.id, {
		currentPassword,
		newPassword,
	});

	return c.json(result, 200);
};

const forgotPasswordHandler: AppRouteHandler<ForgotPasswordRoute> = async (
	c,
) => {
	const { email } = await c.req.json();

	try {
		return c.json(await AuthService.forgotPassword({ email }), 200);
	} catch (error) {
		console.log(error);
		return c.json({ cause: "Failed to process forgot password request" }, 400);
	}
};

const resetPasswordHandler: AppRouteHandler<ResetPasswordRoute> = async (c) => {
	const { token, newPassword } = await c.req.json();

	try {
		return c.json(await AuthService.resetPassword({ token, newPassword }), 200);
	} catch (error) {
		console.log(error);
		return c.json({ cause: "Failed to reset password" }, 400);
	}
};

const verifyEmailHandler: AppRouteHandler<VerifyEmailRoute> = async (c) => {
	const { token } = await c.req.json();

	try {
		return c.json(await AuthService.verifyEmail({ token }), 200);
	} catch (error) {
		console.log(error);
		return c.json({ cause: "Failed to verify email" }, 400);
	}
};

const resendVerificationHandler: AppRouteHandler<
	ResendVerificationRoute
> = async (c) => {
	const { email } = await c.req.json();

	try {
		return c.json(await AuthService.resendVerification({ email }), 200);
	} catch (error) {
		console.log(error);
		return c.json({ cause: "Failed to resend verification email" }, 400);
	}
};

const authHandlers = {
	checkEmailHandler,
	signInHandler,
	signUpHandler,
	changePasswordHandler,
	forgotPasswordHandler,
	resetPasswordHandler,
	verifyEmailHandler,
	resendVerificationHandler,
};

export default authHandlers;
