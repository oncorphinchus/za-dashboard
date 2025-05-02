# Troubleshooting Guide

## 404 or 403 API Errors

If you're encountering 404 (Not Found) or 403 (Forbidden) errors when connecting to your backend, follow these steps:

### 1. Check Your Environment Variables

Make sure you're using the correct environment variable names:

```
NEXT_PUBLIC_MANAGEMENT_BACKEND_URL=https://your-actual-backend-url.com
NEXT_PUBLIC_MANAGEMENT_BACKEND_API_KEY=your_actual_api_key
```

Run our environment variable check script:

```
node scripts/check-env.js
```

### 2. Test API Connectivity

Use our diagnostic script to test all possible API endpoints and authentication methods:

```
node scripts/api-diagnostic.js
```

If you need to provide the URL and key directly:

```
node scripts/api-diagnostic.js "https://your-backend-url.com" "your-api-key"
```

### 3. Self-Signed Certificate Issues

If you're using a backend with a self-signed certificate, we've implemented multiple layers of protection:

1. Set `NODE_TLS_REJECT_UNAUTHORIZED=0` in your `.env.local` file
2. We've added code to disable certificate validation in server-side API routes

### 4. Check Server Logs

The API routes now output detailed logs about which endpoints they're trying. Check your server logs to see:

- Which endpoints are being attempted
- What status codes are being returned 
- Any error messages from failed requests

### 5. Compatible API Routes

The dashboard has been updated to try multiple endpoint patterns for each operation:

- Server listing: `/servers`, `/api/servers`, `/servers-list`, etc.
- Server status: `/servers/[id]/status`, `/api/servers/[id]/status`, etc.
- Peer operations: Multiple endpoint patterns for adding, removing, and getting peer configs

This ensures maximum compatibility with different backend implementations.

### 6. Important Change to Note

We've switched from using:
- `MANAGEMENT_BACKEND_API_KEY` 
to 
- `NEXT_PUBLIC_MANAGEMENT_BACKEND_API_KEY`

Make sure you update your environment variables accordingly.

## 403 Forbidden Errors

If you're encountering 403 Forbidden errors when connecting to your backend, this indicates an authentication or authorization issue. Follow these steps to diagnose and fix the problem:

### 1. Check Your Environment Variables

Ensure your `.env.local` file contains the correct values:

```
NEXT_PUBLIC_MANAGEMENT_BACKEND_URL=https://your-actual-backend-url.com
MANAGEMENT_BACKEND_API_KEY=your_actual_api_key
```

- Double-check for any typos or extra spaces
- Verify that the backend URL is correct and includes the protocol (https://)
- Confirm your API key is exactly what your backend expects

### 2. Try Different Authentication Methods

The dashboard now supports easily switching between authentication formats using an environment variable:

1. In your `.env.local` file, add the `API_AUTH_FORMAT` variable:

```
# Options: 'bearer' (default), 'apikey', 'raw', 'x-api-key'
API_AUTH_FORMAT=bearer
```

2. Try each of the following values one at a time:

   - `bearer` - Sends the header `Authorization: Bearer YOUR_API_KEY`
   - `apikey` - Sends the header `Authorization: ApiKey YOUR_API_KEY`
   - `raw` - Sends the header `Authorization: YOUR_API_KEY` (no prefix)
   - `x-api-key` - Sends the header `X-API-Key: YOUR_API_KEY`

3. Restart your development server after each change:

```
npm run dev
```

### 3. Use the Connection Testing Script

You can use our testing script to try multiple authentication methods at once:

1. First, ensure your `.env.local` file has the correct backend URL and API key:
   ```
   NEXT_PUBLIC_MANAGEMENT_BACKEND_URL=https://your-actual-backend-url.com
   MANAGEMENT_BACKEND_API_KEY=your_actual_api_key
   ```

2. Run the test script:
   ```
   node scripts/test-backend-connection.js
   ```

3. Check the output to see which authentication method works for your backend.

4. Once you find a working method, set it in your `.env.local` file:
   ```
   API_AUTH_FORMAT=x-api-key  # Or whichever format works
   ```

### 4. Examine Backend Logs

If possible, check the logs on your WireGuard backend server. Look for authentication errors that might provide insights into what's going wrong.

### 5. Verify Backend CORS Configuration

Ensure your backend allows requests from your frontend. The backend should include appropriate CORS headers in its responses.

### 6. Test a Direct API Request

Test the API directly using a tool like curl or Postman to verify it's working as expected:

```bash
# Example curl commands for different auth formats
curl -k -H "Authorization: Bearer YOUR_API_KEY" https://your-backend-url.com/servers
curl -k -H "Authorization: ApiKey YOUR_API_KEY" https://your-backend-url.com/servers
curl -k -H "Authorization: YOUR_API_KEY" https://your-backend-url.com/servers
curl -k -H "X-API-Key: YOUR_API_KEY" https://your-backend-url.com/servers
```

### 7. Check with Backend Developers

If you're using a managed backend or working with other developers, consult with them about:
- The expected API key format
- Any recent changes to the authentication mechanism
- Required headers or parameters

## For Vercel Deployment

When deploying to Vercel, make sure to:

1. Set the `NEXT_PUBLIC_MANAGEMENT_BACKEND_URL` environment variable
2. Set the `MANAGEMENT_BACKEND_API_KEY` environment variable
3. Set the `API_AUTH_FORMAT` environment variable to the format that works with your backend

## After Fixing Authentication

Once you've resolved the authentication issue:

1. Make sure the same `API_AUTH_FORMAT` is set in both development and production
2. Test the full application workflow to ensure all API calls are working properly 