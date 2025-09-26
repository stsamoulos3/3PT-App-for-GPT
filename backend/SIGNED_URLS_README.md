# Signed URLs for Secure File Access

This document explains the implementation of signed URLs for secure file access in the admin dashboard.

## Problem

Previously, files uploaded to Cloudflare R2 were accessible via direct URLs that required authentication, causing "permission denied" errors when trying to view images or files.

## Solution

Implemented signed URLs that:
- Generate temporary, authenticated URLs for file access
- Expire after a configurable time period (default: 1 hour)
- Provide secure access without exposing R2 credentials
- Work seamlessly with the existing admin dashboard

## Implementation Details

### 1. R2 Helper Functions (`src/helpers/r2.ts`)

Added `generateSignedUrl` function:
```typescript
export async function generateSignedUrl(key: string, expiresIn: number = 3600): Promise<string>
```

This function:
- Uses AWS SDK's `getSignedUrl` from `@aws-sdk/s3-request-presigner`
- Generates a pre-signed URL for R2 objects
- Default expiration time is 1 hour (3600 seconds)
- Returns a secure URL that can be used to access the file

### 2. New API Endpoint

**Route**: `GET /admin/file/{fileId}/signed-url`

**Parameters**:
- `fileId` (UUID): The ID of the file to generate a signed URL for
- `expiresIn` (query parameter, optional): Expiration time in seconds (default: 3600)

**Response**:
```json
{
  "signedUrl": "https://...",
  "expiresAt": "2025-07-18T10:30:00.000Z"
}
```

**Authentication**: Requires admin token in `x-api-key` header

### 3. Admin Service Updates (`src/apis/admin/service.ts`)

Added `getSignedFileUrl` method:
```typescript
async getSignedFileUrl(adminId: string, fileId: string, expiresIn: number = 3600)
```

This method:
- Verifies admin permissions
- Finds the file in the database
- Generates a signed URL using the R2 key
- Returns both the signed URL and expiration time

### 4. Frontend Updates (`src/static/admin-dashboard-jsx.ts`)

Updated the file display to use signed URLs:
- Changed "View" links to buttons that call `getSignedUrl()` function
- Added `getSignedUrl()` JavaScript function that:
  - Makes API call to get signed URL
  - Opens the signed URL in a new tab
  - Handles errors gracefully

## Usage

### For Admins

1. **Access the Admin Dashboard**: Navigate to `/admin-jsx`
2. **Login**: Use admin credentials
3. **Select a User**: Choose a user from the list
4. **View Files**: Click "View" button next to any file
5. **Secure Access**: The file opens in a new tab with a signed URL

### For Developers

**Generate a signed URL programmatically**:
```typescript
const response = await fetch('/admin/file/{fileId}/signed-url?expiresIn=3600', {
  headers: {
    'x-api-key': adminToken,
  },
});

const { signedUrl, expiresAt } = await response.json();
```

## Security Features

1. **Admin Authentication**: Only authenticated admins can generate signed URLs
2. **File Ownership**: Admins can only access files they have permission to view
3. **Temporary Access**: URLs expire after a configurable time period
4. **No Credential Exposure**: R2 credentials are never exposed to clients
5. **Audit Trail**: All file access is logged through the admin system

## Configuration

### Environment Variables

Ensure these R2 environment variables are set:
```bash
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
```

### Expiration Times

- **Default**: 1 hour (3600 seconds)
- **Configurable**: Pass `expiresIn` parameter to customize
- **Recommended**: 1-24 hours for most use cases
- **Maximum**: R2 supports up to 7 days (604800 seconds)

## Error Handling

The implementation includes comprehensive error handling:

1. **Invalid File ID**: Returns 404 if file doesn't exist
2. **Unauthorized Access**: Returns 401 for invalid admin tokens
3. **R2 Errors**: Handles R2 service errors gracefully
4. **Network Errors**: Provides user-friendly error messages

## Testing

### Manual Testing

1. Start the server: `bun run dev`
2. Access admin dashboard: `http://localhost:4000/admin-jsx`
3. Login with admin credentials
4. Upload a file for a user
5. Click "View" to test signed URL generation

### API Testing

```bash
# Test signed URL generation
curl -X GET "http://localhost:4000/admin/file/{fileId}/signed-url?expiresIn=3600" \
  -H "x-api-key: {adminToken}"
```

## Benefits

1. **Secure Access**: Files are no longer publicly accessible
2. **Temporary URLs**: Automatic expiration prevents long-term access
3. **Admin Control**: Only admins can generate access URLs
4. **Seamless UX**: Users can still view files with a single click
5. **Audit Trail**: All access is logged and trackable
6. **Cost Effective**: No need for additional authentication services

## Future Enhancements

Potential improvements:
1. **User-specific signed URLs**: Allow users to generate their own signed URLs
2. **Download tracking**: Log when files are accessed
3. **Custom expiration**: Allow admins to set custom expiration times per file
4. **Bulk operations**: Generate signed URLs for multiple files at once
5. **Preview support**: Generate different URLs for preview vs download

## Troubleshooting

### Common Issues

1. **"File not found" error**:
   - Verify the file ID is correct
   - Check that the file exists in the database
   - Ensure the file was uploaded successfully

2. **"Admin access required" error**:
   - Verify the admin token is valid
   - Check that the user has ADMIN role
   - Ensure the token hasn't expired

3. **"Failed to generate signed URL" error**:
   - Check R2 environment variables
   - Verify R2 bucket permissions
   - Check network connectivity to R2

4. **Signed URL doesn't work**:
   - Verify the URL hasn't expired
   - Check that the file still exists in R2
   - Ensure the R2 key is correct

### Debugging

Enable debug logging by checking server logs for:
- R2 connection errors
- File lookup failures
- Authentication issues
- URL generation errors 