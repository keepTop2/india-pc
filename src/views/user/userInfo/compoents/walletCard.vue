<template>
	<div>
		<div class="title flex_space-between Text_s">
			<span>总余额</span>
			<span class="Text1 fs_10">$ 1000.00(≈￥7230.00)</span>
		</div>
		<div class="card">
			<div @click="router.push('/recharge')">
				<img src="../image/recharge.png" alt="" />
				<span>存款</span>
			</div>
			<div @click="router.push('/withdrawal')">
				<img src="../image/withdrawal.png" alt="" />
				<span>提现</span>
			</div>
			<div @click="router.push('/transactionRecords')">
				<img src="../image/transactionRecords.png" alt="" />
				<span>交易</span>
			</div>
			<div @click="router.push('/bettingRecords')">
				<img src="../image/bettingRecords.png" alt="" />
				<span>投注记录</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import router from "/@/router";
</script>

<style scoped lang="scss">
.title {
	height: 34px;
	font-size: 14px;
	padding: 7px 12px;
	background: url("../image/titleBg.png") no-repeat;
	background-size: 100% 100%;
	position: relative;
}
.title::before {
	position: absolute;
	content: "";
	left: 0;
	top: 50%;
	background: var(--Theme);
	transform: translateY(-50%);
	border-radius: 0 10px 10px 0;
	width: 3px;
	height: 16px;
}
.card {
	display: flex;
	justify-content: space-around;
	background: var(--Bg1);
	padding: 15px 17px;
	color: var(--Text1);
	> div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		gap: 4px;
		img {
			width: 30px;
			height: 26px;
		}
	}
}
</style>
