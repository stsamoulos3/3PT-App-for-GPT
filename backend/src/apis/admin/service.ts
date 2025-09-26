import { prisma } from "../../db/client";
import AuthHelper from "../../helpers/auth";
import {
	deleteFromS3,
	generateS3Key,
	generateSignedUrl,
	getS3Url,
	uploadToS3,
} from "../../helpers/s3";
import UserService from "../user/service";

interface UploadFile {
	name: string;
	size: number;
	type: string;
	arrayBuffer(): Promise<ArrayBuffer>;
}

class AdminService {
	async signIn(email: string, password: string) {
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new Error("Invalid credentials");
		}

		if (user.role !== "ADMIN") {
			throw new Error("Access denied. Admin privileges required.");
		}

		const isValidPassword = await AuthHelper.compare(password, user.password);
		if (!isValidPassword) {
			throw new Error("Invalid credentials");
		}

		const token = await AuthHelper.signToken({ id: user.id });

		return {
			token,
			user: {
				id: user.id,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
				role: user.role,
			},
		};
	}

	async uploadFiles(
		adminId: string,
		userId: string,
		files: UploadFile[],
		description?: string,
	) {
		const [admin, user] = await Promise.all([
			// Verify admin
			await prisma.user.findUnique({
				where: { id: adminId },
			}),
			await prisma.user.findUnique({
				where: { id: userId },
			}),
		]);

		// Verify user exists
		if (!admin || admin.role !== "ADMIN") {
			throw new Error("Admin access required");
		}
		if (!user) {
			throw new Error("User not found");
		}

		const uploadedFiles: unknown[] = [];

		await Promise.all(
			files.map(async (file) => {
				// Generate S3 key
				const s3Key = generateS3Key(userId, file.name);

				const [_, fileRecord] = await Promise.all([
					// Upload file to S3
					await uploadToS3(file, s3Key),
					// Save file record to database
					await prisma.userFile.create({
						data: {
							userId,
							fileName: file.name,
							filePath: s3Key, // Store S3 key instead of local path
							fileSize: file.size,
							mimeType: file.type,
							uploadedBy: adminId,
							description,
						},
					}),
				]);

				uploadedFiles.push({
					id: fileRecord.id,
					fileName: fileRecord.fileName,
					filePath: s3Key, // Return S3 key for signed URL generation
					fileSize: fileRecord.fileSize,
					mimeType: fileRecord.mimeType,
					description: fileRecord.description || undefined,
					createdAt: fileRecord.createdAt.toISOString(),
				});
			}),
		);

		// Automatically process metabolic data files when uploaded
		const metabolicFiles = files.filter(
			(file) => file.name === "pnoe.csv" || file.name === "vo2_master.csv",
		);

		if (metabolicFiles.length > 0) {
			try {
				console.log(
					`Auto-processing metabolic data files for user ${userId}: ${metabolicFiles.map((f) => f.name).join(", ")}`,
				);
				await UserService.processPnoeData(userId);
				console.log(
					`Successfully auto-processed metabolic data for user ${userId}`,
				);
			} catch (error) {
				console.error(
					`Error auto-processing metabolic data for user ${userId}:`,
					error,
				);
			}
		}

		return {
			message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
			files: uploadedFiles,
		};
	}

	async getUserFiles(adminId: string, userId: string) {
		// Verify admin
		const admin = await prisma.user.findUnique({
			where: { id: adminId },
		});

		if (!admin || admin.role !== "ADMIN") {
			throw new Error("Admin access required");
		}

		const files = await prisma.userFile.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});

		return {
			files: files.map((file) => ({
				id: file.id,
				fileName: file.fileName,
				filePath: file.filePath, // Keep the R2 key for signed URL generation
				fileSize: file.fileSize,
				mimeType: file.mimeType,
				description: file.description || undefined,
				uploadedBy: file.uploadedBy,
				createdAt: file.createdAt.toISOString(),
			})),
		};
	}

	async getAllUsers(adminId: string) {
		// Verify admin
		const admin = await prisma.user.findUnique({
			where: { id: adminId },
		});

		if (!admin || admin.role !== "ADMIN") {
			throw new Error("Admin access required");
		}

		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				first_name: true,
				last_name: true,
				role: true,
				createdAt: true,
				lastActiveAt: true,
				currentWorkoutStreak: true,
				currentFoodStreak: true,
			},
			orderBy: { lastActiveAt: "desc" },
		});

		return {
			users: users.map((user) => ({
				...user,
				createdAt: user.createdAt.toISOString(),
				lastActiveAt: user.lastActiveAt.toISOString(),
			})),
		};
	}

	async searchUsers(adminId: string, query?: string, page = 1, limit = 20) {
		// Verify admin
		const admin = await prisma.user.findUnique({
			where: { id: adminId },
		});

		if (!admin || admin.role !== "ADMIN") {
			throw new Error("Admin access required");
		}

		const skip = (page - 1) * limit;

		// Build search conditions
		const whereConditions: {
			OR?: Array<{
				first_name?: { contains: string; mode: "insensitive" };
				last_name?: { contains: string; mode: "insensitive" };
				email?: { contains: string; mode: "insensitive" };
				id?: { contains: string; mode: "insensitive" };
			}>;
		} = {};

		if (query?.trim()) {
			const searchQuery = query.trim();
			whereConditions.OR = [
				{ first_name: { contains: searchQuery, mode: "insensitive" } },
				{ last_name: { contains: searchQuery, mode: "insensitive" } },
				{ email: { contains: searchQuery, mode: "insensitive" } },
				{ id: { contains: searchQuery, mode: "insensitive" } },
			];
		}

		// Get total count
		const total = await prisma.user.count({
			where: whereConditions,
		});

		// Get users with pagination
		const users = await prisma.user.findMany({
			where: whereConditions,
			select: {
				id: true,
				email: true,
				first_name: true,
				last_name: true,
				role: true,
				createdAt: true,
			},
			orderBy: { createdAt: "desc" },
			skip: skip || 0,
			take: limit || 20,
		});

		const totalPages = Math.ceil(total / limit);

		return {
			users: users.map((user) => ({
				...user,
				createdAt: user.createdAt.toISOString(),
			})),
			total,
			page,
			limit,
			totalPages,
		};
	}

	async getSignedFileUrl(adminId: string, fileId: string, expiresIn = 3600) {
		// Verify admin
		const admin = await prisma.user.findUnique({
			where: { id: adminId },
		});

		if (!admin || admin.role !== "ADMIN") {
			throw new Error("Admin access required");
		}

		// Find the file
		const file = await prisma.userFile.findUnique({
			where: { id: fileId },
		});

		if (!file) {
			throw new Error("File not found");
		}

		// Generate signed URL
		const signedUrl = await generateSignedUrl(file.filePath, expiresIn);

		// Calculate expiration time
		const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

		return {
			signedUrl,
			expiresAt,
		};
	}

	async deleteFile(adminId: string, fileId: string) {
		// Verify admin
		const admin = await prisma.user.findUnique({
			where: { id: adminId },
		});

		if (!admin || admin.role !== "ADMIN") {
			throw new Error("Admin access required");
		}

		// Find the file
		const file = await prisma.userFile.findUnique({
			where: { id: fileId },
		});

		if (!file) {
			throw new Error("File not found");
		}

		// Determine if this is a metabolic data file that requires recalculation after deletion
		const isMetabolicFile =
			file.fileName === "pnoe.csv" || file.fileName === "vo2_master.csv";
		const userIdOfFile = file.userId;

		try {
			// Delete file from S3
			await deleteFromS3(file.filePath);
		} catch (error) {
			console.error("Error deleting file from S3:", error);
			// Continue with database deletion even if S3 deletion fails
			// This prevents orphaned database records
		}

		// Delete file record from database
		await prisma.userFile.delete({
			where: { id: fileId },
		});

		// If a metabolic data file was deleted, re-run the calculation to reflect the change
		if (isMetabolicFile) {
			try {
				console.log(
					`Auto-processing metabolic data after deletion for user ${userIdOfFile}: ${file.fileName}`,
				);
				await UserService.processPnoeData(userIdOfFile);
				console.log(
					`Successfully re-processed metabolic data for user ${userIdOfFile} after deletion`,
				);
			} catch (error) {
				console.error(
					`Error re-processing metabolic data for user ${userIdOfFile} after deletion:`,
					error,
				);
			}
		}

		return { message: "File deleted successfully" };
	}

	async deleteUser(adminId: string, userId: string) {
		// Verify admin
		const admin = await prisma.user.findUnique({
			where: { id: adminId },
		});

		if (!admin || admin.role !== "ADMIN") {
			throw new Error("Admin access required");
		}

		// Find the user to delete
		const userToDelete = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!userToDelete) {
			throw new Error("User not found");
		}

		// Prevent admin from deleting themselves
		if (adminId === userId) {
			throw new Error("Cannot delete your own admin account");
		}

		// Prevent deletion of other admin users
		if (userToDelete.role === "ADMIN") {
			throw new Error("Cannot delete admin users");
		}

		// Delete all user's files from S3
		const userFiles = await prisma.userFile.findMany({
			where: { userId },
		});

		// Delete files from S3 in parallel
		await Promise.allSettled(
			userFiles.map(async (file) => {
				try {
					await deleteFromS3(file.filePath);
				} catch (error) {
					console.error(`Error deleting file ${file.filePath} from S3:`, error);
				}
			}),
		);

		// Delete all related records in the correct order to avoid foreign key constraint violations
		await prisma.$transaction(async (tx) => {
			// Delete user's food logs
			await tx.foodLog.deleteMany({
				where: { userId },
			});

			// Delete user's custom foods
			await tx.food.deleteMany({
				where: { userId },
			});

			// Delete user's files
			await tx.userFile.deleteMany({
				where: { userId },
			});

			// Delete user's workouts
			await tx.workout.deleteMany({
				where: { userId },
			});

			// Delete user's nutrition records
			await tx.nutrition.deleteMany({
				where: { userId },
			});

			await tx.userCalProfile.deleteMany({
				where: { userId },
			});

			// Finally, delete the user
			await tx.user.delete({
				where: { id: userId },
			});
		});

		return { message: "User deleted successfully" };
	}
}

export default new AdminService();
