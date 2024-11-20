// 体育静态文件
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import sportsMap from "./sportsMap/sportsMap";
import { i18n } from "/@/i18n/index";
import { SportsRootObject } from "/@/views/sports/models/interface";
import { convertUtcToUtc5AndFormatMD, convertUtcToUtc5AndFormat } from "/@/webWorker/module/utils/formattingChildrenViewData";
import common from "/@/utils/common";
import { RouteLocationNormalized } from "vue-router";
const $: any = i18n.global;
dayjs.extend(duration); // 启用 duration 插件
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale("zh-cn"); // 设置为中文环境
interface DateData {
	date: string;
	label: string;
	week: string;
}

/**
 * @description 体育公用方法类 -- 根据体育球类字典筛选sportType
 */
class SportsCommonFn {
	// 串关标题
	public static comboTypeNameMaps = {
		Doubles: "2串1",
		Trebles: "3串1",
		Trixie: "3串4",
		Lucky7: "幸运7",
		Fold4: "4串1",
		Yankee: "4串11",
		Lucky15: "幸运15",
		Fold5: "5串1",
		Canadian: "5串26",
		Lucky31: "幸运31",
		Fold6: "6串1",
		Heinz: "6串57",
		Lucky63: "幸运63",
		Fold7: "7串1",
		SuperHeinz: "7串120",
		Lucky127: "幸运127",
		Fold8: "8串1",
		Goliath: "8串247",
		Lucky255: "幸运255",
		Fold9: "9串1",
		Fold10: "10串1",
		Fold11: "11串1",
		Fold12: "12串1",
		Fold13: "13串1",
		Fold14: "14串1",
		Fold15: "15串1",
		Fold16: "16串1",
		Fold17: "17串1",
		Fold18: "18串1",
		Fold19: "19串1",
		Fold20: "20串1",
	};

	// 球类表头集中的字典
	public static betTypeMap: Record<number, string[]> = {
		// 足球
		1: [$.t(`sports["全场独赢"]`), $.t(`sports["全场让球"]`), $.t(`sports["全场大小"]`), $.t(`sports["半场独赢"]`), $.t(`sports["半场让球"]`), $.t(`sports["半场大小"]`)],
		// 篮球
		2: [$.t(`sports["全场独赢"]`), $.t(`sports["让分"]`), $.t(`sports["总分"]`), $.t(`sports["球队总分"]`)],
		// 美式足球
		3: [$.t(`sports["全场独赢"]`), $.t(`sports["全场让球"]`), $.t(`sports["全场大小"]`)],
		// 冰上曲球
		4: [$.t(`sports["独赢"]`), $.t(`sports["让球"]`), $.t(`sports["大小"]`), $.t(`sports["单/双"]`)],
		// 网球
		5: [$.t(`sports["独赢"]`), $.t(`sports["让盘"]`), $.t(`sports["让局"]`), $.t(`sports["总局数"]`)],
		// 排球
		6: [$.t(`sports["独赢"]`), $.t(`sports["让分"]`), $.t(`sports["总分"]`)],
		// 台球
		7: [$.t(`sports["独赢"]`), $.t(`sports["让局"]`), $.t(`sports["总局数"]`)],
		// 棒球
		8: [$.t(`sports["独赢"]`), $.t(`sports["让球"]`), $.t(`sports["大小"]`), $.t(`sports["单/双"]`)],
		// 羽毛球
		9: [$.t(`sports["全场独赢"]`), $.t(`sports["全场让局"]`), $.t(`sports["让分"]`), $.t(`sports["全场总分"]`)],
		// 电竞
		43: [$.t(`sports["全场独赢"]`), $.t(`sports["全场让球"]`), $.t(`sports["全场大小"]`)],
	};

	public static getEventsTitleMap: Record<number, string> = {
		1: "gameInfo",
		2: "gameInfo",
		3: "gameInfo",
		4: "gameInfo",
		5: "tennisInfo",
		6: "volleyballInfo",
		7: "gameInfo",
		8: "baseballInfo",
		9: "badmintonInfo",
		43: "",
	};

	/**
	 * @description: 逐级查找需要的属性对象- 使用safeAccess函数来安全地访问深层属性 防止多级访问出现undefined报错 ()
	 * @param {*} obj 原始对象
	 * @param {*} key ["key"]
	 * @return {*}
	 */
	public static safeAccess = (obj: any, key: string[]): any => {
		const nObj = key.reduce((xs, x) => {
			if (xs && xs[x]) {
				return xs[x];
			} else {
				return null;
			}
		}, obj);
		return nObj;
	};

	/**
	 * 计算比赛中的时间
	 * @param sportInfo
	 * @returns
	 */
	public static getSportGameTime = (sportInfo: SportsRootObject): string => {
		const { gameInfo } = sportInfo ?? {};
		if (gameInfo && gameInfo.seconds) {
			const minutes = Math.floor(gameInfo.seconds / 60);
			const seconds = gameInfo.seconds % 60;
			return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
		} else {
			return "";
		}
	};

	/**
	 * @description 格式化让球Point
	 */
	public static formatPoint = (data: { betType: number; point: number; key: string }): string | null => {
		const { betType, point, key } = data;
		const primaryBetTypes = [
			1, 7, 17, 219, 609, 637, 701, 704, 708, 153, 155, 1303, 1308, 1316, 3904, 9002, 9008, 9012, 9018, 9024, 9028, 9034, 9040, 9046, 9052, 9059, 9076, 9077, 9091, 9093, 9116,
		];
		const secondaryBetTypes = [28, 124, 125, 453, 477, 478, 646];
		if (primaryBetTypes.includes(betType)) return this.formatPositiveNum(point);
		if (secondaryBetTypes.includes(betType) && key !== "x") return this.formatPositiveNum(point);
		if (secondaryBetTypes.includes(betType) && key === "x") return null;
		if (point) {
			return point.toString();
		}
	};

	/**
	 * @description 正数拼接+号
	 */
	public static formatPositiveNum = (value: number): string => {
		const isPositive = value > 0;
		return (isPositive ? "+" : "") + value;
	};

	/**
	 * @description 判断是否显示比分
	 * @date 比赛开始时间
	 */
	public static isStartMatch = (date): boolean => {
		const timestampStr = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
		const easternTimestamp = dayjs.utc(timestampStr).valueOf(); // 开赛时间戳（UTC+0）
		const currentEasternTimestamp = dayjs.utc().valueOf(); // 当前时间戳（UTC+0）
		if (easternTimestamp > currentEasternTimestamp) {
			return false;
		} else {
			return true;
		}
	};

	public static timeFormate = (globalShowTime) => {
		if (globalShowTime) {
			const date = dayjs(convertUtcToUtc5AndFormat(globalShowTime)).format("MM-DD");
			const time = dayjs(convertUtcToUtc5AndFormat(globalShowTime)).format("HH:mm");
			return {
				date,
				time,
			};
		} else {
			return {
				date: "00-00",
				time: "00:00",
			};
		}
	};

	// 使用safeAccess函数来安全地访问深层属性 防止多级访问出现undefined报错
	public static safeAccessMultiple = (obj, keysArray) => {
		return keysArray.reduce((result, keys) => {
			const value = keys.reduce((xs, x) => (xs && xs[x] != null ? xs[x] : null), obj);
			const lastKey = keys[keys.length - 1];
			result[lastKey] = value;
			return result;
		}, {});
	};

	// 动态匹配球类头部信息
	public static getEventsTitle = (event: any) => {
		const numMap = new Map([
			[1, "一"],
			[2, "二"],
			[3, "三"],
			[4, "四"],
		]);
		// 计算比赛剩余多少秒
		const computerSeconds = (seconds: number): string => {
			const timeDuration = dayjs.duration(seconds, "seconds");
			const minutes = String(timeDuration.minutes()).padStart(2, "0"); // 获取分钟并补零
			const secs = String(timeDuration.seconds()).padStart(2, "0"); // 获取秒并补零
			return `${minutes}:${secs}`;
		};
		// console.log("event", event);
		if (!event) return;
		if (event.sportType === 1) {
			const { gameInfo, eventStatus, globalShowTime } = this.safeAccessMultiple(event, [["gameInfo"], ["eventStatus"], ["globalShowTime"]]);
			const { livePeriod, delayLive, isHt, seconds } = gameInfo;

			if (eventStatus == "closed") {
				return $.t("sports['比赛已关闭']");
			}
			if (eventStatus == "postponed") {
				return $.t("sports['比赛已推迟']");
			}
			if (this.isStartMatch(globalShowTime)) {
				if (livePeriod == 0 && !delayLive && isHt) {
					return $.t("sports['中场休息']");
				}
				if (livePeriod == 0 && delayLive && !isHt) {
					return $.t("sports['延迟开赛']");
				}
				if (livePeriod == 1 && !delayLive && !isHt) {
					return $.t("sports['上半场']");
				}
				if (livePeriod == 2 && !delayLive && !isHt) {
					return $.t("sports['下半场']");
				}
			}
			return convertUtcToUtc5AndFormatMD(globalShowTime);
		} else if (event.sportType === 2) {
			const { gameInfo, eventStatus, globalShowTime } = this.safeAccessMultiple(event, [["gameInfo"], ["eventStatus"], ["globalShowTime"]]);
			const { livePeriod, delayLive, isHt, seconds } = gameInfo;
			if (eventStatus == "closed") {
				return $.t("sports['比赛已关闭']");
			}
			if (eventStatus == "postponed") {
				return $.t("sports['比赛已推迟']");
			}

			if (this.isStartMatch(globalShowTime)) {
				if (livePeriod == 0 && !delayLive && isHt) {
					return $.t("sports['中场休息']");
				}
				if (livePeriod == 0 && delayLive && !isHt) {
					return $.t("sports['延迟开赛']");
				}
				if (livePeriod == 99 && !delayLive && !isHt) {
					return $.t("sports['加时赛']");
				}
				if (!delayLive && !isHt && numMap.get(livePeriod)) {
					// 第几节
					return $.t(`sports.whichSection]`, { livePeriod: numMap.get(livePeriod) });
				}
			}
			return convertUtcToUtc5AndFormatMD(globalShowTime);
		} else if (event.sportType === 3) {
			const { gameInfo, eventStatus, globalShowTime } = this.safeAccessMultiple(event, [["gameInfo"], ["eventStatus"], ["globalShowTime"]]);
			const { livePeriod, delayLive, isHt, seconds } = gameInfo;
			if (eventStatus == "closed") {
				return $.t("sports['比赛已关闭']");
			}
			if (eventStatus == "postponed") {
				return $.t("sports['比赛已推迟']");
			}
			if (this.isStartMatch(globalShowTime)) {
				if (livePeriod == 0 && !delayLive && isHt) {
					return $.t("sports['中场休息']");
				}
				if (!delayLive && !isHt && numMap.get(livePeriod)) {
					return $.t(`sports.whichSection]`, { livePeriod: numMap.get(livePeriod) });
				}
			}
			return convertUtcToUtc5AndFormatMD(globalShowTime);
		} else if (event.sportType === 4) {
			const { gameInfo, eventStatus, globalShowTime } = this.safeAccessMultiple(event, [["gameInfo"], ["eventStatus"], ["globalShowTime"]]);
			const { livePeriod, delayLive, isHt } = gameInfo;
			if (eventStatus == "closed") {
				return $.t("sports['比赛已关闭']");
			}
			if (eventStatus == "postponed") {
				return $.t("sports['比赛已推迟']");
			}
			if (this.isStartMatch(globalShowTime)) {
				if (livePeriod == 0 && delayLive && !isHt) {
					return $.t("sports['延迟开赛']");
				}
				if (livePeriod == 1 && !delayLive && !isHt) {
					return $.t("sports['第一节']");
				}
				if (livePeriod == 2 && !delayLive && !isHt) {
					return $.t("sports['第二节']");
				}
				if (livePeriod == 3 && !delayLive && !isHt) {
					return $.t("sports['第三节']");
				}
			}
			return convertUtcToUtc5AndFormatMD(globalShowTime);
		} else if (event.sportType === 5) {
			const { tennisInfo, eventStatus, globalShowTime } = this.safeAccessMultiple(event, [["tennisInfo"], ["eventStatus"], ["globalShowTime"]]);
			const { currentSet } = tennisInfo;
			if (eventStatus == "closed") {
				return $.t("sports['比赛已关闭']");
			}
			if (eventStatus == "postponed") {
				return $.t("sports['比赛已推迟']");
			}
			if (this.isStartMatch(globalShowTime)) {
				if (currentSet == 1) {
					return $.t("sports['第一盘']");
				}
				if (currentSet == 2) {
					return $.t("sports['第二盘']");
				}
				if (currentSet == 3) {
					return $.t("sports['第三盘']");
				}
				if (currentSet == 4) {
					return $.t("sports['第四盘']");
				}
				if (currentSet == 5) {
					return $.t("sports['第五盘']");
				}
			}
			return convertUtcToUtc5AndFormatMD(globalShowTime);
		} else if (event.sportType === 6) {
			const { volleyballInfo, eventStatus, globalShowTime } = this.safeAccessMultiple(event, [["volleyballInfo"], ["eventStatus"], ["globalShowTime"]]);
			if (!volleyballInfo) {
				return convertUtcToUtc5AndFormatMD(globalShowTime);
			}
			const { latestLivePeriod } = volleyballInfo;
			if (eventStatus == "closed") {
				return $.t("sports['比赛已关闭']");
			}
			if (eventStatus == "postponed") {
				return $.t("sports['比赛已推迟']");
			}
			if (this.isStartMatch(globalShowTime)) {
				if (latestLivePeriod == 1) {
					return $.t("sports['第一局']");
				}
				if (latestLivePeriod == 2) {
					return $.t("sports['第二局']");
				}
				if (latestLivePeriod == 3) {
					return $.t("sports['第三局']");
				}
				if (latestLivePeriod == 4) {
					return $.t("sports['第四局']");
				}
				if (latestLivePeriod == 5) {
					return $.t("sports['第五局']");
				}
			}
			return convertUtcToUtc5AndFormatMD(globalShowTime);
		} else if (event.sportType === 7) {
			const { gameInfo, eventStatus, globalShowTime, parentId } = this.safeAccessMultiple(event, [["gameInfo"], ["eventStatus"], ["globalShowTime"], ["parentId"]]);
			const { liveHomeScore, liveAwayScore } = gameInfo;
			if (eventStatus == "closed") {
				return $.t("sports['比赛已关闭']");
			}
			if (eventStatus == "postponed") {
				return $.t("sports['比赛已推迟']");
			}
			if (this.isStartMatch(globalShowTime)) {
				if (parentId > 0) {
					return convertUtcToUtc5AndFormatMD(globalShowTime);
				} else {
					return `第${common.add(liveHomeScore, liveAwayScore) + 1}局`;
				}
			}
			return convertUtcToUtc5AndFormatMD(globalShowTime);
		} else if (event.sportType === 8) {
			const { baseballInfo, eventStatus, globalShowTime } = this.safeAccessMultiple(event, [["baseballInfo"], ["eventStatus"], ["globalShowTime"]]);
			if (!baseballInfo) {
				return convertUtcToUtc5AndFormatMD(globalShowTime);
			}
			const { currentInning } = baseballInfo;
			if (eventStatus == "closed") {
				return $.t("sports['比赛已关闭']");
			}
			if (eventStatus == "postponed") {
				return $.t("sports['比赛已推迟']");
			}
			if (this.isStartMatch(globalShowTime)) {
				if (currentInning == 1) {
					return $.t("sports['第一局']");
				}
				if (currentInning == 2) {
					return $.t("sports['第二局']");
				}
				if (currentInning == 3) {
					return $.t("sports['第三局']");
				}
				if (currentInning == 4) {
					return $.t("sports['第四局']");
				}
				if (currentInning == 5) {
					return $.t("sports['第五局']");
				}
				if (currentInning == 6) {
					return $.t("sports['第六局']");
				}
				if (currentInning == 7) {
					return $.t("sports['第七局']");
				}
				if (currentInning == 8) {
					return $.t("sports['第八局']");
				}
				if (currentInning == 9) {
					return $.t("sports['第九局']");
				}
				if (currentInning > 9) {
					return $.t("sports['延长赛']");
				}
			}
			return convertUtcToUtc5AndFormatMD(globalShowTime);
		} else if (event.sportType === 9) {
			const { badmintonInfo, eventStatus, globalShowTime } = this.safeAccessMultiple(event, [["badmintonInfo"], ["eventStatus"], ["globalShowTime"]]);
			if (!badmintonInfo) {
				return convertUtcToUtc5AndFormatMD(globalShowTime);
			}
			const { currentSet } = badmintonInfo;
			if (eventStatus == "closed") {
				return $.t("sports['比赛已关闭']");
			}
			if (eventStatus == "postponed") {
				return $.t("sports['比赛已推迟']");
			}
			if (this.isStartMatch(globalShowTime)) {
				if (currentSet == 1) {
					return $.t("sports['第一局']");
				}
				if (currentSet == 2) {
					return $.t("sports['第二局']");
				}
				if (currentSet == 3) {
					return $.t("sports['第三局']");
				}
				if (currentSet == 4) {
					return $.t("sports['第四局']");
				}
				if (currentSet == 5) {
					return $.t("sports['第五局']");
				}
			}
			return convertUtcToUtc5AndFormatMD(globalShowTime);
		} else if (event.sportType === 43) {
			const { gameInfo, eventStatus, globalShowTime, isLive } = this.safeAccessMultiple(event, [["gameInfo"], ["eventStatus"], ["globalShowTime"], ["isLive"]]);
			const { livePeriod } = gameInfo;
			if (eventStatus == "closed") {
				return $.t("sports['比赛已关闭']");
			}
			if (eventStatus == "postponed") {
				return $.t("sports['比赛已推迟']");
			}
			if (isLive) {
				if (livePeriod == 1) {
					return $.t("sports['第一局']");
				}
				if (livePeriod == 2) {
					return $.t("sports['第二局']");
				}
				if (livePeriod == 3) {
					return $.t("sports['第三局']");
				}
				if (livePeriod == 4) {
					return $.t("sports['第四局']");
				}
				if (livePeriod == 5) {
					return $.t("sports['第五局']");
				}
				if (livePeriod == 6) {
					return $.t("sports['第六局']");
				}
				if (livePeriod == 7) {
					return $.t("sports['第七局']");
				}
				if (livePeriod == 8) {
					return $.t("sports['第八局']");
				}
				if (livePeriod == 9) {
					return $.t("sports['第九局']");
				}
			}
			return convertUtcToUtc5AndFormatMD(globalShowTime);
		}
	};

	/**
	 * @description 获取体育类型请求参数
	 * @returns 体育类型请求参数
	 */
	public static getRequestSportsType = (): string => {
		return Object.keys(sportsMap).join(",");
	};

	/**
	 * @description 格式化日期格式
	 * @returns 2024年5月25日 09:05:05
	 */
	public static formatDate = (date: string): string => {
		return dayjs(date).format("YYYY年MM月DD日 HH:mm:ss");
	};
	/**
	 * @description 格式化日期为时间戳
	 */
	public static formatDateToTimeStamp = (date: string): number => {
		return dayjs(date).valueOf();
	};

	/**
	 * @description 格式关注数据 提取对应的 events列表与 eventsid
	 */
	public static formatAttention = (data: any) => {
		/**
		 * 递归函数用于提取'thirdId'值
		 * @param {Object|Array} element - 当前处理的数据元素，可以是对象或数组
		 * @returns {string[]} 收集到的'id'值数组
		 */
		const ids: number[] = [];
		function recursiveExtract(element: { thirdId?: any; list?: any } | null): { eventIds: number[] } {
			if (Array.isArray(element)) {
				// 如果当前元素是数组，则遍历每个子元素
				for (const item of element) {
					recursiveExtract(item);
				}
			} else if (typeof element === "object" && element !== null) {
				// 如果当前元素是对象，则检查'id'键并递归处理'list'键
				if ("thirdId" in element) {
					ids.push(Number(element.thirdId));
				}
				if ("list" in element) {
					recursiveExtract(element.list);
				}
			}
			return {
				eventIds: ids,
			};
		}

		return recursiveExtract(data);
	};

	/**
	 * @description: 根据utc-0的当天日期 生成当天零点与23点59分59秒
	 * @param {*} date
	 * @param {*} dayEnd  结束时的间隔天数
	 * @return {*}
	 */
	public static getResultDateRange = (date: string, dayEnd: number = 0, format = "YYYY-MM-DDTHH:mm:ss") => {
		// 确保解析时按照 YYYY-MM-DD 格式
		const easternTime = dayjs(date, "YYYY-MM-DD").utcOffset(this.getUtc());

		// 计算0点（开始时间）
		const startDate = easternTime.startOf("day").toISOString();

		// 计算结束时间：23:59:59，当天的结束
		const endDate = easternTime.add(dayEnd, "days").endOf("day").toISOString();

		return { startDate, endDate };
	};

	/**
	 * @description: 提供一个数据区间 startDate 今天12点 endDate 明天12点
	 * @param {*} date
	 * @return {*}
	 */
	public static getResultDateRangeOld = (date) => {
		const today = dayjs(date).subtract(1, "days").format("YYYY-MM-DDT12:00:00");
		const tomorrow = dayjs(date).format("YYYY-MM-DDT12:00:00");
		return { startDate: today, endDate: tomorrow };
	};
	// 获取 utc0 的当天 日期
	public static todayDate = () => {
		return dayjs.utc().format("YYYY-MM-DD");
	};

	/**
	 * 获取 utc-5 的日期范围
	 */
	public static getQueryDateRange = (index = 1) => {
		return {
			startDate: dayjs()
				.subtract(index - 1, "days")
				.utcOffset(this.getUtc())
				.startOf("days"),
			endDate: dayjs().utcOffset(this.getUtc()).endOf("days"),
		};
	};

	/**
	 * 通过模版格式化日期
	 */
	public static formatDateBySign = (date?: string | Moment, sign = "ymd") => {
		const template = {
			ymdhms: "YYYY-MM-DDTHH:mm:ss",
			ymd: "YYYY-MM-DD",
		};
		return dayjs(date ?? Date.now()).format(template[sign] ?? template["ymd"]);
	};

	/**
	 * @description 生成指定日期区间内的日期数组
	 * @param {string} startDate - 起始日期
	 * @param {number} numDays - 需要生成的日期数量
	 * @param {boolean} direction - true 生成起始日期之后的日期，false 生成起始日期之前的日期，默认 false
	 * @returns {DateData[]} - 日期数组
	 */
	public static generateDateArray(startDate: string, numDays: number, direction = false): DateData[] {
		const dates: DateData[] = [];

		if (direction) {
			for (let i = 0; i < numDays; i++) {
				const startDay = dayjs(startDate).startOf("days");
				const navDay = startDay.add(i, "days");
				const dateObj = {
					date: navDay.format("YYYY-MM-DD"),
					label: navDay.format("MM月DD日"),
					week: navDay.format("dddd"),
				};
				dates.push(dateObj);
			}
		} else {
			for (let i = 0; i < numDays; i++) {
				const startDay = dayjs(startDate).startOf("days");
				const navDay = startDay.add(i, "days");
				const dateObj = {
					date: navDay.format("YYYY-MM-DD"),
					label: navDay.format("MM月DD日"),
					week: navDay.format("dddd"),
				};
				dates.push(dateObj);
			}
		}

		return dates;
	}

	/**
	 * @description 获取沙巴体育apiUrl
	 */
	public static getSportPushApiUrl(): string {
		switch (import.meta.env.VITE_BASEENV) {
			case "development":
				return window["PLATFROM_CONFIG"].developSportUrl;
			case "production":
				return window["PLATFROM_CONFIG"].productionSportUrl;
			default:
				return "";
		}
	}

	/**
	 * @description 获取体育语言
	 */
	public static getSportLanguage(): string {
		return "zhcn";
	}

	/**
	 * @description 节流
	 */
	public static throttle<T extends (...args: any[]) => void, U>(func: T, delay: number): (this: U, ...args: Parameters<T>) => void {
		let lastTime = 0;
		let timer: ReturnType<typeof setTimeout> | null = null;

		return function (this: U, ...args: Parameters<T>) {
			const context = this;
			const now = Date.now();

			if (now - lastTime >= delay) {
				if (timer) clearTimeout(timer); // 清除之前的定时器
				lastTime = now;
				func.apply(context, args); // 立即执行
			} else {
				if (!timer) {
					// 在首次点击后的延迟时间内执行
					timer = setTimeout(() => {
						lastTime = Date.now();
						func.apply(context, args); // 延迟结束后执行
						timer = null; // 重置定时器
					}, delay - (now - lastTime));
				}
			}
		};
	}

	public static debounce<T extends (...args: any[]) => any>(func: T, delay: number, immediate: boolean = false): (...args: Parameters<T>) => void {
		let timeoutId: ReturnType<typeof setTimeout> | null;

		return function (...args: Parameters<T>): void {
			const later = () => {
				timeoutId = null;
				if (!immediate) {
					func(...args);
				}
			};

			const callNow = immediate && !timeoutId;

			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(later, delay);

			if (callNow) {
				func(...args);
			}
		};
	}

	/**
	 * .mainArea节点
	 * 体育模块点击导航栏时，记录当前页面scrollTop到route.mate.scrollTop中，优化用户体验
	 */
	public static saveScrollTop(route: RouteLocationNormalized) {
		const scrollDom = document.querySelector(".mainArea") as HTMLElement;
		route.meta.scrollTop = scrollDom.scrollTop;
	}

	/**
	 * @description 将秒转换成分:秒
	 * @param seconds 秒数
	 * @returns 转换后的格式00:00
	 */
	public static formatSeconds(seconds: number): string {
		if (typeof seconds !== "number" || seconds <= 0) return "";

		const timeDuration = dayjs.duration(seconds, "seconds");
		const minutes = String(timeDuration.minutes()).padStart(2, "0"); // 获取分钟并补零
		const secs = String(timeDuration.seconds()).padStart(2, "0"); // 获取秒并补零
		return `${minutes}:${secs}`;
	}

	/**
	 * @description 获取站点utc
	 */
	public static getUtc() {
		const { timezone = "" } = JSON.parse(localStorage.getItem("userInfo") as string) || {};
		return timezone.replace("UTC", "");
	}
}

export default SportsCommonFn;
