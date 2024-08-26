<!--
 * @Author: WangMingxin
 * @Description: 基础游戏卡片
-->
<template>
	<div class="gameCard">
		<div class="collect" v-if="gameData.status != 2" @click="clickCollect">
			<SvgIcon v-if="gameData.collect" iconName="collect2" class="collectSvg" />
			<div class="unCollect" v-else>
				<SvgIcon iconName="collect" class="collectSvg" :size="12" />
			</div>
		</div>
		<div class="detail">
			<div class="image-plan" @click="gameClick">
				<el-image :src="gameData.pcIcon" :lazy="lazy" :key="gameData.id" />
				<div class="egis" v-if="gameData.status == 2">
					<div class="leftTip-plan">
						<span>{{ $t(`gameList.gameCard['维护中']`) }}</span>
					</div>
					<div class="msg">
						<h6>{{ $t(`gameList.gameCard['维护时间']`) }}</h6>
						<p>{{ gameData.maintenanceStartTime }}</p>
						<p class="icon">——</p>
						<p>{{ gameData.maintenanceEndTime }}</p>
					</div>
				</div>
			</div>
			<div class="footer">
				<p class="name">{{ gameData.name }}</p>
				<div class="help" v-if="help">
					<Popover :title="$t(`gameList['游戏备注']`)" :text-content="gameData.remark"></Popover>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue';
import pubSub from '/@/pubSub/pubSub';
import { Notification } from '/@/components/index';
import { Popover } from './commoments/popover';
import Common from '/@/utils/common';
import { CasionApi } from '/@/api/menu/casion/casion';
import { useUserStore } from '/@/stores/modules/user';
import { useRouter, useRoute } from 'vue-router';
import moment from 'moment-timezone';

import { i18n } from '/@/i18n/index';
const $: any = i18n.global;

const UserStore = useUserStore();

const emit = defineEmits(['clickCollect']);
const router = useRouter();
const route = useRoute();
interface CardItemType {
	/** id */
	id?: string | any;
	/** 是否收藏  */
	collect: boolean;
	/** 是否维护 1:开启中,2:维护中,3:已禁用 */
	status: string | number;
	remark: string;
	name: string;
	maintenanceStartTime: string;
	sort: number | null;
	maintenanceEndTime: string;
	pcIcon: string;
	/**场馆 */
	venueCode: string;
	/**游戏 code */
	gameCode: string;

}

class CardClass implements CardItemType {
	id?: string = '';
	collect = false;
	status = 1;
	remark = '';
	name = '游戏名称';
	maintenanceStartTime = '10.30 00:00';
	sort = null;
	maintenanceEndTime = '10.31 23:59';
	pcIcon = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg';
	venueCode = "";
	gameCode = "";
}

//游戏卡片
interface gameCard {
	lazy?: boolean,
	/** 是否拥有帮助 */
	help?: boolean;
	/** 游戏对象 */
	CardItem: CardClass;
}

const props = withDefaults(defineProps<gameCard>(), {
	lazy: true,
	help: true,
	CardItem: () => {
		return {} as CardClass;
	},
});
//转内部对象；可操作属性
const gameData = ref({
	...props.CardItem,
	maintenanceStartTime: moment(props.CardItem.maintenanceStartTime).format('MM.DD HH:mm'),
	maintenanceEndTime: moment(props.CardItem.maintenanceEndTime).format('MM.DD HH:mm'),
});
watch(
	() => props.CardItem,
	(newValue, oldValue) => {
		gameData.value = Object.assign(gameData.value, newValue);
		gameData.value.maintenanceStartTime = moment(newValue.maintenanceStartTime).format('MM.DD HH:mm')
		gameData.value.maintenanceEndTime = moment(newValue.maintenanceEndTime).format('MM.DD HH:mm')
	}
);

const showLogin = () => {
	nextTick(() => {
		//发布登陆弹窗事件
		pubSub.publish(pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.eventName, pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.params[1]);
		Notification({
			title: $.t('gameList["提示"]'),
			content: $.t('gameList["请登陆后再进行收藏"]'),
		});
	});
};
/**游戏收藏或者取消收藏 */
const clickCollect = async () => {
	// pubSub.publish('showOrHiddenLoginDialog', 1);
	const { token } = UserStore.getUserInfo;
	if (token) {
		// if (gameData.value.collect) {
		// } else {
		// }
		let params: any = {
			gameId: gameData.value.id,
			type: !gameData.value.collect,
		};
		const res: any = await CasionApi.gameCollection(params).catch((err: any) => err);
		const { code, data } = res;
		if (code == Common.ResCode.SUCCESS) {
			if (data == 1) {
				gameData.value.collect = !gameData.value.collect;
			}
		}
	} else {
		showLogin();
	}
	emit('clickCollect', props.CardItem);
};

/** 游戏图片区域点击 */
const gameClick = () => {
	// const { token } = UserStore.getUserInfo;
	// if (token) {

	//游戏状态必须在开启中才能点击游戏
	if (gameData.value.status == 1) {
		const params = {
			id: gameData.value.id,
			collect: gameData.value.collect,
			name: gameData.value.name,
			venueCode: gameData.value.venueCode,
			gameCode: gameData.value.gameCode,
		}
		const routeParam: any = {
			path: '/menu/casino/gameDetail/' + gameData.value.id,
			query: { ...params },
		};
		router.push(routeParam);
	}

	// } else {
	// 	showLogin();
	// }
}


</script>

<style lang="scss" scoped>
.gameCard {
	width: 190px;
	position: relative;
	border-radius: 12px;
	// background: var(--Tag1-N, #31333a);
	// overflow: hidden;
	cursor: pointer;

	@include themeify {
		background-color: themed('Tag1');
	}

	.collect {
		position: absolute;
		right: 10px;
		top: 10px;
		width: 24px;
		height: 24px;
		z-index: 1;

		.unCollect {
			width: 24px;
			height: 24px;
			border-radius: 50%;
			position: relative;
			background-color: rgba(0, 0, 0, 0.7);
			display: flex;
			justify-content: center;
			align-items: center;

			.collectSvg {
				width: 14px;
			}
		}

		.collectSvg {
			width: 100%;
			height: 100%;
			vertical-align: top;
			color: #fff;
			// @include themeify {
			// 	color: themed('Text_s');
			// 	// background-color: themed('Theme');
			// }
		}
	}

	.detail {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		height: 100%;

		.image-plan {
			width: 100%;
			flex: 1;
			position: relative;
			min-height: 190px;
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			border-top-left-radius: 12px;
			border-top-right-radius: 12px;
			overflow: hidden;


			:deep() {
				.el-image {
					width: 100%;
					height: 100%;

					.el-image__error,
					.el-image__inner,
					.el-image__placeholder,
					.el-image__wrapper {
						user-select: none;
						-webkit-user-drag: none;
						width: 100%;
						height: 190px;
					}
				}
			}

			.egis {
				position: absolute;
				width: 100%;
				height: 100%;
				z-index: 1;
				top: 0;
				left: 0;
				background: rgba(0, 0, 0, 0.8);
				backdrop-filter: blur(4px);
				padding-top: 25px;
				box-sizing: border-box;

				.leftTip-plan {
					position: absolute;
					left: 0;
					top: 0;
					z-index: 10;

					span {
						display: block;
						padding: 2px 15px;
						// background: var(--Theme, #3bc116);
						border-radius: 12px 0 12px 0;
						// color: var(--TB-P, #fdfdfd);
						text-align: center;
						font-family: 'PingFang SC';
						font-size: 18px;
						font-style: normal;
						font-weight: 400;
						line-height: normal;

						@include themeify {
							color: themed('TB');
							background-color: themed('Theme');
						}
					}
				}

				.backSvg {
					width: 100%;
					height: 100%;
					flex-shrink: 0;
					position: absolute;
					display: flex;
					align-items: center;
					justify-content: center;
					top: 0;

					.Vector {
						width: 100%;
						height: 100%;
					}
				}

				.msg {
					position: relative;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					z-index: 1;
					width: 100%;
					height: 100%;

					h6 {
						margin-bottom: 8px;
						font-size: 24px;
						font-weight: 600;
					}

					h6,
					p {
						color: var(--TB-P, #fdfdfd);
						text-align: center;
						font-family: 'PingFang SC';
						font-size: 20px;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
						// @include themeify {
						// 	color: themed('TB');
						// }
					}

					.icon {
						font-size: 12px;
						margin: 0;
					}

					:deep() {
						.van-icon {
							// color: var(--TB-P, #fdfdfd);

							font-size: 14px;

							@include themeify {
								color: themed('TB');
							}
						}
					}
				}
			}
		}

		.footer {
			display: flex;
			justify-content: space-between;
			align-content: center;

			width: 190px;
			height: 52px;
			flex-shrink: 0;
			padding: 0px 12px;
			box-sizing: border-box;
			border-radius: 0px 0px 12px 12px;

			// background: var(--Bg1-1, #24262b);
			@include themeify {
				background-color: themed('Bg1');
			}

			.name {
				// color: var(--Text1-1, #98a7b5);
				font-family: 'PingFang SC';
				font-size: 14px;
				font-style: normal;
				font-weight: 500;
				text-transform: lowercase;
				vertical-align: middle;
				line-height: 52px;

				@include themeify {
					color: themed('Text1');
				}
			}

			.help {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
}
</style>
