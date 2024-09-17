<template>
	<div></div>
</template>

<script setup lang="ts"></script>

<style scoped>
.banner {
	width: 100%;
	max-width: 1636px;
	margin: 0 auto;
<<<<<<< HEAD
=======
	img {
		width: 100%;
	}
	.swiper-box {
		position: relative;
		max-width: 1350px;
		margin: 0 auto;
		.arrow {
			max-width: 1350px;
			position: absolute;
			left: 10px;
			right: 10px;
			top: 50%;
			transform: translateY(-50%);
			display: flex;
			justify-content: space-between;
			color: var(--Text_s);
			margin: 0 auto;
			cursor: pointer;
			.arrow_left,
			.arrow_right {
				background-color: var(--button);
				height: 82px;
				width: 36px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.arrow_left {
				border-top-left-radius: 9px;
				border-bottom-left-radius: 9px;
			}
			.arrow_right {
				border-top-right-radius: 9px;
				border-bottom-right-radius: 9px;
			}
		}
	}
	.swiper {
		margin: -55px 55px 0;
		padding-bottom: 20px;
		:deep(.swiper-pagination) {
			bottom: -2px !important;
		}
		:deep(.swiper-pagination-bullet) {
			width: 12px !important;
			border-radius: 2px !important;
			height: 4px;
		}
		:deep(.swiper-pagination-bullet-active) {
			width: 26px !important;
			background: var(--Theme) !important;
		}
	}
>>>>>>> 828ee03 (feat:修改登陆验证)
}
</style>
