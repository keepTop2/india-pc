<template>
	<div class="announcement">
		<div class="content">
			<img src="./image/megaphone.png" alt="" />
			<span>
				尊敬的会员，欢迎莅临，祝您游戏愉快，任何问题请直接联系在线客服。全新的版本给您全新的体验全新的版本给您全新的体验全新的版本给您全新的全新的版本给您全新的全新的全全新的版R本全新的版本给您全新的体验全新的版本给您全新的体验全新的版本给您全新的全新的版本给您全新的全新的全全新的版R本
			</span>
		</div>
		<div class="shadow"></div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.announcement {
	max-width: 1350px;
	margin: 20px auto 0;

	.content {
		width: 100%;
		height: 40px;
		background: url("./image/announcement_bg2.png") no-repeat;
		background-size: 100% 100%;
		color: var(--light-ok-text-s, #ffffff);
		display: flex;
		align-items: center;
		gap: 12px;
    padding: 0 24px 0 20px;

		img {
			width: 40px;
			height: 46px;
			transform: translateY(-5px);
		}

		span {
			overflow: hidden;
			text-wrap: nowrap;
			text-overflow: ellipsis;
      font-size: 14px;
		}
	}

	.shadow {
		width: 100%;
		height: 40px;
		background: url("./image/announcement_bg1.png") no-repeat;
		background-size: 100% 100%;
	}
}
</style>
