import { reactive, ref, watch, onBeforeUnmount, toRefs, toRef } from "vue";
import { GameInfo } from "/@/views/sports/models/interface";
import Common from "/@/views/sports/utils/common";

export default (event: { gameInfo: GameInfo; eventStatus: string; globalShowTime: string }) => {
	console.log(event, "篮球倒计时定时器");

	const timer = ref<null | number>(null);

	const state = reactive({
		gameTime: "", // 转换后的分:秒
		seconds: 0, // 比赛剩余秒数
		isRunning: true,
	});

	// 将 gameInfo 各属性设置为响应式
	const gameInfo = {
		seconds: toRef(event.gameInfo, "seconds"),
		clockDirection: toRef(event.gameInfo, "clockDirection"),
		isBreak: toRef(event.gameInfo, "isBreak"),
		isHt: toRef(event.gameInfo, "isHt"),
		livePeriod: toRef(event.gameInfo, "livePeriod"),
	};

	// 通用定时器管理函数，根据计时方向（增/减）控制计时器
	const manageTimer = (direction: "inc" | "dec") => {
		if (timer.value !== null) clearInterval(timer.value); // 清除之前的计时器
		timer.value = window.setInterval(() => {
			if (direction === "dec" && state.seconds <= 0) {
				clearInterval(timer.value as number);
				state.gameTime = "";
			} else {
				state.seconds += direction === "inc" ? 1 : -1;
				state.gameTime = Common.formatSeconds(state.seconds);
			}
		}, 1000);
	};

	// 启动计时器，根据 `clockDirection` 决定计时方向
	const startTimer = () => {
		manageTimer(gameInfo.clockDirection.value === "dec" ? "dec" : "inc");
	};

	// 响应式更新比赛时间
	watch(
		gameInfo.seconds,
		(newValue, oldValue) => {
			if (gameInfo.isBreak.value || gameInfo.isHt.value || gameInfo.livePeriod.value === 0 || newValue === oldValue) return;

			state.seconds = newValue;
			state.gameTime = Common.formatSeconds(state.seconds);

			if (gameInfo.clockDirection.value === "dec" && state.seconds === 0) {
				state.gameTime = "";
				if (timer.value !== null) clearInterval(timer.value);
			} else {
				startTimer();
			}
		},
		{ immediate: true }
	);

	// 监听中场休息、比赛中断状态，停止计时器
	watch(
		[gameInfo.isBreak, gameInfo.isHt],
		([isBreak, isHt]) => {
			if (isBreak || isHt) clearInterval(timer.value as number);
		},
		{ immediate: true }
	);

	// 监听当前比赛节数，若节数为 0，清空时间显示
	watch(
		gameInfo.livePeriod,
		(livePeriod) => {
			if (livePeriod === 0) {
				clearInterval(timer.value as number);
				state.gameTime = "";
			}
		},
		{ immediate: true }
	);

	// 清除计时器，防止内存泄漏
	onBeforeUnmount(() => clearInterval(timer.value as number));

	return toRefs(state);
};
