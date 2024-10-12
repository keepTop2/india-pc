<template>
	<div class="canvas-container" v-if="isVisible">
		<div class="getReadyCountdown fade-in" v-if="setp == 0">
			<img src="./image/getReadyCountdown3.png" alt="" v-if="getReadyCountdown == 3" />
			<img src="./image/getReadyCountdown2.png" alt="" v-if="getReadyCountdown == 2" />
			<img src="./image/getReadyCountdown1.png" alt="" v-if="getReadyCountdown == 1" @click="startRedbagRain" class="animate" />
		</div>
		<div class="redbag-rain-wrapper" v-show="setp == 1 || setp == 2">
			<div class="redbag-rain-canvas">
				<div v-if="setp == 1" class="redayGo">
					<img :src="readyGo" alt="" />
				</div>
				<div v-show="setp == 2">
					<canvas ref="canvas"></canvas>
					<button class="exit-button" @click="exitGame">
						<img src="./image/close.png" alt="" />
					</button>
				</div>
			</div>
		</div>
		<!-- 结算弹窗 -->
		<RED_BAG_RAIN_Dialog v-model="showRedBagRainResult" :title="dialogTitle" :confirm="confirmDialog" class="redBagRainResult">
			<div v-if="settlement.amount == 0">
				<div class="Text3">没有戳中有奖红包</div>
				<div>
					<img src="./image/pityIcon.png" alt="" />
				</div>
			</div>
			<div v-else>
				<div class="Text2">本轮共抢到{{ settlement.redbagCount }}个红包</div>
				<div class="result mt_20">共计{{ settlement.amount }}</div>
			</div>
		</RED_BAG_RAIN_Dialog>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount, watch } from "vue";
import redBagImg from "./image/redbag.png";
import openRedBagImg from "./image/opened_redbag.png";
import { useCountdown } from "/@/hooks/countdown";
import activitySocketService from "/@/utils/activitySocketService";
import { useActivityStore } from "/@/stores/modules/activity";
import { computed } from "vue";
import { redbagRainSingleton } from "/@/hooks/useRedbagRain";
import pubsub from "/@/pubSub/pubSub";
import readyGo from "./image/readyGo.png";
import RED_BAG_RAIN_Dialog from "./RED_BAG_RAIN_Dialog/index.vue";
const activitySocket = activitySocketService.getInstance();
const { countdown, startCountdown } = useCountdown();
const canvas = ref<HTMLCanvasElement | null>(null);
const activityStore = useActivityStore();
const activityData: any = computed(() => activityStore.getCurrentActivityData);
const isVisible = ref(true);
const isPaused = ref(false);
const setp: any = ref(null);
const showRedBagRainResult = ref(false);
const getReadyCountdown = ref(3);
const dialogTitle = ref("温馨提示");
const settlement: any = ref({});
let ctx: CanvasRenderingContext2D | null = null;

// 创建红包图片对象
const img = new Image();
img.src = redBagImg;
const openedImg = new Image();
openedImg.src = openRedBagImg;

let redBagInterval: ReturnType<typeof setInterval> | null = null; // Declare interval variable
// 红包对象接口
interface RedBag {
	x: number;
	y: number;
	width: number;
	height: number;
	speed: number;
	img: HTMLImageElement;
	openedImg: HTMLImageElement;
	isHovered: boolean;
	isClicked: boolean;
	alpha: number; // 用于透明度
	draw: () => void;
	update: () => void;
	checkHover: (mouseX: number, mouseY: number) => boolean;
}
// 红包类实现
class RedBagImpl implements RedBag {
	x: number;
	y: number;
	width: number;
	height: number;
	speed: number;
	img: HTMLImageElement;
	openedImg: HTMLImageElement;
	isHovered: boolean = false;
	isClicked: boolean = false;
	alpha: number = 1;

	constructor(x: number, y: number, width: number, height: number, speed: number, img: HTMLImageElement, openedImg: HTMLImageElement) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.img = img;
		this.openedImg = openedImg;
	}

	draw(): void {
		if (ctx) {
			const drawImg = this.isClicked ? this.openedImg : this.img;
			ctx.globalAlpha = this.alpha;
			ctx.drawImage(drawImg, this.x, this.y, this.width, this.height);
			ctx.globalAlpha = 1; // 重置透明度
		}
	}

	update(): void {
		if (!this.isHovered && !this.isClicked) {
			this.y += this.speed; // 红包下落
		}

		if (this.isClicked) {
			this.alpha -= 0.02; // 渐变透明度
			if (this.alpha <= 0) {
				this.alpha = 0;
			}
		}

		// 如果红包超出画布范围，则从数组中移除
		if (this.y > canvas.value!.height) {
			this.alpha = 0; // 设置透明度为0
			return; // 直接返回
		}
	}

	checkHover(mouseX: number, mouseY: number): boolean {
		return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
	}
}

// 红包数组
const redBags: RedBag[] = [];

watch(
	() => countdown.value,
	() => {
		if (countdown.value === 3) {
			if (redBagInterval) {
				clearInterval(redBagInterval);
			}
		}
		if (countdown.value === 0) {
			exitGame();
		}
	}
);
// 动画函数
const animate = () => {
	if (ctx && !isPaused.value) {
		ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height); // 清空画布
		drawCountdown(); // 绘制倒计时
		redBags.forEach((redBag, index) => {
			redBag.update();
			redBag.draw();
			// 红包点击后或超出画布边界后移除
			if ((redBag.isClicked && redBag.alpha <= 0) || redBag.y > canvas.value!.height) {
				redBags.splice(index, 1);
			}
		});

		requestAnimationFrame(animate);
	}
};

// 绘制倒计时
const drawCountdown = () => {
	if (ctx && canvas.value) {
		const countdownText = "倒计时: ";
		const countdownValue = countdown.value.toString();

		// 设置倒计时文本的样式和大小
		ctx.font = "20px Arial"; // 较小的字体
		const textWidth1 = ctx.measureText(countdownText).width; // 计算 "倒计时:" 的宽度

		// 设置倒计时值的样式和大小
		ctx.font = "32px Arial"; // 较大的字体
		const textWidth2 = ctx.measureText(countdownValue).width; // 计算倒计时值的宽度

		// 总文本宽度
		const totalTextWidth = textWidth1 + textWidth2;

		// 计算文本在画布的中心位置
		const centerX = (canvas.value.width - totalTextWidth) / 2;
		const centerY = 95;

		// 清空画布
		ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

		// 绘制 "倒计时:" 文本
		ctx.font = "20px Arial"; // 较小的字体
		ctx.fillStyle = "white"; // 设置字体颜色
		ctx.fillText(countdownText, centerX, centerY);

		// 绘制倒计时值
		ctx.font = "32px Arial"; // 较大的字体
		ctx.fillText(countdownValue, centerX + textWidth1, centerY);
	}
};
// 鼠标移动监听器
const handleMouseMove = (event: MouseEvent) => {
	if (isPaused.value)
		return redBags.forEach((redBag) => {
			redBag.isHovered = false; // 重置所有红包的悬停状态
		});
	const rect = canvas.value!.getBoundingClientRect();
	const mouseX = event.clientX - rect.left;
	const mouseY = event.clientY - rect.top;

	let hoveredRedBag: RedBag | null = null;

	// 倒序遍历，查找最上面的红包
	for (let i = redBags.length - 1; i >= 0; i--) {
		const redBag = redBags[i];
		if (redBag.checkHover(mouseX, mouseY)) {
			hoveredRedBag = redBag; // 记录最上面的红包
			break; // 找到后停止遍历
		}
	}

	// 更新红包状态
	redBags.forEach((redBag) => {
		redBag.isHovered = false; // 重置所有红包的悬停状态
	});

	// 仅更新最上面的红包
	if (hoveredRedBag) {
		hoveredRedBag.isHovered = true; // 设置为悬停
	}
};

// 鼠标点击监听
const handleClick = () => {
	if (isPaused.value) return;
	redBags.forEach((redBag) => {
		if (redBag.isHovered) {
			activitySocket.send("/activity/redBagRain/grab:" + JSON.stringify({ redbagSessionId: activityData.value.redbagSessionId }));
			redBag.isClicked = true; // 标记红包为已点击
		}
	});
};

// 调整画布大小
const adjustCanvasSize = () => {
	if (canvas.value) {
		canvas.value.width = 750; // 设置画布宽度
		canvas.value.height = window.innerHeight; // 设置画布高度
		ctx = canvas.value.getContext("2d");
	}
};

// 添加新红包
const addNewRedBag = () => {
	const width = 76; // 红包宽度
	const height = 102; // 红包高度
	const x = Math.random() * (canvas.value!.width - width); // 随机生成 X 坐标
	const speed = Math.random() * 3 + 1; // 随机生成速度
	const newRedBag = new RedBagImpl(x, -height, width, height, speed, img, openedImg);
	redBags.push(newRedBag); // 添加红包到数组
};

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

const startRedbagRain = () => {
	setp.value = 1;
	const timer = setTimeout(() => {
		setp.value = 2;
		animate(); // 启动动画
		redBagInterval = setInterval(() => {
			if (!isPaused.value) {
				addNewRedBag();
			}
		}, 150);
		startCountdown(activityData.value.dropTime);
		clearTimeout(timer);
	}, 3000);
};

const initRedbagRain = () => {
	adjustCanvasSize();
	canvas.value!.addEventListener("mousemove", handleMouseMove);
	canvas.value!.addEventListener("click", handleClick);
};

// 退出游戏函数
const exitGame = () => {
	isPaused.value = true; // 暂停游戏
	setp.value = 3;
	ctx!.clearRect(0, 0, canvas.value!.width, canvas.value!.height); // 清空画布
	redBags.length = 0; // 清空红包数组
	const parmas =
		"/activity/redBagRain/settlement" +
		":" +
		JSON.stringify({
			redbagSessionId: activityData.value.redbagSessionId,
		});
	activitySocket.send(parmas);
};
const confirmDialog = () => {
	isVisible.value = false;
	redbagRainSingleton.hideRedbagRain();
};
// 生命周期管理
onMounted(async () => {
	initReadyTime();
	initRedbagRain();
	pubsub.subscribe("/activity/redBagRain/settlement", (data) => {
		if (data.data.redbagCount > 0) {
			dialogTitle.value = "恭喜你";
		} else {
			dialogTitle.value = "很遗憾";
		}
		settlement.value = data.data;
		showRedBagRainResult.value = true;
	});
});

onBeforeUnmount(() => {
	isVisible.value = false;
	canvas.value!.removeEventListener("mousemove", handleMouseMove);
	canvas.value!.removeEventListener("click", handleClick);
	if (redBagInterval) {
		clearInterval(redBagInterval);
	}
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

		img {
			width: 500px;
			cursor: pointer;
		}
		img.animate {
			animation: shake 1s ease infinite;
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
