import AuthHelper from "../../helpers/auth";
import type { AppRouteHandler } from "../../lib/types";
import type {
	AdminSignInRoute,
	DeleteFileRoute,
	DeleteUserRoute,
	FileUploadRoute,
	GetAllUsersRoute,
	GetSignedFileUrlRoute,
	GetUserFilesRoute,
	SearchUsersRoute,
} from "./routes";
import AdminService from "./service";

const adminSignInHandler: AppRouteHandler<AdminSignInRoute> = async (c) => {
	const { email, password } = await c.req.json();

	try {
		return c.json(await AdminService.signIn(email, password), 200);
	} catch (error) {
		console.log(error);
		const errorMessage =
			error instanceof Error ? error.message : "Admin sign in failed";
		return c.json({ cause: errorMessage }, 400);
	}
};

const fileUploadHandler: AppRouteHandler<FileUploadRoute> = async (c) => {
	const xApiKey = c.req.header("x-api-key");
	if (!xApiKey) {
		return c.json({ cause: "AUTHORIZATION_HEADER_REQUIRED" }, 400);
	}

	try {
		const admin = await AuthHelper.verifyToken(xApiKey);

		const formData = await c.req.formData();
		const userId = formData.get("userId") as string;
		const description = formData.get("description") as string;
		const files = formData.getAll("files") as File[];

		if (!userId || !files || files.length === 0) {
			return c.json({ cause: "userId and files are required" }, 400);
		}

		const time = process.hrtime();
		const result = await AdminService.uploadFiles(
			admin.id,
			userId,
			files,
			description,
		);
		const duration = process.hrtime(time);
		console.log(
			`File upload took ${duration[0]} seconds and ${duration[1] / 1e6} milliseconds`,
		);
		return c.json(result, 200);
	} catch (error) {
		console.log(error);
		return c.json({ cause: "File upload failed" }, 400);
	}
};

const getUserFilesHandler: AppRouteHandler<GetUserFilesRoute> = async (c) => {
	const xApiKey = c.req.header("x-api-key");
	if (!xApiKey) {
		return c.json({ cause: "AUTHORIZATION_HEADER_REQUIRED" }, 400);
	}

	try {
		const admin = await AuthHelper.verifyToken(xApiKey);
		const { userId } = c.req.param();

		const result = await AdminService.getUserFiles(admin.id, userId);
		return c.json(result, 200);
	} catch (error) {
		console.log(error);
		return c.json({ cause: "Failed to get user files" }, 400);
	}
};

const getAllUsersHandler: AppRouteHandler<GetAllUsersRoute> = async (c) => {
	const xApiKey = c.req.header("x-api-key");
	if (!xApiKey) {
		return c.json({ cause: "AUTHORIZATION_HEADER_REQUIRED" }, 400);
	}

	try {
		const admin = await AuthHelper.verifyToken(xApiKey);
		const result = await AdminService.getAllUsers(admin.id);
		return c.json(result, 200);
	} catch (error) {
		console.log(error);
		return c.json({ cause: "Failed to get users" }, 400);
	}
};

const searchUsersHandler: AppRouteHandler<SearchUsersRoute> = async (c) => {
	const xApiKey = c.req.header("x-api-key");
	if (!xApiKey) {
		return c.json({ cause: "AUTHORIZATION_HEADER_REQUIRED" }, 400);
	}

	try {
		const admin = await AuthHelper.verifyToken(xApiKey);
		const { query, page, limit } = c.req.query();
		const result = await AdminService.searchUsers(
			admin.id,
			query,
			Number(page),
			Number(limit),
		);
		return c.json(result, 200);
	} catch (error) {
		console.log(error);
		return c.json({ cause: "Failed to search users" }, 400);
	}
};

const getSignedFileUrlHandler: AppRouteHandler<GetSignedFileUrlRoute> = async (
	c,
) => {
	const xApiKey = c.req.header("x-api-key");
	if (!xApiKey) {
		return c.json({ cause: "AUTHORIZATION_HEADER_REQUIRED" }, 400);
	}

	try {
		const admin = await AuthHelper.verifyToken(xApiKey);
		const { fileId } = c.req.param();
		const { expiresIn } = c.req.query();

		const result = await AdminService.getSignedFileUrl(
			admin.id,
			fileId,
			Number(expiresIn),
		);
		return c.json(result, 200);
	} catch (error) {
		console.log(error);
		if (error instanceof Error && error.message.includes("not found")) {
			return c.json({ cause: "FILE_NOT_FOUND" }, 400);
		}
		return c.json({ cause: "Failed to generate signed URL" }, 400);
	}
};

const deleteFileHandler: AppRouteHandler<DeleteFileRoute> = async (c) => {
	const xApiKey = c.req.header("x-api-key");
	if (!xApiKey) {
		return c.json({ cause: "AUTHORIZATION_HEADER_REQUIRED" }, 400);
	}

	try {
		const admin = await AuthHelper.verifyToken(xApiKey);
		const { fileId } = c.req.param();

		await AdminService.deleteFile(admin.id, fileId);
		return c.json({ message: "File deleted successfully" }, 200);
	} catch (error) {
		console.log(error);
		if (error instanceof Error && error.message.includes("not found")) {
			return c.json({ cause: "FILE_NOT_FOUND" }, 400);
		}
		return c.json({ cause: "Failed to delete file" }, 400);
	}
};

const deleteUserHandler: AppRouteHandler<DeleteUserRoute> = async (c) => {
	const xApiKey = c.req.header("x-api-key");
	if (!xApiKey) {
		return c.json({ cause: "AUTHORIZATION_HEADER_REQUIRED" }, 400);
	}

	try {
		const admin = await AuthHelper.verifyToken(xApiKey);
		const { userId } = c.req.param();

		await AdminService.deleteUser(admin.id, userId);
		return c.json({ message: "User deleted successfully" }, 200);
	} catch (error) {
		console.log(error);
		if (error instanceof Error && error.message.includes("not found")) {
			return c.json({ cause: "USER_NOT_FOUND" }, 400);
		}
		if (error instanceof Error && error.message.includes("Cannot delete admin")) {
			return c.json({ cause: error.message }, 400);
		}
		return c.json({ cause: "Failed to delete user" }, 400);
	}
};

const adminHandlers = {
	adminSignInHandler,
	fileUploadHandler,
	getUserFilesHandler,
	getAllUsersHandler,
	searchUsersHandler,
	getSignedFileUrlHandler,
	deleteFileHandler,
	deleteUserHandler,
};

export default adminHandlers;
