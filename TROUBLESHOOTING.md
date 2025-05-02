# Troubleshooting Guide

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