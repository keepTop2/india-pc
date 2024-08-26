import { ref, onUnmounted } from 'vue';

export function useCountdown() {
	const countdown = ref(0); // 倒计时时长
	const isCountingDown = ref(false); // 倒计时状态
	let timer: NodeJS.Timeout | null = null;

	/**
	 * @param duration 倒计时参数
	 * @annotation 倒计时启动函数
	 */
	const startCountdown = (duration?: number) => {
		countdown.value = duration || 60;
		isCountingDown.value = true;

		const count = () => {
			countdown.value--;
			if (countdown.value === 0) {
				stopCountdown();
				countdown.value = 0; // 倒计时结束后将倒计时值重置为0
				isCountingDown.value = false; // 进入未在倒计时状态
			} else {
				timer = setTimeout(count, 1000);
			}
		};
		count();
	};

	/**
	 * @annotation 倒计时停止函数
	 */
	const stopCountdown = () => {
		if (timer) {
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
