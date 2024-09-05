<template>
	<div
		class="left_main"
		:class="collapse ? 'collapse' : ''"
		:style="{
			backgroundImage: !collapse ? `url(${Common.getThemeImgPath('layout/sideBar_open.png')})` : `url(${Common.getThemeImgPath('layout/sideBar_close.png')})`,
		}"
	>
		<!-- 左侧头 -->
		<div class="left_main_header">
			<div class="left_imgs_collapse collapse_icon icon" @click="changeCollpase">
				<SvgIcon name="collapse_icon" :class="collapse ? 'active' : ''" width="36px" height="36px" />
			</div>
			<div class="login_plan" @click="to('/')">
				<svg-icon name="logo" width="132px" height="16px" />
			</div>
		</div>
		<div class="line1"></div>
		<!-- 左侧菜单 -->
		<div class="left_scroll">
			<div class="left_scroll_conatiner1">
				<!-- 奖金 -->
				<div class="left_bonus">
					<svg-icon name="bonus_icon" size="18px" />
					<span class="left_text1">
						{{ $t(`common['奖金']`) }}
					</span>
				</div>

				<!-- 任务 抽奖-->
				<div class="task_lottery mt_10">
					<div
						class="task_lottery_item"
						@click="showTask"
						:style="{ backgroundImage: !collapse ? `url(${Common.getThemeImgPath('layout/task_bg.png')})` : '', marginRight: '5px' }"
					>
						<img :src="Common.getThemeImgPath('layout/task_icon.png')" alt="" />
						<span class="fz_14 ml_3 task_lottery_item_text1">{{ $t(`layout['layout1']['任务']`) }} </span>
					</div>

					<div class="task_lottery_item" @click="showLottery" :style="{ backgroundImage: !collapse ? `url(${Common.getThemeImgPath('layout/lottery_bg.png')})` : '' }">
						<img :src="Common.getThemeImgPath('layout/lottery_icon.png')" alt="" />
						<span class="fz_14 ml_3 task_lottery_item_text1">{{ $t(`layout['layout1']['抽奖']`) }}</span>
					</div>
				</div>
				<!-- 菜单 -->
				<div class="left_scroll_conatiner2">
					<Menu />
				</div>
			</div>
		</div>

		<!-- 左侧底步功能区 -->
		<div class="sidebar_bttom">
			<!-- 帮助中心 -->
			<div class="helpcenter_container" @click="to('/helpCenter')">
				<svg-icon name="help_icon" size="17px" />
				<span class="left_text1">
					{{ $t(`layout['layout1']['帮助中心']`) }}
				</span>
			</div>

			<!-- 推荐码 -->
			<div class="referralcode_conatiner">
				<div class="referralcode_row1 br_4">
					<input class="referralcode_input1 fz_14 br_4" type="text" :placeholder="$t(`layout['layout1']['请输入推荐/促销码']`)" />
					<div class="referralcode_btn1 fz_14 br_4">{{ $t(`layout['layout1']['提交']`) }}</div>
				</div>
				<div class="referralcode_row2 fz_12 mt_4">{{ $t(`layout['layout1']['注:注册后24小时内有效']`) }}</div>
			</div>
			<!-- 白天黑夜  打开侧边栏状态-->
			<div class="dayOrNight mt_12 mb_10" v-if="!collapse">
				<!-- 白天 -->
				<div class="dayOrNight_item" :class="{ activeBg: ThemesStore.themeName == 'light' }" @click="onSetTheme('light')">
					<svg-icon name="light_icon" size="17px" class="mr_8" />
					<span class="left_text1" :class="{ activeColor: ThemesStore.themeName == 'light' }"> {{ $t(`layout['layout1']['白天']`) }}</span>
				</div>
				<!-- 黑夜 -->
				<div class="dayOrNight_item" :class="{ activeBg: ThemesStore.themeName == 'dark' }" @click="onSetTheme('dark')">
					<svg-icon name="dark_icon" size="17px" class="mr_8" />
					<span class="left_text1" :class="{ activeColor: ThemesStore.themeName == 'dark' }"> {{ $t(`layout['layout1']['黑夜']`) }}</span>
				</div>
			</div>

			<!-- 白天黑夜  关闭侧边栏状态-->
			<div class="dayOrNight mt_12 mb_10" v-else>
				<!-- 白天 -->
				<div class="dayOrNight_item" :class="{ activeBg: ThemesStore.themeName == 'dark' }" @click="onSetTheme('light')" v-if="ThemesStore.themeName == 'dark'">
					<svg-icon name="light_icon" size="17px" />
				</div>
				<!-- 白天 -->
				<div class="dayOrNight_item" :class="{ activeBg: ThemesStore.themeName == 'light' }" @click="onSetTheme('dark')" v-else>
					<svg-icon name="dark_icon" size="17px" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ThemeKey } from "/@/models/commonInterface";
import Menu from "./components/menu.vue";
import { computed, onMounted } from "vue";
import { useThemesStore } from "/@/stores/modules/themes";
import { useMenuStore } from "/@/stores/modules/menu";
import useTo from "/@/hooks/ustTo";
import useMenuHooks from "./useMenuHooks";
import PubSub from "/@/pubSub/pubSub";
import Img from "/@/components/Img/index.vue";
import Common from "/@/utils/common";
const { to, router } = useTo();
const ThemesStore = useThemesStore();
const MenuStore = useMenuStore();

onMounted(() => {});

const showLottery = () => {
	PubSub.publish(PubSub.PubSubEvents.LotteryEvents.LotteryDialogSwitch.eventName, PubSub.PubSubEvents.LotteryEvents.LotteryDialogSwitch.params.show);
};

const showTask = () => {
	PubSub.publish(PubSub.PubSubEvents.TaskEvents.TaskDialogSwitch.eventName, true);
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
	width: 260px;
	transition: all 0.2s ease;
	box-sizing: border-box;
	z-index: 1;
	.left_main_header {
		width: 260px;
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
				color: var(--Icon_1);
			}
		}
		.login_plan {
			display: flex;
			align-items: center;
			flex: 1;
			justify-content: center;
		}
	}
	.line1 {
		position: fixed;
		top: 64px;
		left: 0;
		right: 0;
		width: 260px;
		background: var(--Line_1);
		box-shadow: 0px 1px 0px 0px #343d48;

		height: 1px;
		flex-shrink: 0;
	}
	.login_plan {
		cursor: pointer;
	}
	.left_scroll {
		width: 260px;
		box-sizing: border-box;
		cursor: pointer;
		transition: all 0.2s ease;

		.left_scroll_conatiner1 {
			padding: 8px;
			margin: 16px auto;
			border-radius: 5px;
			.left_bonus {
				height: 46px;
				display: flex;
				align-items: center;
				padding: 0 20px;
				background: var(--Bg2);
				color: var(--Text1);
				border-radius: 4px;
				.left_text1 {
					padding: 0 16px;
				}
			}
			.task_lottery {
				display: flex;
				width: 100%;
				height: 46px;
				margin-bottom: 16px;
				.task_lottery_item {
					width: 100%;
					line-height: 46px;
					background-size: 100% 100%;
					display: flex;
					font-size: 13px;

					.task_lottery_item_text1 {
						color: var(--Text_a);
					}
					img {
						height: 41px;
						margin-left: 10px;
						margin-top: -5px;
					}
				}
			}
		}
	}

	.sidebar_bttom {
		width: 260px;
		padding: 10px;
		box-sizing: border-box;
		transition: width 0.2s ease;
		background: var(--Bg1);
		color: var(--Text1);

		.helpcenter_container {
			width: 100%;
			height: 44px;
			display: flex;
			align-items: center;
			padding: 0 20px;
			border-radius: 4px;
			box-sizing: border-box;
			cursor: pointer;
			background: var(--Bg2);
			color: var(--Text1);
			.left_text1 {
				margin-left: 16px;
			}
		}
		.referralcode_conatiner {
			margin: 12px 0;
			padding: 8px;
			border-radius: 4px;
			background: var(--Bg2);
			color: var(--Text1);

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
					background: var(--Bg1);
					color: var(--Text1);
				}
				.referralcode_btn1 {
					position: absolute;
					right: 4px;
					height: 38px;
					line-height: 38px;
					padding: 0 26px;
					cursor: pointer;
					background: var(--butter);
					color: var(--Text2);
				}
			}
		}
		.dayOrNight {
			display: flex;
			height: 46px;
			width: 100%;
			background: var(--Bg2);
			color: var(--Text1);
			.dayOrNight_item {
				flex: 1;
				height: 100%;
				line-height: 46px;
				text-align: center;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				img {
					height: 18px;
					margin-right: 8px;
				}
			}
			.dayOrNight_item.active {
				flex: 1;
				background: var(--butter);
				color: var(--Text_s);
			}
			.activeBg {
				background: var(--butter);
			}
		}
	}

	&.collapse {
		width: 64px;
		overflow-x: hidden;
		.left_main_header {
			.collapse_icon {
				color: var(--Text_a);
			}
			.login_plan {
				display: none;
			}
		}
		.line1 {
			width: 64px;
		}
		.left_scroll {
			width: 64px;
			padding: 0px;
			display: flex;
			flex-direction: column;
			align-items: center;
			height: calc(100% - 167px);
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
				width: 64px;
				padding: 0px;
				display: flex;
				flex-direction: column;
				align-items: center;
			}
		}
		.sidebar_bttom {
			width: 44px;
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
			margin-top: 16px !important;
			background: var(--Bg4);

			.dayOrNight_item {
				width: 44px;
				height: 44px;
				flex: none;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-shrink: 0;
				border-radius: 4px;
				margin-bottom: 16px;

				&:hover {
					background: var(--Bg1);
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
