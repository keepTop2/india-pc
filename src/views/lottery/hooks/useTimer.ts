import { ref } from "vue";

/**
 * @description 这个钩子是在单个彩种页面，例如 /lottery/kuaisan 页面，定时去刷新第三方返回的 token 的定时器。其他地方也可以使用，提供定时器的一个钩子函数
 * @param callback 定时调用的回调函数
 * @returns interval 定时器的时间，默认一小时，支持传入
 */
const INTERVAL = 1000 * 60 * 60; // 一小时拉一遍
export function useTimer(callback = Function.prototype, interval = INTERVAL) {
	const timer = ref();
	const turnOnTimer = () => {
		turnOffTimer();
		timer.value = setInterval(callback, interval);
	};
	const turnOffTimer = () => timer.value && clearInterval(timer.value);
	return { timer, turnOnTimer, turnOffTimer };
}
