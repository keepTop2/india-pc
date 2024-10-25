import { reactive, ref, watch, toRefs, onBeforeUnmount, toRef } from "vue";
import { GameInfo } from "/@/views/sports/models/interface";
import dayjs from "dayjs";
import { i18n } from "/@/i18n/index";
import Common from "/@/views/sports/utils/common";
import { convertUtcToUtc5AndFormatMD, convertUtcToUtc5AndFormat } from "/@/webWorker/module/utils/formattingChildrenViewData";
const $: any = i18n.global;

// 将秒转换成分:秒
export const formatSeconds = (seconds: number): string => {
	const timeDuration = dayjs.duration(seconds, "seconds");
	const minutes = String(timeDuration.minutes()).padStart(2, "0"); // 获取分钟并补零
	const secs = String(timeDuration.seconds()).padStart(2, "0"); // 获取秒并补零
	return `${minutes}:${secs}`;
};

/**
 * eventStatus 赛事状况字典
 */
const eventStatusMap = new Map<string, string>([
	["closed", $.t("sports['比赛已关闭']")],
	["closed", $.t("sports['比赛已关闭']")],
]);

/**
 * livePeriod 比赛节数字典
 */
const livePeriodMap = new Map([
	[1, "一"],
	[2, "二"],
	[3, "三"],
	[4, "四"],
	[5, "五"],
	[6, "六"],
	[7, "七"],
	[8, "八"],
	[9, "九"],
]);

export default (event: { gameInfo: GameInfo; eventStatus: string; globalShowTime: string }) => {
	/**
	 * gameInfo 赛事数据
	 * eventStatus 赛事状态 running/ closed/ postponed/ deleted
	 * globalShowTime 开赛时间 (时区GMT+0)
	 */
	// 倒计时定时器
	const timer = ref<null | number>(null);
	const state = reactive({
		gameTime: "", //转换后的分:秒
		seconds: 0, //比赛剩余秒数
		gameDesc: "", //赛事描述
	});

	// 设置倒计时逻辑
	const startTimer = () => {
		if (timer.value !== null) clearInterval(timer.value); // 清除之前的定时器

		timer.value = window.setInterval(() => {
			if (state.seconds <= 0) {
				clearInterval(timer.value as number);
				state.gameTime = "";
			} else {
				state.seconds -= 1;
				state.gameTime = formatSeconds(state.seconds);
			}
		}, 1000);
	};

	/**
	 * seconds 当前赛事时间以秒为单位
	 * 支持的sportType类型如下
	 * 1: 足球 2: 篮球 3: 美式足球 4: 冰上曲棍球 9: 羽毛球 24: 手球 26: 橄榄球 43: 电子竞技
	 */
	watch(
		() => event.gameInfo.seconds,
		(newValue, oldValue) => {
			// 当新旧值不一样时，开始倒计数
			if (newValue !== oldValue) {
				state.seconds = newValue;
				if (state.seconds === 0) {
					state.gameTime = "";
					if (timer.value !== null) clearInterval(timer.value);
					return;
				}
				// 将秒转换成分:秒
				state.gameTime = formatSeconds(newValue);
				// 开启倒计时
				startTimer();
			}
		},
		{ immediate: true }
	);

	/**
	 * isBreak 赛事是否中断(休息时间)
	 * isHt 是否为中场休息
	 */
	watch([event.gameInfo.isBreak, event.gameInfo.isHt], ([isBreak], [isHt]) => {
		if (isBreak || isHt) clearInterval(timer.value as number);
	});

	/**
	 * livePeriod 目前进行到第几节 如果值为 0，则前端不显示时间
	 */
	watch(
		() => event.gameInfo.livePeriod,
		(livePeriod) => {
			if (livePeriod === 0) {
				clearInterval(timer.value as number);
				state.gameTime = "";
			}
		}
	);

	// 检查赛事状态
	const validEventStatus = (): boolean | undefined => {
		const result = eventStatusMap.get(event.eventStatus);
		if (result) {
			state.gameDesc = result;
			return true;
		}
	};

	// const basketball = () => {
	// 	//检查赛事状态
	// 	if (validEventStatus()) return;
	// 	// 判断开赛时间 是否大于 当前时间
	// 	if (!Common.isStartMatch(event.globalShowTime)) {
	// 		// 显示开始日期+时间
	// 		state.gameDesc = convertUtcToUtc5AndFormatMD(event.globalShowTime);
	// 		return;
	//   }

	//   const { livePeriod, delayLive, isHt } = event.gameInfo;
	//   if (livePeriod == 0 || livePeriod == 99) {
	//     if (!delayLive && isHt) {
	//       state.gameDesc = $.t("sports['中场休息']");
	//     }
	//     if (delayLive && !isHt) {
	//       state.gameDesc = $.t("sports['中场休息']");
	//     }
	//     if (!delayLive && !isHt) {
	//       state.gameDesc = $.t("sports['加时赛']")
	//     }
	//     return;
	//   }

	//   if (!delayLive && !isHt && livePeriodMap.has(livePeriod)) {
	//     state.gameDesc = $.t(`sports['第${livePeriodMap.get(livePeriod)}节']`);
	//   }
	// };

	onBeforeUnmount(() => clearInterval(timer.value as number));

	return toRefs(state);
};
