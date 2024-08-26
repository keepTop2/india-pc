<!--
 * @Author: Relax
 * @Description: 帮助中心-用户协议
-->
<template>
	<div class="right">
		<div class="bottom">
			<div class="content">用户协议</div>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.right {
	.bottom {
		min-height: 600px;
		padding: 40px;
		border-radius: 8px;

		@include themeify {
			background: themed('Bg1');
		}

		.content {
			@include themeify {
				color: themed('Text_s');
			}

			font-family: 'PingFang SC';
			font-size: 16px;
			font-style: normal;
			font-weight: 600;
			line-height: normal;
		}
	}
}
</style>
