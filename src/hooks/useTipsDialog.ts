// hooks/useRedbagRain.ts
import { createVNode, render, ref } from "vue";
import TipsDialog from "/@/components/TipsDialog.vue"; // 你的红包雨组件路径

interface DialogOptions {
	title?: string;
	text: string;
	cancelText?: string;
	confirmText?: string;
	onConfirm?: () => void;
	onClose?: () => void;
}
export function useTipsDialog(options: DialogOptions) {
	const container = document.createElement("div");
	document.body.appendChild(container);

	const closeDialog = () => {
		render(null, container);
		document.body.removeChild(container);
	};

	const vnode = createVNode(TipsDialog, {
		title: options.title,
		text: options.text,
		cancelText: options.cancelText,
		confirmText: options.confirmText,
		onClose: () => {
			options.onClose && options.onClose();
			closeDialog();
		},
		onConfirm: () => {
			options.onConfirm && options.onConfirm();
			closeDialog();
		},
	});

	render(vnode, container);
}
