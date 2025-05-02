# WireGuard Dashboard Frontend

A modern, responsive dashboard for managing WireGuard VPN servers, built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- View status of multiple WireGuard servers in a clean, modern UI
- Monitor connected peers and their statistics
- Add and remove peers (Phase 2)
- Custom "Walnut & Willow" color palette for a sophisticated, dark-themed dashboard

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Deployment**: Vercel

## Installation

1. Clone this repository
2. Install dependencies using one of these methods:

```bash
# Using the npm setup script (recommended for Windows/macOS/Linux)
npm run setup

# Or manual installation
npm install
npm install --save-dev @types/node @types/react @types/react-dom
npx shadcn@latest init --yes
npx shadcn@latest add button card dialog table toast alert-dialog
```

## Configuration

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_MANAGEMENT_BACKEND_URL=https://your-backend-url
MANAGEMENT_BACKEND_API_KEY=your-api-key
```

## Development

```bash
npm run dev
```

The application will be available at http://localhost:3000/dashboard

## Build for Production

```bash
npm run build
```

## Deployment to Vercel

This application is optimized for Vercel deployment. Follow these steps to deploy:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Vercel account and click "New Project"
3. Import your repository
4. Configure the following environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_MANAGEMENT_BACKEND_URL`: The URL of your WireGuard management backend
   - `MANAGEMENT_BACKEND_API_KEY`: Your secret API key for authenticating with the backend
5. Set the build command to `next build` (should be detected automatically)
6. Deploy the project

### Important Notes for Vercel Deployment

- The `MANAGEMENT_BACKEND_API_KEY` is a server-side secret and should NOT have the `NEXT_PUBLIC_` prefix
- Ensure that your backend is accessible from Vercel's servers
- If you're using a custom domain, configure it in the Vercel project settings
- For production deployments, consider setting up preview deployments and environment branching

## Project Structure

- `/src/app` - Next.js App Router pages
- `/src/components` - React components
- `/src/lib` - Utility functions
- `/src/types` - TypeScript type definitions

## License

MIT

## Security Considerations

### Self-Signed Certificates

This dashboard includes utilities to handle self-signed certificates from the backend API. While this is useful for development and testing, please note:

- For production environments, it's strongly recommended to use properly signed SSL certificates from a trusted Certificate Authority
- The dashboard disables certificate validation in server-side API routes using multiple approaches:
  1. A custom HTTPS Agent with `rejectUnauthorized: false`
  2. Setting `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'` in server-side code
  3. Configuring `serverRuntimeConfig` in `next.config.js`
- These approaches only affect server-side code, not browser requests
- **IMPORTANT SECURITY WARNING:** Disabling certificate validation reduces security. Only use with trusted backends.

If you're using a properly signed certificate for your backend API, these workarounds will still function but aren't necessary for security.

### Vercel Deployment

For Vercel deployment, the self-signed certificate handling is automatically included. However, for maximum security in production:

1. Use a properly signed SSL certificate for your backend API
2. Consider removing or conditionally applying the certificate validation bypasses in production environments
