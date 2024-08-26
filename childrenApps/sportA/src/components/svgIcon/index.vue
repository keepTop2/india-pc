<template>
	<CunstomRender />
</template>

<script lang="ts" setup>
import { watch, ref, computed, h, compile } from "vue";
import { omit } from "lodash-es";

type Props = {
	iconName: string;
	size?: number | string;
	height?: number | string;
	iconClass?: string;
	currentColor?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
	size: 24,
	currentColor: false, // 默认不替换为currentColor
});

/**
 * 加载svg
 * @param url
 * @param callback
 * @param errorCallback
 */
const loadSvg = (url: string, callback: Function, errorCallback: Function) => {
	if (url) {
		var req = new XMLHttpRequest();
		req.onreadystatechange = function () {
			if (req.readyState == 4) {
				// readyState is DONE
				var status = req.status;
				if (status == 200) {
					// request status is OK
					callback(req.responseXML, req.responseText.trim());
				} else if (status >= 400) {
					// request status is error (4xx or 5xx)
					errorCallback();
				} else if (status == 0) {
					// request status 0 can indicate a failed cross-domain call
					errorCallback();
				}
			}
		};
		req.open("GET", url, true);
		req.send();
	}
};

const svgHtml = ref("");

const computedUrl = computed(() => {
	const svgFileName: string = window.SVG_CONFIG[props.iconName] ?? "";
	if (!svgFileName) {
		return "";
	}

	if (window.__MICRO_APP_ENVIRONMENT__ && import.meta.env.VITE_BASEENV === "development") {
		return new URL(`${window.__MICRO_APP_PUBLIC_PATH__}src/assets/zh/${svgFileName}`, import.meta.url).href;
	}

	return new URL(`../../assets/zh/${svgFileName}`, import.meta.url).href;
});

const initLoadSvg = () => {
	if (!computedUrl.value) {
		return;
	}

	loadSvg(
		computedUrl.value,
		(_svgXml: any, svgString: string) => {
			if (svgString) {
				let content = svgString.replace(/stroke="[a-zA-Z#0-9]*"/, 'stroke="currentColor"');
				if (props.currentColor) {
					content = content.replace(/fill="[a-zA-Z#0-9]*"/g, 'fill="currentColor"');
				}

				const regStr = svgString.match(/<svg((?!>)).*>/)?.[0] ?? "";
				const width = (regStr.match(/width="[a-zA-Z#0-9]*"/)?.[0] ?? "").replace("width=", "").replace(/"/g, "");
				const height = (regStr.match(/height="[a-zA-Z#0-9]*"/)?.[0] ?? "").replace("height=", "").replace(/"/g, "");

				if (width && height && +props.size !== +width) {
					const realHeight = props.height ? props.height : (+props.size / +width) * +height;
					content = content.replace(`width="${width}`, `width="${props.size}`);
					content = content.replace(`height="${height}`, `height="${realHeight}`);
				}
				svgHtml.value = content;
			}

			// const svgDocument = svgXml?.documentElement as SVGSVGElement;
			// const attr = svgDocument?.attributes as any;
			// const width = attr?.width?.value;
			// const height = attr?.height?.value;

			// let content = svgString.replace(/stroke="[a-zA-Z#0-9]*"/, 'stroke="currentColor"');
			// if (props.currentColor) {
			// 	content = content.replace(/fill="[a-zA-Z#0-9]*"/g, 'fill="currentColor"');
			// }

			// if (width && height && +props.size !== +width) {
			// 	const realHeight = props.height ? props.height : (+props.size / width) * height;
			// 	content = content.replace(`width="${width}`, `width="${props.size}vw`);
			// 	content = content.replace(`height="${height}`, `height="${realHeight}vw`);
			// }
			// svgHtml.value = content;
		},
		() => {
			console.error("SVG load failed");
		}
	);
};

watch(
	() => props.iconName,
	() => {
		initLoadSvg();
	},
	{
		immediate: true,
		deep: true,
	}
);

/**
 * 自定义render
 */
const CunstomRender = () => {
	return h(compile(svgHtml.value), {
		...omit(props, ["width", "height", "size", "iconName", "currentColor", "iconClass"]),
		class: "svg-icon" + (props.iconClass ? props.iconClass : ""),
	});
};
</script>

<style scoped>
.svg-icon {
	fill: currentColor;
	vertical-align: middle;
	cursor: pointer;
}
</style>
