import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig, transformWithEsbuild } from 'vite';
import vitePluginImport from 'vite-plugin-imp';
import stylelint from 'vite-plugin-stylelint';
// import progress from 'vite-plugin-progress';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import {
    parseEnvVariables,
    getViteEnvVarsConfig,
    getViteCSSConfig,
    getViteBuildConfig,
    getViteEsbuildConfig,
    customChunkSplit,
    chunkSplitPlugin,
} from '@milesight/scripts';
import { version } from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const projectRoot = path.join(__dirname, '../../');
const {
    WEB_DEV_PORT,
    WEB_API_ORIGIN,
    WEB_WS_HOST,
    WEB_API_PROXY,
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    WEB_SOCKET_PROXY,
    MOCK_API_PROXY,
} = parseEnvVariables([
    path.join(projectRoot, '.env'),
    path.join(projectRoot, '.env.local'),
    path.join(__dirname, '.env'),
    path.join(__dirname, '.env.local'),
]);
const runtimeVariables = getViteEnvVarsConfig({
    // APP_TYPE: 'web',
    APP_VERSION: version,
    APP_API_ORIGIN: WEB_API_ORIGIN,
    APP_OAUTH_CLIENT_ID: OAUTH_CLIENT_ID,
    APP_OAUTH_CLIENT_SECRET: OAUTH_CLIENT_SECRET,
    APP_WS_HOST: WEB_WS_HOST,
});
const DEFAULT_LESS_INJECT_MODULES = [
    '@import "@milesight/shared/src/styles/variables.less";',
    '@import "@milesight/shared/src/styles/mixins.less";',
];

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        nodePolyfills({
            include: ['buffer', 'process'],
            globals: {
                Buffer: true,
                process: true,
            },
        }),
        stylelint({
            fix: true,
            cacheLocation: path.join(__dirname, 'node_modules/.cache/.stylelintcache'),
            emitWarning: !isProd,
        }),
        /**
         * Optimize build speed and reduce Tree-Shaking checks and resource processing at compile time
         */
        vitePluginImport({
            libList: [
                {
                    libName: '@mui/material',
                    libDirectory: '',
                    camel2DashComponentName: false,
                },
                {
                    libName: '@mui/icons-material',
                    libDirectory: '',
                    camel2DashComponentName: false,
                },
            ],
        }),
        chunkSplitPlugin({
            customChunk: customChunkSplit,
        }),
        {
            name: 'treat-js-files-as-jsx',
            async transform(code, id) {
                if (!id.match(/src\/.*\.js$/)) return null

                // Use the exposed transform from vite, instead of directly
                // transforming with esbuild
                return transformWithEsbuild(code, id, {
                    loader: 'jsx',
                    jsx: 'automatic',
                })
            },
        },
        react(),
        // progress(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // src path alias
            "~": path.resolve(__dirname, "node_modules"),
            "@src": path.resolve(__dirname, "src"),
            "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
            "@assets": path.resolve(__dirname, "src/pages/third-party/e3ms/@core/assets"),
            "@components": path.resolve(__dirname, "src/pages/third-party/e3ms/@core/components"),
            "@extensions": path.resolve(__dirname, "src/views/modules/extensions"),
            "@rmmsmodules": path.resolve(__dirname, "src/views/modules/rmms"),
            "@coremodules": path.resolve(__dirname, "src/pages/third-party/e3ms/core"),
            "@e3msmodules": path.resolve(__dirname, "src/pages/third-party/e3ms"),
            "@tenantmodules": path.resolve(__dirname, "src/views/modules/tenant"),
            "@fddmodules": path.resolve(__dirname, "src/views/modules/fdd"),
            "@hialertmodules": path.resolve(__dirname, "src/views/modules/hialert"),
            "@layouts": path.resolve(__dirname, "src/pages/third-party/e3ms/@core/layouts"),
            "@store": path.resolve(__dirname, "src/redux"),
            "@styles": path.resolve(__dirname, "src/pages/third-party/e3ms/@core/scss"),
            "@configs": path.resolve(__dirname, "src/configs"),
            "@utils": path.resolve(__dirname, "src/utility/Utils"),
            "@hooks": path.resolve(__dirname, "src/utility/hooks")
        },
    },

    define: runtimeVariables,
    css: getViteCSSConfig(DEFAULT_LESS_INJECT_MODULES),
    build: getViteBuildConfig(),
    esbuild: getViteEsbuildConfig(),
    optimizeDeps: {
        force: true,
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },

    server: {
        host: '0.0.0.0',
        port: WEB_DEV_PORT,
        open: true,
        proxy: {
            '/api': {
                target: WEB_API_PROXY,
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api\/v1/, ''),
            },
            '/mqtt': {
                target: WEB_SOCKET_PROXY,
                ws: true, // Enable the WebSocket proxy
                changeOrigin: true,
            },
            '/mock': {
                target: MOCK_API_PROXY,
                changeOrigin: true,
                rewrite: path => path.replace(/^\/mock/, ''),
            },
        },
    },
});
