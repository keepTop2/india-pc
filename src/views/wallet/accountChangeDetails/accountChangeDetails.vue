<template>
	<div>
		<Card :header="true">
			<template #header>
				<div class="header">
					<span class="label">{{ $t(`wallet['存款']`) }}</span>
					<svg-icon class="icon" name="wallet-header_arrow" />
					<span class="type_label">测试</span>
				</div>
			</template>
			<div class="container">
				<div class="info">
					<div class="amount_info">
						<img class="icon" :src="amount_icon" alt="" />
						<span class="value">5000</span>
						<span>&nbsp;</span>
						<span class="label">CNY</span>
					</div>
					<div class="date">
						<span>00:30:00</span>
					</div>
					<p class="tips">
						<span>{{ $t(`wallet['请在规定的时间内完成支付，如已完成支付']`) }}</span>
						<span>&nbsp;</span>
						<span class="a">{{ $t(`wallet['提供转账凭证']`) }}</span>
					</p>
				</div>

				<div class="form_info">
					<div class="content">
						<div class="cell">
							<div class="label">{{ $t(`wallet['存款']`) }}</div>
							<div class="value"></div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['存款金额']`) }}</div>
							<div class="value"></div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['手续费']`) }}</div>
							<div class="value"></div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['到账金额']`) }}</div>
							<div class="value"></div>
						</div>
					</div>
					<div class="content">
						<div class="cell">
							<div class="label">{{ $t(`wallet['存款方式']`) }}</div>
							<div class="value"></div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['申请时间']`) }}</div>
							<div class="value"></div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['订单号']`) }}</div>
							<div class="value"></div>
						</div>
					</div>
				</div>

				<div class="progress">
					<div class="step">
						<div class="icon">
							<div class="content">
								<img :src="success" alt="" />
							</div>
							<div class="line line_success"></div>
						</div>
						<div class="label">{{ $t(`wallet['创建充值订单']`) }}</div>
						<div class="value">2023</div>
					</div>
					<div class="step">
						<div class="icon">
							<div class="content">
								<img :src="success" alt="" />
							</div>
							<div class="line"></div>
						</div>
						<div class="label">{{ $t(`wallet['第三方商户处理中']`) }}</div>
						<div class="value">2023</div>
					</div>
					<div class="step">
						<div class="icon">
							<div class="content">
								<span>1</span>
							</div>
						</div>
						<div class="label">{{ $t(`wallet['交易完成/失败']`) }}</div>
						<div class="value">2023</div>
					</div>
				</div>

				<div class="btns">
					<div class="cancel">{{ $t(`wallet['取消充值']`) }}</div>
					<div class="confirm">{{ $t(`wallet['继续充值']`) }}</div>
				</div>
			</div>
		</Card>
	</div>
</template>

<script setup lang="ts">
import Card from "../components/card.vue";
import amount_icon from "/@/assets/zh-CN/wallet/amount_icon.png";
import success from "/@/assets/zh-CN/wallet/success.png";
import time_bg from "/@/assets/zh-CN/wallet/time_bg.png";
</script>

<style scoped lang="scss">
.header {
	display: flex;
	align-items: center;
	gap: 10px;
	padding-bottom: 6px;
	border-bottom: 1px solid var(--Line_1);
	box-shadow: 0px 1px 0px 0px #343d48;

	.label {
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 24px;
		font-weight: 500;
	}
	.type_label {
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 18px;
		font-weight: 500;
	}
	.icon {
		width: 18px;
		height: 18px;
	}
}

.container {
	padding: 20px;
	.info {
		display: grid;
		justify-content: center;
		gap: 10px;
		margin-top: 10px;
		.amount_info {
			display: flex;
			align-items: center;
			justify-content: center;

			.icon {
				width: 26px;
				height: 26px;
				margin-right: 10px;
			}
			.value {
				color: var(--Text_s);
				font-family: "DIN Alternate";
				font-size: 26px;
				font-weight: 700;
			}
			.label {
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 22px;
				font-weight: 500;
			}
		}
		.date {
			width: 120px;
			height: 120px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto;
			background: url("../../../assets/zh-CN/wallet/time_bg.png") center center / 100% 100% no-repeat;

			span {
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 17px;
				font-weight: 400;
			}
		}
		.tips {
			color: var(--Text1);
			text-align: center;
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
			.a {
				color: var(--F2);
			}
		}
	}

	.form_info {
		max-width: 922px;
		position: relative;
		display: flex;
		gap: 1px;
		margin: 30px auto 30px;
		border-radius: 12px;
		background: var(--Bg1);
		border: 1px solid var(--Line_2);
		&::after {
			position: absolute;
			content: "";
			top: 50%;
			left: 50%;
			width: 1px;
			height: 142px;
			transform: translate(-50%, -50%);
			background: var(--Line_2);
		}
		.content {
			flex: 1;
			display: grid;
			padding: 20px 24px;
			gap: 14px;
			grid-auto-rows: min-content;
			.cell {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.label {
					color: var(--Text1);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
				.value {
					color: var(--Text_s);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
			}
		}
	}
	.progress {
		display: flex;
		justify-content: space-between;
		.step {
			flex: 1;
			padding: 0px 10px;
			text-align: center;
			.icon {
				position: relative;
				width: 100%;

				.content {
					width: 26px;
					height: 26px;
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 0 auto;
					border-radius: 50%;
					background-color: #7d8086;
					span {
						color: var(--Text_a);
						text-align: center;
						font-family: "PingFang SC";
						font-size: 16px;
						font-weight: 500;
					}
					img {
						width: 26px;
						height: 26px;
					}
				}

				.line {
					position: absolute;
					content: "";
					top: 50%;
					right: calc(-50% + 10px);
					width: calc(100% - 40px);
					height: 4px;
					transform: translateY(-50%);
					border-radius: 8px;
					background: var(--Line_2);
				}
				.line_success {
					background: var(--Success);
				}
			}
			.label {
				margin-top: 14px;
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
			.value {
				margin-top: 2px;
				color: var(--Text1);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
		}
	}

	.btns {
		display: flex;
		justify-content: center;
		gap: 40px;
		margin-top: 30px;
		.cancel,
		.confirm {
			width: 240px;
			height: 48px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-family: "PingFang SC";
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			border-radius: 4px;
			cursor: pointer;
		}
		.cancel {
			border: 1px solid var(--Theme);
			color: var(--Theme);
		}
		.confirm {
			background: var(--Theme);
			color: var(--Text_a);
		}
	}
}
</style>
