<template>
	<div>
		<div class="header">
			<div class="left">
				<div class="icon">
					<img :src="currencyIcon" alt="" />
				</div>
				<div class="balance">
					<div class="label">{{ $t(`assets['余额']`) }}</div>
					<div class="value">
						<span class="mr_6">$</span><span>{{ '0.00(≈¥0)' }}</span>
					</div>
				</div>
			</div>
			<div class="right">
				<div class="bonus">
					<div class="label">{{ $t(`assets['奖金']`) }}</div>
					<div class="value">
						<span class="mr_6">$</span><span>{{ '0.00' }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="table-container">
			<div class="date">{{ Common.getYMD(Common.startOneDay()) }}</div>
			<div class="table">
				<Table v-if="tableData.length != 0" :data="tableData" />
				<NoneData v-else></NoneData>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import currencyIcon from '/@/assets/zh/default/layout/layout1/left/wallet/currencyIcon.png';
import Common from '/@/utils/common';
import Table from './components/table.vue';

const tableData = [
	{
		date: '100.00',
		name: '2024-04-06',
		type: '充值',
		address: '成功',
	},
	{
		date: '100.00',
		name: '2024-04-06',
		type: '充值',
		address: '成功',
	},
	{
		date: '100.00',
		name: '2024-04-06',
		type: '充值',
		address: '成功',
	},
	{
		date: '100.00',
		name: '2024-04-06',
		type: '充值',
		address: '成功',
	},
] as any;
</script>

<style scoped lang="scss">
.header {
	display: flex;
	padding: 16px 32px;
	border-radius: 8px;
	@include themeify {
		background: themed('Bg1');
	}

	.left {
		min-width: 408px;
		display: flex;
		align-items: center;
	}
	.right {
		position: relative;
		display: flex;
		align-items: center;
	}
	.icon {
		width: 62px;
		height: 64px;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.balance {
		flex: 1;
		margin-left: 14px;
		.label {
			@include themeify {
				color: themed('Text_s');
			}
			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
		}
		.value {
			margin-top: 2px;
			@include themeify {
				color: themed('f1');
			}
			font-family: 'Arial Black';
			font-size: 20px;
			font-weight: 900;
		}
	}
	.bonus {
		flex: 1;
		margin-left: 32px;
		.label {
			@include themeify {
				color: themed('Text1');
			}
			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
		}
		.value {
			margin-top: 2px;
			@include themeify {
				color: themed('Text_s');
			}
			font-family: 'Arial Black';
			font-size: 20px;
			font-weight: 900;
		}
	}

	.right::after {
		content: '';
		position: absolute;
		left: 0px;
		width: 2px;
		height: 56px;
		@include themeify {
			background: themed('Line');
		}
	}
}

.table-container {
	margin-top: 12px;
	padding: 24px 20px 20px;
	border-radius: 8px;
	@include themeify {
		background: themed('Bg1');
	}
	.date {
		margin-bottom: 12px;
		@include themeify {
			color: themed('Text1');
		}
		font-family: 'PingFang SC';
		font-size: 14px;
		font-weight: 400;
	}
}
</style>
