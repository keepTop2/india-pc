<template>
	<el-dialog :model-value="props.visible" :show-close="false" :align-center="true" width="480" style="height: 660px" :close-on-click-modal="false" :close-on-press-escape="false">
		<div class="deposit-dialog">
			<div class="head">
				<div class="label">
					<el-icon v-if="isEdit" @click="isEdit = false">
						<ArrowLeftBold />
					</el-icon>
					{{ props.title }}
				</div>
				<SvgIcon class="dialog_close" iconName="dialog_close" :size="30" @click="emits('close')" />
			</div>
			<div class="content">
				<template v-if="!isEdit">
					<div class="center">
						<div class="top">
							<div class="part1">
								<Avatar :size="160" />
								<div @click="isEdit = true">
									{{ $t(`userDropDown['编辑头像']`) }}
								</div>
							</div>
						</div>
					</div>
					<div class="input-box">
						<div>{{ $t(`userDropDown['用户名']`) }}</div>
						<el-input v-model="password" :type="passwordFieldType" :placeholder="$t(`userDropDown['请输入用户名']`)"></el-input>
					</div>
				</template>

				<template v-else>
					<div class="editAvatar">
						<div class="avatar">
							<Avatar :size="258" />
						</div>
						<div class="edit">
							<p>默认头像</p>
							<div class="list">
								<Avatar :size="46" v-for="item in 6" :key="item" />
								<div class="add">
									<el-icon>
										<Plus />
									</el-icon>
								</div>
							</div>
						</div>
					</div>
				</template>

				<div class="btn">
					<el-button type="success">{{ $t(`userDropDown['保存']`) }}</el-button>
				</div>
			</div>
		</div>
	</el-dialog>

	<!--  <Dialog @close="onClose" :model-value="props.visible" :title="props.title" width="480" style="height: 600px">-->
	<!--  </Dialog>-->
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Avatar } from "/@/components/User";
import Dialog from "/@/components/Dialog/Dialog.vue";
import { userApi } from "/@/api/user/user";

const props = defineProps<{
	title?: string;
	visible: boolean;
}>();
const emits = defineEmits(["update:visible", "close"]);
const onClose = () => {
	emits("update:visible", false);
};
const password = ref("");
const passwordFieldType = ref("password");
const togglePasswordVisibility = () => {
	console.log("togglePasswordVisibility");
	passwordFieldType.value = passwordFieldType.value === "password" ? "text" : "password";
};
const isEdit = ref(false);
</script>
<style scoped lang="scss">
@import "../index";

.content {
	display: flex;
	flex-direction: column;
	gap: 50px;

	& > .center {
		cursor: pointer;
	}

	.top {
		width: 80%;

		div {
			@include center;
		}

		.part1 {
			margin-top: 30px;
			position: relative;

			& > div {
				position: absolute;
				bottom: 0;
				width: 96px;
				height: 36px;
				background: rgba(0, 0, 0, 0.3);
				border-radius: 6px;

				@include themeify {
					color: themed("Text_a");
				}
			}
		}
	}

	.input-box {
		margin: auto;
		width: 80%;

		@include themeify {
			color: themed("Text_s");
		}

		:deep {
			.el-input {
				--el-color-primary: white;
				--el-input-placeholder-color: #656e78;
				margin-top: 10px;
				height: 48px;
			}

			.el-input__wrapper {
				box-shadow: none;

				@include themeify {
					background: themed("Bg2");
				}
			}
		}
	}

	.editAvatar {
		.avatar {
			@include themeify {
				background-color: themed("Bg2");
			}

			text-align: center;
		}

		.edit {
			padding: 0 30px;

			& > p {
				margin: 10px 0;
				font-size: 14px;

				@include themeify {
					color: themed("Text_s");
				}
			}

			.list {
				display: flex;
				gap: 10px;

				.add {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 50px;
					height: 50px;
					box-sizing: border-box;
					border-radius: 50%;
					cursor: pointer;

					@include themeify {
						border: 2px solid themed("Theme");
					}

					i {
						font-size: 20px;

						@include themeify {
							color: themed("Text_s");
						}
					}
				}
			}
		}
	}

	.btn {
		width: 200px;
		height: 48px;
		margin: auto;

		.el-button {
			width: 100%;
			height: 100%;
		}
	}
}

.label {
	display: flex;
	align-items: center;

	i {
		cursor: pointer;

		@include themeify {
			color: themed("icon");
		}
	}
}
</style>
