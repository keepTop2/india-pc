<template>
	<i v-html="svgHtml" :class="'svg-icon' + ($attrs.iconClass ? $attrs.iconClass : '')" />
</template>

<script setup lang="ts">
import { watch, ref, computed } from "vue";

type Props = {
	iconName: string;
	size?: number;
	height?: number;
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
	const svgFileName: string = window.SVG_CONFIG[props.iconName];
	if (!svgFileName) {
		return "";
	}

	return new URL(`../assets/svg/${svgFileName}`, import.meta.url).href;
});

const initLoadSvg = () => {
	if (!computedUrl.value) {
		return;
	}

	loadSvg(
		computedUrl.value,
		(svgXml: any, svgString: string) => {
			const svgDocument = svgXml?.documentElement as SVGSVGElement;
			const attr = svgDocument.attributes as any;
			const width = attr?.width?.value;
			const height = attr?.height?.value;

			let content = svgString.replace(/stroke="[a-zA-Z#0-9]*"/, 'stroke="currentColor"');
			if (props.currentColor) {
				content = content.replace(/fill="[a-zA-Z#0-9]*"/g, 'fill="currentColor"');
			}

			if (width && height && +props.size !== +width) {
				const realHeight = props.height ? props.height : (props.size / width) * height;
				content = content.replace(`width="${width}`, `width="${props.size}`);
				content = content.replace(`height="${height}`, `height="${realHeight}`);
			}

			svgHtml.value = content;
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
</script>

<style scoped>
.svg-icon {
	/* display: inline-flex; */
	fill: currentColor;
	vertical-align: middle;
	cursor: pointer;
}
</style>
