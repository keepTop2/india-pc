<template>
	<div>
		<div class="left_main" :class="collapse ? 'collapse' : ''">
			<!-- 左侧头 -->
			<div class="left_main_header">
				<div class="left_imgs_collapse collapse_icon icon" @click="changeCollpase">
					<SvgIcon :size="18" :iconName="left_imgs.collapse_icon" class="iconSvg" />
				</div>
				<div class="login_plan" @click="to('/frontPage/home')">
					<img :src="left_imgs.logo" alt="" />
				</div>
			</div>
			<div class="left_main_header_placeholder"></div>
			<!-- 左侧菜单 -->
			<el-scrollbar>
				<div class="left_scroll">
					<div class="left_scroll_conatiner1">
						<!-- 奖金 -->
						<div
							:class="{ activeBg: hoverList.val.includes('/frontPage/bonus') || router.currentRoute.value.path == '/frontPage/bonus' }"
							class="left_bonus"
							@click="to('/frontPage/bonus')"
							@mouseover="onMouseover({ path: '/frontPage/bonus' })"
							@mouseout="onMouseout()"
						>
							<img
								class="left_icon"
								v-show="hoverList.val.includes('/frontPage/bonus') || router.currentRoute.value.path == '/frontPage/bonus'"
								:src="left_imgs.active.bonus_active"
							/>
							<img
								class="left_icon"
								v-show="!hoverList.val.includes('/frontPage/bonus') && router.currentRoute.value.path != '/frontPage/bonus'"
								:src="left_imgs.inactivated.bonus_inactivated"
							/>
							<span :class="{ activeColor: router.currentRoute.value.path == '/frontPage/bonus' || hoverList.val.includes('/frontPage/bonus') }" class="left_text1">
								{{ $t(`layout['layout1']['奖金']`) }}
							</span>
						</div>

						<!-- 任务 抽奖-->
						<div class="task_lottery mt_8">
							<div class="task_lottery_item bg_Bg1" @click="showTask">
								<img :src="left_imgs.rwjj_img" alt="" />
								<span class="fz_14 ml_8 task_lottery_item_text1">{{ $t(`layout['layout1']['任务']`) }} </span>
							</div>

							<div class="task_lottery_item bg_Bg2" @click="showLottery">
								<img :src="left_imgs.choujiang_img" alt="" />
								<span class="fz_14 ml_8 task_lottery_item_text1">{{ $t(`layout['layout1']['抽奖']`) }}</span>
							</div>
						</div>
					</div>

					<!-- 菜单 -->
					<div class="left_scroll_conatiner2">
						<Menu />
					</div>

					<!-- 推荐码 -->
					<div class="referralcode_conatiner mt_173 p_8">
						<div class="referralcode_row1">
							<input class="referralcode_input1 br_4 fz_14" type="text" :placeholder="$t(`layout['layout1']['请输入推荐/促销码']`)" />
							<div class="referralcode_btn1 br_2 fz_14">{{ $t(`layout['layout1']['提交']`) }}</div>
						</div>

						<div class="referralcode_row2 fz_12 mt_4">{{ $t(`layout['layout1']['注:注册后24小时内有效']`) }}</div>
					</div>

					<!-- 帮助中心 -->
					<div
						class="helpcenter_container mt_12"
						:class="{ activeBg: hoverList.val.includes('/frontPage/helpCenter') || router.currentRoute.value.path == '/frontPage/helpCenter' }"
						@click="to('/frontPage/helpCenter')"
						@mouseover="onMouseover({ path: '/frontPage/helpCenter' })"
						@mouseout="onMouseout()"
					>
						<img
							v-show="hoverList.val.includes('/frontPage/helpCenter') || router.currentRoute.value.path == '/frontPage/helpCenter'"
							class="left_icon"
							:src="left_imgs.active.helpcenter_active"
							alt=""
						/>
						<img
							v-show="!hoverList.val.includes('/frontPage/helpCenter') && router.currentRoute.value.path != '/frontPage/helpCenter'"
							class="left_icon"
							:src="left_imgs.inactivated.helpcenter_inactivated"
							alt=""
						/>
						<span class="left_text1" :class="{ activeColor: router.currentRoute.value.path == '/frontPage/helpCenter' || hoverList.val.includes('/frontPage/helpCenter') }">
							{{ $t(`layout['layout1']['帮助中心']`) }}
						</span>
					</div>

					<!-- 白天黑夜 -->
					<div class="dayOrNight mt_12 mb_40">
						<!-- 白天 -->
						<div class="dayOrNight_item" :class="{ activeBg: ThemesStore.themeName == 'dark' }" @click="onSetTheme('dark')">
							<img v-show="ThemesStore.themeName != 'dark'" class="left_icon left_icon2" :src="left_imgs.inactivated.day_inactivated" alt="" />
							<img v-show="ThemesStore.themeName == 'dark'" class="left_icon left_icon2" :src="left_imgs.active.day_active" alt="" />
							<span class="left_text1" :class="{ activeColor: ThemesStore.themeName == 'dark' }"> {{ $t(`layout['layout1']['白天']`) }}</span>
						</div>
						<!-- 黑夜 -->
						<div class="dayOrNight_item" :class="{ activeBg: ThemesStore.themeName == 'default' }" @click="onSetTheme('default')">
							<img v-show="ThemesStore.themeName != 'default'" class="left_icon left_icon2" :src="left_imgs.inactivated.night_inactivated" alt="" />
							<img v-show="ThemesStore.themeName == 'default'" class="left_icon left_icon2" :src="left_imgs.active.night_active" alt="" />
							<span class="left_text1" :class="{ activeColor: ThemesStore.themeName == 'default' }"> {{ $t(`layout['layout1']['黑夜']`) }}</span>
						</div>
					</div>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts">
// import Dialog from "/@/components/Dialog/Dialog.vue";
// import Spin from "/@/components/Spin/Spin.vue";
import { ThemeKey } from "/@/models/commonInterface";
//图片资源
import left_imgs from "./left_imgs";
//菜单
import Menu from "./components/menu.vue";
import { computed, onMounted, ref } from "vue";
import { useThemesStore } from "/@/stores/modules/themes";
import { useMenuStore } from "/@/stores/modules/menu";
import useTo from "/@/hooks/ustTo";
import useMenuHooks from "./useMenuHooks";
import PubSub from "/@/pubSub/pubSub";

const { onMouseover, onMouseout, hoverList, getIconPath } = useMenuHooks();
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
	let html = document.documentElement;
	/*设置element plus的暗黑模式切换*/
	str === "default" ? (html.className = "dark") : (html.className = "");
};

const collapse = computed(() => {
	const val = MenuStore.getCollapse;
	return val;
});
//改变是否缩小状态；
const changeCollpase = () => {
	const status = collapse.value;
	MenuStore.setCollapse(!status);
};
</script>

<style lang="scss" scoped>
@import "./left.scss";

.left_main {
	.login_plan {
		cursor: pointer;
	}

	&.collapse {
		width: 64px;
		overflow-x: hidden;

		.login_plan {
			display: none;
		}

		.left_scroll {
			width: 100%;
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
				@include themeify {
					background: themed("Bg4");
				}

				.left_bonus {
					width: 44px;
					height: 44px;
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 16px 0px;
					background: transparent;

					.left_text1 {
						display: none;
					}
				}

				.task_lottery {
					margin-top: 0px !important;
					flex-direction: column;
					align-items: center;

					.task_lottery_item {
						width: 44px;
						height: 44px;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 16px;

						.task_lottery_item_text1 {
							display: none;
						}

						&.bg_Bg1 {
							@include themeify {
								background: themed("blg1");
							}
						}

						&.bg_Bg2 {
							@include themeify {
								background: themed("blg2");
							}
						}
					}
				}
			}

			.left_scroll_conatiner2 {
				margin: 0px;
				width: 100%;
				padding: 0px;
				display: flex;
				flex-direction: column;
				align-items: center;
			}
		}

		.referralcode_conatiner {
			display: none;
		}

		.helpcenter_container {
			width: 44px;
			height: 44px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 0px !important;
			background: transparent;

			.left_text1 {
				display: none;
			}
		}

		.dayOrNight {
			display: flex;
			flex-direction: column;
			margin-top: 16px !important;

			@include themeify {
				background: themed("Bg4");
			}

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
					@include themeify {
						background: themed("Bg1");
					}
				}

				img {
					display: flex;
					align-items: center;
					justify-content: center;
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
