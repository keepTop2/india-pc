import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n";
import { LangType } from "/@/models/commonInterface";
// import app from '/@/main';
import zhCn from "element-plus/es/locale/lang/zh-cn";
import miandian from "./lang/element/miandian";

export interface I18nGlobalTranslation {
	(key: string): string;
	(key: string, locale: string): string;
	(key: string, locale: string, list: unknown[]): string;
	(key: string, locale: string, named: Record<string, unknown>): string;
	(key: string, list: unknown[]): string;
	(key: string, named: Record<string, unknown>): string;
}

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

export const useI18n = (): {
	t: I18nGlobalTranslation;
} => {
	const { t, ...method } = i18n.global as any;
	return {
		...method,
		t,
	};
};

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

	// console.info("设置界面语言", lang);
	const LangList = loadLang();
	// console.info("设置界面语言", LangList);
	if (LangList[lang]) {
		i18n.global.locale.value = lang;
		// console.info("设置界面语言", LangList, i18n.global.t("sports['全场让球']"));
	} else {
		i18n.global.locale.value = "en-US";
	}
}

/**
 * @description 设置 vant 语言
 * @param lang
 */
export function setElementLang() {
	console.info("设置 vant 语言");
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
