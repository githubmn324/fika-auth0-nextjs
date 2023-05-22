module.exports = {
  // rewrite機能を使うとフロントエンドからCORS対応しながら外部API呼び出し可能
  // https://zenn.dev/yoshio25/articles/9a27d4c75e3a16 参考
  // https://nextjs.org/docs/pages/api-reference/next-config-js/rewrites 参考
  async rewrites() {
    return [
      {
        source: '/api/auth0/:path*',
        destination: 'https://dev-kjqwuq76z8suldgw.us.auth0.com/api/v2/:path*',
      },
    ];
  },
  poweredByHeader: false,
  
  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false };
  //   return config;
  // },
};
