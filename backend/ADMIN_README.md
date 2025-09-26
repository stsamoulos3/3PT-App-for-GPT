# Admin Dashboard - File Upload System

This document explains how to set up and use the admin dashboard for uploading files to users.

## Features

- **Admin Authentication**: Secure login system for administrators
- **User Management**: View all users in the system
- **File Upload**: Upload multiple files for specific users
- **File Management**: View and manage uploaded files
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Database Migration

The admin functionality requires database changes. Run the migration to add the necessary tables and fields:

```bash
cd apps/backend
bun run prisma:migrate
```

### 2. Create Admin User

Create an admin user using the provided script:

```bash
# Basic usage
bun run create-admin admin@example.com yourpassword

# With custom name
bun run create-admin admin@example.com yourpassword "John" "Doe"
```

This will:
- Create a new user with ADMIN role
- Hash the password securely
- Skip email verification for admin users
- If the user already exists, it will update their role to ADMIN

### 3. Start the Backend Server

```bash
bun run dev
```

The server will start on the configured port (default: 3000).

## Usage

### Accessing the Admin Dashboard

1. Open your browser and navigate to: `http://localhost:3000/admin`
2. Login with your admin credentials (email and password)
3. You'll see the admin dashboard with user management and file upload functionality

### Uploading Files for Users

1. **Select a User**: Click on any user from the left panel to select them
2. **Add Files**: 
   - Drag and drop files into the upload area, or
   - Click the upload area to select files from your computer
3. **Add Description** (optional): Enter a description for the files
4. **Upload**: Click the "Upload Files" button to upload the files

### Viewing User Files

- When you select a user, their uploaded files will be displayed in the bottom section
- Files show:
  - File name
  - File size
  - File type (MIME type)
  - Upload date
  - Description (if provided)

## API Endpoints

The admin functionality provides the following API endpoints:

### Authentication
- `POST /admin/sign-in` - Admin login

### User Management
- `GET /admin/users` - Get all users (requires admin token)

### File Management
- `POST /admin/upload-files` - Upload files for a user (requires admin token)
- `GET /admin/user/{userId}/files` - Get files for a specific user (requires admin token)

### Authentication
All admin endpoints (except sign-in) require the `x-api-key` header with a valid admin token.

## File Storage

Files are stored in Cloudflare R2, organized by user ID:
```
users/
├── user-id-1/
│   ├── timestamp_file1.pdf
│   └── timestamp_file2.jpg
└── user-id-2/
    └── timestamp_file3.docx
```

Files are accessible via direct R2 URLs and are automatically served through Cloudflare's global CDN.

## Security Features

- **Role-based Access**: Only users with ADMIN role can access admin functionality
- **Token Authentication**: JWT tokens are used for API authentication
- **File Validation**: Files are validated before upload
- **Secure File Storage**: Files are stored with unique names to prevent conflicts

## Database Schema

The admin functionality adds the following to the database:

### User Model Updates
- `role` field (enum: ADMIN, USER) - defaults to USER

### UserFile Model
- `id` - Unique identifier
- `userId` - Reference to user
- `fileName` - Original file name
- `filePath` - Path to stored file
- `fileSize` - File size in bytes
- `mimeType` - File MIME type
- `uploadedBy` - Admin ID who uploaded the file
- `description` - Optional file description
- `createdAt` - Upload timestamp
- `updatedAt` - Last update timestamp

## Troubleshooting

### Common Issues

1. **"Admin access required" error**
   - Ensure the user has ADMIN role in the database
   - Use the create-admin script to set up admin users

2. **"User not found" error**
   - Verify the user ID exists in the database
   - Check that the user hasn't been deleted

3. **File upload fails**
   - Check that R2 environment variables are properly configured
   - Verify R2 bucket permissions and access keys
   - Ensure the file size is within acceptable limits
   - Check network connectivity to Cloudflare R2

4. **Authentication fails**
   - Check that the JWT_SECRET environment variable is set
   - Verify the token hasn't expired (30 days by default)

### Environment Variables

Make sure these environment variables are set:
- `JWT_SECRET` - Secret key for JWT token generation
- `DATABASE_URL` - PostgreSQL database connection string
- `PORT` - Server port (default: 3000)

#### R2 Configuration (Required for file uploads)
- `R2_ACCOUNT_ID` - Your Cloudflare account ID
- `R2_ACCESS_KEY_ID` - R2 API access key ID
- `R2_SECRET_ACCESS_KEY` - R2 API secret access key
- `R2_BUCKET_NAME` - R2 bucket name for file storage

## Development

### Adding New Admin Features

1. **Add new routes** in `src/apis/admin/routes.ts`
2. **Create handlers** in `src/apis/admin/handlers.ts`
3. **Implement business logic** in `src/apis/admin/service.ts`
4. **Update models** in `src/apis/admin/models.ts`
5. **Register routes** in `src/apis/admin/index.ts`

### Testing

Test the admin functionality:
1. Create an admin user
2. Access the dashboard at `/admin`
3. Test file uploads for different users
4. Verify file storage and retrieval

## Support

For issues or questions about the admin functionality, check:
1. Server logs for error messages
2. Database connection and permissions
3. File system permissions for uploads directory
4. Environment variable configuration 