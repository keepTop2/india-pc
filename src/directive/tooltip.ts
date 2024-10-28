import { Directive, h, render } from "vue";
import { ElTooltip } from "element-plus";
import "element-plus/dist/index.css";

export const okTooltip: Directive = {
	mounted(el) {
		// 检测溢出并应用 tooltip
		const checkOverflow = () => {
			const parent = el.parentElement;
			if (el.getBoundingClientRect().width > parent?.clientWidth) {
				const tooltipContent = el.innerHTML;

				// 创建容器来包裹 tooltip
				const tooltipWrapper = document.createElement("div");
				tooltipWrapper.classList.add(...parent.classList);
				el.remove();
				parent.appendChild(tooltipWrapper);

				// 使用渲染函数动态生成 el-tooltip
				const vnode = h(
					ElTooltip,
					{ content: tooltipContent, offset: 5, showArrow: false },
					{
						default: () =>
							h("span", {
								innerHTML: tooltipContent,
								class: el.className,
								style: el.getAttribute("style"),
							}),
					}
				);

				// 渲染 vnode 到 tooltipWrapper
				render(vnode, tooltipWrapper);
			}
		};

		// 将 checkOverflow 函数挂载到 el，以便在 updated 中访问
		el._checkOverflow = checkOverflow;

		// 初次挂载时检查溢出
		checkOverflow();

		// 监听窗口大小变化，重新检查溢出状态
		window.addEventListener("resize", checkOverflow);

		// 在卸载时移除 resize 监听
		el._removeResizeListener = () => window.removeEventListener("resize", checkOverflow);
	},

	updated(el) {
		// 数据更新后调用挂载的 checkOverflow 函数重新检查溢出状态
		el._checkOverflow();
	},

	beforeUnmount(el) {
		// 清理 resize 监听
		if (el._removeResizeListener) el._removeResizeListener();
	},
};
