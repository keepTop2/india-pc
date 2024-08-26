<template>
	<div class="from">
		<div class="amount-info">
			<img :src="currencyIcon" alt="" />
			<p class="amount mt_16">
				-<span>500</span>
				<span class="ml_4">USDT</span>
			</p>
		</div>

		<div class="order-info mt_24">
			<div class="cell">
				<div class="label">{{ $t(`transaction['状态']`) }}</div>
				<div class="value">123</div>
			</div>
			<div class="cell">
				<div class="label">{{ $t(`transaction['订单号']`) }}</div>
				<div class="value">
					<span>123</span>
					<SvgIcon class="ml_8" iconName="copy_icon_one" :size="16" />
				</div>
			</div>
			<div class="cell">
				<div class="label">{{ $t(`transaction['时间']`) }}</div>
				<div class="value">123</div>
			</div>
			<div class="cell">
				<div class="label">{{ $t(`transaction['提现地址']`) }}</div>
				<div class="value">123</div>
			</div>
		</div>

		<div class="order-status mt_16">
			<div class="label">
				<span>{{ $t(`transaction['订单进度']`) }}</span>
			</div>

			<div class="steps mt_13">
				<div class="container">
					<div class="label">
						<SvgIcon class="step_icon" iconName="step_icon_success" :size="18" />
						<div class="text">{{ $t(`transaction['创建提现订单']`) }}</div>
					</div>
					<div class="content">
						<p>{{ $t(`transaction['更新于']`, { date: '2013 - 07 - 28' }) }}</p>
						<p>{{ $t(`transaction['链上交易通常需要一些时间']`) }}</p>
					</div>
					<div class="label">
						<!-- <SvgIcon class="step_icon" iconName="step_icon_success" :size="18" /> -->
						<!-- <SvgIcon class="step_icon" iconName="step_icon_error" :size="18" /> -->
						<div class="step_icon_num">2</div>
						<div class="text">{{ $t(`transaction['交易成功']`) }}</div>
					</div>
					<!-- <div class="text_warn">{{ $t(`transaction['失败原因']`, { text: '存款失败' }) }}</div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import currencyIcon from '/@/assets/zh/default/layout/layout1/left/wallet/currencyIcon.png';
</script>

<style scoped lang="scss">
@import '../../common.scss'; // 引入弹窗公共样式
.from {
	padding: 0px 44px;
	.amount-info {
		margin: 8px auto 0;
		text-align: center;
		img {
			width: 80px;
			height: 80px;
			margin: 0 auto;
		}
		.amount {
			@include themeify {
				color: themed('Text_s');
			}
			font-family: 'PingFang SC';
			font-size: 20px;
			font-weight: 400;
		}
	}

	.order-info {
		.cell {
			width: 100%;
			height: 48px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0px 12px;
			box-sizing: border-box;
			.label {
				@include themeify {
					color: themed('Text1');
				}
				font-family: 'PingFang SC';
				font-size: 14px;
				font-weight: 400;
			}
			.value {
				display: flex;
				align-items: center;
				@include themeify {
					color: themed('Text_s');
				}
				font-family: 'PingFang SC';
				font-size: 14px;
				font-weight: 400;
			}
		}
	}
	.order-status {
		padding: 0px 12px;
		box-sizing: border-box;
		.label {
			@include themeify {
				color: themed('Text1');
			}
			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
		}
	}

	.steps {
		padding: 15px;
		border-radius: 4px;
		@include themeify {
			background-color: themed('Bg4');
		}
		box-sizing: border-box;

		.container {
			padding-left: 26px;

			.label,
			.content {
				position: relative;

				.step_icon {
					position: absolute;
					top: 50%;
					left: -26px;
					transform: translate(0%, -50%);
				}

				.step_icon_num {
					position: absolute;
					top: 50%;
					left: -26px;
					transform: translate(0%, -50%);
					width: 18px;
					height: 18px;
					border-radius: 50%;
					@include themeify {
						background-color: themed('icon');
						color: themed('Text_a');
					}
					text-align: center;
					font-family: 'PingFang SC';
					font-size: 12px;
					font-weight: 500;
				}
			}

			.label {
				@include themeify {
					color: themed('Text1');
				}
				font-family: 'PingFang SC';
				font-size: 14px;
				font-weight: 400;
			}

			.content {
				min-height: 50px;
				@include themeify {
					color: themed('Text2_1');
				}
				font-family: 'PingFang SC';
				font-size: 12px;
				font-weight: 400;

				&::after {
					position: absolute;
					content: '';
					top: 50%;
					left: -18px;
					transform: translate(0%, -50%);
					width: 2px;
					height: calc(100% - 6px);
					min-height: 44px;
					@include themeify {
						background-color: themed('Theme');
					}
				}
			}

			.text_warn {
				@include themeify {
					color: themed('Warn');
				}
				font-family: 'PingFang SC';
				font-size: 12px;
				font-weight: 400;
			}
		}
	}
}
</style>
