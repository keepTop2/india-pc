// 体育静态文件
import moment, { Moment } from "moment";
// import relativeTime from "moment/plugin/relativeTime";
// import locale from "moment/locale/zh-cn"; // 引入中文语言包
import sportsMap from "./sportsMap/sportsMap";
import { i18n } from "/@/i18n/index";
import { SportsRootObject } from "/@/views/sports/models/interface";
import { convertUtcToUtc5AndFormatMD, convertUtcToUtc5AndFormat } from "/@/webWorker/module/utils/formattingChildrenViewData";
const $: any = i18n.global;

// moment.extend(relativeTime);
// moment.locale("zh-cn"); // 设置为中文环境

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
	public static betTypeMap: Record<number, string[]> = {
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
	public static formatPoint = (data: { betType: number; point: number; key: string; }): string | null => {
		const { betType, point, key } = data;
		const primaryBetTypes = [1, 7, 17, 219, 609, 637, 701, 704, 708, 153, 155, 1303, 1308, 1316, 3904, 9002, 9008, 9012, 9018, 9024, 9028, 9034, 9040, 9046, 9052, 9059, 9076, 9077, 9091, 9093, 9116];
		const secondaryBetTypes = [28, 124, 125, 453, 477, 478, 646];
		if (primaryBetTypes.includes(betType)) return this.formatPositiveNum(point);
		if (secondaryBetTypes.includes(betType) && key !== "x") return this.formatPositiveNum(point);
		if (secondaryBetTypes.includes(betType) && key === "x") return null;
		return point.toString();
	};


	/**
	 * @description 正数拼接+号
	 */
	public static formatPositiveNum = (value: number): string => {
		const isPositive = value > 0;
		return (isPositive ? "+" : "") + value;
	};


	// 动态匹配球类头部信息
	public static getEventsTitle = (event: SportsRootObject, temp = "MM-DD HH:mm"): string[] => {
		const titleMap: Record<number, any> = {
			1: {
				key: "gameInfo",
				0: {
					0: "中场休息",
					1: "延迟开赛",
					2: "点球",
				},
				1: "上半场",
				2: "下半场",
			},
			2: {
				key: "gameInfo",
				0: {
					0: "中场休息",
					1: "延迟开赛",
				},
				1: "第一节",
				2: "第二节",
				3: "第三节",
				4: "第四节",
				99: "加时赛",
			},
			3: {
				key: "gameInfo",
				0: {
					0: "中场休息",
					1: "延迟开赛",
				},
				1: "上半场",
				2: "下半场",
			},
			4: {
				key: "gameInfo",
				0: {
					0: "中场休息",
					1: "延迟开赛",
				},
				1: "第一节",
				2: "第二节",
				3: "第三节",
				4: "第四节",
				99: "加时赛",
			},
			5: {
				key: "tennisInfo",
				1: "第一盘",
				2: "第二盘",
				3: "第三盘",
				4: "第四盘",
				5: "第五盘",
			},
			6: {
				key: "volleyballInfo",
				1: "第一局",
				2: "第二局",
				3: "第三局",
				4: "第四局",
				5: "第五局",
			},
			7: {
				key: "gameInfo",
				0: {
					0: "中场休息",
					1: "延迟开赛",
				},
				1: "第一节",
				2: "第二节",
				3: "第三节",
				4: "第四节",
				99: "加时赛",
			},
			8: {
				key: "baseballInfo",
				1: "第一局",
				2: "第二局",
				3: "第三局",
				4: "第四局",
				5: "第五局",
				6: "第六局",
				7: "第七局",
				8: "第八局",
				9: "第九局",
				延长赛: "延长赛",
			},
			9: {
				key: "badmintonInfo",
				1: "第一局",
				2: "第二局",
				3: "第三局",
				4: "第四局",
				5: "第五局",
			},
			43: {
				key: "gameInfo",
				0: {
					0: "中场休息",
					1: "延迟开赛",
				},
				1: "第一局",
				2: "第二局",
				3: "第三局",
				4: "第四局",
				5: "第五局",
				6: "第六局",
				7: "第七局",
				8: "第八局",
				9: "第九局",
			},
		};
		// 获取球类标记
		const sportType = event.sportType;
		// 获取信息对象
		const infoKey = titleMap[sportType]?.key;
		let title = "";
		/**
		 *  判断滚球
		 */
		if (infoKey && event.isLive) {
			// 如果是gameInfo则归集判断 如果不是 直接赋值
			if ([1, 2, 3, 4, 7, 43].includes(sportType)) {
				const { livePeriod, delayLive, isHt } = event[infoKey];
				// 中场休息判断
				if (livePeriod == 0 && !delayLive && isHt) {
					title = titleMap[sportType][0][0];
				}
				// 延迟开赛判断
				if (livePeriod == 0 && delayLive && !isHt) {
					title = titleMap[sportType][0][1];
				}
				if (livePeriod != 0 && !delayLive && !isHt) {
					title = titleMap[sportType][livePeriod];
				}
				if (livePeriod == 0 && !delayLive && !isHt) {
					title = "";
				}
			} else if (sportType == 8) {
				const livePeriod = event[infoKey]?.currentInning;
				if (livePeriod > 9) {
					title = titleMap[sportType]["延长赛"];
				} else {
					title = titleMap[sportType][livePeriod];
				}
			} else {
				const livePeriod = event[infoKey]?.currentSet || event[infoKey]?.latestLivePeriod || event[infoKey]?.currentSet;
				console.log(livePeriod, "==titleMap[sportType][livePeriod]");
				title = titleMap[sportType][livePeriod];
			}

			// 有半场等其他数据时
			if (title) {
				return [title, this.getSportGameTime(event)].filter((i) => !!i);
			}

			const globalShowTime = this.safeAccess(event, ["globalShowTime"]);
			const timeTime = convertUtcToUtc5AndFormatMD(globalShowTime, temp);
			return timeTime.split(" ").filter((i) => !!i);
		}

		// 非滚球逻辑显示开赛时间
		const globalShowTime = this.safeAccess(event, ["globalShowTime"]);
		return globalShowTime
			? [moment(convertUtcToUtc5AndFormat(globalShowTime)).format(temp.split(" ")[0]), moment(convertUtcToUtc5AndFormat(globalShowTime)).format(temp.split(" ")[1])]
			: ["00-00", "00:00"];
	};

	/**
	 * @description 判断是否显示比分
	 * @date 比赛开始时间
	 */
	public static isShowScore = (date: string): boolean => {
		const timestampStr = moment(date).format("YYYY-MM-DD HH:mm:ss");
		const easternTimestamp = moment.utc(timestampStr).valueOf(); // 开赛时间戳（UTC+0）
		const currentEasternTimestamp = moment.utc().valueOf(); // 当前时间戳（UTC+0）
		if (easternTimestamp > currentEasternTimestamp) {
			return false;
		} else {
			return true;
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
		return moment(date).format("YYYY年MM月DD日 HH:mm:ss");
	};
	/**
	 * @description 格式化日期为时间戳
	 */
	public static formatDateToTimeStamp = (date: string): number => {
		return moment(date).valueOf();
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
		function recursiveExtract(element: { thirdId?: any; list?: any; } | null): { eventIds: number[] } {
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
		const easternTime = moment(date);
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
	public static getResultDateRangeOld = (date: moment.MomentInput) => {
		const today = moment(date).subtract(1, "days").format("YYYY-MM-DDT12:00:00");
		const tomorrow = moment(date).format("YYYY-MM-DDT12:00:00");
		return { startDate: today, endDate: tomorrow };
	};
	// 获取 utc-5的当天 日期
	public static todayDate = () => {
		return moment.utc().subtract(5, "hour").format("YYYY-MM-DD");
	};

	/**
	 * 获取 utc-5 的日期范围
	 */
	public static getQueryDateRange = (index = 1) => {
		return {
			startDate: moment()
				.subtract(index - 1, "days")
				.utcOffset(-5)
				.startOf("days"),
			endDate: moment().utcOffset(-5).endOf("days"),
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
		return moment(date ?? Date.now()).format(template[sign] ?? template["ymd"]);
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
				const startDay = moment(startDate).startOf("days");
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
				const startDay = moment(startDate).startOf("days");
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
