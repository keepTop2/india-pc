<template>
	<div class="left_main" :class="collapse ? 'collapse' : ''">
		<!-- 左侧头 -->
		<div class="left_main_header">
			<div class="left_imgs_collapse collapse_icon icon">
				<SvgIcon :name="collapse ? 'common-collapse_close_icon' : 'common-collapse_open_icon'" width="24px" height="21px" @click="changeCollpase" />
			</div>
			<div class="logo" @click="router.push('/')" v-if="!collapse">
				<svg-icon name="common-logo" width="132px" height="16px" />
			</div>
		</div>
		<div class="line1"></div>
		<!-- 左侧菜单 -->
		<div class="left_scroll">
			<div class="left_scroll_conatiner1">
				<!-- 任务 抽奖-->
				<div class="task_lottery mt_15">
					<div class="task_lottery_item" @click="showTask" :style="{ backgroundImage: !collapse ? `url(${Common.getCommonImgPath('task_bg.png')})` : '', marginRight: '5px' }">
						<img :src="Common.getCommonImgPath('task_icon.png')" alt="" />
						<span class="fz_14 ml_3 task_lottery_item_text1">{{ $t(`home['任务']`) }} </span>
					</div>

					<div class="task_lottery_item" @click="showSpin" :style="{ backgroundImage: !collapse ? `url(${Common.getCommonImgPath('lottery_bg.png')})` : '' }">
						<img :src="Common.getCommonImgPath('lottery_icon.png')" alt="" />
						<span class="fz_14 ml_3 task_lottery_item_text1">{{ $t(`home['转盘']`) }}</span>
					</div>
				</div>
				<!-- 菜单 -->
				<div class="left_scroll_conatiner2">
					<menuSkeleton v-if="isLoading" :collapse="collapse" />
					<Menu v-else :ActivitySwitch="ActivitySwitch" @showDAILY_COMPETITION="showDAILY_COMPETITION" />
					<!-- 左侧底步功能区 -->
					<div class="sidebar_bttom">
						<!-- 白天黑夜  打开侧边栏状态-->
						<div class="dayOrNight mt_4" v-if="!collapse">
							<!-- 白天 -->
							<div class="dayOrNight_item" :class="{ activeBg: ThemesStore.themeName == 'light' }" @click="onSetTheme('light')">
								<svg-icon name="light_icon" size="17px" class="mr_8" />
								<span> {{ $t(`home['白天']`) }}</span>
							</div>
							<!-- 黑夜 -->
							<div class="dayOrNight_item" :class="ThemesStore.themeName == 'dark' ? 'darkbg1' : 'darkbg2'" @click="onSetTheme('dark')">
								<svg-icon name="dark_icon" size="17px" class="mr_8" />
								<span> {{ $t(`home['黑夜']`) }}</span>
							</div>
						</div>

						<!-- 白天黑夜  关闭侧边栏状态-->
						<div class="dayOrNight mt_4" v-else>
							<!-- 白天 -->
							<div class="dayOrNight_item" @click="onSetTheme('dark')" v-if="ThemesStore.themeName == 'light'">
								<svg-icon name="light_icon" size="17px" />
							</div>
							<!-- 白天 -->
							<div class="dayOrNight_item" :class="{ activeBg: ThemesStore.themeName == 'dark' }" @click="onSetTheme('light')" v-else>
								<svg-icon name="dark_icon" size="17px" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<activityDialog v-model="showCommonDialog" :title="$t(`activity['温馨提示']`)" :confirm="confirmDialog">
			{{ dialogInfo.message }}
		</activityDialog>
		<activityDialog v-model="showNeedLogin" :title="$t(`activity['温馨提示']`)" :confirm="confirmDialog" :nofooter="false">
			<div>{{ $t(`activity['您的账号暂未登录无法参与活动， 如已有账号请登录，如还未有账号 请前往注册']`) }}</div>
		</activityDialog>
	</div>
</template>

<script setup lang="ts">
import { ThemeKey } from "/@/models/commonInterface";
import Menu from "./components/menu.vue";
import menuSkeleton from "./components/menuSkeleton.vue";
import { computed, onMounted, ref } from "vue";
import { useThemesStore } from "/@/stores/modules/themes";
import { useMenuStore } from "/@/stores/modules/menu";
import activityDialog from "/@/views/activity/components/activityDialog.vue";
import Common from "/@/utils/common";
import { activityApi } from "/@/api/activity";
import { useModalStore } from "/@/stores/modules/modalStore";
const modalStore = useModalStore();
const ThemesStore = useThemesStore();
const MenuStore = useMenuStore();
const showCommonDialog = ref(false);
import { useRouter } from "vue-router";
import { useUserStore } from "/@/stores/modules/user";
import { useActivityStore } from "/@/stores/modules/activity";
import showToast from "/@/hooks/useToast";
import { i18n } from "/@/i18n/index";
const $: any = i18n.global;
const activityStore = useActivityStore();
const router = useRouter();
const dialogInfo: any = ref({});
const isLoading = ref(false);
const showNeedLogin = ref(false);
const ActivitySwitch: any = ref([]);
onMounted(() => {
	queryLobbyLabelActivitySwitch();
});

const queryLobbyLabelActivitySwitch = () => {
	activityApi.queryLobbyLabelActivitySwitch().then((res) => {
		ActivitySwitch.value = res.data.activityTemplate || [];
	});
};
const showSpin = () => {
	if (ActivitySwitch.value.includes("SPIN_WHEEL")) {
		activityApi.getSpindetail().then((res) => {
			activityStore.setCurrentActivityData(res.data);
			modalStore.openModal("SPIN_WHEEL");
		});
	} else {
		showToast($.t(`home['敬请期待']`));
	}
};
const confirmDialog = () => {
	showCommonDialog.value = false;
};
const showTask = () => {
	if (useUserStore().getLogin) {
		modalStore.openModal("TASK");
	} else {
		showNeedLogin.value = true;
	}
};
const showDAILY_COMPETITION = () => {
	if (useUserStore().getLogin) {
		modalStore.openModal("DAILY_COMPETITION");
	} else {
		showNeedLogin.value = true;
	}
};
const onSetTheme = (str: ThemeKey) => {
	ThemesStore.setTheme(str);
};
const collapse = computed(() => {
	const val = MenuStore.getCollapse;
	return val;
});
const changeCollpase = () => {
	const status = collapse.value;
	MenuStore.setCollapse(!status);
};
</script>

<style lang="scss" scoped>
.left_main_header_placeholder {
	height: 64px;
}
.left_scroll::-webkit-scrollbar {
	display: none;
}
.left_main::-webkit-scrollbar {
	display: none;
}

.left_main {
	box-shadow: 4px 0px 12px 0px rgba(14, 16, 19, 0.25);
	position: relative;
	width: 224px;
	transition: all 0.2s ease;
	box-sizing: border-box;
	z-index: 120;
	background: var(--sideBar_bg);
	.left_main_header {
		width: 224px;
		height: 64px;
		z-index: 10;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		.collapse_icon {
			width: 44px;
			height: 44px;
			margin: 12px 10px;
			cursor: pointer;
			&.icon {
				display: flex;
				align-items: center;
				justify-content: center;
				color: var(--Icon-1);
			}
		}
		.logo {
			display: flex;
			align-items: center;
			flex: 1;
			justify-content: center;
		}
	}
	.line1 {
		position: fixed;
		top: 64px;
		left: 6px;
		right: 6px;
		width: 212px;
		background: var(--Line-1);
		height: 1px;
		flex-shrink: 0;
		box-shadow: 0px 1px 0px 0px var(--lineBg);
	}
	.logo {
		cursor: pointer;
	}
	.left_scroll {
		width: 224px;
		box-sizing: border-box;
		cursor: pointer;
		overflow-y: auto;
		height: calc(100vh - 70px);
		transition: all 0.2s ease;
		.left_scroll_conatiner1 {
			padding: 0 8px;
			border-radius: 5px;

			.left_bonus {
				height: 46px;
				display: flex;
				align-items: center;
				padding: 0 20px;
				background: var(--Bg-2);
				color: var(--Text-1);
				border-radius: 4px;
				.left_text1 {
					padding: 0 16px;
				}
			}
			.task_lottery {
				display: flex;
				width: 100%;
				height: 46px;
				margin-bottom: 8px;
				.task_lottery_item {
					width: 100%;
					line-height: 46px;
					background-size: 100% 100%;
					display: flex;
					font-size: 13px;

					.task_lottery_item_text1 {
						color: var(--Text-a);
					}
					img {
						width: 34px;
						height: 34px;
						margin-top: 3px;
						margin-right: 3px;
					}
				}
			}
		}
	}

	.sidebar_bttom {
		background: var(--Bg-1);
		color: var(--Text-1);

		.helpcenter_container {
			width: 100%;
			height: 44px;
			display: flex;
			align-items: center;
			padding: 0 20px;
			border-radius: 4px;
			box-sizing: border-box;
			cursor: pointer;
			background: var(--Bg-2);
			color: var(--Text-1);
			.left_text1 {
				margin-left: 16px;
			}
		}
		.referralcode_conatiner {
			margin: 12px 0;
			padding: 8px;
			border-radius: 4px;
			background: var(--Bg-2);
			color: var(--Text-1);

			.referralcode_row1 {
				display: flex;
				height: 46px;
				padding: 4px 0;
				box-sizing: border-box;
				align-items: center;
				position: relative;
				.referralcode_input1 {
					position: absolute;
					left: 0;
					right: 0;
					height: 42px;
					border: none;
					padding: 0 4px 0 10px;
					background: var(--Bg-1);
					color: var(--Text-1);
				}
				.referralcode_btn1 {
					position: absolute;
					right: 4px;
					height: 38px;
					line-height: 38px;
					padding: 0 26px;
					cursor: pointer;
					background: var(--Butter);
					color: var(--Text-2);
				}
			}
		}
		.dayOrNight {
			display: flex;
			height: 40px;
			width: 100%;
			background: var(--Bg);
			color: var(--Text-1);
			border-radius: 6px;
			border-bottom: 2px solid rgba(#fff, $alpha: 0.05);
			.dayOrNight_item {
				flex: 1;
				height: 100%;
				line-height: 40px;
				text-align: center;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 6px;
				img {
					height: 18px;
					margin-right: 8px;
				}
			}
			.dayOrNight_item.active {
				flex: 1;
				background: var(--Butter);
				color: var(--Text-s);
			}

			.darkbg1 {
				background: var(--Butter);
				color: var(--Text-s);
			}
			.darkbg2 {
				background: var(--Bg-3);
				color: var(--Text-s);
			}
		}
	}

	&.collapse {
		width: 52px;

		.left_main_header {
			width: 52px;
			.collapse_icon {
				color: var(--Text-a);
			}
			.logo {
				display: none;
			}
		}
		.line1 {
			width: 40px;
		}
		.left_scroll {
			width: 52px;
			padding: 0px;
			display: flex;
			flex-direction: column;
			align-items: center;

			.left_scroll_conatiner1 {
				margin: 0px;
				width: 100%;
				padding: 0px;
				display: flex;
				flex-direction: column;
				align-items: center;

				.left_bonus {
					display: none;
				}

				.task_lottery {
					display: block;
					text-align: center;
					height: auto;
					.task_lottery_item {
						width: 100%;
						background: none;

						.task_lottery_item_text1 {
							display: none;
						}
						img {
							height: auto;
							width: 38px;
							margin: 0 auto;
						}
					}
					.task_lottery_item:first-child {
						margin-bottom: 16px;
					}
				}
			}

			.left_scroll_conatiner2 {
				margin: 0px;
				width: 52px;
				padding: 0px;
				display: flex;
				flex-direction: column;
				align-items: center;
			}
		}
		.sidebar_bttom {
			width: 40px;
			transition: width 0.2s ease;
		}
		.referralcode_conatiner {
			display: none;
		}

		.helpcenter_container {
			display: none;
		}

		.dayOrNight {
			display: flex;
			flex-direction: column;
			background: var(--Bg-3);
			width: 40px;
			height: 40px;
			.dayOrNight_item {
				flex: none;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-shrink: 0;
				border-radius: 4px;
				margin-bottom: 16px;

				&:hover {
					background: var(--Bg-1);
				}

				img {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 0;
				}

				.left_icon {
					padding: 0px;
				}

				.left_text1 {
					display: none;
				}
			}
		}
	}
}
</style>
