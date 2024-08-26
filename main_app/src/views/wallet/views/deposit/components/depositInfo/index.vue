<template>
	<div>
		<el-dialog :model-value="props.show" :show-close="false" :align-center="true" width="764" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="close">
			<div class="deposit-dialog">
				<div class="head">
					<div class="label">{{ $t(`deposit['充值信息']`) }}</div>
					<SvgIcon class="dialog_close" iconName="dialog_close" :size="30" @click="close" />
				</div>

				<!-- 内容 -->
				<div class="main">
					<!-- 金额信息 -->
					<div class="order-amount">
						<p class="Text1 mt_29">
							<i18n-t keypath="deposit['完成支付']" :tag="'span'">
								<template v-slot:date>
									<span class="Warn">13:50</span>
								</template>
							</i18n-t>
						</p>
						<p class="amount mt_31">${{ 1000 }}</p>
						<p class="Warn mt_13">{{ $t(`deposit['您的付款金额和付款账号务必与订单信息一致']`) }}</p>
					</div>
					<!-- 支付信息 -->
					<div class="pay-info">
						<div class="title">
							<div class="icon Theme">1</div>
							<div class="Text_s">{{ $t(`deposit['等待付款']`) }}</div>
						</div>
						<div class="pay-info-main">
							<p class="Text1 mt_13">
								<i18n-t keypath="deposit['支付完成']" :tag="'span'">
									<template v-slot:text>
										<span class="Warn">{{ $t(`deposit['上传截图']`) }}</span>
									</template>
								</i18n-t>
							</p>
							<p class="Text1 mt_10">{{ $t(`deposit['尽快到账']`) }}</p>
							<div class="pay-info-from mt_13">
								<div class="from-cell">
									<div class="Text2_1">{{ $t(`deposit['收款账户名']`) }}</div>
									<div class="value Text1">
										<span>123</span>
										<SvgIcon class="ml_20" iconName="copy_icon_one" :size="16" />
									</div>
								</div>
								<div class="from-cell">
									<div class="Text2_1">{{ $t(`deposit['收款账号']`) }}</div>
									<div class="value Text1">
										<span>123</span>
										<SvgIcon class="ml_20" iconName="copy_icon_one" :size="16" />
									</div>
								</div>
								<div class="from-cell">
									<div class="Text2_1">{{ $t(`deposit['银行名称']`) }}</div>
									<div class="value Text1">
										<span>123</span>
										<SvgIcon class="ml_20" iconName="copy_icon_one" :size="16" />
									</div>
								</div>
								<div class="from-cell">
									<div class="Text2_1">{{ $t(`deposit['充值金额']`) }}</div>
									<div class="value Text1">
										<span>123</span>
										<SvgIcon class="ml_20" iconName="copy_icon_one" :size="16" />
									</div>
								</div>
							</div>
						</div>
						<div class="title mt_24">
							<div class="icon">2</div>
							<div class="Text_s">{{ $t(`deposit['等待到账']`) }}</div>
						</div>
						<div class="pay-info-main">
							<p class="Text1 mt_13">{{ $t(`deposit['充值到账']`) }}</p>
						</div>
					</div>
					<!-- 订单信息 -->
					<div class="order-info">
						<div class="title">
							<div class="icon Theme">1</div>
							<div class="Text_s">{{ $t(`deposit['等待付款']`) }}</div>
						</div>
						<div class="pay-info-main">
							<div class="pay-info-from mt_13">
								<div class="from-cell">
									<div class="Text2_1">{{ $t(`deposit['收款账户名']`) }}</div>
									<div class="value Text1">123</div>
								</div>
								<div class="from-cell">
									<div class="Text2_1">{{ $t(`deposit['收款账号']`) }}</div>
									<div class="value Text1">123</div>
								</div>
								<div class="from-cell">
									<div class="Text2_1">{{ $t(`deposit['银行名称']`) }}</div>
									<div class="value Text1">123</div>
								</div>
							</div>
						</div>
					</div>
					<Button class="from-button" type="default" @click="innerVisible = true">{{ $t(`deposit['立即充值']`) }}</Button>
				</div>
			</div>
		</el-dialog>
		<!-- 上传凭证 -->
		<UploadCertificateDialog :show="innerVisible" @close="innerVisible = false" @closed="isModalOpen = true" />
		<!-- 成功 -->
		<Success :isModalOpen="isModalOpen" @close="isModalOpen = false" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '/@/components/Button/Button.vue';
import UploadCertificateDialog from './components/uploadCertificate/uploadCertificate.vue';
import Success from './components/success/index.vue';
const emit = defineEmits(['close']);
const props = withDefaults(
	defineProps<{
		show?: boolean;
	}>(),
	{ show: false }
);

const innerVisible = ref(false);
const isModalOpen = ref(false);

const close = () => {
	emit('close');
};
</script>

<style scoped lang="scss">
.deposit-dialog {
	height: 100%;
	border-radius: 24px;
	@include themeify {
		background: themed('Bg1');
	}
	padding-bottom: 30px;
	box-sizing: border-box;

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15px 17px;
		border-bottom: 1px solid;
		@include themeify {
			border-color: themed('Line');
			box-shadow: 0px 1px 0px 0px themed('Bg2');
		}
		box-sizing: border-box;
		.label {
			margin-left: 15px;
			@include themeify {
				color: themed('Text_s');
			}
			font-family: 'PingFang SC';
			font-size: 16px;
			font-weight: 500;
		}
		.dialog_close:hover {
			@include themeify {
				color: themed('Text_s');
			}
			transform: rotate(-90deg) scale(1.05);
			transition: all 0.3s;
		}
	}
	.main {
		height: calc(100% - 61px);
		padding: 0px 32px 22px;
		overflow: scroll;
		box-sizing: border-box;
		.order-amount {
			width: 100%;
			padding-bottom: 29px;
			text-align: center;
			border-bottom: 1px solid;
			@include themeify {
				border-color: themed('Line');
			}
			.amount {
				@include themeify {
					color: themed('Text_s');
				}
				font-family: 'Arial Black';
				font-size: 20px;
				font-weight: 900;
			}
		}

		.pay-info {
			padding: 29px 93px;
			border-bottom: 1px solid;
			@include themeify {
				border-color: themed('Line');
			}
		}
		.order-info {
			padding: 29px 93px 0px;
		}

		.pay-info,
		.order-info {
			box-sizing: border-box;

			.title {
				display: flex;
				align-items: center;
				.icon {
					width: 20px;
					height: 20px;
					border-radius: 50%;
					@include themeify {
						background: themed('icon');
						color: themed('Text_s');
					}
					text-align: center;
					font-family: 'PingFang SC';
					font-size: 14px;
					font-weight: 500;
					margin-right: 8px;
				}
			}
			.pay-info-main {
				padding-left: 28px;

				.pay-info-from {
					width: 440px;
					border-radius: 8px;
					@include themeify {
						background: themed('Bg4');
					}
					box-sizing: border-box;

					.from-cell {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 12px 16px;

						.value {
							display: flex;
							align-items: center;
						}
					}
				}
			}
		}

		// 表单按钮
		.from-button {
			width: 220px;
			height: 48px;
			margin: 40px auto 0px;
		}
	}
	.Text1 {
		@include themeify {
			color: themed('Text1');
		}
		font-family: 'PingFang SC';
		font-size: 14px;
		font-weight: 400;
	}
	.Warn {
		@include themeify {
			color: themed('Warn');
		}
		font-family: 'PingFang SC';
		font-size: 14px;
		font-weight: 400;
	}
	.Text_s {
		@include themeify {
			color: themed('Text_s');
		}
		font-family: 'PingFang SC';
		font-size: 14px;
		font-weight: 400;
	}
	.Text2_1 {
		@include themeify {
			color: themed('Text2_1');
		}
		font-family: 'PingFang SC';
		font-size: 14px;
		font-weight: 400;
	}
	.Theme {
		@include themeify {
			background: themed('Theme') !important;
		}
	}
}

:deep(.el-dialog) {
	background-color: unset;
	box-shadow: unset;
	overflow: hidden;
	// max-height: calc(100% - 220px);
}
:deep(.el-dialog.is-align-center) {
	margin: 52px auto;
}
:deep(.el-dialog__body) {
	height: 100%;
}
:deep(.el-dialog__header),
:deep(.el-dialog__body) {
	margin: 0;
	padding: 0;
}
</style>
