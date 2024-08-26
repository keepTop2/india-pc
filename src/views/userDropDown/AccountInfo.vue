<template>
	<div class="drop-right">
		<div class="user-box">
			<div class="right-title">{{ $t(`userDropDown['个人信息']`) }}</div>
			<div class="center">
				<div class="space-between">
					<div>
						<Avatar :size="72" />
						<div class="center">
							<div>
								<div>{{ userBaseInfo.nickName }}</div>
								<div class="text">ID:{{ userBaseInfo.userAccount }}</div>
							</div>
						</div>
					</div>
					<div>
						<el-button class="btn" type="success" @click="onEdit">{{ $t(`userDropDown['编辑']`) }}</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class="account-box">
			<div class="right-title">{{ $t(`userDropDown['联系方式']`) }}</div>
			<div>
				<div class="part1">{{ $t(`userDropDown['电子邮箱']`) }}</div>
				<div class="center part2">
					<div class="space-between">
						<div>
							<el-input class="input" placeholder="" v-model="userBaseInfo.email" readonly v-if="userBaseInfo.mailStatus">
								<template #suffix>
									<div class="suffix">
										<el-image :src="verifyImage" />
										<div>{{ $t(`userDropDown['已验证']`) }}</div>
									</div>
								</template>
							</el-input>
							<div class="text center" v-else>
								{{ $t(`userDropDown['添加您的电子邮箱，您可以用电子邮箱作为登录方式']`) }}
							</div>
						</div>
						<div>
							<el-button class="btn" type="success" @click="onAdd('email')">{{ $t(`userDropDown['添加']`) }}</el-button>
						</div>
					</div>
				</div>
				<div class="part3">{{ $t(`userDropDown['电话号码']`) }}</div>

				<div class="center part4">
					<div class="space-between">
						<div>
							<el-input placeholder="" v-model="userBaseInfo.phone" readonly v-if="userBaseInfo.phoneStatus">
								<template #suffix>
									<div class="suffix">
										<el-image :src="verifyImage" />
										<div>已验证</div>
									</div>
								</template>
							</el-input>
							<div class="text center" v-else>
								{{ $t(`userDropDown['添加您的电话号码，您可以用电话作为登录方式']`) }}
							</div>
						</div>
						<div>
							<el-button class="btn" type="success" @click="onAdd('phone')">{{ $t(`userDropDown['添加']`) }}</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<UserEditModal v-model:visible="editVisible" title="编辑" @close="editVisible = false" />
	<PhoneAndEmailModel v-model:visible="addVisible" :mod="mod" @close="addVisible = false" />
</template>

<script setup lang="ts">
import verifyImage from "/@/assets/zh/default/config/verify.svg";
import { ref } from "vue";
import { Avatar } from "/@/components/User";
import UserEditModal from "/@/views/userDropDown/components/UserEditModal.vue";
import PhoneAndEmailModel from "/@/views/userDropDown/components/PhoneAndEmailModel.vue";
import { userApi } from "/@/api/user/user";

const phoneVerify = ref(false);

const editVisible = ref(false);
const addVisible = ref(false);

const mod = ref("");
const onEdit = () => {
	editVisible.value = true;
};
const onAdd = (type: string) => {
	mod.value = type;
	addVisible.value = true;
};

// 用户基本信息
const userBaseInfo = ref({});

// 获取基本信息
async function getUserGlobalSetInfo() {
	let res = await userApi.getUserGlobalSetInfo();
	const { data } = res;
	console.clear();
	console.log(data);
	userBaseInfo.value = data;
}

getUserGlobalSetInfo();
</script>

<style scoped lang="scss">
@import "index";

.drop-right {
	@include drop-right;

	.user-box {
		@include card;
		height: 173px;

		& > .center {
			height: 120px;

			.space-between {
				width: 94%;

				& > div:first-child {
					display: flex;

					& > .center {
						margin-left: 20px;
					}
				}

				& > div:last-child {
					display: flex;
					align-items: center;
				}
			}
		}
	}

	.account-box {
		@include card;
		margin-top: 20px;
		height: 314px;

		& > div:last-child {
			margin-left: 20px;

			.part1 {
				padding: 10px;
				font-size: 14px;
				margin-top: 20px;
			}

			.part2 {
				.space-between {
					width: 100%;
					padding-right: 30px;

					.el-input {
						height: 40px;
						width: 500px;
						margin: 10px;

						.suffix {
							display: flex;

							& > div {
								color: #3bc116;
								margin-left: 10px;
							}
						}
					}

					.text {
						height: 100%;
						padding: 10px;
					}

					& > div:last-child {
						display: flex;
						align-items: center;
					}
				}
			}

			.part3 {
				padding: 10px;
				font-size: 14px;
				margin-top: 20px;
			}

			.part4 {
				.space-between {
					width: 100%;
					padding-right: 30px;

					:deep() {
						.el-input {
							height: 40px;
							width: 500px;
							margin: 10px;

							.suffix {
								display: flex;

								& > div {
									color: #3bc116;
									margin-left: 10p;
								}
							}
						}
					}

					& > div:first-child {
						& > .text {
							height: 100%;
							padding: 0 10px;
						}
					}

					& > div:last-child {
						display: flex;
						align-items: center;
					}
				}
			}
		}
	}
}

.input {
	:deep() {
		.el-input__wrapper {
			box-shadow: none;

			@include themeify {
				background-color: themed("Bg2");
			}

			input {
				@include themeify {
					color: themed("Text2_1");
				}
			}
		}
	}
}
</style>
