import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig, loadEnv, ConfigEnv } from "vite";
import vueSetupExtend from "vite-plugin-vue-setup-extend-plus";
import viteCompression from "vite-plugin-compression";
import { buildConfig } from "./src/utils/build";
import path from "path";
import { createSvgIconsPlugin } from "./plugins/svg-icons-plugin";
import svgLoader from "vite-svg-loader";

const pathResolve = (dir: string) => {
	return resolve(process.cwd(), ".", dir);
};

const alias = [
	{
		find: "vue-i18n",
		replacement: "vue-i18n/dist/vue-i18n.cjs.js",
	},
	// /@/xxxx => src/xxxx
	{
		find: /\/@\//,
		replacement: pathResolve("src") + "/",
	},
	// /#/xxxx => types/xxxx
	{
		find: /\/#\//,
		replacement: pathResolve("types") + "/",
	},
];

const viteConfig = defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd());
	return {
		base: "./",
		plugins: [
			vue(),
			createSvgIconsPlugin({
				iconDirs: [
					path.resolve(process.cwd(), "src/assets/svg"),
					// path.resolve(process.cwd(), "src/assets/2sdf"),
				],
			}),
			vueSetupExtend(),
			svgLoader(),
			viteCompression(),
			JSON.parse(env.VITE_OPEN_CDN) ? buildConfig.cdn() : null,
		],
		root: process.cwd(),
		resolve: { alias },
		// base: './',
		optimizeDeps: { exclude: ["vue-demi"] },
		// server: {
		// 	host: true,
		// 	hmr: true,
		// },
		// 开发服务器配置
		server: {
			host: true,
			hmr: true,
			open: false,
			port: 5002,
			proxy: {
				"/app-foreign": {
					target: env.VITE_API_URL,
					// target: 'http://192.168.27.127:7070/',
					changeOrigin: true,
					ws: true,
					secure: true,
					//重写代理tag（app-foreign）
					// rewrite: (path) => path.replace(/^\/app-foreign/, ''),
				},
			},
		},

		build: {
			outDir: "dist",
			chunkSizeWarningLimit: 1500,
			assetsDir: "assets",
			sourcemap: false,
			rollupOptions: {
				output: {
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
					manualChunks(id) {
						if (id.includes("node_modules")) {
							return id.toString().match(/\/node_modules\/(?!.pnpm)(?<moduleName>[^\/]*)\//)?.groups!.moduleName ?? "vender";
						}
					},
				},
				...(JSON.parse(env.VITE_OPEN_CDN) ? { external: buildConfig.external } : {}),
			},
		},
		css: {
			preprocessorOptions: {
				// css: { charset: false }
				scss: {
					// javascriptEnable: true,
					// additionalData: '@import "/@/styles/index.scss";',
				},
			},
		},
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
			__NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
		},
	};
});

export default viteConfig;
