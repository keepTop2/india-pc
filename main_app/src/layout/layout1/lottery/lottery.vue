<template>
	<Dialog v-model="visible" width="488px" @close="close" :showClose="false">
		<div class="content">
			<div class="tabs">
				<ul>
					<li :class="['color_Text_a', { active: tab.value === currentTab }]" v-for="tab in tabs" :key="tab.name" @click="selectTab(tab.value)">
						<img v-if="tab.value === currentTab" :src="getImg(tab.value)" alt="" />
						<a>{{ tab.name }}</a>
					</li>
				</ul>
			</div>
			<div class="lottery">
				<Spin @start-spinning-callback="spinStart" @end-spinning-callback="spinEnd" :reward="reward" :spinList="spinList" />
			</div>
		</div>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import pubsub from '/@/pubSub/pubSub';
import Dialog from '/@/components/Dialog/Dialog.vue';
import Spin from '/@/components/Spin/Spin.vue';
import { mockDoGetReward, mockGetSpinList } from './api.ts';

const spinList = ref();
const reward = ref();
const visible = ref(false);
const currentTab = ref('1');
const tabs = ref([
	{
		name: '青铜',
		value: '1',
	},
	{
		name: '白银',
		value: '2',
	},
	{
		name: '黄金',
		value: '3',
	},
	{
		name: '钻石',
		value: '4',
	},
]);

onMounted(() => {
	/**
	 * @description 获取奖项列表
	 */

	mockGetSpinList().then((res: { data: Array<object> }) => {
		spinList.value = res.data;
	});
});

pubsub.subscribe(pubsub.PubSubEvents.LotteryEvents.LotteryDialogSwitch.eventName, lotterySwitch);
function lotterySwitch(val: boolean) {
	visible.value = val;
}

const spinStart = () => {
	/**
	 * @description 抽奖开始
	 */
	mockDoGetReward().then((res: { data: {} }) => {
		reward.value = res.data;
	});
};
const spinEnd = () => {
	/**
	 * 处理转盘停止后的逻辑
	 */
};

// 根据currentTab返回不同的img
const getImg = (val: string) => {
	return new URL(`/@/assets/zh/default/lottery/tab_bg${val}.png`, import.meta.url).href;
};
const selectTab = (tabKey: string) => {
	currentTab.value = tabKey;
};
const close = () => {
	console.log('close');
};
</script>

<style scoped lang="scss">
@import './style.scss';
</style>
