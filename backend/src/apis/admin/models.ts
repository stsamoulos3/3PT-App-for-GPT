import { z } from "zod";

// Admin Sign In
export const AdminSignInBody = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const AdminSignInResponse = z.object({
	token: z.string(),
	user: z.object({
		id: z.string(),
		email: z.string(),
		first_name: z.string(),
		last_name: z.string(),
		role: z.enum(["ADMIN", "USER"]),
	}),
});

// File Upload
export const FileUploadBody = z.object({
	userId: z.string(),
	description: z.string().optional(),
});

export const FileUploadResponse = z.object({
	message: z.string(),
	files: z.array(
		z.object({
			id: z.string(),
			fileName: z.string(),
			filePath: z.string(),
			fileSize: z.number(),
			mimeType: z.string(),
			description: z.string().optional(),
			createdAt: z.string(),
		}),
	),
});

// Get User Files
export const GetUserFilesParams = z.object({
	userId: z.string(),
});

export const GetUserFilesResponse = z.object({
	files: z.array(
		z.object({
			id: z.string(),
			fileName: z.string(),
			filePath: z.string(),
			fileSize: z.number(),
			mimeType: z.string(),
			description: z.string().optional(),
			uploadedBy: z.string(),
			createdAt: z.string(),
		}),
	),
});

// Get All Users
export const GetAllUsersResponse = z.object({
	users: z.array(
		z.object({
			id: z.string(),
			email: z.string(),
			first_name: z.string(),
			last_name: z.string(),
			role: z.enum(["ADMIN", "USER"]),
			createdAt: z.string(),
		}),
	),
});

export const SearchUsersQuery = z.object({
	query: z.string().optional(),
	page: z
		.string()
		.transform(Number)
		.pipe(z.number().min(1))
		.optional()
		.default("1"),
	limit: z
		.string()
		.transform(Number)
		.pipe(z.number().min(1).max(100))
		.optional()
		.default("20"),
});

export const SearchUsersResponse = z.object({
	users: z.array(
		z.object({
			id: z.string(),
			email: z.string(),
			first_name: z.string(),
			last_name: z.string(),
			role: z.string(),
			createdAt: z.string(),
		}),
	),
	total: z.number(),
	page: z.number(),
	limit: z.number(),
	totalPages: z.number(),
});

export type AdminSignInBody = z.infer<typeof AdminSignInBody>;
export type AdminSignInResponse = z.infer<typeof AdminSignInResponse>;
export type FileUploadBody = z.infer<typeof FileUploadBody>;
export type FileUploadResponse = z.infer<typeof FileUploadResponse>;
export type GetUserFilesParams = z.infer<typeof GetUserFilesParams>;
export type GetUserFilesResponse = z.infer<typeof GetUserFilesResponse>;
export type GetAllUsersResponse = z.infer<typeof GetAllUsersResponse>;
export type SearchUsersQuery = z.infer<typeof SearchUsersQuery>;
export type SearchUsersResponse = z.infer<typeof SearchUsersResponse>;
