import { UserConfig, ConfigEnv, splitVendorChunkPlugin } from 'vite';
import { createVitePlugins } from './build/vite/plugins';
import { resolve } from 'path';
import { VITE_PORT } from './build/constant';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build';
  let base: string;
  if (command === 'build') {
    base = '/';
  } else {
    base = '/';
  }
  return {
    base,
    publicDir: 'public', //静态资源服务的文件夹
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // 别名 /@/xxxx => src/xxxx
        {
          find: '/@',
          replacement: pathResolve('src') + '/',
        },
      ],
    },
    modulePreload: { polyfill: true },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'axios', 'ant-design-vue', '@ant-design/icons-vue'],
    },
    // plugins
    plugins: [...createVitePlugins(isBuild), splitVendorChunkPlugin()],

    // css
    css: {},

    // server
    server: {
      hmr: { overlay: false }, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
      // 服务配置
      port: VITE_PORT, // 类型： number 指定服务器端口;
      open: false, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
      cors: true, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
      host: '0.0.0.0', // IP配置，支持从IP启动
      https: false, // 禁用https

      // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 改动开始 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
      proxy: {
        '/api': {
          target: 'http://localhost:9100', // 后端接口地址
          changeOrigin: true, // 是否跨域
          ws: true,
          // 注意：因为你的后端 application.yml 配置了 context-path: /api
          // 所以这里不需要 rewrite 去掉 /api，直接原样转发即可
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 改动结束 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    },
    build: {
      target: 'es2018',
      cssCodeSplit: true,
      sourcemap: false,
      chunkSizeWarningLimit: 1200,
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            antd: ['ant-design-vue', '@ant-design/icons-vue'],
            vendor: ['axios', 'qs'],
          },
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  };
};
