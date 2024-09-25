<template>
	<div class="shopCart" v-if="!isOrdered">
		<div class="header-container" @click="changeShopCart">
			<div class="left">
				<span class="label">投注单</span>
				<span class="num_total" v-if="sportsBetEvent.sportsBetEventData.length">{{ sportsBetEvent.sportsBetEventData.length }}</span>
				<span class="arrow"><svg-icon name="sports-arrow_card_header" width="12px" height="8px"></svg-icon></span>
			</div>
			<div class="right">
				<div class="sportsBetEventData" @click.stop="refreshBalance">
					<!-- 余额 -->
					<span class="stake">{{ Common.formatAmount(Number(sportsBetInfo.balance)) }}</span>
					<span class="refresh_icon" :class="{ rotateAn: isRotating }" @animationend="handleAnimationEnd"><svg-icon name="sports-refresh" size="18px"></svg-icon></span>
				</div>
				<span v-if="ShopCatControlStore.getShopCatShow" class="close_icon" @click.stop="onClickClear"><svg-icon name="sports-close" size="30px"></svg-icon></span>
			</div>
		</div>
		<div v-if="ShopCatControlStore.getShopCatShow" class="container-main">
			<div class="noData" v-if="!sportsBetEvent.sportsBetEventData.length">
				<span> 请完成您的下注 </span>
			</div>
			<!-- 购物车 -->
			<div class="shop-plan" v-else>
				<div class="card-all" ref="cardAllRef">
					<!-- 单注 -->
					<template v-if="sportsBetEvent.sportsBetEventData.length == 1">
						<SinglePass ref="singlePassRef" />
					</template>
					<!-- 串关下注 -->
					<template v-if="sportsBetEvent.sportsBetEventData.length > 1">
						<MoreShop ref="moreShopRef" :sportsBetEventData="sportsBetEvent?.sportsBetEventData" />
					</template>
				</div>
				<!-- 到底部的箭头 -->
				<!-- <img class="left_arrow" :src="left_arrow" alt="" v-show="showArrow" @click="scrollToBottom" /> -->

				<div class="bottom">
					<div class="part1">
						<template v-if="sportsBetEvent.sportsBetEventData.length <= 1">
							<div class="auth">
								<!-- <el-checkbox v-if="oddsOption == 1" v-model="oddsOptionIsAccept" label="自动接受较优赔率" @change="onOddsOptionIsAccept(2)" />
								<el-checkbox v-if="oddsOption == 2" v-model="oddsOptionIsAccept" label="自动接受较优赔率" @change="onOddsOptionIsAccept(1)" /> -->
								<span v-if="oddsOption == 1" class="checkbox">
									<span class="icon"><svg-icon :name="oddsOptionIsAccept ? 'sports-checkbox' : 'sports-checkbox_active'" size="18px"></svg-icon></span>
									<span class="label">自动接受较优赔率</span>
								</span>
								<span v-if="oddsOption == 2" class="checkbox">
									<span class="icon"><svg-icon :name="oddsOptionIsAccept ? 'sports-checkbox' : 'sports-checkbox_active'" size="18px"></svg-icon></span>
									<span class="label">自动接受较优赔率</span>
								</span>
							</div>
						</template>

						<template v-if="sportsBetEvent.sportsBetEventData.length > 1">
							<div class="auth">
								<!-- <el-checkbox v-if="priceOption == 1" v-model="priceOptionIsAccept" label="自动接受较优赔率" @change="onPriceOptionIsAccept(1)" /> -->
								<span v-if="priceOption == 1" class="checkbox">
									<span class="icon"><svg-icon :name="priceOptionIsAccept ? 'sports-checkbox' : 'sports-checkbox_active'" size="18px"></svg-icon></span>
									<span class="label">自动接受较优赔率</span>
								</span>
							</div>
						</template>
						<planButton v-model:isAccept="isAccept" v-model:isChange="isChange" :maxWinnable="maxWinnable"></planButton>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- <auth-hint-dialog v-model="hintVisible" /> -->

	<!-- 下单结束 -->
	<template v-if="isOrdered">
		<!-- 单关投注返回结果 -->
		<SingleOrderStatus v-if="sportsBetEvent.sportsBetEventData.length == 1"> </SingleOrderStatus>
		<!-- 串关投注返回结果 -->
		<MoreOrderStatus v-if="sportsBetEvent.sportsBetEventData.length > 1"> </MoreOrderStatus>
	</template>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from "vue";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { MoreShop, planButton, SinglePass, SingleOrderStatus, MoreOrderStatus } from "./components/index";
import Common from "/@/utils/common";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import { getIndexInfo } from "/@/views/sports/utils/commonFn";

const sportsBetInfo = useSportsBetInfoStore();
const ShopCatControlStore = useShopCatControlStore();
const sportsBetEvent = useSportsBetEventStore();
const isRotating = ref(false);

/** 是否接受赔率变动  */
const isAccept = ref(false);
/** 单关接受赔率变动  */
const oddsOptionIsAccept = ref(false);
/** 串关接受赔率变动  */
const priceOptionIsAccept = ref(false);

/** 个人余额 */
const balance = ref();

/**单下注 */
const singlePassRef = ref();
/** 多单下单 */
const moreShopRef = ref();
/*赔率是否发生了变化*/
const isChange = ref(false);
/*最高可赢*/
const maxWinnable: any = ref(0);

/**  是否下单结束 */
const isOrdered = ref(false);
/** 按钮是否禁用中 */
const btnDisabled = ref(false);

const cardAllRef = ref(null);

onMounted(() => {
	// 请求余额信息
	getIndexInfo();
	// 请求赔率设置
	// getPublicSetting();
});

// 监听购物车赛事变化
watch(
	() => sportsBetEvent.sportsBetEventData.length,
	(newValue, oldValue) => {
		// 长度变化则监听
		if (newValue == 1 && !oldValue) {
			// 首次有赛事加入开启弹窗
			ShopCatControlStore.setShopCatShow(true);
		}
		// 判断购物车弹窗层开启的时候 购物车赛事发生变化 则重新开关线程发起推送
		// 还需要判断购物车赛事信息是否有 需要赛事信息大于0
		if (ShopCatControlStore.getShopCatShow && newValue > 0) {
			// 开启线程
			sportsBetEvent.sportsOpenSse();
		}
		/**订单度发生变化时 （重置订单状态）*/
		isOrdered.value = false;
		nextTick(() => {});
		/** 长度小于0时 清除改动记录 */
		if (!newValue) {
			isChange.value = false;
		}
	}
);

/*购物车隐藏时 关闭错误弹框*/
watch(
	() => ShopCatControlStore.getShopCatShow,
	(newValue) => {}
);

// 刷新余额交互
const refreshBalance = () => {
	if (isRotating.value) {
		return;
	}
	// 触发旋转动画
	isRotating.value = true;
	getIndexInfo();
};

// 动画结束时，移除旋转效果
function handleAnimationEnd() {
	isRotating.value = false;
}

// 打开关闭弹窗
const changeShopCart = () => {
	if (ShopCatControlStore.getShopCatShow) {
		ShopCatControlStore.setShopCatShow(false);
	} else {
		ShopCatControlStore.setShopCatShow(true);
	}
};

// 关闭弹窗
const onClickClear = () => {
	ShopCatControlStore.setShopCatShow(false);
};
</script>

<style scoped lang="scss">
.shopCart {
	width: 520px;
	min-height: 100%;
	background: var(--Bg1);
	color: var(--Text_s);
	box-shadow: 0px -3px 30px 0px rgba(14, 16, 19, 0.4);
	border-radius: 4px;
	box-sizing: border-box;

	.header-container {
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 15px;
		cursor: pointer;

		.left {
			display: flex;
			gap: 8px;

			.label {
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 16px;
				font-weight: 500;
			}

			.num_total {
				width: 21px;
				height: 21px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: var(--Theme);
				font-size: 14px;
				color: #fff;
				border-radius: 50%;
			}

			.arrow {
				width: 12px;
				height: 8px;
				transition: 0.3s ease;
			}
		}

		.right {
			display: flex;
			align-items: center;
			gap: 10px;

			.sportsBetEventData {
				height: 34px;
				display: flex;
				align-items: center;
				padding: 8px 10px;
				border-radius: 34px;
				gap: 10px;
				background: var(--Bg3);
				color: var(--Theme);
				cursor: pointer;

				.stake {
					text-align: right;
					font-family: "DIN Alternate";
					font-size: 14px;
					font-style: normal;
					font-weight: 700;
					line-height: normal;
					color: var(--Text_s) !important;
				}
				.refresh_icon {
					width: 18px;
					height: 18px;
				}
			}
			.close_icon {
				width: 30px;
				height: 30px;
			}
		}
	}

	.container-main {
		position: relative;
		overflow-y: hidden;
		padding: 10px 15px 15px;

		&::after {
			position: absolute;
			content: "";
			top: 0px;
			left: 0px;
			width: 100%;
			height: 1px;
			background-color: var(--Line_1);
			box-shadow: 0px 1px 0px 0px #343d48;
		}
	}

	.noData {
		padding: 18px 0;
		text-align: center;
		font-size: 14px;
		color: var(--Text1);
	}

	.bottom {
		padding: 10px 15px 15px;
		border-radius: 8px;
		background: var(--Bg4);
		.part1 {
			.auth {
				.checkbox {
					width: fit-content;

					display: flex;
					align-items: center;
					gap: 10px;
					cursor: pointer;
					.icon {
						width: 18px;
						height: 18px;
						color: var(--Bg5);
					}
					.label {
						color: var(--Text1);
						font-family: "PingFang SC";
						font-size: 14px;
						font-weight: 400;
						line-height: 20px;
					}
				}
			}
		}

		.part2 {
			margin: 5px 0;
			padding-top: 15px;

			.el-button {
				margin: 5px 0;
			}

			.confirming {
				& > .el-button:last-child {
					border: 1px solid var(--Theme);
					background: var(--Bg3);
					color: var(--Theme);
				}
			}
		}
	}
}

.shop-plan {
	display: grid;
	gap: 6px;
}

.card-all {
	display: grid;
	gap: 6px;
	overflow: auto;
	max-height: 420px;
	position: relative;
	&::-webkit-scrollbar {
		display: none;
	}
}
.left_arrow {
	position: absolute;
	bottom: 20%;
	left: 48%;
	width: 22px;
	height: 16px;
	transform: rotate(-90deg);
	cursor: pointer;
}

.rotate {
	transform: rotate(180deg);
}

.rotateAn {
	transform-origin: 50% 50%;
	animation: reflash 1s linear 1;
}

@keyframes reflash {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
