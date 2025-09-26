import { createRouter } from "../../lib/create-app";
import adminHandlers from "./handlers";
import adminRoutes from "./routes";

const router = createRouter()
	.openapi(adminRoutes.adminSignInRoute, adminHandlers.adminSignInHandler)
	.openapi(adminRoutes.fileUploadRoute, adminHandlers.fileUploadHandler)
	.openapi(adminRoutes.getUserFilesRoute, adminHandlers.getUserFilesHandler)
	.openapi(adminRoutes.getAllUsersRoute, adminHandlers.getAllUsersHandler)
	.openapi(adminRoutes.searchUsersRoute, adminHandlers.searchUsersHandler)
	.openapi(
		adminRoutes.getSignedFileUrlRoute,
		adminHandlers.getSignedFileUrlHandler,
	)
	.openapi(adminRoutes.deleteFileRoute, adminHandlers.deleteFileHandler)
	.openapi(adminRoutes.deleteUserRoute, adminHandlers.deleteUserHandler);

export default router;
