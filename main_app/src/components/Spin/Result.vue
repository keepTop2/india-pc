<!-- 未登录大转盘结果 -->

<template>
	<VanModal v-model:isShow="dialogShow" :width="500" :height="500" :isDialog="false" :closeable="false" background="transparent" :close-on-click-overlay="false">
		<audio ref="music" controls class="hidden">
			<source :src="musicData" type="audio/mpeg" />
		</audio>
		<LoadingGoPlay :isShow="true" v-if="pageLoading"></LoadingGoPlay>
		<div class="result-layer" v-else>
			<img class="img-bg rotate" :src="require('./img/gold_bg_sun.png')" alt="" />

			<div class="reward-layer">
				<img class="img_glod" :src="require('./img/gold_bg.png')" alt="" />
				<div class="cont">
					<div class="tit ttu">{{ $t('bonus.Congratulations') }}</div>
					<div class="desc">
						{{ $t('bonus.You’ve got free money to bet on our games') }}
					</div>
					<div class="scroll-num amount">{{ coin }} {{ currency }}</div>
					<ButtonGoPlay class="btn" @click="handleReward"
						><span class="txt">{{ $t('bonus.Bonus Collection') }}</span></ButtonGoPlay
					>
				</div>
			</div>
		</div>
	</VanModal>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import VanModal from '../Modal/VanModal.vue';
import { useEntry, useMusic } from '@/hooks';

defineProps(['coin', 'currency']);
const pageLoading = ref(true);
const dialogShow = ref(true);
// const { openModal } = useEntry();
// const { music, musicData, claimMusic, winningMusic } = useMusic();

// 领取
function handleReward() {
	// claimMusic();
	dialogShow.value = false;
	// openModal("login");
}

onMounted(() => {
	pageLoading.value = false;
	// winningMusic();
});
</script>

<style lang="scss" scoped>
.result-layer {
	position: relative;
	overflow: hidden;
	height: 500px;
}
.hidden {
	display: none;
}

.img-bg {
	position: absolute;
	width: 100%;
	left: 0;
	top: 0;
}

.img-bg.rotate {
	-webkit-animation: rotate-srwwvyw 5s linear infinite;
	animation: rotate-srwwvyw 5s linear infinite;
}

.reward-layer {
	height: 350px;
	width: 380px;
	background-image: radial-gradient(rgba(242, 187, 47, 0.3), #191a1b 80%);
	background-size: 100% 90%;
	background-position: center center;
	background-repeat: no-repeat;
	background-color: #191a1b;
	position: relative;
	z-index: 1;
	margin: 50px 0 0 50px;
	.img_glod {
		position: absolute;
		z-index: 2;
		width: 430px;
		height: 420px;
		top: -50px;
		left: -20px;
		max-width: unset !important;
	}

	.cont {
		position: relative;
		height: 350px;
		width: 100%;
		margin-top: 50px;
		z-index: 3;
		text-align: center;
		display: flex;
		flex-direction: column;
		/* background: var(--bg3-color); */
		.tit {
			color: #fff;
			font-weight: 700;
			font-size: 22px;
			line-height: 50px;
			margin-top: 40px;
		}
		.desc {
			font-size: 16px;
			width: 70%;
			margin: 10px auto 0;
			color: #98a7b5;
		}
		.amount {
			font-weight: 900;
			background-image: linear-gradient(to bottom, #ffb03b, #fcee21, #ffff89, #fddb3e, #ffdb49, #ffeb7d, #fda60a);
			-webkit-filter: drop-shadow(2px 2px 0 #c55b1a);
			filter: drop-shadow(2px 2px 0 #c55b1a);
			-webkit-background-clip: text;
			color: transparent;
			font-size: 40px;
			font-style: italic;
			flex: auto;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.btn {
			height: 48px;
			border-radius: 4px;
			color: var(--font0-color);
			width: 70%;
			margin-left: 15%;
			margin-bottom: 30px;
		}
		.txt {
			font-weight: bold;
			font-size: 16px;
		}
	}
}

@keyframes rotate-srwwvyw {
	0% {
		-webkit-transform: rotate(0deg);
		-ms-transform: rotate(0deg);
		transform: rotate(0);
	}

	to {
		-webkit-transform: rotate(360deg);
		-ms-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}

.app_isApp {
	.reward-layer {
		margin: 20px 0 0 10px;
		width: 3.5rem;
	}
}
</style>
