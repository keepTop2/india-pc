<template>
	<div class="shopCart" :class="[ShopCatControlStore.getShopCatShow && sportsBetEvent.sportsBetEventData.length ? 'shop-cart-show' : 'shop-cart-hide']" v-if="!isOrdered">
		<!-- 头部信息 -->
		<div class="header-container" @click="changeShopCart">
			<div class="left">
				<span class="label">投注单</span>
				<span v-if="sportsBetEvent.sportsBetEventData.length > 0" class="num_total" :class="{ shake: isShaking }" @animationend="totalAnimationEnd">{{
					sportsBetEvent.sportsBetEventData.length
				}}</span>
				<span class="arrow" :class="{ up_arrow: ShopCatControlStore.getShopCatShow }"><svg-icon name="sports-arrow_card_header" width="12px" height="8px"></svg-icon></span>
			</div>
			<div class="right">
				<!-- 余额信息 -->
				<div class="sportsBetEventData" @click.stop="refreshBalance">
					<span class="stake">{{ Common.formatAmount(Number(sportsBetInfo.balance)) }}</span>
					<span class="refresh_icon" :class="{ rotateAn: isRotating }" @animationend="handleAnimationEnd"><svg-icon name="sports-refresh" size="18px"></svg-icon></span>
				</div>
			</div>
		</div>
		<transition name="fade">
			<div class="container-main" ref="containerMain">
				<div class="main" ref="main">
					<!-- 无赛事时展示 -->
					<div class="noData" v-if="!sportsBetEvent.sportsBetEventData.length"><span> 请完成您的下注 </span></div>
					<!-- 购物车赛事列表 -->
					<div class="shop-plan" v-else>
						<div class="event-list" ref="container" @scroll="checkScroll">
							<!-- 赛事列表 单关串关公用 -->
							<EventCard v-for="(data, index) in sportsBetEvent.sportsBetEventData" :key="index" :shopData="data" :hasClose="true" />
							<!-- 单关表单 -->
							<SingleTicketFrom v-if="sportsBetEvent.sportsBetEventData.length == 1" />
							<!-- 串关表单 -->
							<ParlayTicketsFrom v-if="sportsBetEvent.sportsBetEventData.length > 1" />
							<!-- 指示箭头 -->
							<img v-if="arrowShow" class="left_arrow" :src="left_arrow" />
						</div>
						<div class="footer-container">
							<!-- 单关投注按钮 -->
							<SingleTicketFooter v-if="sportsBetEvent.sportsBetEventData.length == 1" @singleTicketSuccess="getSingleTicketSuccess" />
							<!-- 串关键盘按钮 -->
							<ParlayTicketsFooter v-if="sportsBetEvent.sportsBetEventData.length > 1" @parlayTicketsSuccess="getParlayTicketsSuccess" />
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>

	<!-- 下单结束 -->
	<template v-if="isOrdered">
		<!-- 单关投注返回结果 -->
		<SingleTicketFinish v-if="sportsBetEvent.sportsBetEventData.length == 1" :data="state.singleTicketSuccess" @onOrderConfirm="onOrderConfirm" />
		<!-- 串关投注返回结果 -->
		<ParlayTicketsFinish v-if="sportsBetEvent.sportsBetEventData.length > 1" :data="state.parlayTicketsSuccess" @onOrderConfirm="onOrderConfirm" @onSecondBet="onSecondBet" />
	</template>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import left_arrow from "/@/assets/zh-CN/sports/left_arrow.gif";
import { EventCard, SingleTicketFrom, ParlayTicketsFrom, SingleTicketFooter, ParlayTicketsFooter, SingleTicketFinish, ParlayTicketsFinish } from "./components/index";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import Common from "/@/utils/common";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import { getBetOrderId } from "/@/views/sports/utils/commonFn";
import { useUserStore } from "/@/stores/modules/user";
import shopCartPubSub from "/@/views/sports/hooks/shopCartPubSub";
const sportsBetInfo = useSportsBetInfoStore();
const ShopCatControlStore = useShopCatControlStore();
const sportsBetEvent = useSportsBetEventStore();
const UserStore = useUserStore();
const isRotating = ref(false);

const isShaking = ref(false); // 创建一个响应式变量，用于控制摇摆动画的状态

/**  是否下单结束 */
const isOrdered = ref(false);
const container = ref<HTMLElement | null>(null);
const hasScrollbar = ref(false);
const arrowShow = ref(false);

const containerMain = ref<HTMLElement | null>(null);
const main = ref<HTMLElement | null>(null);
let observer: MutationObserver | null = null;

const state = reactive({
	singleTicketSuccess: {}, // 单关下注详情
	parlayTicketsSuccess: {}, // 串关下注详情
});

onMounted(() => {
	// 判断token状态
	if (UserStore.getUserInfo.token) {
		// 请求余额信息
		getBetOrderId();
	}
});

// 监听购物车赛事变化
watch(
	() => sportsBetEvent.sportsBetEventData.length,
	(newValue, oldValue) => {
		// 长度变化则监听
		if (newValue === 1 && !oldValue) {
			// 首次有赛事加入开启弹窗
			ShopCatControlStore.setShopCatShow(true);
		}
		// 当购物车弹窗层开启时，判断赛事数量变化
		if (ShopCatControlStore.getShopCatShow) {
			// 在 nextTick 中获取高度
			nextTick(() => {
				getHasScrollbar();
			});
			// 开启线程
			if (newValue > 0) {
				isShaking.value = true;
				sportsBetEvent.sportsOpenSse();
			}
		}
		// 添加赛事发生变化，清空购物车计算 缓存数值
		shopCartPubSub.initializeState();
	}
);

/* 购物车隐藏时关闭错误弹框 */
watch(
	() => ShopCatControlStore.getShopCatShow,
	(newValue) => {
		if (newValue) {
			// 初始化 MutationObserver 并开始监听
			initializeObserver();
		} else if (observer) {
			// 当购物车隐藏时断开观察器
			observer.disconnect();
		}

		nextTick(() => {
			handleContainerHeight(newValue); // 处理高度
			getHasScrollbar();
		});
	}
);

// 在组件卸载前断开观察器
onBeforeUnmount(() => {
	if (observer) {
		observer.disconnect();
	}
});

// 控制高度的函数
const handleContainerHeight = (isVisible: any) => {
	if (main.value) {
		if (isVisible) {
			nextTick(() => {
				const height = main.value?.scrollHeight; // 获取内容的实际高度
				containerMain.value.style.height = `${height}px`; // 设置 containerMain 的高度
			});
		} else {
			containerMain.value.style.height = "0"; // 隐藏内容
		}
	}
};

// 初始化 MutationObserver 的函数，用于监听子节点的变化
const initializeObserver = () => {
	// 创建一个 MutationObserver 实例，并定义当监控的 DOM 发生变化时执行的回调函数
	observer = new MutationObserver(() => {
		// 当被观察的元素的内容或属性发生变化时，调用 handleContainerHeight(true) 来调整 containerMain 的高度
		handleContainerHeight(true);
	});
	// 检查 main 元素是否存在
	if (main.value) {
		// 通过 observer.observe() 方法开始观察 main 元素
		observer.observe(main.value, {
			// 监听子节点的添加或删除操作
			childList: true,
			// 监听子节点及后代节点的变化
			subtree: true,
			// 监听元素属性的变化，例如 class、style 等
			attributes: true,
		});
	}
};

// 判断是否出现滚动条
const getHasScrollbar = () => {
	const element = container.value;
	if (element) {
		// 允许 scrollHeight 和 clientHeight 之间的差异在 2px 以内
		const hasVerticalScrollbar = Math.abs(element.scrollHeight - element.clientHeight) > 2;
		hasScrollbar.value = hasVerticalScrollbar;
		// 根据是否有滚动条来控制 arrowShow
		arrowShow.value = hasVerticalScrollbar;
	}
};

const checkScroll = () => {
	const element = container.value;
	if (element) {
		const hasScrollbar = element.scrollHeight > element.clientHeight;
		// 允许一个 2px 的误差范围
		const isAtBottom = Math.abs(element.scrollTop + element.clientHeight - element.scrollHeight) <= 2;
		// 根据是否有滚动条和是否滚动到底部来控制 arrowShow
		arrowShow.value = hasScrollbar && !isAtBottom;
	}
};

/**
 * @description 单关请求回调执行
 */
const getSingleTicketSuccess = (result: any) => {
	sportsBetEvent.closeShopCart(); // 关闭购物车弹窗
	isOrdered.value = true; // 开启投注成功注单列表
	state.singleTicketSuccess = result;
};

/**
 * @description 串关请求回调执行
 */
const getParlayTicketsSuccess = (result: any) => {
	sportsBetEvent.closeShopCart(); // 关闭购物车弹窗
	isOrdered.value = true;
	state.parlayTicketsSuccess = result;
};

// 刷新余额交互
const refreshBalance = () => {
	if (isRotating.value) {
		return;
	}
	// 刷新余额
	useUserStore().initUserInfo();
	// 触发旋转动画
	isRotating.value = true;
};

// 打开关闭弹窗
const changeShopCart = () => {
	ShopCatControlStore.setShopCatShow(!ShopCatControlStore.getShopCatShow);
};

/**
 * @description 二次投注执行
 */
const onSecondBet = () => {
	// 开启线程
	sportsBetEvent.sportsOpenSse();
	// 开启赛事列表
	isOrdered.value = false;
	// 开启购物车弹窗
	ShopCatControlStore.setShopCatShow(true);
};

// 关闭弹窗
const onClickClear = () => {
	ShopCatControlStore.setShopCatShow(false);
};

// 订单确认
const onOrderConfirm = () => {
	sportsBetEvent.clearShopCart();
	isOrdered.value = false;
	shopCartPubSub.initializeState();
};

// 动画结束后的处理函数
const handleAnimationEnd = () => {
	isRotating.value = false; // 动画结束后将 isShaking 重置为 false，以便下次可以重新触发动画
};

// 动画结束时，移除旋转效果
const totalAnimationEnd = () => {
	console.log("1231");

	isShaking.value = false;
};
</script>

<style scoped lang="scss">
.shopCart {
	width: 520px;
	min-height: 100%;
	color: var(--Text_s);
	border-radius: 8px 8px 0px 0px;
	border-top: 1px solid var(--Line_2);
	border-right: 1px solid var(--Line_2);
	border-left: 1px solid var(--Line_2);
	background: var(--Bg1);
	box-shadow: 0px -3px 30px 0px rgba(14, 16, 19, 0.7);
	box-sizing: border-box;
	&.shop-cart-hide {
		background-color: var(--shopcar_header_bg);
	}
	.header-container {
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 15px;
		cursor: pointer;

		.left {
			display: flex;
			align-items: center;
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
				background: var(--F1);
				font-size: 14px;
				color: #fff;
				border-radius: 50%;
			}

			.shake {
			}

			.arrow {
				width: 12px;
				height: 8px;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: 0.3s ease;
				transform: rotate(-180deg); /* 鼠标悬停时旋转 */
			}
			.up_arrow {
				transform: rotate(0deg); /* 鼠标悬停时旋转 */
				transform-origin: center; /* 设置旋转中心为元素的中心 */
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
			// .close_icon {
			// 	width: 30px;
			// 	height: 30px;
			// 	transition: transform 0.6s ease; /* 设置旋转过渡 */
			// }
			// .close_icon:hover {
			// 	transform: rotate(-180deg); /* 鼠标悬停时旋转 */
			// }
		}
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: height 0.2s cubic-bezier(0.65, 0, 0.35, 1); /* 过渡时间 */
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active 在 CSS 中使用 */ {
		height: 0; /* 初始高度 */
	}
	.fade-enter-to {
		height: auto; /* 结束时的高度 */
	}

	.container-main {
		position: relative;
		overflow-y: hidden;
		transition: height 0.2s cubic-bezier(0.65, 0, 0.35, 1); /* 设置过渡效果 */
		height: 0; /* 初始高度为 0 */

		.main {
			padding: 10px 0px 15px;
		}

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
}

.shop-plan {
	display: grid;
	gap: 6px;
	.event-list {
		display: grid;
		gap: 6px;
		padding: 0px 15px;
		max-height: 450px;
		overflow-y: auto;
		&::-webkit-scrollbar-thumb {
			background-color: var(--Bg3);
			border-radius: 6px;
		}
		&::-webkit-scrollbar {
			width: 6px;
		}
	}
	.footer-container {
		padding: 0px 15px;
	}
}

.left_arrow {
	position: absolute;
	bottom: 125px;
	left: 50%;
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
