import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig, loadEnv, ConfigEnv } from "vite";
import vueSetupExtend from "vite-plugin-vue-setup-extend-plus";
import viteCompression from "vite-plugin-compression";
import { buildConfig } from "./src/utils/build";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { visualizer } from "rollup-plugin-visualizer";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { execSync } from "child_process";
// import { createSvgIconsPlugin } from "./plugins/svg-icons-plugin";

import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

import svgLoader from "vite-svg-loader";

//git版本号
const gitVersion = getGitVersion();

const pathResolve = (dir: string) => {
	return resolve(process.cwd(), ".", dir);
};

const alias = [
	{
		find: "vue-i18n",
		replacement: "vue-i18n/dist/vue-i18n.cjs.js",
	},
	{
		find: /\/@\//,
		replacement: pathResolve("src") + "/",
	},
	{
		find: /\/#\//,
		replacement: pathResolve("types") + "/",
	},
	{
		find: "vue",
		replacement: "vue/dist/vue.esm-bundler.js",
	},
];

const viteConfig = defineConfig(({ command, mode }: ConfigEnv) => {
	const isProduction = command === "build";
	const env = loadEnv(mode, process.cwd());
	return {
		__VUE_OPTIONS_API__: true,
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
		base: "./",
		plugins: [
			vue(),
			vueJsx(),
			vueSetupExtend(),
			viteCompression({
				verbose: true, // 默认即可
				disable: false, //开启压缩(不禁用)，默认即可
				deleteOriginFile: false, //删除源文件
				threshold: 1024, //压缩前最小文件大小
				algorithm: "brotliCompress", //压缩算法
				ext: ".br", //文件类型
			}),
			AutoImport({
				resolvers: [ElementPlusResolver()],
			}),
			Components({
				resolvers: [ElementPlusResolver(), IconsResolver()],
			}),
			Icons(),
			svgLoader(),
			createHtmlPlugin({
				minify: true,
				pages: [
					{
						template: "index.html",
						filename: "index.html",
						injectOptions: {
							data: {
								buildTime: new Date().toLocaleString(),
								gitVersion,
							},
						},
					},
				],
			}),
			JSON.parse(env.VITE_OPEN_CDN) ? buildConfig.cdn() : null,

			createSvgIconsPlugin({
				// 指定需要缓存的图标文件夹
				iconDirs: [path.resolve(process.cwd(), "src/assets/svg")],
				// 指定symbolId格式
				symbolId: "[dir]-[name]",
			}),
			process.env.npm_lifecycle_event == "build:preview"
				? visualizer({
						gzipSize: true,
						brotliSize: true,
						emitFile: false,
						filename: "test.html", //分析图生成的文件名
						open: true, //如果存在本地服务端口，将在打包后自动展示
				  })
				: null,
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
			port: 5001,
			proxy: {},
		},

		build: {
			minify: "terser", // 必须开启：使用terserOptions才有效果
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
			terserOptions: {
				compress: {
					//生产环境时移除console
					// drop_console: isProduction,
					// drop_console: false,
					// drop_debugger: true,
				},
			},
		},
		css: {
			preprocessorOptions: {
				// css: { charset: false }
				scss: {
					// javascriptEnable: true,
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
function getGitVersion() {
	try {
		// 获取最近的提交次数
		const commitCount = execSync("git rev-list --count HEAD").toString().trim();
		// 获取最近提交的简短哈希
		const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
		// // 获取最近的提交信息
		// const commitMessage = execSync('git log -1 --pretty=%B').toString().trim()
		// 获取当前分支名
		const branchName = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
		return `${commitCount}-${commitHash}-${branchName}`;
	} catch (e) {
		console.error("无法生成 Git 版本号:", e);
		return "0.0.0";
	}
}
export default viteConfig;
