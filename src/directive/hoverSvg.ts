export const hoverSvg = {
	beforeMount(el: SVGSVGElement) {
		const useElement = el.querySelector("use");
		const svgName = useElement?.getAttribute("xlink:href") || useElement?.getAttribute("href");

		if (!svgName || !useElement) {
			console.warn("SVG name or <use> element not found!");
			return;
		}

		const defaultIcon = `${svgName}`;
		const hoverIcon = `${svgName}_on`;

		useElement.setAttribute("href", defaultIcon);

		// 确保指针事件正常
		el.style.pointerEvents = "auto";

		// 鼠标进入事件
		const mouseOverHandler = () => {
			useElement.setAttribute("href", hoverIcon);
		};

		// 鼠标离开事件
		const mouseOutHandler = () => {
			useElement.setAttribute("href", defaultIcon);
		};

		// 点击事件
		const clickHandler = (event: MouseEvent) => {
			console.log("SVG clicked!");
			event.stopPropagation(); // 可选：如果你想防止事件冒泡
		};

		// 绑定事件
		el.addEventListener("mouseover", mouseOverHandler);
		el.addEventListener("mouseout", mouseOutHandler);
		el.addEventListener("click", clickHandler);

		// 存储事件处理程序
		el._mouseOverHandler = mouseOverHandler;
		el._mouseOutHandler = mouseOutHandler;
		el._clickHandler = clickHandler;
	},
	unmounted(el: SVGSVGElement) {
		// 清理事件监听器
		el.removeEventListener("mouseover", el._mouseOverHandler);
		el.removeEventListener("mouseout", el._mouseOutHandler);
		el.removeEventListener("click", el._clickHandler);
	},
};
