# Deploying to Vercel

This guide provides detailed instructions for deploying your WireGuard Dashboard frontend to Vercel.

## Prerequisites

1. A GitHub, GitLab, or Bitbucket account where your code is hosted
2. A Vercel account (free tier is available)
3. Access to your WireGuard backend (for API URL and key)

## Step 1: Prepare Your Repository

Ensure your code is pushed to a Git repository. Your repository should include:

- All the application code
- `package.json` with correct dependencies
- `next.config.js` with any necessary configuration
- `vercel.json` (already included in the project)

## Step 2: Deploy to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click the "New Project" button
3. Import your Git repository from GitHub, GitLab, or Bitbucket
4. Configure the project:
   - **Framework Preset**: Next.js (should be detected automatically)
   - **Root Directory**: ./ (default if your project is in the repository root)
   - **Build Command**: next build (from vercel.json)
   - **Output Directory**: .next (default for Next.js)

## Step 3: Configure Environment Variables

Add the following environment variables in the Vercel project settings:

1. `NEXT_PUBLIC_MANAGEMENT_BACKEND_URL`: The URL of your WireGuard management backend
   - Example: `https://your-backend-domain.com`
   - Make sure this URL is accessible from Vercel's deployment servers

2. `MANAGEMENT_BACKEND_API_KEY`: Your secret API key for authenticating with the backend
   - This is a server-side secret and should NOT have the `NEXT_PUBLIC_` prefix
   - Keep this value secure

## Step 4: Deploy

1. Click "Deploy" to begin the deployment process
2. Vercel will build your application and deploy it to a production URL
3. Once complete, you'll receive a deployment URL (e.g., `https://your-project.vercel.app`)

## Step 5: Verify Deployment

1. Visit your deployment URL to ensure the application is working correctly
2. Check that you can:
   - View the server list in the sidebar
   - See server status details when selecting a server
   - Add and remove peers
   - Generate QR codes for peer configurations

## Troubleshooting

### API Connection Issues

If your frontend can't connect to your backend:

1. Check that your `NEXT_PUBLIC_MANAGEMENT_BACKEND_URL` is correct and accessible
2. Verify that your backend allows requests from your Vercel deployment (CORS)
3. Confirm that your `MANAGEMENT_BACKEND_API_KEY` is valid

### Build Errors

If your project fails to build:

1. Check the build logs in Vercel for specific error messages
2. Ensure all dependencies are correctly listed in your `package.json`
3. Verify that your `next.config.js` and `vercel.json` are correctly configured

## Additional Configuration

### Custom Domain

To use a custom domain with your Vercel deployment:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain and follow the verification steps

### Environment Branching

For development workflows:

1. Configure Git integration in your Vercel project settings
2. Enable preview deployments for pull requests
3. Configure environment variables per branch/environment if needed

## Monitoring and Logs

After deployment, you can:

1. Monitor application performance in the Vercel dashboard
2. View deployment logs for debugging
3. Set up Vercel Analytics for usage insights 