// src/directives/hover.ts
import { DirectiveBinding } from "vue";

export const Hover = {
	mounted(el: HTMLElement, binding: DirectiveBinding) {
		const { message = "提示语", callback } = binding.value || {};
		let tooltip: HTMLElement | null = null;
		let isTooltipVisible = false;

		const createTooltip = () => {
			if (isTooltipVisible) return; // 防止重复创建

			tooltip = document.createElement("div");
			tooltip.textContent = message;

			// 设置 Tooltip 样式
			Object.assign(tooltip.style, {
				position: "fixed", // 使用 fixed 定位
				background: "rgba(0, 0, 0, 0.75)",
				color: "#fff",
				padding: "5px 10px",
				borderRadius: "4px",
				whiteSpace: "nowrap",
				fontSize: "12px",
				pointerEvents: "none",
				zIndex: "1000",
				opacity: "0",
				transition: "opacity 0.2s ease",
			});

			document.body.appendChild(tooltip);
			setTimeout(() => {
				if (tooltip) tooltip.style.opacity = "1";
			}, 0);

			isTooltipVisible = true;
		};

		const updateTooltipPosition = () => {
			if (tooltip) {
				// 获取目标元素的位置
				const elRect = el.getBoundingClientRect();

				// 设置 Tooltip 在目标元素右侧
				tooltip.style.left = `${elRect.right + 10}px`; // 距离目标元素右边 10px
				tooltip.style.top = `${elRect.top + (elRect.height - tooltip.offsetHeight) / 2}px`; // 垂直居中
			}
		};

		const removeTooltip = () => {
			if (!isTooltipVisible || !tooltip) return;

			tooltip.style.opacity = "0";
			setTimeout(() => {
				if (tooltip && document.body.contains(tooltip)) {
					document.body.removeChild(tooltip);
				}
				tooltip = null;
				isTooltipVisible = false;
			}, 200);
		};

		// 绑定鼠标事件
		const onMouseEnter = () => {
			createTooltip();
			updateTooltipPosition();
			if (callback) callback(true);
		};

		const onMouseLeave = () => {
			removeTooltip();
			if (callback) callback(false);
		};

		el.addEventListener("mouseenter", onMouseEnter);
		el.addEventListener("mouseleave", onMouseLeave);

		el._onMouseEnter = onMouseEnter;
		el._onMouseLeave = onMouseLeave;
	},

	unmounted(el: HTMLElement) {
		el.removeEventListener("mouseenter", el._onMouseEnter);
		el.removeEventListener("mouseleave", el._onMouseLeave);
	},
};
