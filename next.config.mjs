/** @type {import('next').NextConfig} */
const isBasePathDefined =
  typeof process.env.NEXT_PUBLIC_BASE_PATH === "string" &&
  process.env.NEXT_PUBLIC_BASE_PATH.length > 0

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: "export",
  // Only set basePath/assetPrefix when provided (for GitHub Pages project sites)
  ...(isBasePathDefined
    ? {
        basePath: process.env.NEXT_PUBLIC_BASE_PATH,
        assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
      }
    : {}),
}

export default nextConfig
