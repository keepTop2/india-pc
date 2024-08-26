<template>
	<div class="spin">
		<!-- 灯光 -->
		<div :style="{ '--spinOverRotate': spinRotate }" :class="['spin-wrap', { rotate: spinning && !spinOver, result: spinOver }]">
			<img class="spin-img" :src="spinBG" alt="" />
			<div class="currency">
				<div v-for="(i, index) in spinList" :key="index" class="spin-item" :style="getItemStyle(index)">
					<span class="amount">{{ showCoin(i.coin) }}</span>
					<img :src="getImg(i.currency)" width="24" height="24" />
				</div>
			</div>
		</div>

		<!-- 大转盘背景 -->
		<div class="point-img">
			<img :src="crypto_point" alt="" :class="{ reward: rewardAni }" />
		</div>

		<!-- 手动画 -->
		<canvas v-if="!spinning" id="canvas" width="160" height="200" style="touch-action: auto; width: 80px; height: 100px; cursor: inherit" />

		<!-- 中间 -->
		<div :class="['btn-img', { loading: spinning }]" @click.stop="handleStartSpin">
			<img class="btn-txt" :src="crypto_btn" alt="" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, getCurrentInstance, watch, nextTick } from 'vue';
import crypto_point from './img/crypto_point.png';
import crypto_btn from './img/crypto_btn.png';
import img10001 from './img/10001.png';
import spinBG from './img/spin_bg.png';

const lightActive = ref(false);
const spinning = ref(false);
const spinOver = ref(false);
const spinRotate = ref('0deg');
const pageLoading = ref(true);
const rewardAni = ref(false);

/**
 * @description 转盘组件
 * @param {Array<Coin>} spinList 奖品列表
 * @param {Object} reward 选中的奖品
 * @param {Function} startSpinningCallback 开始旋转的回掉函数
 * @param {Function} endSpinningCallback 结束旋转的回掉函数
 */

interface Coin {
	coin: string;
	currency: string;
}

interface Spin {
	spinList: Coin[]; //奖品列表
	reward: Coin; //选中的奖品
}

const props = withDefaults(defineProps<Spin>(), {
	spinList: () => [],
	reward: () => ({} as Coin),
});

// startSpinningCallback 开始旋转的回掉函数
const emit = defineEmits(['startSpinningCallback']);

// 监听props中的reward变化，以触发停止旋转
watch(
	() => props.reward,
	async () => {
		await nextTick();
		spinOver.value = true;
		const { coin, currency } = props.reward;
		const findIndex = props.spinList.findIndex((i) => i.coin === coin && i.currency === currency);
		if (findIndex === -1) {
			// 错误处理
			console.error('奖品信息错误');
			return;
		}
		spinRotate.value = `${(360 / 16) * (16 - findIndex) + 270}deg`;
		await nextTick();
		rewardAni.value = true;
	}
);

onMounted(async () => {
	lightActive.value = true;
	const canvasAction = () => {
		// Canvas动画逻辑...
		let width = 128;
		let height = 128;
		const image = new Image();
		image.onload = drawImageActualSize;
		image.src = img10001;
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');
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
			console.log('this.width', this.width, this.height);
			width = this.width;
			height = this.height;
			window.requestAnimationFrame(draw);
		}
	};
	pageLoading.value = false;
	setTimeout(() => canvasAction(), 0);
});

// 计算每个奖品项的样式
const getItemStyle = (index: number) => ({
	opacity: '1',
	height: '24px',
	transform: `rotate(${(360 / 16) * index}deg)`,
});
// 获取奖品图标的路径
const getImg = (url: string) => {
	return new URL(`./img/coin/${url}.black.png`, import.meta.url).href;
};
// 格式化显示币种小数点数
const showCoin = (c: string) => {
	let coin = Number(c).toFixed(7).toString().slice(0, 7);
	if (coin.indexOf('.') === 6) {
		coin = coin.slice(0, 6);
	}
	return coin;
};
// 重置旋转动画状态
const clearSpin = () => {
	spinOver.value = false;
	spinning.value = false;
	rewardAni.value = false;
};
// 处理开始旋转的逻辑
const handleStartSpin = () => {
	clearSpin();
	if (spinning.value) return;
	spinning.value = true;
	emit('startSpinningCallback');
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
	background-image: url('./img/crypto_head.png');
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
					font-family: 'DIN Alternate';
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
