import { defineConfig } from '@umijs/max';

export default defineConfig({
  publicPath: '/',
  antd: {},
  request: {
  },
  routes: [
    { path: "/", component: "home" },
    { path: "/banking", component: "banking" },
    { path: "/compare", component: "compare" },
  ],
  npmClient: 'pnpm',
  proxy: {
    '/rank/data': {
      target: 'https://dev-allinpay.pmssaas.com/rank/data/',
      changeOrigin: true,
      pathRewrite: {"^/rank/data": ""}
    },
  },
  history: {
    type: 'hash'
  },
});

