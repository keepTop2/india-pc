export const hoverSvg = {
	beforeMount(el: SVGSVGElement) {
		// 获取 <use> 元素
		const useElement = el.querySelector("use"); // 获取 <svg-icon> 组件

		const svgName = useElement?.getAttribute("xlink:href");

		if (!svgName || !useElement) {
			console.warn("SVG name or <use> element not found!");
			return;
		}

		// 设置默认和悬停图标
		const defaultIcon = `${svgName}`;
		const hoverIcon = `${svgName}_on`; // 悬停图标命名规则

		// 设置初始图标
		useElement.setAttribute("xlink:href", defaultIcon);

		// 鼠标进入事件
		el.addEventListener("mouseover", () => {
			useElement.setAttribute("xlink:href", hoverIcon);
		});

		// 鼠标离开事件
		el.addEventListener("mouseout", () => {
			useElement.setAttribute("xlink:href", defaultIcon);
		});
	},
	unmounted(el: SVGSVGElement) {
		// 清除事件监听
		el.removeEventListener("mouseover", () => {});
		el.removeEventListener("mouseout", () => {});
	},
};
