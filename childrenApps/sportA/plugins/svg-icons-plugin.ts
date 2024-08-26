import fg from "fast-glob";
import getEtag from "etag";
import path from "path";
import fs from "fs";
import cors from "cors";
import { normalizePath, ResolvedConfig } from "vite";

const SVG_ICONS_REGISTER_NAME = "virtual:svg-icons-plugin-register";
const SVG_DOM_ID = "__svg__icons__script__";

type InjectType = "body-last" | "body-first";

type OptionType = {
	iconDirs: string[];
	customDomId?: string;
	splitDir?: string;
	symbolId?: string;
	inject?: InjectType;
};

type RequiredOptionType = Required<OptionType>;

const domInject = (inject: InjectType = "body-last") => {
	switch (inject) {
		case "body-first":
			return "body.insertBefore(svgScript, body.firstChild);";
		default:
			return "body.insertBefore(svgScript, body.lastChild);";
	}
};

const compilerIcons = async (options: RequiredOptionType) => {
	const { iconDirs } = options;
	let svgSymbol = {};
	for (const dir of iconDirs) {
		const svgFilsStats = fg.sync("**/*.svg", {
			cwd: dir,
			stats: true,
			absolute: true,
		});
		for (const entry of svgFilsStats) {
			const { name, path: path2 } = entry;
			const replaceName = name.replace(/.svg/, "");
			const relativeDir = path2.split(options?.splitDir ?? "")?.[1] ?? "";

			svgSymbol[replaceName] = relativeDir;
		}
	}
	return JSON.stringify(svgSymbol, null, 2);
};

const createModuleCode = async (options: RequiredOptionType) => {
	const insertHtml = await compilerIcons(options);
	const code = `
		if (typeof window !== 'undefined') {
			function loadSvgScript() {
				var body = document.body;
				var svgScript = document.getElementById('${options.customDomId}');
				if(!svgScript) {
					svgScript = document.createElement('script');
					svgScript.setAttribute('type', 'text/javascript');
					svgScript.id = '${options.customDomId}';
				}
				svgScript.innerText = 'window.SVG_CONFIG = ${JSON.stringify(JSON.parse(insertHtml))}';
				${domInject(options.inject)}
			}
			if(document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', loadSvgScript);
			} else {
				loadSvgScript()
			}
		}
	`;

	return code;
};

/**
 * 创建配置文件
 */
const createModuleFile = async (options: RequiredOptionType) => {
	const insertHtml = await compilerIcons(options);

	const filePath = path.resolve(__dirname, "../public/svgConfig.json");

	// 判断是否存在
	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, insertHtml);
	} else {
		const originFile = fs.readFileSync(filePath, "utf-8");
		if (originFile && originFile !== insertHtml) {
			fs.writeFileSync(filePath, insertHtml);
		}
	}

	return `export default ${insertHtml}`;
};

const createSvgIconsPlugin = (opt: OptionType) => {
	let isBuild = false;
	const options = {
		symbolId: "[name]",
		inject: "body-last",
		splitDir: "assets/zh/",
		customDomId: SVG_DOM_ID,
		...opt,
	};

	const { symbolId } = options;

	if (!symbolId.includes("[name]")) {
		throw new Error("SymbolId must contain [name] string!");
	}

	return {
		name: "vite:svg-icons",
		configResolved(resolvedConfig: ResolvedConfig) {
			isBuild = resolvedConfig.command === "build";
		},
		resolveId(id: string) {
			if ([SVG_ICONS_REGISTER_NAME].includes(id)) {
				return id;
			}
			return null;
		},
		async load(id: string, ssr: any) {
			if (!isBuild && !ssr) return null;
			const isRegister = id.endsWith(SVG_ICONS_REGISTER_NAME);
			if (ssr && !isBuild && isRegister) {
				return `export default {}`;
			}
			if (isRegister) {
				const content = await createModuleCode(options as RequiredOptionType);
				return content;
			}
		},
		configureServer: ({ middlewares }) => {
			middlewares.use(cors({ origin: "*" }));
			middlewares.use(async (req: any, res: any, next: any) => {
				const url = normalizePath(req.url);
				const registerId = `/@id/${SVG_ICONS_REGISTER_NAME}`;
				if ([registerId].some((item) => url.endsWith(item))) {
					res.setHeader("Content-Type", "application/javascript");
					res.setHeader("Cache-Control", "no-cache");
					const content = await createModuleCode(options as RequiredOptionType);
					res.setHeader("Etag", getEtag(content, { weak: true }));
					res.statusCode = 200;
					res.end(content);
				} else {
					next();
				}
			});
		},
	};
};

export { createSvgIconsPlugin };
