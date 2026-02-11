module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://i-clock-backend.onrender.com/api/:path*',
      },
    ]
  },
}

