// import { useCookies } from '@vueuse/integrations/useCookies';

import { defineStore } from "pinia";
// import router from '/@/router';
import { setLang } from "/@/i18n/index";
import { LangEnum } from "/@/enum/appConfigEnum";
import { CommonApi } from "/@/api/common";
import { ref, Ref } from "vue";
import Common from "/@/utils/common";
// interface StoreUser {
// 	token: string;
// 	userInfo: Record<any, any>;
// 	lang: string; //语言
// }

interface LangListType {
	code: LangEnum;
	currLang: number;
	icon: string;
	name: string;
	sort: number;
}
interface StoreUser {
	lang: Ref<LangEnum>;
	LangList: Ref<Array<LangListType>>;
}

export const useUserStore = defineStore("User", () => {
	const lang: StoreUser["lang"] = ref((localStorage.getItem("lang") as LangEnum) || LangEnum["en-US"]);
	const LangList: StoreUser["LangList"] = ref([]);
	const currencyList: any = ref([]);

	const setLangs = (v: LangEnum) => {
		lang.value = v;
		setLang(v);
	};

	const setCommonBusiness = async () => {
		const res: any = await CommonApi.getCommonBusinessDownBox().catch((err: any) => err);
		const { code, data } = res;
		if (code == Common.ResCode.SUCCESS) {
			LangList.value = data.languageEnums;
			currencyList.value = data.languageEnums;
		}
	};

	const userInit = async () => {
		setLangs(lang.value);
		setCommonBusiness();
	};
	return { lang, LangList, setLangs, userInit, setCommonBusiness };
	// state: (): StoreUser => {
	// 	return {
	// 		lang: "zh",
	// 		token: "",
	// 		userInfo: {},
	// 	};
	// },
	// getters: {
	// 	getLang(): any {
	// 		console.log(this.lang, "================");
	// 		return this.lang;
	// 	},
	// 	getUserInfo(): any {
	// 		return this.userInfo || {};
	// 	},
	// },
	// actions: {
	// 	setLang(data: any) {
	// 		this.lang = data;
	// 		setLang(this.lang as any);
	// 	},
	// 	setInfo(data: any) {
	// 		this.token = data.token;
	// 		this.userInfo = data ? data : {};
	// 	},

	// 	clearInfo() {
	// 		this.token = "";
	// 		this.userInfo = {};
	// 		localStorage.clear();
	// 	},
	// },
	// persist: {
	// 	key: "useUserStore",
	// 	storage: sessionStorage,
	// 	paths: ["token", "userInfo", "lang"],
	// },
});
