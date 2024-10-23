<template>
	<div class="max-width feedback_wrapper pt_30 pr_10 pl_10">
		<div class="tabs mb_30 curp">
			<div v-for="(item, index) in tabs" :key="index" :class="currentTab === item.value ? 'activeTab' : ''" @click="setCurrentTab(item)">
				{{ item.label }}
			</div>
		</div>
		<div class="fade-in">
			<div class="payMethods">
				<div class="fs_20 mb_20 Text_s fw_500">付款方式</div>
				<slide>
					<div v-for="(item, index) in 20" :key="index" class="payMethodsItem">
						<img src="http://api.btstu.cn/sjbz/?lx=meizi" alt="" />
						<p class="Texta fs_14">{{ item }}123123</p>
					</div>
				</slide>
			</div>
			<div class="payContent">
				<div class="form">
					<p class="Text_s mb_8">名字</p>
					<p><input type="text" class="common_input" /></p>
					<p class="Text_s mt_16 mb_8">姓</p>
					<p><input type="text" class="common_input" /></p>
					<p class="Text_s mt_16 mb_8">电子邮箱</p>
					<p><input type="text" class="common_input" /></p>
					<p class="Text_s mt_16 mb_8">存款金额</p>
					<p><input type="text" class="common_input" /></p>
					<div class="flex-center">
						<div v-for="(item, index) in 5" :key="index">{{ item }}00</div>
					</div>
					<div class="format">
						<p>
							<span>存款金额</span>
							<span>100</span>
						</p>
						<p>
							<span>手续费(1.00%)</span>
							<span>100</span>
						</p>
						<p>
							<span>预计到账金额</span>
							<span>100</span>
						</p>
					</div>
					<div class="text-center">
						<button class="common_btn">立即存款</button>
					</div>
				</div>
				<div class="text">
					<p>注意：</p>
					<p>
						1.请确保填写真实正确信息，存款金额必须与订单金额一致，切勿重复支付，切勿修改金额，请按照时间内支付
						2.支付后，必须上传银行转账凭证（回执单）并点击【我已付款】，否则无法到账，我司概不负责 3.若出现存款异常 请联系客服
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const selectedFiles = ref<Array<File>>([]);
const currentTab = ref(0);
const tabs = ref([
	{
		value: 0,
		label: "推荐方式",
	},
	{
		value: 1,
		label: "银行卡",
	},
	{
		value: 2,
		label: "电子钱包",
	},
	{
		value: 3,
		label: "存款类型2",
	},
	{
		value: 4,
		label: "存款类型3",
	},
]);
const setCurrentTab = (item: any) => {
	currentTab.value = item.value;
};
</script>

<style scoped lang="scss">
.tabs {
	display: flex;
	gap: 60px;
	color: var(--Text2_1);
	> div {
		position: relative;
	}
	.activeTab {
		color: var(--Theme);
	}
	.activeTab::after {
		display: block;
		content: "";
		position: absolute;
		width: 60%;
		height: 2px;
		left: 50%;
		bottom: -5px;
		border-radius: 2px;
		transform: translateX(-50%);
		background-color: var(--Theme);
	}
}
.payMethods {
	background-color: var(--Bg1);
	padding: 25px;
	border-radius: 8px;

	.payMethodsItem {
		margin-right: 16px;
		border-radius: 8px;

		border: 1px solid var(--Line_2);
		img {
			width: 159px;
			height: 76px;
			border-radius: 8px 8px 0 0;
			pointer-events: none;
			object-fit: cover;
		}
		p {
			text-align: center;
			border-top: none;
			height: 37px;
			line-height: 37px;
		}
	}
}
.payContent {
	background: var(--Bg1);
	display: flex;
	padding: 14px 14px 14px 0;
	gap: 20px;
	border-radius: 8px;
	margin-top: 12px;
	> div {
		width: 50%;
		padding: 14px;
	}
	.text {
		background: var(--Bg3);
		border-radius: 8px;
		color: var(--Text1);
	}
	.form {
		padding-top: 4px;
		.common_input {
			background: var(--Bg2);
			height: 46px;
		}
		.common_btn {
			width: 384px;
			height: 48px;
			margin-top: 18px;
		}
	}
}
</style>
