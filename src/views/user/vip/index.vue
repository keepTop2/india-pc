<template>
	<div class="vipWrapper">
		<div class="Header">
			<div class="title">
				{{ "VIP俱乐部" }}
			</div>
			<span class="closeIcon curp" @click="useModalStore().closeModal"><img src="./image/close_icon.png" alt="" /></span>
		</div>
		<div class="card1">
			<div>通过升级获得丰厚礼金和专属福利！加入我们精英俱乐部， 享受OKsport提供的最佳游戏体验。</div>
			<div class="goToVipRule">查看VIP等级制度</div>
		</div>
		<div class="card2">
			<div class="vipLevelBg">
				<div class="currentLevelText">当前等级</div>
				<div>
					<img src="./image/level0.png" alt="" class="vipLevelIcon" />
				</div>
				<div>VIP0</div>
				<div><span>升级所需经验:</span> <span>200/5000=</span></div>


				<div>
					
				</div>
			</div>
			<div class="kefu"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useModalStore } from "/@/stores/modules/modalStore";
</script>

<style scoped lang="scss">
.vipWrapper {
	width: 780px;
	height: 80vh;
	background: url("./image/bg.png") no-repeat;
	background-size: 100% 100%;
	.Header {
		position: relative;
		.title {
			padding-top: 30px;
			padding-bottom: 20px;
			width: 100%;
			text-align: center;
			color: var(--Text_s);
			font-size: 20px;
		}
		.closeIcon {
			position: absolute;
			right: 22px;
			top: 22px;

			img {
				width: 30px;
				height: 30px;
			}
		}
	}
	.card1 {
		width: 548px;
		color: var(--Text1);
		margin: 0 auto 30px;
		.goToVipRule {
			margin-top: 16px;
			width: 186px;
			height: 44px;
			margin: 0 auto;
			line-height: 44px;
			text-align: center;
			border: 1px solid var(--Theme);
			border-radius: 12px;
			font-size: 14px;
			color: var(--Theme);
		}
	}
	.card2 {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		gap: 16px;
		.vipLevelBg {
			padding-top: 20px;
			width: 540px;
			height: 260px;
			position: relative;
			background: url("./image/vipLevelBg.png") no-repeat;
			background-size: 100% 100%;
			.currentLevelText {
				background: url("./image/levelText_bg.png") no-repeat;
				background-size: auto 100%;
				padding: 8px 21px;
				color: var(--Text_a);
				font-weight: 500;
			}
			.vipLevelIcon {
				position: absolute;
				right: 0;
				top: 0px;
				width: 158px;
				height: 152px;
			}
		}
		.kefu {
			width: 176px;
			height: 195px;
			background: #fff;
			background-size: 100% 100%;
		}
	}
}
</style>
