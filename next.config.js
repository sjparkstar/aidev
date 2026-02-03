/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    REDMINE_URL: process.env.REDMINE_URL,
    REDMINE_API_KEY: process.env.REDMINE_API_KEY,
  },
}

module.exports = nextConfig