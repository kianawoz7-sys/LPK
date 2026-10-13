import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const localNetworkHosts = Object.values(networkInterfaces()).flatMap((entries) =>
  (entries ?? [])
    .filter((entry) => entry.family === "IPv4" && !entry.internal)
    .map((entry) => entry.address),
);

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", ...localNetworkHosts],
  turbopack: { root: process.cwd() },
  images: { unoptimized: true },
};

export default nextConfig;
