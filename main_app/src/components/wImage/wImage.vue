<!--
 * @Author: WangMingxin
 * @Description: 图片加载二次封装
-->
<template>
	<div class="image-container" ref="imageContainerRef">
		<el-image
			:src="state.url"
			:fit="fit"
			:lazy="lazy"
			:hide-on-click-modal="hideOnClickModal"
			:loading="loading"
			:scroll-container="scrollContainer"
			:alt="alt"
			:referrerpolicy="referrerpolicy"
			:crossorigin="crossorigin"
			:preview-src-list="previewSrcList"
			:z-index="zIndex"
			:initial-index="initialIndex"
			:close-on-press-escape="closeOnPressEscape"
			:preview-teleported="previewTeleported"
			:infinite="infinite"
			:zoom-rate="zoomRate"
			:min-scale="minScale"
			:max-scale="maxScale"
		>
			<template #placeholder>
				<div class="image-slot">Loading<span class="dot">...</span></div>
			</template>
			<template #error>
				<div class="image-slot">
					<el-icon>
						<icon-picture />
					</el-icon>
				</div>
			</template>
		</el-image>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, reactive } from "vue";
import { ElImage } from "element-plus";
import { Picture as IconPicture } from "@element-plus/icons-vue";

interface imageProps {
	/**
	 * @description when enabling preview, use this flag to control whether clicking on backdrop can exit preview mode.
	 */
	hideOnClickModal?: boolean;
	/**
	 * @description image source, same as native.
	 */
	src: string;
	/**
	 * @description indicate how the image should be resized to fit its container, same as [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit).
	 * values: ["", "contain", "cover", "fill", "none", "scale-down"];
	 */
	fit?: "" | "contain" | "cover" | "fill" | "none" | "scale-down";
	/**
	 * @description  Indicates how the browser should load the image, same as [native](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading)
	 * 		values: ["eager", "lazy"];
	 */
	loading?: "eager" | "lazy";
	/**
	 * @description whether to use lazy load.
	 */
	lazy?: boolean;
	/**
	 * @description the container to add scroll listener when using lazy load.
	 */
	scrollContainer?: any;
	/**
	 * @description allow big image preview.
	 */
	previewSrcList?: any;
	/**
	 * @description whether to append image-viewer to body. A nested parent element attribute transform should have this attribute set to `true`.
	 */
	previewTeleported?: boolean;
	/**
	 * @description set image preview z-index.
	 */
	zIndex?: number;
	/**
	 * @description initial preview image index, less than the length of `url-list`.
	 */
	initialIndex?: number;
	/**
	 * @description whether the viewer preview is infinite.
	 */
	infinite?: boolean;
	/**
	 * @description whether the image-viewer can be closed by pressing ESC.
	 */
	closeOnPressEscape?: boolean;
	/**
	 * @description the zoom rate of the image viewer zoom event
	 */
	zoomRate?: number;
	/**
	 * @description the min scale of the image viewer zoom event.
	 */
	minScale?: number;
	/**
	 * @description the max scale of the image viewer zoom event.
	 */
	maxScale?: number;
	/**
	 * @description  	type: "anonymous" | "use-credentials" | ""; set HTML attribute: crossorigin.
	 * 允许使用来自允许跨域访问的第三方网站的图像与画布（canvas）一起使用。
	 */
	crossorigin?: "anonymous" | "use-credentials" | "";
	/**属性是一个必需的属性，它规定在图像无法显示时的替代文本。 */
	alt?: string;
	/** 规定在获取图像时要使用的引用信息 */
	referrerpolicy?: string;
}
//定义props并设置默认值
const props = withDefaults(defineProps<imageProps>(), {
	src: "",
	hideOnClickModal: false,
	alt: "",
	closeOnPressEscape: true,
	lazy: false,
	previewTeleported: false,
	infinite: true,
	zoomRate: 1.2,
	minScale: 0.2,
	maxScale: 7,
});
const imageContainerRef = ref();
const state = reactive({
	url: "",
});

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// 元素进入视口时的逻辑
				state.url = props.src;
			} else {
				// 元素离开视口时的逻辑
			}
		});
	},
	{
		root: null, // 默认为 viewport
		rootMargin: "0px", // 根据需要调整
		threshold: [0, 0.25, 0.75, 1], //触发回调的阈值 (默认: 0.5 )
		// threshold: [0.25, 0.75], //触发回调的阈值 (默认: 0.5 )
		// threshold: [0, 1], //触发回调的阈值 (默认: 0.5 )
	}
);
watch(
	() => imageContainerRef.value,
	(newValue, oldValue) => {
		if (newValue && props.lazy) {
			observer.observe(imageContainerRef.value);
		}
	},
	{
		immediate: true,
	}
);

onMounted(() => {
	if (!props.lazy) {
		state.url = props.src;
	}
});
</script>

<style lang="scss" scoped>
.image-container {
	width: 100%;
	height: 100%;
	min-height: 10px;
	min-width: 10pc;
	:deep(.el-image) {
		width: 100%;
		height: 100%;
	}
}
</style>
