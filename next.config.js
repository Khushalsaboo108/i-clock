module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // destination: 'http://localhost:8000/api/:path*',
        destination: 'https://iclock-backend.mentem.in//api/:path*',
      },
    ]
  },
}

