<template>
	<div class="wrapper">
		<div>
			<img src="./image/maintain.png" alt="" />
		</div>
		<div class="content">
			<p>(图片)logo+平台名称</p>
			<h1 class="fs_46px">系统维护中</h1>
			<p class="fw_700 Text2_1 mb_50">尊敬的用户，当前游戏正在维护中，维护时间： 2023-12-19 18:43:00～2023-12-19 19:00:00</p>

			<button class="common_btn" @click="Common.getSiteCustomerChannel">联系客服</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import router from "/@/router";
import Common from "/@/utils/common";
const refresh = () => {
	window.location.reload();
};
</script>

<style lang="scss">
.wrapper {
	height: 100vh;
	width: 100vw;
	background-color: var(--Bg);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	> div {
		width: 450px;
		img {
			width: 450px;
			height: 450px;
		}
	}
	.content {
		display: flex;
		flex-direction: column;
		align-content: center;
		justify-content: center;
		gap: 10px;
		padding: 0 30px;
		.flex_space-between {
			gap: 20px;
			button {
				cursor: pointer;
				height: 56px;
				width: 168px;
				background-color: transparent;
				border-radius: 6px;
			}
			.cancel {
				border: 2px solid var(--Text_s);

				font-size: 20px;
				color: var(--Text_s);
			}
			.refresh {
				font-size: 20px;
				color: var(--Theme);
				border: none;
				background: var(--Bg3);
			}
		}
		.common_btn {
			margin-top: 20px;
			height: 56px;
		}
	}
}
</style>
