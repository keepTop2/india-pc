<template>
	<div>
		<el-dialog :model-value="props.show" :show-close="false" width="400" :close-on-click-modal="false" :close-on-press-escape="false" @closed="closed">
			<div class="uploadCertificate">
				<div class="head">
					<div class="label">{{ $t(`transaction['上传凭证']`) }}</div>
					<SvgIcon class="dialog_close" iconName="dialog_close" :size="30" @click="close" />
				</div>

				<div class="uploadCertificate-main">
					<p class="Warn mt_32">
						<i18n-t keypath="transaction['信息截图']" :tag="'span'">
							<template v-slot:text>
								<span class="F2">{{ $t(`transaction['图片限制']`) }}</span>
							</template>
						</i18n-t>
					</p>
					<div class="upload-list">
						<el-upload v-show="uploadShow" v-model:file-list="fileList" action="#" list-type="picture-card" :auto-upload="false" :show-file-list="false" :limit="3" multiple>
							<template #default>
								<div>
									<SvgIcon iconName="upload_icon" :size="40" />
								</div>
							</template>
						</el-upload>
						<div class="img" v-for="(item, index) in fileList" :key="index">
							<SvgIcon class="delete_icon" iconName="delete_icon" :size="24" @click="onDelete(index)" />
							<img :src="item.url" alt="" />
						</div>
					</div>

					<div class="order-info">
						<div class="cell">
							<div class="label Text2_1">{{ $t(`transaction['金额']`) }}</div>
							<div class="value Text1">123</div>
						</div>
						<div class="cell">
							<div class="label Text2_1">{{ $t(`transaction['状态']`) }}</div>
							<div class="value Text1">123</div>
						</div>
						<div class="cell">
							<div class="label Text2_1">{{ $t(`transaction['时间']`) }}</div>
							<div class="value Text1">123</div>
						</div>
					</div>

					<div class="message-board">
						<div class="label">
							<span class="Text2_1">{{ $t(`transaction['留言']`) }}</span>
							<span style="font-size: 12px" class="Text2_1">{{ $t(`transaction['字符']`, { num: maxLength }) }}</span>
						</div>

						<MessageBoard v-model="state.messageText" />
					</div>

					<Button class="from-button" type="default" @click="close">{{ $t(`transaction['提交']`) }}</Button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, Ref, watch } from 'vue';
import MessageBoard from '/@/components/MessageBoard/messageBoard.vue';
import Button from '/@/components/Button/Button.vue';
const emit = defineEmits(['close', 'closed']);
const props = withDefaults(
	defineProps<{
		show?: boolean;
	}>(),
	{ show: false }
);
const uploadShow = ref(true);
const maxLength = ref(500);
const fileList = ref([]); // 文件列表
const state = reactive({
	text: '',
	messageText: '',
});

// 监听上传列表
watch(
	() => fileList.value,
	(newValue, oldValue) => {
		if (newValue.length == 3) {
			uploadShow.value = false;
		} else {
			uploadShow.value = true;
		}
	},
	{ deep: true }
);

// 删除上传列表
const onDelete = (index: number) => {
	fileList.value.splice(index, 1);
};

const close = () => {
	emit('close');
};
const closed = () => {
	emit('closed');
};
</script>

<style scoped lang="scss">
.uploadCertificate {
	padding-bottom: 15px;
	border-radius: 20px;
	@include themeify {
		background: themed('Bg1');
	}
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
	.uploadCertificate-main {
		padding: 0px 32px;
		.upload-list {
			display: flex;
			flex-wrap: wrap;
			gap: 15px;
			margin-top: 17px;
			:deep(.el-upload) {
				width: 100px;
				height: 100px;
				border-radius: 12px;
				border: 1px solid;
				@include themeify {
					border-color: themed('Line');
					background: themed('Bg3');
				}
			}
			.img {
				position: relative;
				width: 100px;
				height: 100px;
				border-radius: 12px;
				border: 1px solid;
				@include themeify {
					border-color: themed('Line');
					background: themed('Bg3');
				}

				.delete_icon {
					position: absolute;
					top: -4px;
					right: -4px;
					z-index: 1;
				}
				img {
					width: 100%;
					height: 100%;
					border-radius: 12px;
				}
			}
		}
		.order-info {
			margin-top: 13px;
			.cell {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 4px 0px;
			}
		}

		.message-board {
			margin-top: 13px;
		}
		// 表单按钮
		.from-button {
			width: 220px;
			height: 48px;
			margin: 17px auto 0px;
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
	.Text2_1 {
		@include themeify {
			color: themed('Text2_1');
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
	.F2 {
		@include themeify {
			color: themed('f2');
		}
	}
	.F1 {
		@include themeify {
			color: themed('f1');
		}
	}
}

:deep(.el-dialog) {
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: unset;
	box-shadow: unset;
	overflow: hidden;
	margin: 0;
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
