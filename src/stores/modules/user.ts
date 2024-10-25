// import { useCookies } from '@vueuse/integrations/useCookies';

import { defineStore } from "pinia";
// import router from '/@/router';
import { setLang } from "/@/i18n/index";
import { LangEnum } from "/@/enum/appConfigEnum";
import { CommonApi } from "/@/api/common";
import Common from "/@/utils/common";
import { useMenuStore } from "./menu";
import EncryptionFn from "/@/utils/encryption";
import { userApi } from "/@/api/user";
import showToast from "/@/hooks/useToast";
import { loginApi } from "/@/api/login";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import activitySocketService from "/@/utils/activitySocketService";
import pubsub from "/@/pubSub/pubSub";

interface StoreUser {
	lang: string;
	LangList: [];
	currencyList: [];
	userInfo: any;
	loginInfo: any;
	userGlobalSetInfo: any;
	token: string;
	registerModalInfo: any;
}

export const useUserStore = defineStore("User", {
	state: (): StoreUser => {
		return {
			lang: JSON.parse(localStorage.getItem("langInfo" || "{}") as any)?.code || LangEnum["zh-CN"],
			LangList: [],
			currencyList: [],
			userInfo: JSON.parse(localStorage.getItem("userInfo") || "{}"),
			loginInfo: null,
			userGlobalSetInfo: {},
			token: "",
			registerModalInfo: {},
		};
	},
	getters: {
		getLang(): any {
			return this.lang;
		},
		getLogin(): boolean {
			return this.userInfo.token ? true : false;
		},
		getLangList(): any {
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
		getUserGlobalSetInfo(): any {
			return this.userGlobalSetInfo;
		},
		getRegisterModalInfo(): any {
			return this.registerModalInfo;
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

		// 设置货币语言下拉
		async setCommonBusiness() {
			const res: any = await CommonApi.getCommonBusinessDownBox().catch((err: any) => err);
			const { code, data } = res;
			if (code == Common.ResCode.SUCCESS) {
				this.LangList = data.languageEnums;
				this.currencyList = data.currencyEnums;
			}
		},
		// 设置用户信息
		setUserGlobalSetInfo(info: Object) {
			this.userGlobalSetInfo = info;
		},
		// 更新用户信息
		uplateUserGlobalSetInfo() {
			userApi.getUserGlobalSetInfo().then((res) => {
				this.setUserGlobalSetInfo(res.data);
			});
		},
		// 设置用户注册缓存信息
		setRegisterModalInfo(info: Object) {
			this.registerModalInfo = info;
		},
		// 设置用户信息
		setUserInfo(info: any) {
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
		// 用户初始化
		async userInit() {
			if (this.getUserInfo.token) {
				this.initUserInfo();
				this.uplateUserGlobalSetInfo();
			}
			await this.setCommonBusiness();
			this.setLangs(this.getLang);
			this.initUserMenu();
		},
		// 退出登陆
		logOut(): void {
			loginApi
				.logout()
				.then(() => {})
				.finally(() => {
					localStorage.removeItem("userInfo");
					window.location.replace("/");
				});
		},
		// 初始化用户信息
		async initUserInfo() {
			const websocketService: any = activitySocketService.getInstance();
			const sportsBetInfo = useSportsBetInfoStore();
			this.setBasionInfo();
			const res = await userApi.getIndexInfo().catch((err) => err);
			const { code, data, message } = res;
			if (code === Common.ResCode.SUCCESS) {
				const userInfo = { ...this.getUserInfo, ...data };
				this.setUserInfo(userInfo);
				localStorage.setItem("userInfo", JSON.stringify(userInfo));
				// 同步体育余额信息
				sportsBetInfo.balance = data.totalBalance;
				websocketService.connect().then(() => {
					pubsub.publish("websocketReady");
				});
			} else {
				showToast(message, 1500);
			}
		},
		async setBasionInfo() {
			const res = await userApi.getCurrentBasicInfo().catch((err) => err);
			const { code, data, message } = res;
			if (code === Common.ResCode.SUCCESS) {
				const userInfo = { ...this.getUserInfo, ...data };
				this.setUserInfo(userInfo);
			}
		},
	},
	persist: [
		{
			key: "loginInfo",
			storage: localStorage,
			paths: ["loginInfo", "token"],
		},
		{
			key: "userGlobalSetInfo",
			storage: localStorage,
			paths: [...["userGlobalSetInfo"]],
		},
	],
});
