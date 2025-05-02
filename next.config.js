/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
  // Set environment variables for handling self-signed certificates
  // This is only applied to server-side code, not client-side
  serverRuntimeConfig: {
    // Will only be available on the server side
    NODE_TLS_REJECT_UNAUTHORIZED: '0', // WARNING: Only use in development or with trusted backends
  },
}

module.exports = nextConfig 