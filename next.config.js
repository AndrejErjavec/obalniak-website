module.exports = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          port: ''
        },
      ],
    },
  }
