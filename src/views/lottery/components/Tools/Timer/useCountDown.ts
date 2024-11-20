import { computed, onBeforeUnmount, ref, watch } from "vue";

import { useCountDown as useCountDownFromVant } from "@vant/use";
import { BEGIN_PAGE_DATA_INTERVAL } from "/@/views/lottery/constant/index";
import { type LotteryDetail } from "/@/views/lottery/types/index";

interface Props {
	data: LotteryDetail;
}

export function useCountDown(props: Props, callback = Function.prototype) {
	const isAllowedToBet = ref(false);
	const countDown = useCountDownFromVant({
		time: 0,
		onFinish() {
			console.log("onFinish");
			isAllowedToBet.value = false;
			setTimeout(callback, BEGIN_PAGE_DATA_INTERVAL);
		},
	});

	const unwatch = watch(
		() => props.data.id,
		() => {
			const { seconds } = props.data;
			countDown.reset(seconds * 1000 || 0);
			countDown.start();
			isAllowedToBet.value = true;
		}
	);

	onBeforeUnmount(unwatch);

	const hours = computed(() => countDown.current.value.hours);
	const minutes = computed(() => countDown.current.value.minutes);
	const seconds = computed(() => countDown.current.value.seconds);

	return { isAllowedToBet, hours, minutes, seconds };
}
