<template>
	<div>
		<div class="card-container">
			<div class="header">
				<div class="header-item" :class="{ 'header-item-active': headerActive == index }" v-for="(item, index) in ChannelData" :key="item.code">
					<a @click="onSelectChannel(item, index)">{{ item.name }}</a>
				</div>
			</div>
			<div class="main">
				<div class="channel-card" :class="{ 'card-active': channelActive == index }" v-for="(item, index) in 13" :key="index" @click="onChoose(item, index)">
					<div v-if="index == 0" class="badge">+{{ 10 }}%</div>
					<div class="logo">
						<img :src="currencyIcon" alt="" />
					</div>
					<div class="name">
						<span>ABA</span>
					</div>
				</div>
			</div>
		</div>
		<WithdrawDialog :show="withdrawDialogVisible" @close="withdrawDialogVisible = false" @finish="withdrawInfoVisible = true" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import currencyIcon from '/@/assets/zh/default/layout/layout1/left/wallet/currencyIcon.png';
import router from '/@/router';
import WithdrawDialog from './components/withdrawDialog/index.vue'; // 提现表单弹窗
const ChannelData = [
	{
		name: '推荐方式',
		code: '',
	},
	{
		name: '银行卡',
		code: '1',
	},
	{
		name: '电子钱包',
		code: '2',
	},
	{
		name: '银行转账',
		code: '3',
	},
];
const headerActive = ref('' as string | number);
const channelActive = ref('' as string | number);
const withdrawDialogVisible = ref(false);
const withdrawInfoVisible = ref(false);

const onChoose = (item: any, index: number) => {
	withdrawDialogVisible.value = true;
	channelActive.value = index;
};

const onSelectChannel = (item: any, index: number) => {
	router.push({
		path: '/wallet/withdraw',
		query: {
			tab: item.code,
		},
	});
	headerActive.value = index;
};
</script>

<style scoped lang="scss">
.card-container {
	border-radius: 8px;
	@include themeify {
		background: themed('Bg1');
	}
	overflow: hidden;

	.header {
		display: flex;
		height: 60px;
		padding: 0px 26px;
		border-bottom: 1px solid;
		@include themeify {
			border-color: themed('Line');
		}
		.header-item {
			width: 156px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 2px solid transparent;
			a {
				@include themeify {
					color: themed('Text1');
				}
				font-family: 'PingFang SC';
				font-size: 16px;
				font-weight: 500;
				cursor: pointer;
			}
		}
		.header-item-active {
			border-bottom: 2px solid;
			@include themeify {
				border-color: themed('Theme');
			}
			a {
				@include themeify {
					color: themed('Text_s');
				}
			}
		}
	}

	.main {
		height: 589px;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		gap: 20px;
		margin-top: 32px;
		margin-bottom: 32px;
		padding: 0px 36px 0px 32px;
		box-sizing: border-box;
		overflow: scroll;

		.card-active {
			position: relative;
		}

		.card-active::after {
			content: '';
			position: absolute;
			top: 0px;
			left: 0px;
			width: 100%;
			height: 100%;
			border: 2px solid;
			@include themeify {
				border-color: themed('Theme');
			}
			border-radius: 8px;
			box-sizing: border-box;
			z-index: 2;
		}
		.channel-card {
			position: relative;
			width: 168px;
			border-radius: 8px;
			overflow: hidden;
			cursor: pointer;

			.badge {
				position: absolute;
				top: 0px;
				right: 0px;
				width: 44px;
				height: 20px;
				border-radius: 0px 6px 0px 12px;
				@include themeify {
					color: themed('Text_a');
				}
				background: linear-gradient(180deg, #ff6b6b 0%, #e81919 100%);
				font-family: 'PingFang SC';
				font-size: 12px;
				font-weight: 400;
				line-height: 19px;
				text-align: center;
			}
			.logo {
				width: 100%;
				height: 72px;
				display: flex;
				align-items: center;
				justify-content: center;
				@include themeify {
					background: themed('Bg3');
				}
				img {
					width: 62px;
					height: 64px;
				}
			}
			.name {
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: linear-gradient(0deg, #138386 0%, #1a476b 100%);
				transition: all 0.1s ease;
				overflow: hidden;
				@include themeify {
					color: themed('Text_a');
				}
				font-family: 'PingFang SC';
				font-size: 14px;
				font-weight: 400;
				border-radius: 0px 0px 8px 8px;
				z-index: 1;
			}
		}
	}
}
</style>
