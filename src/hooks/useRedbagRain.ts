// hooks/useRedbagRain.ts
import { createVNode, render, ref } from "vue";
import RedbagRain from "/@/views/activity/activityType/RED_BAG_RAIN/rainPage.vue";
import Countdown from "/@/views/activity/activityType/RED_BAG_RAIN/countdownPgae.vue";

let instance: any = null; // 用于保存单例实例

export function useRedbagRain() {
	const isMounted = ref(false);
	let container: HTMLElement | null = null;

	const showRedbagRain = () => {
		if (!instance) {
			// 创建容器并挂载到 DOM
			container = document.createElement("div");
			document.body.appendChild(container);
			const vnode = createVNode(RedbagRain);
			render(vnode, container);
			isMounted.value = true;
			instance = { showRedbagRain, hideRedbagRain }; // 保存实例
		} else {
			// 如果实例已存在，可以选择重新渲染或不做任何操作
			console.warn("Redbag rain is already shown.");
		}
	};

	const hideRedbagRain = () => {
		if (container) {
			render(null, container); // 卸载组件
			document.body.removeChild(container); // 移除 DOM
			isMounted.value = false;
			instance = null; // 清除实例
			container = null; // 清空容器引用
		}
	};
	const showCountdown = () => {
		if (!instance) {
			// 创建容器并挂载到 DOM
			container = document.createElement("div");
			document.body.appendChild(container);
			const vnode = createVNode(Countdown);
			render(vnode, container);
			isMounted.value = true;
			instance = { showCountdown, hideCountdown }; // 保存实例
		} else {
			// 如果实例已存在，可以选择重新渲染或不做任何操作
			console.warn("Redbag rain is already shown.");
		}
	};

	const hideCountdown = () => {
		if (container) {
			render(null, container); // 卸载组件
			document.body.removeChild(container); // 移除 DOM
			isMounted.value = false;
			instance = null; // 清除实例
			container = null; // 清空容器引用
		}
	};
	return {
		showRedbagRain,
		showCountdown,
		hideCountdown,
		hideRedbagRain,
	};
}

// 导出单例实例
export const redbagRainSingleton = useRedbagRain();
