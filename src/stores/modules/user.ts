// import { useCookies } from '@vueuse/integrations/useCookies';

import { defineStore } from "pinia";
// import router from '/@/router';
import { setLang } from "/@/i18n/index";
import { LangEnum } from "/@/enum/appConfigEnum";
import { CommonApi } from "/@/api/common";
import Common from "/@/utils/common";
import { useMenuStore } from "./menu";
import EncryptionFn from "/@/utils/encryption";
interface LangListType {
	code: LangEnum;
	currLang: number;
	icon: string;
	name: string;
	sort: number;
}
interface StoreUser {
	lang: LangEnum;
	LangList: Array<LangListType> | Array<null>;
	currencyList: [];
	userInfo: any;
	loginInfo: any;
}

export const useUserStore = defineStore("User", {
	state: (): StoreUser => {
		return {
			lang: JSON.parse(localStorage.getItem("langInfo" || "{}") as any)?.code || LangEnum["en-US"],
			LangList: [],
			currencyList: [],
			userInfo: JSON.parse(localStorage.getItem("userInfo") || "{}"),
			loginInfo: null,
		};
	},
	getters: {
		getLang(): LangEnum {
			return this.lang;
		},
		getLogin(): boolean {
			return this.userInfo.token ? true : false;
		},
		getLangList(): Array<LangListType> | Array<null> {
			return this.LangList;
		},
		getUserInfo(): any {
			return this.userInfo;
		},
		getCurrencyList(): any {
			return this.currencyList;
		},
		getLoginInfo(): any {
			if (!this.loginInfo) return null;
			const decryptedInfo = EncryptionFn.decrypt(this.loginInfo);
			return decryptedInfo;
		},
	},

	actions: {
		setLangs(lang: LangEnum) {
			this.lang = lang;
			const currentLangInfo = this.LangList.find((item: any) => item.code === lang);
			currentLangInfo ? localStorage.setItem("langInfo", JSON.stringify(currentLangInfo)) : null;
			setLang(lang);
		},
		async initUserMenu() {
			const userMenu = useMenuStore();
			const res: any = await CommonApi.queryLobbyLabelList().catch((err: any) => err);
			const { code, data } = res;
			if (code == Common.ResCode.SUCCESS) {
				userMenu.setMenuList(data);
			}
		},
		async setCommonBusiness() {
			const res: any = await CommonApi.getCommonBusinessDownBox().catch((err: any) => err);
			const { code, data } = res;
			if (code == Common.ResCode.SUCCESS) {
				this.LangList = data.languageEnums;
				this.currencyList = data.currencyEnums;
			}
		},

		setUserInfo(info: Object) {
			this.token = info.token;
			Object.assign(this.userInfo, info);
		},
		// 设置记住密码
		setLoginInfo(data?: any) {
			if (!data) {
				this.loginInfo = null;
				return;
			}
			const loginInfoObj = {
				userAccount: data.userAccount ?? "",
				password: data.password ?? "",
			};
			// 将 loginInfo 对象加密后转换为字符串
			this.loginInfo = EncryptionFn.encryption(JSON.stringify(loginInfoObj));
		},
		async userInit() {
			await this.setCommonBusiness();
			this.setLangs(this.getLang);
			this.initUserMenu();
		},
		logOut(): void {
			localStorage.removeItem("userInfo");
			window.location.reload();
			console.log(this.getUserInfo);
		},
	},
	persist: [
		{
			key: "loginInfo",
			storage: localStorage,
			paths: ["loginInfo"],
		},
	],
});
