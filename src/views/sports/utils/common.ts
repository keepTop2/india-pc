// 体育静态文件
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import sportsMap from "./sportsMap/sportsMap";
import { i18n } from "/@/i18n/index";
import { SportsRootObject } from "/@/views/sports/models/interface";
import { convertUtcToUtc5AndFormatMD, convertUtcToUtc5AndFormat } from "/@/webWorker/module/utils/formattingChildrenViewData";
const $: any = i18n.global;

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
	// 球类表头集中的字典
	public static betTypeMap = {
		// 足球
		1: [$.t("全场独赢"), $.t("全场让球"), $.t("全场大小"), $.t("半场独赢"), $.t("半场让球"), $.t("半场大小")],
		// 篮球
		2: [$.t("全场独赢"), $.t("让分"), $.t("总分"), $.t("球队总分")],
		// 美式足球
		3: [$.t("全场独赢"), $.t("全场让球"), $.t("全场大小")],
		// 冰上曲球
		4: [$.t("独赢"), $.t("让球"), $.t("大小"), $.t("单/双")],
		// 网球
		5: [$.t("独赢"), $.t("让盘"), $.t("让局"), $.t("总局数")],
		// 排球
		6: [$.t("独赢"), $.t("让分"), $.t("总分")],
		// 台球
		7: [$.t("独赢"), $.t("让局"), $.t("总局数")],
		// 棒球
		8: [$.t("独赢"), $.t("让球"), $.t("大小"), $.t("单/双")],
		// 羽毛球
		9: [$.t("全场独赢"), $.t("全场让局"), $.t("让分"), $.t("全场总分")],
		// 电竞
		43: [$.t("全场独赢"), $.t("全场让球"), $.t("全场大小")],
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
		// console.log("event", event);
		if (!event) return;
		if (event.sportType === 1) {
			const { gameInfo, eventStatus, globalShowTime } = this.safeAccessMultiple(event, [["gameInfo"], ["eventStatus"], ["globalShowTime"]]);
			const { livePeriod, delayLive, isHt } = gameInfo;
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
			const { livePeriod, delayLive, isHt } = gameInfo;
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
					return $.t("sports['第一节']");
				}
				if (livePeriod == 2 && !delayLive && !isHt) {
					return $.t("sports['第二节']");
				}
				if (livePeriod == 3 && !delayLive && !isHt) {
					return $.t("sports['第三节']");
				}
				if (livePeriod == 4 && !delayLive && !isHt) {
					return $.t("sports['第四节']");
				}
				if (livePeriod == 99 && !delayLive && !isHt) {
					return $.t("sports['加时赛']");
				}
			}
			return convertUtcToUtc5AndFormatMD(globalShowTime);
		} else if (event.sportType === 3) {
			const { gameInfo, eventStatus, globalShowTime } = this.safeAccessMultiple(event, [["gameInfo"], ["eventStatus"], ["globalShowTime"]]);
			const { livePeriod, delayLive, isHt } = gameInfo;
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
				if (livePeriod == 1 && !delayLive && !isHt) {
					return $.t("sports['第一节']");
				}
				if (livePeriod == 2 && !delayLive && !isHt) {
					return $.t("sports['第二节']");
				}
				if (livePeriod == 3 && !delayLive && !isHt) {
					return $.t("sports['第三节']");
				}
				if (livePeriod == 4 && !delayLive && !isHt) {
					return $.t("sports['第四节']");
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
					return "第一盘";
				}
				if (currentSet == 2) {
					return "第二盘";
				}
				if (currentSet == 3) {
					return "第三盘";
				}
				if (currentSet == 4) {
					return "第四盘";
				}
				if (currentSet == 5) {
					return "第五盘";
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
					return "第一局";
				}
				if (latestLivePeriod == 2) {
					return "第二局";
				}
				if (latestLivePeriod == 3) {
					return "第三局";
				}
				if (latestLivePeriod == 4) {
					return "第四局";
				}
				if (latestLivePeriod == 5) {
					return "第五局";
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
					return `第${common.getInstance().add(liveHomeScore, liveAwayScore) + 1}局`;
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
					return "第一局";
				}
				if (currentInning == 2) {
					return "第二局";
				}
				if (currentInning == 3) {
					return "第三局";
				}
				if (currentInning == 4) {
					return "第四局";
				}
				if (currentInning == 5) {
					return "第五局";
				}
				if (currentInning == 6) {
					return "第六局";
				}
				if (currentInning == 7) {
					return "第七局";
				}
				if (currentInning == 8) {
					return "第八局";
				}
				if (currentInning == 9) {
					return "第九局";
				}
				if (currentInning > 9) {
					return "延长赛";
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
					return "第一局";
				}
				if (currentSet == 2) {
					return "第二局";
				}
				if (currentSet == 3) {
					return "第三局";
				}
				if (currentSet == 4) {
					return "第四局";
				}
				if (currentSet == 5) {
					return "第五局";
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
		let requestStr = "";
		const sportsKeyTypeList = Object.keys(sportsMap);
		sportsKeyTypeList.forEach((key, index) => {
			if (index != sportsKeyTypeList.length - 1) {
				requestStr += key + ",";
			} else {
				requestStr += key;
			}
		});
		return requestStr;
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
	public static formatAttention = (data) => {
		/**
		 * 递归函数用于提取'thirdId'值
		 * @param {Object|Array} element - 当前处理的数据元素，可以是对象或数组
		 * @returns {string[]} 收集到的'id'值数组
		 */
		const ids: number[] = [];
		function recursiveExtract(element) {
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
	 * @description: 根据utc-5的当天日期 生成当天零点与23点59分59秒
	 * @param {*} date
	 * @param {*} dayEnd  结束时的间隔天数
	 * @return {*}
	 */
	public static getResultDateRange = (date: string, dayEnd: number = 0, format = "YYYY-MM-DDTHH:mm:ss") => {
		// 传入的日期为UTC-5时间
		const easternTime = dayjs(date);
		// 计算0点（开始时间）
		const startDate = easternTime.startOf("days").add(5, "hour").format(format);
		// 计算23:59:59（结束时间），注意endOf返回的是下一周期的开始，所以需要减去1毫秒
		const endDate = easternTime.add(dayEnd, "days").endOf("days").add(5, "hour").subtract(1, "millisecond").format(format);

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
	// 获取 utc-5的当天 日期
	public static todayDate = () => {
		return dayjs.utc().subtract(5, "hour").format("YYYY-MM-DD");
	};

	/**
	 * 获取 utc-5 的日期范围
	 */
	public static getQueryDateRange = (index = 1) => {
		return {
			startDate: dayjs()
				.subtract(index - 1, "days")
				.utcOffset(-5)
				.startOf("days"),
			endDate: dayjs().utcOffset(-5).endOf("days"),
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
}

export default SportsCommonFn;
