<template>
	<!-- 图片预览弹窗 -->
	<div v-if="isOpen" class="overlay" @click="closePreview">
		<div class="preview-container" @click.stop>
			<button @click="prevImage" class="nav-button left"><svg-icon name="common-common-arrow_left_on" width="8px" height="12px"></svg-icon></button>
			<div class="imgBox">
				<img v-lazy-load="images[currentIndex]" alt="Preview" class="preview-image" />
			</div>
			<button @click="nextImage" class="nav-button right"><svg-icon name="common-arrow_right" width="8px" height="12px"></svg-icon></button>
			<div @click="closePreview" class="close-button curp"><img src="/@/assets/common/close_btn_bg.png" alt="" /></div>
			<div class="index Text1">{{ currentIndex + 1 }}/{{ images.length }}</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// 接收图片URL数组和控制弹窗打开状态
const props = defineProps<{
	images: string[];
	isOpen: boolean;
	initialIndex?: number;
}>();

const emit = defineEmits(["close"]);

// 设置当前图片索引
const currentIndex = ref(props.initialIndex || 0);

// 切换到上一张图片
const prevImage = () => {
	currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
};

// 切换到下一张图片
const nextImage = () => {
	currentIndex.value = (currentIndex.value + 1) % props.images.length;
};

// 关闭预览弹窗
const closePreview = () => {
	emit("close");
};
</script>

<style scoped lang="scss">
.overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.3);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.preview-container {
	position: relative;
	text-align: center;
	background: var(--Bg-1);
	padding: 0 50px;
	width: 676px;
	height: 595px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	border-radius: 12px;
	.imgBox {
		flex: 1;
		width: 100%;
		max-height: 462px;
		max-width: 572px;
		overflow-y: auto;
		img {
			max-width: 100%;
		}
	}
}

.index {
	position: absolute;
	bottom: 16px;
}
.nav-button {
	position: absolute;
	top: 50%;
	width: 28px;
	height: 28px;
	transform: translateY(-50%);
	background: var(--Butter);
	color: #fff;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border-radius: 4px;
}

.left {
	left: 12px;
}

.right {
	right: 12px;
}

.close-button {
	position: absolute;
	top: 0;
	right: 0;
	height: 45px;
	img {
		height: 45px;
	}
}
</style>
