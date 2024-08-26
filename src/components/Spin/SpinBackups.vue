<!-- 代码备份，保留播放音乐代码，待调试 -->
<template>
	<div class="spin">
		<!-- 灯光 -->
		<div :style="{ '--spinOverRotate': spinRotate }" :class="['spin-wrap', { rotate: spining && !spinOver, result: spinOver }]">
			<!-- <img :class="['spin-light', { active: lightActive }]" :src="light" alt="" /> -->
			<img class="spin-img" :src="spinBG" alt="" />

			<!-- 金额列表 -->
			<div class="currency">
				<div
					v-for="(i, index) in getSpinList()"
					:key="i"
					class="spin-item"
					:style="{
						opacity: '1',
						height: '24px',
						transform: `rotate(${(360 / 16) * index}deg)`,
					}"
				>
					<span class="amount">{{ showCoin(i.coin) }}</span>
					<img :src="getImg(i.currency)" width="24" height="24" />
				</div>
			</div>
		</div>

		<!-- 大转盘背景 -->

		<div class="point-img">
			<!-- <div class="light-wrap"><div class="point-light"></div></div> -->
			<img :src="crypto_point" alt="" :class="{ reward: rewardAni }" />
		</div>

		<!-- 手动画 -->
		<canvas v-if="!spining" id="canvas" width="160" height="200" style="touch-action: auto; width: 80px; height: 100px; cursor: inherit" />

		<!-- 中间 -->
		<div :class="['btn-img', { loading: spining }]" style="opacity: 1; transform: none" @click.stop="handleStartSpin">
			<img class="btn-txt" :src="crypto_btn" alt="" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, getCurrentInstance } from "vue";
import { mockDoGetReward } from "./api.ts";
import renderComponent from "/@/utils/renderComponent";
import crypto_point from "./img/crypto_point.png";
import crypto_btn from "./img/crypto_btn.png";
import img10001 from "./img/10001.png";
import light from "./img/light.png";
import spinBG from "./img/spin_bg.png";
import { get } from "lodash-es";

let lightInter = null;
const { appContext } = getCurrentInstance();
const dialogShow = ref(true);
const lightActive = ref(false);
const spining = ref(false);
const spinOver = ref(false);
const spinRotate = ref("0deg");
const pageLoading = ref(true);
const music = ref(null); // 音乐标签
const musicStep = ref(1);
const getRewardTime = ref(2500); // 中奖动画时间
const rewardAni = ref(false);
const awardList = ref([]);

const spinInfo = ref({
	promoSpin: [
		{
			id: "169865761221100001",
			title: "NEWBIE SPIN",
			maxVipLevel: 0,
			minVipLevel: 0,
			configList: [
				{
					id: "1782447017013141504",
					coin: "1000.00",
					currency: "VND",
					sort: 1,
					freeNum: null,
				},
				{
					id: "1782447017021530112",
					coin: "2.00",
					currency: "ETH",
					sort: 2,
					freeNum: null,
				},
				{
					id: "1782447017021530113",
					coin: "10.00",
					currency: "GPL",
					sort: 3,
					freeNum: null,
				},
				{
					id: "1782447017021530114",
					coin: "1.00",
					currency: "LTC",
					sort: 4,
					freeNum: null,
				},
				{
					id: "1782447017021530115",
					coin: "1.00",
					currency: "APE",
					sort: 5,
					freeNum: null,
				},
				{
					id: "1782447017038307328",
					coin: "5.00",
					currency: "DAI",
					sort: 6,
					freeNum: null,
				},
				{
					id: "1782447017042501632",
					coin: "100.00",
					currency: "DOGE",
					sort: 7,
					freeNum: null,
				},
				{
					id: "1782447017042501633",
					coin: "80.00",
					currency: "TRX",
					sort: 8,
					freeNum: null,
				},
				{
					id: "1782447017046695936",
					coin: "10.00",
					currency: "USDT",
					sort: 9,
					freeNum: null,
				},
				{
					id: "1782447017046695937",
					coin: "0.10",
					currency: "MATIC",
					sort: 10,
					freeNum: null,
				},
				{
					id: "1782447017046695938",
					coin: "2.00",
					currency: "USDT",
					sort: 11,
					freeNum: null,
				},
				{
					id: "1782447017046695939",
					coin: "6.00",
					currency: "GPL",
					sort: 12,
					freeNum: null,
				},
				{
					id: "1782447017046695940",
					coin: "10.00",
					currency: "USDT",
					sort: 13,
					freeNum: null,
				},
				{
					id: "1782447017046695941",
					coin: "8.00",
					currency: "USDC",
					sort: 14,
					freeNum: null,
				},
				{
					id: "1782447017046695942",
					coin: "6.00",
					currency: "USD",
					sort: 15,
					freeNum: null,
				},
				{
					id: "1782447017050890240",
					coin: "8888.00",
					currency: "CZK",
					sort: 16,
					freeNum: null,
				},
			],
		},
	],
	freeNum: 1,
	maxReward: {
		currency: "BTC",
		coin: "5.00",
		coinProfit: null,
		coinPayout: null,
		count: null,
	},
});

onMounted(async () => {
	lightInter = setInterval(() => {
		lightActive.value = !lightActive.value;
	}, 1000);

	const canvasAction = () => {
		let width = 128;
		let height = 128;
		const image = new Image(); // Using optional size for image
		image.onload = drawImageActualSize; // Draw when image has loaded
		image.src = img10001;
		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext("2d");
		const moveInfo = {
			currentX: 0,
			currentY: 0,
			maxX: 60,
			minX: 0,
			speed: 2,
			currentScale: 1.3,
		};

		let positive = true; // 正反 0 向上  1向下

		// 绘制
		function draw() {
			let x = 0;
			let y = 0;
			if (positive) {
				x = moveInfo.currentX + moveInfo.speed;
				moveInfo.currentX = x;
				y = moveInfo.currentY + moveInfo.speed;
				moveInfo.currentY = y;

				if (x > moveInfo.maxX) {
					positive = !positive;
				}
			} else {
				x = moveInfo.currentX - moveInfo.speed;
				moveInfo.currentX = x;
				y = moveInfo.currentY - moveInfo.speed;
				moveInfo.currentY = y;

				if (x < moveInfo.minX) {
					positive = !positive;
				}
			}
			let scaleVal = 0.3 / (moveInfo.maxX / moveInfo.speed);
			if (positive) {
				moveInfo.currentScale -= scaleVal;
			} else {
				moveInfo.currentScale += scaleVal;
			}
			ctx.reset();
			ctx.save();
			ctx.scale(moveInfo.currentScale, moveInfo.currentScale);
			ctx.drawImage(image, 0, 0, width / 2, height, 0, 40, 128, 128);
			ctx.restore();
			ctx.save();
			ctx.rotate((90 * Math.PI) / 180);
			ctx.translate(0, -width / 2);
			ctx.scale(moveInfo.currentScale, moveInfo.currentScale);
			ctx.drawImage(image, width / 2 + 25, 0, width / 2, height, x, -30, 128, 128);
			ctx.restore();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			window.requestAnimationFrame(draw);
		}

		function drawImageActualSize() {
			console.log("this.width", this.width, this.height);
			width = this.width;
			height = this.height;
			window.requestAnimationFrame(draw);
		}
	};
	// // 获取轮盘信息
	// await doGetSpin({}).then((res) => {
	//   if (res?.code === 0) {
	//     spinInfo.value = res.data;
	//   }
	// });

	// 中奖名单
	// await doRealTimeAward().then((res) => {
	//   if (res.code == 0) {
	//     awardList.value = res.data;
	//   }
	// });
	pageLoading.value = false;
	setTimeout(() => canvasAction());
});
onUnmounted(() => {
	clearInterval(lightInter);
});

const getImg = (url: string) => {
	return new URL(`./img/coin/${url}.black.png`, import.meta.url).href;
};

const getSpinList = () => {
	return get(spinInfo.value, ["promoSpin", 0, "configList"], []);
};

// 播放音乐
// function handleAudioPlay() {
//   music.value.currentTime = 3;
//   music.value.play();
//   music.value.addEventListener("timeupdate", scrollIng);
// }

// function handleAudioPause() {
//   music.value.pause();
//   music.value.removeEventListener("timeupdate", scrollIng);
// }

// function scrollIng() {
//   const maxTime = musicStep.value === 1 ? 5 : 7.5;
//   if (music.value?.currentTime >= maxTime) {
//     music.value.currentTime = 3;
//   }
// }

// 显示金额
const showCoin = (c) => {
	let coin = Number(c).toFixed(7).toString().slice(0, 7);
	if (coin.indexOf(".") === 6) {
		coin = coin.slice(0, 6);
	}
	return coin;
};

const clearSpin = () => {
	spinOver.value = false;
	spining.value = false;
	rewardAni.value = false;
};

// 开始转
const handleStartSpin = () => {
	clearInterval(lightInter);
	clearSpin();
	if (spining.value) return;
	spining.value = true;

	// handleAudioPlay();
	mockDoGetReward()
		.then(async (res) => {
			if (res.code !== 0) {
				// 错误提示 加隐藏弹窗
				dialogShow.value = false;
				return;
			}
			setTimeout(() => {
				spinOver.value = true;
				// 查找获取是第几项
				const { coin, currency } = res.data;
				const list = get(spinInfo.value, ["promoSpin", 0, "configList"], []);
				const findIndex = list.findIndex((i) => i.coin === coin && i.currency === currency);
				if (findIndex === -1) {
					// 错误提示 加隐藏弹窗
					dialogShow.value = false;
					return;
				}

				// musicStep.value = 2;
				// music.value.currentTime = 5;
				console.log(findIndex, "=findIndex");
				spinRotate.value = `${(360 / 16) * (16 - findIndex) + 270}deg`;
				setTimeout(() => {
					// 执行动画
					rewardAni.value = true;

					// handleAudioPause();

					// 跳转
					// setTimeout(async () => {
					// 	dialogShow.value = false;
					// 	renderComponent({
					// 		component: (await import('/@/components/Spin/Result.vue')).default,
					// 		appContext,
					// 		props: res.data,
					// 	});
					// }, 500);
				}, getRewardTime.value);
			}, 2000);
		})
		.finally(() => {
			// spining.value = false;
		});
};
</script>

<style lang="scss" scoped>
.spin-layer {
	background-color: #1a132c;
	position: relative;
	padding: 0;
	border-radius: 4px;
	height: 100%;
	overflow: hidden;
}
.head {
	background-image: url("./img/crypto_head.png");
	background-size: 100%;
	background-repeat: no-repeat;
	text-align: center;
	color: #fff;
	font-weight: 700;
	position: relative;
	z-index: 1;
	background-size: 100% auto;
	background-position: center;
	padding: 50px 0 25px 0;

	.txt {
		font-weight: 900;
		font-size: 30px;
		line-height: 40px;
		background-image: linear-gradient(to bottom, #ffffff, #a27beb);
		-webkit-filter: drop-shadow(1px 1px 0 #7f4cd6);
		filter: drop-shadow(1px 1px 0 #7f4cd6);
		color: transparent;
		-webkit-background-clip: text;
	}
	.amount {
		font-weight: 900;
		font-size: 50px;
		line-height: 50px;
		background-image: linear-gradient(to bottom, #ffa600, #ffe47b);
		-webkit-filter: drop-shadow(2px 2px 0 #ca8619);
		filter: drop-shadow(2px 2px 0 #ca8619);
		-webkit-background-clip: text;
		color: transparent;
	}
}
.spin {
	position: relative;
	width: 340px;
	// margin-left: 10%;
	height: max-content;
	.spin-wrap {
		/* transform-origin: center; */
		width: 100%;
		height: 100%;

		&.rotate {
			animation: rotate 1s linear infinite;
			-webkit-animation: rotate 1s linear infinite;
		}
		&.result {
			animation: spin-result 2s ease-out forwards;
			animation-fill-mode: forwards;
		}

		.spin-light {
			position: absolute;
			z-index: 1;
			left: 0;
			top: 0;
			/* animation: spin-light 2s infinite linear; */
			width: 100%;
			height: auto;
			&.active {
				transform: rotate(22.5deg);
			}
		}

		.spin-img {
			/* position: absolute; */
			width: 100%;
			left: 0;
			top: 0;
		}

		.currency {
			.spin-item {
				position: absolute;
				top: 158px;
				left: 50%;
				line-height: 1.5rem;
				transform-origin: -64px center;
				margin-left: 64px;
				color: #fff;
				font-size: 12px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				/* border: 1px solid red; */

				.amount {
					text-align: right;
					margin-right: 4px;
					font-weight: 600;
					font-size: 14px;
					// text-shadow: 0px 2px 0px rgba(0, 0, 0, 0.3);
					color: #fff;
					padding-left: 8px;
					font-family: "DIN Alternate";
				}
			}
		}
	}
	.point-img {
		position: absolute;
		z-index: 5;
		top: -30px;
		left: 127px;
		height: 150px;
		width: 86px;
		transform-origin: left center;
		.reward {
			animation: rewardRotate 0.3s ease-out forwards;
			-webkit-animation: rewardRotate 0.3s ease-out forwards;
		}

		img {
			width: 100%;
			height: 100%;
		}
	}

	.btn-img {
		position: absolute;
		width: 100px;
		height: 100px;
		top: 175px;
		left: 50%;
		margin-left: -50px;
		margin-top: -55px;
		z-index: 11;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		/* background-image: url("./img/crypto_btn.png");
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center center; */
		.btn-txt {
			width: 96%;
			height: auto;
		}

		&:hover {
			transition: transform 0.2s ease;
			transform: scale(1.1) !important;
		}

		&:not(.loading) .btn-txt {
			-webkit-animation: pulse-s196nhep 2s infinite linear;
			animation: pulse-s196nhep 2s infinite linear;
		}
	}
}

canvas {
	position: absolute;
	top: 140px;
	left: 0%;
	z-index: 13;
	margin-left: 50%;
	pointer-events: none;
}

.select-currency {
	height: 65px;
}

.footer {
	margin: 6px;
	@include flex-center();
	justify-content: space-between;
	align-items: flex-start;

	.total {
		@include flex-center();
		flex-direction: column;
		background-color: var(--bg3-color);
		height: 70px;
		border-radius: var(border-radius);
		min-width: 160px;
		.title {
			color: var(--title-color);
		}
		.amount {
			color: #e9d317;
			font-size: 16px;
			font-weight: 800;
			@include text-ellipsis();
		}
	}
	.spin-user-list {
		flex: 1;
		background-color: var(--bg3-color);
		margin-left: 6px;
		cursor: pointer;
	}

	.item-list {
		overflow: hidden;
		height: 70px;
		width: 100%;
		.name {
			color: var(--font0-color);
			font-weight: 800;
			margin-bottom: 6px;
		}
		.amount-str {
			color: var(--font5-color);
			padding-right: 3px;
		}

		.td {
			@include flex-center();
			justify-content: space-between;
			.avatar {
				width: 28px;
				height: 28px;
				flex-shrink: 0;
				border-radius: 14px;
				overflow: hidden;
				margin: 0 15px;
			}
			.info {
				@include flex-center();
				align-items: flex-start;
				flex-direction: column;
				flex: 1;
				font-size: 14px;
				.currency {
					color: var(--font0-color);
				}
			}
			.arrow {
				width: 16px;
				margin-right: 5px;
			}
		}
	}
}

.ranking-content {
	position: absolute;
	top: 0px;
	left: 100%;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	padding-top: 13px;
	border-radius: 4px;
	z-index: 101;
	background-image: linear-gradient(8deg, #31343c -16%, #1e2025 -5%, #1e2025 6%, #1d2024 40%, #1e2025 74%, #1e2025 113%);
	transition: 0.5s;
	&.active {
		left: 0;
	}

	.head-btn {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.close-btn,
	.icon-left {
		position: absolute;
		font-size: 24px;
		font-weight: bold;
		left: 10px;
		top: 7px;
		cursor: pointer;
		color: #67707b;
		font-weight: bold;
		transition: 0.5s;
		&:hover {
			color: var(--font0-color);
		}
	}
	.close-btn {
		right: 10px;
		left: unset;
	}
	.winlist-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: var(--font0-color);
		padding-top: 40px;
		.crown {
			width: 47px;
			height: 26px;
		}
		.bouns {
			display: flex;
			align-items: center;
			padding-top: 5px;
			img {
				width: 12px;
				height: 22px;
			}
			.tit {
				height: 29px;
				font-size: 17px;
				font-weight: 800;
				margin: 0 5px;
			}
			.suf-img {
				transform: scaleX(-1);
			}
		}
	}
	.winlist-wrap {
		margin: 0 10px 10px 10px;
		margin-top: 16px;
		border-radius: 4px;
		background: var(--bg4-color);
		overflow: hidden;
		/* flex: 1; */
		display: flex;
		flex-direction: column;
		padding: 0px 12px;

		.table-header {
			height: 45px;
			flex-shrink: 0;
			width: 100%;
			display: flex;
			align-items: center;
			.p {
				color: #98a7b5;
			}
		}
		.reward-user-list {
			overflow: hidden;
			height: 540px;
			width: 100%;
			pointer-events: none;
			.name {
				color: var(--font0-color);
				font-weight: 800;
			}
			.amount-str {
				color: var(--font5-color);
				padding-right: 3px;
			}
			.coin-icon {
				width: 20px;
				height: 20px;
			}
			.td {
				height: 34px;
			}
		}
		.my-swipe-item {
			height: 34px;
		}
		.td {
			display: flex;
			align-items: center;
			.p {
				width: 30%;
				white-space: normal;
				font-size: 14px;
				overflow: hidden;
				text-overflow: ellipsis;
				text-align: center;
				&:first-of-type {
					text-align: left;
				}
				&:last-of-type {
					width: 40%;
					text-align: right;
					display: flex;
					justify-content: flex-end;
					align-items: center;
				}
			}
		}
	}
}

@keyframes pulse-s196nhep {
	0% {
		transform: rotate(-5deg) scaleZ(1);
	}

	50% {
		transform: rotate(0) scale3d(1.1, 1.1, 1.1);
	}

	to {
		transform: rotate(-5deg) scaleZ(1);
	}
}

@keyframes spin-result {
	0% {
		transform: rotate(0);
	}
	100% {
		transform: rotate(var(--spinOverRotate));
	}
}

@keyframes rewardRotate {
	0% {
		transform: scale(1, 1);
	}
	50% {
		transform: scale(1.2, 1.2);
	}
	100% {
		transform: scale(1, 1);
	}
}

@keyframes rotate {
	0% {
		transform: rotate(0);
	}

	25% {
		transform: rotate(90deg);
	}

	50% {
		transform: rotate(180deg);
	}

	75% {
		transform: rotate(270deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

.app_isApp {
	.spin {
		width: 337px;
		height: 337px;

		position: relative;
		left: 50%;
		margin-left: -169px;
	}
}
</style>
