<template>
	<div class="wrapper">
		<div>
			<img src="./image/block.png" alt="" />
		</div>
		<div class="content">
			<p>(图片)logo+平台名称</p>
			<h1 class="fs_46px">访问受限</h1>
			<p class="fw_700 Text2_1">您的IP来自于：168.162.198.122</p>
			<p class="fw_700 Text2_1 mb_50">您所在的区域被禁止访问我们的网站，给您造成的不便，敬请谅解</p>
			<div class="flex_space-between">
				<button class="cancel" @click="router.back()">返回</button>
				<button class="refresh" @click="refresh">刷新</button>
			</div>
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
				border: 2px solid var(--Text-s);

				font-size: 20px;
				color: var(--Text-s);
			}
			.refresh {
				font-size: 20px;
				color: var(--Theme);
				border: none;
				background: var(--Bg-3);
			}
		}
		.common_btn {
			margin-top: 20px;
			height: 56px;
		}
	}
}
</style>
