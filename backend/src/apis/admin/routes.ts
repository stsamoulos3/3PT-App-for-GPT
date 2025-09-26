import { createRoute, z } from "@hono/zod-openapi";
import errorContent from "../../helpers/error-content";
import jsonContent from "../../helpers/json-content";
import {
	AdminSignInBody,
	AdminSignInResponse,
	FileUploadBody,
	FileUploadResponse,
	GetAllUsersResponse,
	GetUserFilesParams,
	GetUserFilesResponse,
	SearchUsersQuery,
	SearchUsersResponse,
} from "./models";

const adminSignInRoute = createRoute({
	method: "post",
	path: "/sign-in",
	request: {
		body: jsonContent(AdminSignInBody, "Admin Sign In Body"),
	},
	responses: {
		200: jsonContent(AdminSignInResponse, "Admin Sign In Response"),
		400: errorContent,
	},
	tags: ["Admin"],
});

const fileUploadRoute = createRoute({
	method: "post",
	path: "/upload-files",
	request: {
		headers: z.object({
			"x-api-key": z.string(),
		}),
		body: {
			content: {
				"multipart/form-data": {
					schema: z.object({
						userId: z.string(),
						description: z.string().optional(),
						files: z.any(), // File uploads
					}),
				},
			},
		},
	},
	responses: {
		200: jsonContent(FileUploadResponse, "File Upload Response"),
		400: errorContent,
	},
	tags: ["Admin"],
});

const getUserFilesRoute = createRoute({
	method: "get",
	path: "/user/{userId}/files",
	request: {
		headers: z.object({
			"x-api-key": z.string(),
		}),
		params: z.object({
			userId: z.string(),
		}),
	},
	responses: {
		200: jsonContent(GetUserFilesResponse, "Get User Files Response"),
		400: errorContent,
	},
	tags: ["Admin"],
});

const getAllUsersRoute = createRoute({
	method: "get",
	path: "/users",
	request: {
		headers: z.object({
			"x-api-key": z.string(),
		}),
	},
	responses: {
		200: jsonContent(GetAllUsersResponse, "Get All Users Response"),
		400: errorContent,
	},
	tags: ["Admin"],
});

const searchUsersRoute = createRoute({
	method: "get",
	path: "/users/search",
	request: {
		headers: z.object({
			"x-api-key": z.string(),
		}),
		query: SearchUsersQuery,
	},
	responses: {
		200: jsonContent(SearchUsersResponse, "Search Users Response"),
		400: errorContent,
	},
	tags: ["Admin"],
});

const getSignedFileUrlRoute = createRoute({
	method: "get",
	path: "/file/{fileId}/signed-url",
	request: {
		headers: z.object({
			"x-api-key": z.string(),
		}),
		params: z.object({
			fileId: z.string(),
		}),
		query: z.object({
			expiresIn: z.string().optional().default("3600"), // Default 1 hour
		}),
	},
	responses: {
		200: jsonContent(
			z.object({
				signedUrl: z.string(),
				expiresAt: z.string(),
			}),
			"Signed URL Response",
		),
		400: errorContent,
	},
	tags: ["Admin"],
});

const deleteFileRoute = createRoute({
	method: "delete",
	path: "/file/{fileId}",
	request: {
		headers: z.object({
			"x-api-key": z.string(),
		}),
		params: z.object({
			fileId: z.string(),
		}),
	},
	responses: {
		200: jsonContent(
			z.object({
				message: z.string(),
			}),
			"Delete File Response",
		),
		400: errorContent,
	},
	tags: ["Admin"],
});

const deleteUserRoute = createRoute({
	method: "delete",
	path: "/user/{userId}",
	request: {
		headers: z.object({
			"x-api-key": z.string(),
		}),
		params: z.object({
			userId: z.string(),
		}),
	},
	responses: {
		200: jsonContent(
			z.object({
				message: z.string(),
			}),
			"Delete User Response",
		),
		400: errorContent,
	},
	tags: ["Admin"],
});

const adminRoutes = {
	adminSignInRoute,
	fileUploadRoute,
	getUserFilesRoute,
	getAllUsersRoute,
	searchUsersRoute,
	getSignedFileUrlRoute,
	deleteFileRoute,
	deleteUserRoute,
};

export default adminRoutes;

export type AdminSignInRoute = typeof adminRoutes.adminSignInRoute;
export type FileUploadRoute = typeof adminRoutes.fileUploadRoute;
export type GetUserFilesRoute = typeof adminRoutes.getUserFilesRoute;
export type GetAllUsersRoute = typeof adminRoutes.getAllUsersRoute;
export type SearchUsersRoute = typeof adminRoutes.searchUsersRoute;
export type GetSignedFileUrlRoute = typeof adminRoutes.getSignedFileUrlRoute;
export type DeleteFileRoute = typeof adminRoutes.deleteFileRoute;
export type DeleteUserRoute = typeof adminRoutes.deleteUserRoute;
