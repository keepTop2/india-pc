import { createApp, h, App, VNode } from "vue";
import Toast from "/@/components/Toast/index.vue";

// 创建一个容器用来插入 toast 组件
const container = document.createElement("div");
document.body.appendChild(container);

// 用于管理 toast 实例
let appInstance: App | null = null;

// 创建和显示 toast 的函数
const showToast = (message: string, duration: number = 3000) => {
	// 如果已有的 toast 实例存在，卸载它
	if (appInstance) {
		appInstance.unmount();
		container.innerHTML = ""; // 清除容器中的内容
	}

	// 创建 Vue 应用实例
	const app = createApp({
		render() {
			return h(Toast, { message, duration, bottom: 20 });
		},
	});

	// 将应用挂载到容器
	appInstance = app;
	appInstance.mount(container);

	// 自动卸载 toast
	setTimeout(() => {
		if (appInstance) {
			appInstance.unmount();
			appInstance = null;
			container.innerHTML = ""; // 清除容器中的内容
		}
	}, duration);
};

// 导出函数以便在其他地方调用
export default showToast;
