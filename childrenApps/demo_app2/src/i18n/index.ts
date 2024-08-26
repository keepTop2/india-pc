import { createI18n } from "vue-i18n";
import { LangType } from "/@/models/commonInterface";
// import app from '/@/main';
import zhCn from "element-plus/es/locale/lang/zh-cn";
import miandian from "./lang/element/miandian";

export function loadLang() {
	const modules: Record<string, any> = import.meta.glob("./lang/*.ts", { eager: true });
	const langs: Record<string, any> = {};

	for (const path in modules) {
		const name = path.replace(/(\.\/lang\/|\.ts)/g, "");
		langs[name] = modules[path].lang;
	}
	console.log(langs, "看看语言列表");
	return langs;
}

export const i18n = createI18n({
	// globalInjection: true,
	legacy: false,
	locale: "en-US",
	fallbackLocale: "en-US",
	messages: loadLang(),
});

/**
 * @description 设置界面语言
 * @param lang
 */
export function setLang(lang: LangType) {
	// if (lang) {
	// 	localStorage.setItem('lang', lang);
	// }
	// if (!localStorage.getItem('lang')) {
	// 	localStorage.setItem('lang', 'zh');
	// }
	// i18n.global.locale.value = localStorage.getItem('lang') as string;
	const LangList = loadLang();
	if (LangList[lang]) {
		i18n.global.locale.value = lang;
	} else {
		i18n.global.locale.value = "en-US";
	}
}

/**
 * @description 设置 vant 语言
 * @param lang
 */
export function setElementLang() {
	let lang = localStorage.getItem("lang");
	if (!lang) {
		lang = "zh";
	}
	if (lang != "zh") {
		return zhCn;
	} else {
		return miandian;
	}
}
