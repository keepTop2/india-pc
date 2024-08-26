<!--
 * @Author: Relax
 * @Description: 帮助中心-注册登录
-->
<template>
	<div class="right">
		<div class="bottom">
			<div class="content">注册登录</div>
			<div class="text">
				您必须年满 18 岁才能注册。如果您想添加您的电子邮件地址，请确保您输入的电子邮件地址正确，以便稍后用于KYC账户验证。<br />
				您可以随时登录。为了提高安全性，我们建议您添加2FA。了解有关谷歌身份验证器的更多信息。<br />
				如果您需要更改您的注册电子邮件，我们很抱歉，但我们无法更新此信息。如果您坚持更改用户名和/或注册电子邮件，我们建议您关闭当前帐户并注册一个新帐户。
			</div>
			<div></div>
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
			margin-bottom: 14px;
		}

		.text {
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
</style>
