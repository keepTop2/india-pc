<!--
 * @Author: Relax
 * @Description: 401
-->
<template>
	<div class="error layout-padding">
		<div class="error-flex">
			<div class="left">
				<img :src="maintain" alt="" />
			</div>
			<div class="right">
				<img :src="maintain" alt="" />
				<div class="title">{{ $t(`errorPage.maintain['系统维护中']`) }}</div>
				<div class="text">
					<p>{{ $t(`errorPage.maintain['维护时间']`) }}</p>
					<p>2023-12-19 18:43:00～2023-12-19 19:00:00</p>
				</div>
				<Button class="service">{{ $t(`errorPage['联系客服']`) }}</Button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import maintain from '/@/assets/zh/default/errorPage/maintain.png';
</script>

<style scoped lang="scss">
.error {
	background: black;
	height: 100vh;
	/* 使用视窗高度作为容器的高度 */
	display: flex;
	justify-content: center;
	align-items: center;
}

.error-flex {
	display: flex;
	justify-content: center;
	align-items: center;

	.left {
		width: 450px;
		height: 450px;
		flex-shrink: 0;
	}

	.right {
		margin-left: 26px;

		img {
			width: 252px;
			height: 60px;
			flex-shrink: 0;
			background: #fff;
		}

		.title {
			margin: 32px 0 22px 0;

			@include themeify {
				color: themed('Text_s');
			}

			font-family: 'Microsoft YaHei';
			font-size: 46px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}

		.text {
			@include themeify {
				color: themed('Text2_1');
			}

			font-family: 'Microsoft YaHei';
			font-size: 16px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}

		.service {
			@include themeify {
				color: themed('Text_a');
			}

			font-size: 20px;
			font-weight: 700;
			margin-top: 20px;
			width: 360px;
			height: 56px;
		}
	}
}
</style>
