import proxy from 'express-http-proxy';

const getProxyOptions = () => ({
  parseReqBody: false, // stream body directly — prevents ERR_HTTP_HEADERS_SENT
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    // Forward Authorization header and any other headers unchanged
    if (srcReq.headers.authorization) {
      proxyReqOpts.headers['authorization'] = srcReq.headers.authorization;
    }
    return proxyReqOpts;
  }
});

export const setupProxies = (app) => {
  const routes = [
    { path: '/api/auth', target: process.env.AUTH_SERVICE_URL || 'http://localhost:5001' },
    { path: '/api/users', target: process.env.USER_SERVICE_URL || 'http://localhost:5002' },
    { path: '/api/extinguishers', target: process.env.EXTINGUISHER_SERVICE_URL || 'http://localhost:5003' },
    { path: '/api/inspections', target: process.env.INSPECTION_SERVICE_URL || 'http://localhost:5004' },
    { path: '/api/reports', target: process.env.REPORT_SERVICE_URL || 'http://localhost:5005' },
    { path: '/api/notifications', target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5006' }
  ];

  routes.forEach(route => {
    app.use(route.path, proxy(route.target, {
      ...getProxyOptions(),
      proxyReqPathResolver: (req) => {
        // Preserve the full path since services host their routes under /api/...
        return req.originalUrl;
      }
    }));
  });
};
