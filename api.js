const fs = require("fs");
const path = require("path");
const axios = require("axios");

// 定义输出目录
const outputDir = path.join(__dirname, "/src/api/");

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir);
}

// 获取 API 文档
const fetchApiDocs = async () => {
	try {
		const response = await axios.get("https://gw.playesoversea.store/app/v3/api-docs");
		const paths = response.data.paths; // 提取路径信息
		const schemas = response.data.components.schemas; // 提取 schemas 信息
		return { paths, schemas };
	} catch (error) {
		console.error("获取 API 文档时出错:", error.response ? error.response.data : error.message);
	}
};

// 生成 TypeScript 接口
const generateInterfaces = (schemas) => {
	let interfaces = "";

	for (const [key, value] of Object.entries(schemas)) {
		const interfaceName = key; // 接口名称
		const properties = value.properties;
		const requiredProps = value.required || []; // 获取必填字段

		// 生成属性定义
		const propertyLines = Object.entries(properties)
			.map(([propKey, propValue]) => {
				let type = propValue.type;

				// 处理引用类型
				if (propValue.$ref) {
					const ref = propValue.$ref.split("/").pop(); // 获取引用的类型名称
					type = ref; // 使用引用类型
				} else if (type === "array") {
					// 处理数组类型
					const itemType = propValue.items.$ref ? propValue.items.$ref.split("/").pop() : propValue.items.type;
					type = `${itemType}[]`;
				} else if (type === "integer") {
					type = "number"; // 将 integer 转换为 number
				}

				// 添加注释，使用 description
				const comment = propValue.description ? propValue.description : "无注释";

				// 判断是否为必填字段
				const isRequired = requiredProps.includes(propKey);
				return `    /** ${comment} */\n    ${propKey}${isRequired ? "" : "?"}: ${type};`;
			})
			.join("\n");

		interfaces += `export interface ${interfaceName} {\n${propertyLines}\n}\n\n`;
	}

	return interfaces;
};

// 主函数
const main = async () => {
	const { schemas } = await fetchApiDocs();
	if (schemas) {
		const interfaces = generateInterfaces(schemas);

		// 将生成的接口保存到 TypeScript 文件
		fs.writeFileSync(path.join(outputDir, "apiInterfaces.ts"), interfaces);
		console.log("TypeScript 接口已生成到 output/apiInterfaces.ts");
	}
};

main();
