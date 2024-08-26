<template>
	<div class="Notification">
		<div class="bg_Bg3 br_6 pl_16 pr_16 pb_16">
			<Tabs class="" v-model="activeKey" :list="tabList" :height="60" />
			<div class="systematic" v-if="activeKey == 1">
				<div class="card bg_Bg1">
					<p class="time color_Text1 fs_14 fw_400 mb_8">2023-07-16 15:30:00</p>
					<h3 class="title fs_14 fw_500 color_Text_s mb_8">这里是活动标题</h3>
					<div class="content">
						<img :src="notification" width="100%" alt="" class="mb_8" />
						<p class="fs_14 fw_400 color_Text1 content_text">
							如果您收到了一封有关密码重置的电子邮件，但您并未请求，请务必小心。虽然这不会以任何方式损害您的账户安全，但请查看一下步骤：避免这里是文案都好好的放哈哈发货发货发货
						</p>
						<!-- <a href="">显示所有</a>
						<a href="">隐藏</a> -->
					</div>
				</div>
			</div>
			<div class="activity" v-if="activeKey == 2">
				<div class="card bg_Bg1">
					<p class="time color_Text1 fs_14 fw_400 mb_8">2023-07-16 15:30:00</p>
					<h3 class="title fs_14 fw_500 color_Text_s mb_8">这里是活动标题1</h3>
					<div class="content">
						<img :src="notification" width="100%" alt="" class="mb_8" />
						<p class="fs_14 fw_400 color_Text1">如果您收到了一封有关密码重置的电子邮件，但您并未请求</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import pubsub from '/@/pubSub/pubSub';
import Tabs from '/@/components/Tabs/Tabs.vue';
import Dialog from '/@/components/Dialog/Dialog.vue';
import Table from './Table/Table.vue';
import notification from './notification.png';
const activeKey = ref(1);
const detailVisible = ref(false);
const taskShow = ref(false);

const defaultProps = {
	// 表格数据
	data: [
		{
			type: '每日任务',
			completedAmount: '4/2',
			status: '已完成',
			award: '0.00$',
		},
		{
			type: '每日任务',
			completedAmount: '4/2',
			status: '已完成',
			award: '0.00$',
		},
		{
			type: '每日任务',
			completedAmount: '4/2',
			status: '已完成',
			award: '0.00$',
		},
		{
			type: '每日任务',
			completedAmount: '4/2',
			status: '已完成',
			award: '0.00$',
		},
		{
			type: '每日任务',
			completedAmount: '4/2',
			status: '已完成',
			award: '0.00$',
		},
	],

	// 列定义
	columns: [
		{ field: 'type', label: '类型' },
		{ field: 'completedAmount', label: '完成量' },
		{ field: 'status', label: '状态' },
		{ field: 'award', label: '获得奖励' },
	],
};
const tabList = [
	{
		label: '系统通知',
		value: 1,
	},
	{
		label: '活动通知',
		value: 2,
	},
];

pubsub.subscribe(pubsub.PubSubEvents.TaskEvents.TaskDialogSwitch.eventName, taskSwitch);
function taskSwitch(val: boolean) {
	taskShow.value = val;
}

function goBack() {
	detailVisible.value = false;
}
function onClose() {
	detailVisible.value = false;
	taskSwitch(false);
}
</script>

<style lang="scss" scoped>
@import url('./style.scss');
</style>
