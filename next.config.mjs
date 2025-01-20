/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // 기존 설정 유지
  env: {
    NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  },
};

export default nextConfig;
