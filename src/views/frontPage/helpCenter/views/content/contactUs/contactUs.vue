<!--
 * @Author: Relax
 * @Description: 帮助中心-联系我们
-->
<template>
	<div class="right">
		<div class="bottom">
			<div class="relation">{{ $t(`helpCenter.contactUs['联系我们']`) }}</div>
			<div class="way">{{ $t(`helpCenter.contactUs['业务邮箱']`) }}<span>shuiguo@gmail.com</span></div>
			<div class="way">{{ $t(`helpCenter.contactUs['业务Telegram']`) }}<span>@shuiguo</span></div>
			<div class="way">{{ $t(`helpCenter.contactUs['投诉建议邮箱']`) }}<span>shuiguo@gmail.com</span></div>
			<div class="way">{{ $t(`helpCenter.contactUs['投诉建议Telegram']`) }}<span>@shuiguo</span></div>
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

		.relation {
			@include themeify {
				color: themed('Text_s');
			}

			font-family: 'PingFang SC';
			font-size: 16px;
			font-style: normal;
			font-weight: 600;
			line-height: normal;
			margin-bottom: 14px;
		}

		.way {
			margin-top: 10px;

			@include themeify {
				color: themed('Text2_1');
			}

			font-family: 'PingFang SC';
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;

			span {
				@include themeify {
					color: themed('Text1');
				}

				font-family: 'PingFang SC';
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}
		}
	}
}
</style>
