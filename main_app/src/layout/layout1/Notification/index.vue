<template>
	<Dialog v-model="taskShow" title="任务" width="630" :showFooter="false">
		<div class="Task">
			<div class="flex_space-between mb_20">
				<div>
					<p class="color_Text_s fs_16 fw_500">累计奖励：</p>
					<p class="color_f1 fs_24">$ 523.00</p>
				</div>
				<div class="label">
					<span class="bg_icon color_Text_s fs_16 fw_500" @click="detailVisible = true">详情</span>
				</div>
			</div>
			<div class="bg_Bg3 br_6 pl_16 pr_16 pb_16">
				<Tabs class="" v-model="activeKey" :list="tabList" :height="60" />
				<div class="dayTask" v-if="activeKey == 1">
					<p class="color_Text_s fs_14 fw_400 mb_15"><span class="color_Text1">过期时间：</span>2023-12-18 23:59:59</p>
					<div class="card bg_Bg1">
						<div>
							<el-progress type="circle" :width="72" :percentage="25" status="success">
								<template #default="{ percentage }">
									<span class="percentage-value color_Text_s fs_14">1/4</span>
								</template>
							</el-progress>
						</div>
						<div>
							<h3 class="color_Text_s fs_16 fw_500 mb_4">任务名称</h3>
							<p class="fs_14 fw_400 color_Text1 mb_4">这里是任务内容，案发后；安徽省；哈佛；南方哈佛兰芳哈佛啦不发啦发啦不放</p>
							<h3 class="color_Text_s fs_16 fw_500 mb_4">任务奖励 <span class="color_f1">$ 34.500</span></h3>
						</div>
						<div>
							<button class="bg_Theme fs_16 color_Text_a br_4">去完成</button>
							<!-- <button class="bg_icon fs_16 color_Text_a br_4">已领取</button>
						<button class="bg_f1 fs_16 color_Text_a br_4">领取</button> -->
						</div>
					</div>
				</div>
				<div class="weekTask" v-if="activeKey == 2">
					<p class="color_Text_s fs_14 fw_400 mb_15"><span class="color_Text1">过期时间：</span>2023-12-18 23:59:59</p>
					<div class="card bg_Bg1">
						<div>
							<el-progress type="circle" :width="72" :percentage="25" status="success">
								<template #default="{ percentage }">
									<span class="percentage-value color_Text_s fs_14">1/4</span>
								</template>
							</el-progress>
						</div>
						<div>
							<h3 class="color_Text_s fs_16 fw_500 mb_4">任务名称</h3>
							<p class="fs_14 fw_400 color_Text1 mb_4">这里是任务内容，案发后；安徽省；哈佛；南方哈佛兰芳哈佛啦不发啦发啦不放</p>
							<h3 class="color_Text_s fs_16 fw_500 mb_4">任务奖励 <span class="color_f1">$ 34.500</span></h3>
						</div>
						<div>
							<button class="bg_Theme fs_16 color_Text_a br_4">去完成</button>
							<!-- <button class="bg_icon fs_16 color_Text_a br_4">已领取</button>
						<button class="bg_f1 fs_16 color_Text_a br_4">领取</button> -->
						</div>
					</div>
				</div>
			</div>
			<Dialog title="任务详情" width="630" v-model="detailVisible">
				<template #header>
					<div class="my-header">
						<h4 class="color_Text_s fs_20 fw_500">
							<SvgIcon @click="goBack()" iconName="back_icon" width="20" height="20" alt="" />
							任务详情
						</h4>
						<SvgIcon class="close" @click="onClose" iconName="dialog_close" />
					</div>
				</template>
				<div class="p_21 task_content">
					<p>2023-12-16</p>
					<Table :tableData="defaultProps.data" :height="68" :columns="defaultProps.columns">
						<template #cell-type="{ data }">
							<span>{{ data.type }}</span>
						</template>
						<template #cell-completedAmount="{ data }">
							<span>{{ data.completedAmount }}</span>
						</template>
						<template #cell-status="{ data }">
							<span style="color: #ff0000">{{ data.status }}</span>
						</template>
						<template #cell-award="{ data }">
							<span>{{ data.award }}</span>
						</template>
					</Table>
					<p>2023-12-16</p>
					<Table :tableData="defaultProps.data" :height="68" :columns="defaultProps.columns">
						<template #cell-type="{ data }">
							<span>{{ data.type }}</span>
						</template>
						<template #cell-completedAmount="{ data }">
							<span>{{ data.completedAmount }}</span>
						</template>
						<template #cell-status="{ data }">
							<span style="color: #ff0000">{{ data.status }}</span>
						</template>
						<template #cell-award="{ data }">
							<span>{{ data.award }}</span>
						</template>
					</Table>
				</div>
			</Dialog>
		</div>
	</Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import pubsub from '/@/pubSub/pubSub';
import Tabs from '/@/components/Tabs/Tabs.vue';
import Dialog from '/@/components/Dialog/Dialog.vue';
import Table from './Table/Table.vue';
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
		label: '每日任务',
		value: 1,
	},
	{
		label: '每周任务',
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
