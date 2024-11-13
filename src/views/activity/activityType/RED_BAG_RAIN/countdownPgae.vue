<template>
	<div class="canvas-container">
		<div class="getReadyCountdown fade-in">
			<img src="./image/getReadyCountdown3.png" alt="" v-if="getReadyCountdown == 3" />
			<img src="./image/getReadyCountdown2.png" alt="" v-if="getReadyCountdown == 2" />
			<img src="./image/getReadyCountdown1.png" alt="" v-if="getReadyCountdown == 1" @click="startRedbagRain" class="animate" />
			<img src="./image/close2.png" alt="" class="close" @click="redbagRainSingleton.hideCountdown()" />
		</div>
	</div>

	<!-- 结算弹窗 -->
	<RED_BAG_RAIN_Dialog v-model="showDialog" title="温馨提示" :confirm="confirmDialog" class="redBagRainResult">
		<div class="Text3">{{ dialogInfo.message }}</div>
		<template v-slot:footer v-if="[30045, 30053].includes(dialogInfo.status)"> 去绑定 </template>
	</RED_BAG_RAIN_Dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useActivityStore } from "/@/stores/modules/activity";
import { redbagRainSingleton } from "/@/hooks/useRedbagRain";
import { activityApi } from "/@/api/activity";
import RED_BAG_RAIN_Dialog from "./RED_BAG_RAIN_Dialog/index.vue";
import Common from "/@/utils/common";

const activityStore = useActivityStore();
const setp: any = ref(null);
const getReadyCountdown = ref(3);
const showDialog = ref(false);
const dialogInfo = ref({});
const initReadyTime = () => {
	setp.value = 0;
	const timer = setInterval(() => {
		if (getReadyCountdown.value == 1) {
			clearInterval(timer);
		} else {
			getReadyCountdown.value = getReadyCountdown.value - 1;
		}
	}, 1000);
};
const confirmDialog = () => {
	showDialog.value = false;
};
const startRedbagRain = async () => {
	await activityApi.redBagParticipate({ redbagSessionId: activityStore.getCurrentActivityData.redbagSessionId }).then((res) => {
		if (res.code === 10000) {
			if (res.data.status === 10000) {
				redbagRainSingleton.showRedbagRain();
			} else {
				dialogInfo.value = res.data;
				showDialog.value = true;
			}
		}
	});
	redbagRainSingleton.hideCountdown();
	// activityApi.getRedBagInfo().then(async (res) => {
	// 	if (res.code == Common.ResCode.SUCCESS) {
	// 		await activityStore.setCurrentActivityData({ ...res.data });

	// 	}
	// });
};
// 生命周期管理
onMounted(async () => {
	initReadyTime();
});
</script>

<style scoped lang="scss">
.canvas-container {
	position: fixed;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 100%;
	height: 100vh;
	z-index: 1200;
	background: rgba(0, 0, 0, 0.5);
	.getReadyCountdown {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		flex-direction: column;
		img {
			width: 500px;
			cursor: pointer;
		}
		img.animate {
			animation: shake 1s ease infinite;
		}
		.close {
			width: 48px;
			cursor: pointer;
		}
	}
	.redbag-rain-wrapper {
		width: 100%;
		height: 100vh;
		position: relative;
		background: linear-gradient(180deg, #4c129d 0%, #91139a 100%);

		.redayGo {
			text-align: center;
			display: flex;
			height: 100vh;
			align-items: center;
			justify-content: center;
		}
		.redbag-rain-canvas {
			width: 100%;
			height: 100vh;
			background: url("./image/redBagBg.png") no-repeat center;
			background-size: 750px 100%;
			cursor: pointer;
			> div {
				width: 750px;
				margin: 0 auto;
				position: relative;
			}
		}
	}
}

.exit-button {
	position: absolute;
	top: 20px; /* 距离顶部的距离 */
	right: 20px; /* 距离右侧的距离 */
	border: none; /* 去掉边框 */
	border-radius: 5px; /* 圆角 */
	cursor: pointer; /* 鼠标悬停变为指针 */
	background: transparent;
	img {
		width: 54px;
		height: 54px;
	}
}

@keyframes shake {
	0% {
		transform: translateX(0) rotate(0deg);
	} /* 初始位置 */
	10% {
		transform: translateX(-10px) rotate(-5deg);
	} /* 向左移动并倾斜 */
	20% {
		transform: translateX(10px) rotate(5deg);
	} /* 向右移动并倾斜 */
	30% {
		transform: translateX(-10px) rotate(-5deg);
	} /* 向左移动并倾斜 */
	40% {
		transform: translateX(10px) rotate(5deg);
	} /* 向右移动并倾斜 */
	50% {
		transform: translateX(0) rotate(0deg);
	} /* 回到原位，结束摇晃 */
	100% {
		transform: translateX(0) rotate(0deg);
	}
}

.redBagRainResult {
	.result {
		height: 46px;
		line-height: 46px;
		background-color: rgba(255, 40, 75, 0.2);
		color: var(--Theme);
		border-radius: 5px;
	}
	img {
		height: 108px;
		width: 108px;
	}
}
</style>
