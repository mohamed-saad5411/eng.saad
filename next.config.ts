// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
  
// };

// export default nextConfig;


const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin(
  './src/lib/i18n/request.ts' // مسار ملف الإعدادات بتاعك
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // أي إعدادات تانية خاصة بمشروعك بتتحط هنا
};

module.exports = withNextIntl(nextConfig);
