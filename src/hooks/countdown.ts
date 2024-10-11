import { ref, onUnmounted } from "vue";

export function useCountdown() {
	const countdown = ref(0); // 倒计时时长
	const isCountingDown = ref(false); // 倒计时状态
	let timer: number | null = null;
	let startTime = 0; // 记录倒计时开始的时间
	let endTime = 0; // 记录倒计时结束的时间

	/**
	 * @param duration 倒计时参数
	 * @annotation 倒计时启动函数
	 */
	const startCountdown = (duration = 60) => {
		countdown.value = duration;
		isCountingDown.value = true;
		startTime = Date.now();
		endTime = startTime + duration * 1000;

		const count = () => {
			const now = Date.now();
			const remainingTime = Math.max(Math.floor((endTime - now) / 1000), 0);

			countdown.value = remainingTime;

			if (remainingTime === 0) {
				stopCountdown();
				isCountingDown.value = false;
			} else {
				const nextTick = 1000 - (now % 1000); // 保证每秒执行一次
				timer = window.setTimeout(count, nextTick);
			}
		};

		count();
	};

	/**
	 * @annotation 倒计时停止函数
	 */
	const stopCountdown = () => {
		if (timer !== null) {
			clearTimeout(timer);
			timer = null;
		}
		isCountingDown.value = false;
	};

	onUnmounted(() => {
		stopCountdown();
	});

	return {
		countdown,
		isCountingDown,
		startCountdown,
		stopCountdown,
	};
}
