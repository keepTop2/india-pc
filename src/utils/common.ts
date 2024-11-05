import { ElMessage } from "element-plus";
import moment from "moment-timezone";
import Decimal from "decimal.js";
import { useThemesStore } from "../stores/modules/themes";
import dayjs from "dayjs";
// import download from './download.js';
// 引入复制插件
import useClipboard from "vue-clipboard3";
import { i18n } from "../i18n";
import { gameApi } from "../api/game";
import { CommonApi } from "../api/common";
import router from "../router";
import qs from "qs";
import showToast from "../hooks/useToast";
// // 全局设置moment时区 (上海)
// moment.tz.setDefault("Pacific/Guadalcanal");
class Common {
	static ResCode = {
		//成功
		SUCCESS: 10000,
		//token为空
		TOKEN_MISSION: 10006,
		//令牌错误
		TOKEN_INVALID: 10007,
		//登录过期
		LOGIN_EXPIRE: 10008,
		//授权失败
		Authorization_Failed: 10014,
		//服务异常，请稍后再试
		ERR: 500,
	};

	// 手机号正则
	static phoneReg(phone: string) {
		return /^1[0-9]\d{9}$/.test(phone);
	}

	// 邮箱正则
	static emailReg(email: string) {
		return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email);
	}

	// 新增会员登录密码正则 6-16位，字母+数字组合
	static accountPassword(password: string) {
		return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(password);
	}

	// 电话号码转换*
	static maskString(str: string) {
		if (!str) return;
		const length = str.length;
		// 对于长度大于等于8的情况
		if (length >= 8) {
			const prefix = str.slice(0, 3); // 前3位
			const suffix = str.slice(-3); // 后3位
			const masked = "*".repeat(length - 6); // 中间字符替换为*
			return prefix + masked + suffix;
		}

		// 对于长度小于8的情况
		else if (length < 8) {
			const prefix = str.slice(0, 2); // 前2位
			const suffix = str.slice(-2); // 后2位
			const masked = "*".repeat(length - 4); // 中间字符替换为*
			return prefix + masked + suffix;
		}
	}
	// 邮箱转换*
	static maskEmail(email: string) {
		const [localPart, domain] = email.split("@"); // 将email按@分割
		const prefix = localPart.slice(0, 2); // 前2位
		const masked = "***"; // 中间字符为*
		return prefix + masked + "@" + domain; // 重新组合
	}
	/**
	 * @description 加法
	 * @param a
	 * @param b
	 * @returns 加出来的和
	 */
	static add = (a: string | number, b: string | number) => Number(new Decimal(Number(a)).add(new Decimal(Number(b))));

	/**
	 * @description 减法
	 * @param a
	 * @param b
	 * @returns
	 */
	static sub = (a: string | number, b: string | number) => Number(new Decimal(Number(a)).sub(new Decimal(Number(b))));
	/**
	 * @description 乘法
	 * @param a
	 * @param b
	 * @returns
	 */
	static mul = (a: string | number, b: string | number) => Number(new Decimal(Number(a)).mul(new Decimal(Number(b))));
	/**
	 * @description 除法
	 * @param a
	 * @param b
	 * @returns
	 */
	static div = (a: string | number, b: string | number) => Number(new Decimal(Number(a)).div(new Decimal(Number(b))));

	/**
	 * @description 保留n位小数 截断
	 * @param num 值
	 * @param n 几位小数
	 * @returns
	 */
	static formatFloat(num: number | string, n: number = 2) {
		const f_x = parseFloat(num);
		if (isNaN(f_x)) {
			return 0;
		}
		let s_x = num.toString();
		let pos_decimal = s_x.indexOf(".");
		if (pos_decimal < 0) {
			pos_decimal = s_x.length;
			if (n != 0) {
				s_x += ".";
			} else {
				return s_x;
			}
		}
		if (s_x.length <= pos_decimal + n) {
			while (s_x.length <= pos_decimal + n) {
				s_x += "0";
			}
		} else {
			s_x = s_x.substring(0, pos_decimal + n + 1);
		}
		return s_x;
	}

	/**
	 * @description 上传验证
	 * @param file
	 * @returns boolean
	 */
	static beforeAvatarUpload(file: File): boolean {
		if (file.type !== "image/jpeg" && file.type !== "image/jpg" && file.type !== "image/png") {
			ElMessage.error("上传图片只能是 jpg,jpeg,png 格式!");
			return false;
		}
		if (file.size / 1024 / 1024 > 2) {
			ElMessage.error("上传图片大小不能超过 2MB!");
			return false;
		}
		return true;
	}

	/**
	 * @description 复制
	 * @param value
	 */
	static async copy(value: string | number): Promise<void> {
		const { toClipboard } = useClipboard();
		try {
			//复制
			await toClipboard(String(value));
			showToast("复制成功");
		} catch (e) {
			console.log("复制失败");
		}
	}

	/**
	 * @description 转化年月日时间
	 * @params timeStamp 时间戳
	 * @params format 格式 默认'YYYY-MM-DD'
	 */
	static getYMD(timeStamp: number, format?: string) {
		return moment(timeStamp).format(format || "YYYY-MM-DD");
	}

	/**
	 * @description 转化年月日 时分秒时间
	 * @params timeStamp 时间戳
	 * @params format 格式 默认'YYYY-MM-DD HH:mm:ss'
	 */
	static getYMDHms(timeStamp: number, format?: string) {
		return moment(timeStamp).format(format || "YYYY-MM-DD HH:mm:ss");
	}

	/**
	 * @describe 获取当前时间
	 */
	static getDate() {
		return moment().format("YYYY-MM-DD HH:mm:ss");
	}

	/**
	 * @describe 获取当前时间戳
	 */
	static getDateNow() {
		return moment(moment().format("YYYY-MM-DD HH:mm:ss")).valueOf();
	}
	/**
	 * @describe 获取今天开始时间 (YYYY-MM-DD HH:mm:ss)
	 */
	static parseTime(time: any) {
		return dayjs(time).format("YYYY.MM.DD HH:mm:ss");
	}
	/**
	 * @describe 获取时分秒 (HH:mm:ss)
	 */
	static parseHms(time: any) {
		return moment(time).format("HH:mm:ss");
	}
	/**
	 * @describe 获取时分秒 (HH:mm:ss)
	 */
	static parseHm(time: any) {
		return dayjs(time).format("HH:mm");
	}
	/**
	 * @describe 获取今天开始时间 (YYYY-MM-DD HH:mm:ss)
	 */
	static startOneDay() {
		return moment(moment().startOf("day").format("YYYY-MM-DD HH:mm:ss")).valueOf();
	}

	/**
	 * @describe 获取今天结束时间(YYYY-MM-DD HH:mm:ss)
	 */
	static endOneDay() {
		return moment(moment().endOf("day").format("YYYY-MM-DD HH:mm:ss")).valueOf();
	}
	/**
	 * @describe 获取昨天开始时间 (YYYY-MM-DD HH:mm:ss)
	 */
	static startYesterDay() {
		return moment(moment().subtract(1, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss")).valueOf();
	}

	/**
	 * @describe 获取昨天结束时间(YYYY-MM-DD HH:mm:ss)
	 */
	static endYesterDay() {
		return moment(moment().subtract(1, "days").format("YYYY-MM-DD 23:59:59")).valueOf();
	}

	/**
	 * @describe 获取七天前开始时间(YYYY-MM-DD HH:mm:ss)
	 */
	static sevenDaysDay() {
		return moment(moment().subtract(7, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss")).valueOf();
	}

	/**
	 * @describe 获取八天前开始时间(YYYY-MM-DD HH:mm:ss)
	 */
	static eightDaysDay() {
		return moment(moment().subtract(8, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss")).valueOf();
	}

	/**
	 * @describe 获取本周开始时间(YYYY-MM-DD HH:mm:ss)
	 */
	static startWeeksDay() {
		return moment(moment().weekday(1).format("YYYY-MM-DD 00:00:00")).valueOf();
	}

	/**
	 *  @describe 获取本周结束时间(YYYY-MM-DD HH:mm:ss)
	 */
	static endWeeksDay() {
		return moment(moment().weekday(7).format("YYYY-MM-DD 23:59:59")).valueOf();
	}

	/**
	 *  @describe 获取当月开始时间(YYYY-MM-DD HH:mm:ss)
	 */
	static startMonth() {
		return moment().month(moment().month()).startOf("month").valueOf();
	}
	/**
	 *  @describe 获取当月结束时间(YYYY-MM-DD HH:mm:ss)
	 */
	static endMonth() {
		return moment().month(moment().month()).endOf("month").valueOf();
	}

	/**
	 *  @describe 获取上月开始时间(YYYY-MM-DD HH:mm:ss)
	 */
	static startLastMonth() {
		return moment().month(moment().month()).subtract(1, "months").startOf("month").valueOf();
	}

	/**
	 *  @describe 获取上月结束时间(YYYY-MM-DD HH:mm:ss)
	 */
	static endLastMonth() {
		return moment().month(moment().month()).subtract(1, "months").endOf("month").valueOf();
	}

	/**
	 *  @describe 获取近3月开始时间(YYYY-MM-DD HH:mm:ss)
	 */
	static startThreeMonths() {
		return moment(moment().subtract(3, "months").startOf("day").format("YYYY-MM-DD HH:mm:ss")).valueOf();
	}

	/**
	 * 时间转化 所罗门群岛时区
	 */
	static dayForMat5(date: number | string | null) {
		return moment(date).format("DD MMM YYYY");
	}

	/**
	 *  @describe 三位数分割逗号
	 */
	static thousands(num: number) {
		if (num || num == 0) {
			var str = String(num);
			var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
			return str.replace(reg, "$1,");
		}
		return "";
	}

	/**
	 * @describe 时间选择器不可大于今天
	 */
	static changeTime(time: number) {
		return moment().valueOf() < moment(time).valueOf(); // 开始时间不可大于今天
	}

	/**
	 * @describe 时间选择器不可小于今天
	 */
	static changeTimeNow(time: number) {
		return moment().startOf("day").valueOf() > moment(time).valueOf(); // 开始时间不可大于今天
	}

	/**
	 * @params fileUrl 文件链接点至
	 * @params fileName 文件名 (失效,未修复)
	 */
	static downloadFile(fileUrl: string, fileName: string) {
		const a = document.createElement("a");
		a.setAttribute("href", fileUrl);
		a.setAttribute("download", fileName);
		a.download = fileName;
		a.click();
	}

	/**
	 * @description 转化为时间戳 (YYYY-MM-DD HH:mm:ss,北京时区)
	 */
	static getTimeTimestamp(date: number) {
		return moment(date).valueOf();
	}

	/**
	 *
	 * @param {*} paramsName 参数字段
	 * @returns
	 * @description 获取浏览器地址栏参数
	 */
	static getQueryVariable(paramsName: string) {
		const url = window.location.href; // 获取url中"?"符后的字串
		const theRequest = {};
		if (url.indexOf("?") != -1) {
			const index = url.indexOf("?");
			const str = url.substr(index + 1);
			const strs = str.split("&");
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest[paramsName];
	}

	/**
	 * @description 下载二维码图片
	 * @param canvas
	 */
	static downloadQrcode(canvas: HTMLCanvasElement): void {
		const a: HTMLAnchorElement = document.createElement("a");
		a.download = `DONATE.jpg`;
		a.href = canvas.toDataURL("image/jpeg");
		document.body.append(a);
		a.click();
		a.remove();
	}

	/**
	 * @description 若超出指定位数，千位用K表示，默认超出10位数，最小支持5位
	 */
	static formatAmount(number: number, digits: number = 10): string {
		// 限制最小位数为 5
		const minDigits = 5;
		const thresholdDigits = Math.max(digits, minDigits);
		const threshold = Math.pow(10, thresholdDigits - 1);

		const absNumber = Math.abs(number);
		let formattedNumber: string;

		if (absNumber >= threshold) {
			const quotient = Math.floor(this.div(absNumber, 1000));
			formattedNumber = `${quotient}K`;
		} else {
			formattedNumber = this.formatFloat(Number(absNumber));
		}

		// 处理负数情况
		if (number < 0) {
			formattedNumber = "-" + formattedNumber;
		}

		return formattedNumber;
	}

	/**
	 * @description 若超出10位数，千位用K表示
	 */
	// static formatAmount(number: number) {
	// 	const absNumber = Math.abs(number);
	// 	const threshold = 10000000;
	// 	let formattedNumber = "" as number | string;
	// 	if (absNumber >= threshold) {
	// 		const quotient = Math.floor(this.div(absNumber, 1000));
	// 		formattedNumber = `${quotient}K`;
	// 	} else {
	// 		formattedNumber = this.formatFloat(Number(absNumber));
	// 	}
	// 	// 处理负数情况
	// 	if (number < 0) {
	// 		formattedNumber = "-" + formattedNumber;
	// 	}
	// 	return formattedNumber;
	// }

	// 获取 config 配置请求 api
	static getUrl() {
		switch (import.meta.env.VITE_BASEENV) {
			case "development":
				return (window as any)["PLATFROM_CONFIG"].developS128Url;
			case "production":
				return (window as any)["PLATFROM_CONFIG"].productionS128Url;
			default:
				return "";
		}
	}
	static convertMilliseconds(ms: number) {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const remainingSeconds = seconds % 60;
		const remainingMinutes = minutes % 60;

		return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
	}
	/**
	 * @description 获取根据主题语言获取图片
	 */
	static getCommonImgPath(path: string) {
		return new URL(`../assets/${i18n.global.locale.value}/common/${path}`, import.meta.url).href;
	}
	static getThemeImgPath(path: string) {
		const themesStore = useThemesStore();

		return new URL(`../assets/theme/${themesStore.themeName}/${path}`, import.meta.url).href;
	}
	static getlangImgPath(path: string) {
		const themesStore = useThemesStore();
		return new URL(`../assets/lang/${i18n.global.locale.value}/${themesStore.themeName}/${path}`, import.meta.url).href;
	}
	static getlangThemeImgPath(path: string) {
		const themesStore = useThemesStore();
		return new URL(`../assets/${i18n.global.locale.value}/${themesStore.themeName}/${path}`, import.meta.url).href;
	}

	// 加载脚本
	static loadScript(url: string): Promise<void> {
		return new Promise((resolve, reject) => {
			// 检查脚本是否已存在，防止重复加载
			const existingScript = document.querySelector(`script[src="${url}"]`);
			if (existingScript) {
				resolve();
				return;
			}

			// 创建一个新的脚本元素
			const script = document.createElement("script");
			script.src = url;
			script.async = true;

			// 当脚本加载成功时
			script.onload = () => {
				resolve();
			};

			// 当脚本加载失败时
			script.onerror = (error) => {
				reject(new Error(`Failed to load script: ${url}`));
			};

			// 将脚本添加到文档中
			document.head.appendChild(script);
		});
	}
	/**
	 * 进入游戏
	 */

	static goToGame(gameinfo: any) {
		const params = {
			venueCode: gameinfo.venueCode,
			gameCode: gameinfo.gameCode,
		};
		gameApi.loginGame(params).then((res) => {
			if (res.code === this.ResCode.SUCCESS) {
				const { source, userAccount, type } = res.data;
				const state = {
					source: "",
					userAccount: "",
					type: "",
				};
				switch (type) {
					case "url": {
						state.source = source;
						state.userAccount = userAccount;
						state.type = type;
						break;
					}
					case "html": {
						// 将HTML编码的文本字符串转换为Blob对象
						const blob: any = new Blob([source], { type: "text/html" });
						// 将Blob对象作为iframe的源
						state.source = URL.createObjectURL(blob);
						// window.open(state.source, "_blank");
						// window.open(state.source, "_self");
						state.userAccount = userAccount;
						state.type = type;
						break;
					}
					case "token": {
						const params = {
							session_id: source,
							lang: "zh-CN",
							login_id: userAccount,
						};
						const url = Common.getUrl();
						state.source = url + `/api/cash/auth?${qs.stringify(params)}`;
						state.userAccount = userAccount;
						state.type = type;
						break;
					}
					default:
						break;
				}
				router.push({ path: "/game/gamepage", query: { ...state } });
			} else {
				showToast(res.message);
			}
		});
	}

	/**
	 * @description 自定义防抖函数
	 * @param func 要防抖的函数
	 * @param delay 防抖延迟时间（毫秒）
	 * @returns 防抖后的函数
	 */
	static debounce(func: Function, delay: number) {
		let timeoutId: NodeJS.Timeout;

		return (...args: any[]) => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(() => {
				func(...args);
			}, delay);
		};
	}

	// 联系客服
	static async getSiteCustomerChannel() {
		const res = await CommonApi.getSiteCustomerChannel().catch((err) => err);
		console.log("res", res);
	}
}

export default Common;
