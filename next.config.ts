import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Default de Server Actions es 1MB — muy poco para subir varias fotos de un vehículo de una.
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
