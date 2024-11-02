<template>
	<div class="spin">
		<!-- 灯光 -->
		<img class="spin-img-border" :src="spinBorder" alt="" />
		<div :style="{ '--spinOverRotate': spinRotate }" :class="['spin-wrap', { rotate: spinning && !spinOver, result: spinOver }]">
			<img class="spin-img" :src="spinBG" alt="" />

			<div class="currency">
				<div v-for="(i, index) in spinList" :key="index" class="spin-item" :style="getItemStyle(index)">
					<span class="amount">
						<img v-lazy-load="i.prizePictureUrl" alt="" />
					</span>
				</div>
			</div>
		</div>
		<!-- 大转盘背景 -->
		<div class="point-img">
			<img :src="crypto_point" alt="" :class="{ reward: rewardAni }" />
		</div>
		<!-- 中间 -->
		<div :class="['btn-img', { loading: spinning }]" @click.stop="startVerification">
			<img class="btn-txt" :src="crypto_btn" alt="" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import crypto_point from "./img/crypto_point.png";
import crypto_btn from "./img/crypto_btn.png";
import spinBG from "./img/spin_bg.png";
import spinBorder from "./img/spin-img-border.png";
import { activityApi } from "/@/api/activity";
import showToast from "/@/hooks/useToast";
import Common from "/@/utils/common";
import { useUserStore } from "/@/stores/modules/user";

const lightActive = ref(false);
const spinning = ref(false);
const spinOver = ref(false);
const spinRotate = ref("0deg");
const pageLoading = ref(true);
const rewardAni = ref(false);
/**
 * @description 转盘组件
 * @param {Array<Coin>} spinList 奖品列表
 * @param {Object} reward 选中的奖品
 * @param {Function} endSpinningCallback 结束旋转的回掉函数
 * @param {Function} startVerification 开始旋转的校验
 */

const props = defineProps({
	spinList: {
		type: Array as any,
	},
	reward: {
		type: Object as any,
	},
});

// startSpinningCallback 开始旋转的回掉函数
const emit = defineEmits(["endSpinningCallback", "startVerification"]);

const endSpinning = async () => {
	spinOver.value = true;
	const findIndex = props.spinList.findIndex((i: any) => i.id === props.reward?.id);
	console.log(findIndex);

	if (findIndex === -1) {
		clearSpin();
		return;
	}
	spinRotate.value = `${360 - (360 / 16) * findIndex}deg`;
	rewardAni.value = true;
	const timer = setTimeout(() => {
		spinning.value = false;

		emit("endSpinningCallback");
		clearTimeout(timer);
	}, 2500);
};
onMounted(async () => {
	lightActive.value = true;
	pageLoading.value = false;
});

// 计算每个奖品项的样式
const getItemStyle = (index: number) => ({
	opacity: "1",
	transform: `rotate(${(360 / 16) * index - 90}deg)`,
});

// 重置旋转动画状态
const clearSpin = () => {
	spinOver.value = false;
	spinning.value = false;
	rewardAni.value = false;
};

const startVerification = () => {
	emit("startVerification");
};
// 处理开始旋转的逻辑
const handleStartSpin = () => {
	if (spinning.value) return;
	clearSpin();
	spinning.value = true;
};
defineExpose({
	handleStartSpin,
	endSpinning,
	spinning,
});
</script>

<style lang="scss" scoped>
.spin {
	position: relative;
	width: 350px;
	padding-top: 60px;
	margin: 0 auto;
	height: max-content;
	.spin-img-border {
		width: 354px;
		height: 354px;
		position: absolute;
		top: 53px;
		left: -7px;
	}
	.spin-wrap {
		width: 340px;
		height: 340px;
		position: relative;
		&.rotate {
			animation: rotate 1s linear infinite;
			-webkit-animation: rotate 1s linear infinite;
		}
		&.result {
			animation: spin-result 2s ease-out forwards;
			animation-fill-mode: forwards;
		}

		.spin-img {
			width: 100%;
			left: 0;
			top: 0;
		}

		.currency {
			.spin-item {
				// height: 24px;
				position: absolute;
				top: 46%;
				left: 50%;
				line-height: 1.5rem;
				transform-origin: -80px center;
				margin-left: 80px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				img {
					width: 30px;
					height: 30px;
					object-fit: cover;
				}

				.amount {
					margin-right: 4px;
					font-weight: 700;
					font-size: 12px;
					color: #fff;
					padding-left: 45px;
					font-family: "DIN Alternate";
				}
			}
		}
	}
	.point-img {
		position: absolute;
		z-index: 5;
		top: 30px;
		left: calc(50% - 46px);
		height: 142px;
		width: 82px;
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
		width: 125px;
		top: 43%;
		left: 50%;
		z-index: 11;
		cursor: pointer;
		margin-left: -68px;
		.btn-txt {
			width: 100%;
		}
		&:hover {
			transform: scale(1.1);
		}
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
</style>
