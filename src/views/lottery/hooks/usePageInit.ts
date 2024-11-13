import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { lotteryApi } from "/@/api/lottery";
import { useUserStore } from "/@/stores/modules/user";
import { BEGIN_PAGE_DATA_INTERVAL, DEFAULT_LANG, langMaps } from "/@/views/lottery/constant/index";
import { useTimer } from "/@/views/lottery/hooks/useTimer";
import { useWebSocket, type WebSocketResponseData, type WebSocketResponseMessage } from "/@/views/lottery/hooks/useWebSocket";
import { useLoginGame } from "/@/views/lottery/stores/loginGameStore";

// 这个 hook 要注意，不能涉及单个彩种的业务。都是所有彩种通用的逻辑才能放在这里

/**
 * @description 详情投注页面，mounted 时需要处理的逻辑。主要就是 onMounted onBeforeUnmount watch 里面需要做的事情。只有两个功能函数 beginPageData callback。beginPageData 函数是拉取单个彩种详情的，例如期号。callback 是收到 ws 消息的回调函数
 * @param
 * @returns
 */
export function usePageInit() {
	const lotteryDetail = ref({}); // 单个彩种的详情，例如期号、名字、多少分钟一期

	// 这些都是 hooks
	const route = useRoute();
	const { loginGame } = useLoginGame();
	const { turnOnTimer, turnOffTimer } = useTimer(loginGame);
	const { turnOnTimer: turnOnLotteryDetailTimer, turnOffTimer: turnOffLotteryDetailTimer } = useTimer(beginPageData, BEGIN_PAGE_DATA_INTERVAL);
	const { status } = useWebSocket({ callback, fallbackFn: beginPageData });

	// 这个定时器是方便调试的，可以删除没问题的
	setInterval(() => {
		console.log("WebSocket Status", status.value);
	}, 1000);

	// 标签栏的配置数据
	onMounted(async () => {
		// 1. 登录第三方拿 token
		loginGame();

		// 2. 定时去刷新第三方返回的 token
		turnOnTimer();

		// 3. 获取 单个彩种的详情
		beginPageData();
	});

	onBeforeUnmount(() => {
		turnOffTimer();
		turnOffLotteryDetailTimer();
	});

	watch(
		() => status.value,
		(newValue) => {
			if (newValue === "OPEN") {
				return turnOffLotteryDetailTimer(); // ws 有的话就关闭轮询
			}
			turnOnLotteryDetailTimer(); // ws 没有的话就开启轮询
		}
	);

	async function beginPageData() {
		// 3.1 准备一下入参 gameCode lang 两个入参
		const { gameCode = "" } = route.query;
		const userStore = useUserStore();
		const language = userStore.getLang;
		const lang = (langMaps as any)[language] || DEFAULT_LANG;
		const submitData = { gameCode, lang };

		// 3.2 准备好了，发送请求
		const res = await lotteryApi.beginPageData(submitData);
		const resData = (res.data || []).shift() || {}; // 有时候会有两条数据，始终取下标为 0 的那一条数据

		const seconds = Math.floor((resData.endTime - resData.currentTime) / 1000);
		lotteryDetail.value = { ...resData, seconds };
	}

	function callback(message: WebSocketResponseMessage) {
		const { data } = message;
		const { gameCode: wsGameCode } = data as WebSocketResponseData;
		const { gameCode = "" } = route.query;
		if (wsGameCode !== gameCode) return;
		beginPageData();
	}

	return { lotteryDetail, beginPageData };
}
