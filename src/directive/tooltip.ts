/**
 * @description
 */
import { Directive, h, render, watch, ref } from "vue";
import { useRoute } from "vue-router";
import { ElTooltip } from "element-plus";
import "element-plus/dist/index.css";

export const okTooltip: Directive = {
	updated(el) {
		const checkOverflow = () => {
			const parent = el.parentElement;
			if (el.getBoundingClientRect()?.width > parent?.clientWidth) {
				// 子元素宽度大于父元素时，使用 el-tooltip 包裹
				const tooltipContent = el.innerHTML;

				// 创建一个容器元素来承载 tooltip
				const tooltipWrapper = document.createElement("div");
				tooltipWrapper.classList.add(parent.classList);
				el.remove();
				parent.appendChild(tooltipWrapper);

				// 使用 Vue 渲染函数动态创建并渲染 el-tooltip 组件
				const vnode = h(
					ElTooltip,
					{ content: tooltipContent, offset: 5, showArrow: false },
					{
						default: () =>
							h("span", {
								innerHTML: el.innerHTML,
								class: el.className, // 保留 class
								style: el.getAttribute("style"), // 保留样式
							}), // 渲染 el 的内容作为 tooltip 的触发元素
					}
				);

				// 渲染 vnode 到 tooltipWrapper
				render(vnode, tooltipWrapper);
			}
		};

		checkOverflow();
	},
};
