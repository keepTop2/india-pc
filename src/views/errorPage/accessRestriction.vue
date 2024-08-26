<!--
 * @Author: Relax
 * @Description: 访问限制
-->
<template>
	<div class="error layout-padding">
		<div class="error-flex">
			<div class="left">
				<img :src="accessRestriction" alt="" />
			</div>
			<div class="right">
				<img :src="accessRestriction" alt="" />
				<div class="title">{{ $t(`errorPage.accessRestriction['访问受限']`) }}</div>
				<div class="text">
					<p>{{ $t(`errorPage.accessRestriction['IP来自']`) }}123132132133</p>
					<p>{{ $t(`errorPage.accessRestriction['禁止访问']`) }}<br />{{ $t(`errorPage.accessRestriction['敬请谅解']`) }}</p>
				</div>
				<div class="but_box">
					<Button class="but_one">{{ $t(`errorPage['返回']`) }}</Button><Button class="but_two">{{ $t(`errorPage['刷新']`)
						}}</Button>
				</div>
				<Button class="service">{{ $t(`errorPage['联系客服']`) }}</Button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import accessRestriction from '/@/assets/zh/default/errorPage/accessRestriction.png';
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

		.but_box {
			margin-top: 50px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.but_one {
				width: 168px;
				height: 56px;
				padding: 15px 60px;

				@include themeify {
					background: themed('Bg');
					color: themed('Text_s');
					border: 2px solid themed('Text_s');
				}

				border-radius: 6px;
				font-size: 20px;
				font-weight: 700;
			}

			.but_two {
				width: 168px;
				height: 56px;
				padding: 15px 64px;
				border-radius: 6px;

				@include themeify {
					background: themed('Bg3');
					color: themed('Theme');
				}

				font-size: 20px;
				font-weight: 700;
			}
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
