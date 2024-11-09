<template>
	<div class="content">
		<div class="gameplay-container">
			<div style="width: 100%; flex: 1">
				<!-- 展示玩法配置的 Accordion 手风琴组件 -->
				<Accordion
					v-for="(item, index) in gamePlayConfig"
					:key="item.id"
					:isExpanded="item.actived"
					@change="(status) => clearAccordionStatus(status, index)"
					:title="item.gamePlayName"
					style="margin-bottom: 4px"
				>
					<!-- 手风琴内容，仅在激活时渲染 -->
					<template v-if="item.actived" #content>
						<div class="gameplay gameplay-description">
							<!-- 使用 v-html 渲染描述内容，支持 HTML 标签如 <br> -->
							<p v-html="item.desc"></p>
						</div>

						<!-- 展示每个玩法项 -->
						<AccordionItem
							v-for="(plays, i) in item.oddsList"
							:key="plays.id"
							:actived="plays.actived"
							@select="(status) => handleExpanded(status, plays, item)"
							:title="plays.title"
							:info="plays.desc"
							:odds="plays.itemOdds"
							style="margin-bottom: 4px"
						>
							<!-- 显示选择球组组件，当玩法类型为 'selectBall' 且激活时渲染 -->
							<template v-if="plays.actived && plays.type === 'selectBall'" #default>
								<div class="accordion-content-item-balls">
									<SelectBallGroup
										@clear="() => (balls = [])"
										:type="3"
										@select="(data) => handleSelectBalls(data, plays, item)"
										:multiple="false"
										:renderBallNum="plays.ballNum"
										:maxLeng="1"
										:value="balls"
									/>
								</div>
							</template>
						</AccordionItem>
					</template>
				</Accordion>
			</div>

			<!-- 投注表单组件 -->
			<BetForm ref="betFormRef" @submit="handleSubmit" :value="gameInfo" :actived="formActived">
				<!-- 表单激活时显示的插槽内容 -->
				<template v-if="formActived" #default>
					<div class="bet-form-slot-header">
						<div>{{ gameInfo.gamePlayName }}</div>
						<div>{{ gameInfo.playMethod.title }}</div>
						<div v-if="formActived" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px">
							<Ball v-for="item in balls" :key="item" :ball-number="item" :type="3" />
						</div>
					</div>
				</template>
			</BetForm>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// 引入各组件和工具方法
import useAccordion from "/@/views/lottery/components/Tools/Accordion/Index";
import useBall from "/@/views/lottery/components/Tools/Ball/Index";
import useBetForm from "/@/views/lottery/components/BetForm/Index";
import showToast from "/@/hooks/useToast";
import { i18n } from "/@/i18n/index";
import { playsConfigList, queryGameListParams, queryGamePlayOddsListParams } from "./playsConfig";
import { integratePlaysConfig } from "/@//views/lottery/utils/index.ts";
import { lotteryApi } from "/@/api/lottery";

const $: any = i18n.global;
const props = defineProps({
	lotteryDetail: { type: Object, default: () => ({}) },
});
// 使用各自的组件
const { Accordion, AccordionItem } = useAccordion();
const { Ball, SelectBallGroup } = useBall();
const { BetForm } = useBetForm();

// 游戏玩法配置数据
const gamePlayConfig = ref({});

// 选中的球的数组，用于投注表单
const balls = ref([]);
const gameInfo = ref();
const formActived = ref(false);
const currentItem = ref({}); // 向前选中高亮的项

/**
 * @description 手风琴展开玩法项的处理方法
 * @param status 当前子项选中状态
 * @param childData 当前子项数据
 * @param data 父数据
 */
const handleExpanded = (status: boolean, childData: any, data: any) => {
	gamePlayConfig.value.forEach((v) => {
		v.oddsList.forEach((w) => (w.actived = false));
	});
	childData.actived = status;
	currentItem.value = childData;
	console.log("childData", childData);
	balls.value = [];
	// 排除选择球玩法
	if (childData.type !== "selectBall") {
		formActived.value = status;
		gameInfo.value = status ? { ...data, playMethod: { ...childData } } : null;
	}
};

// 选择球组的处理方法
const handleSelectBalls = ({ list }, childData: any, data: any) => {
	formActived.value = list.length ? true : false;
	gameInfo.value = list.length ? { ...data, playMethod: { ...childData } } : null;
	balls.value = list;
};

// 清除手风琴展开状态的处理方法
const clearAccordionStatus = (status: boolean, index: number) => {
	gamePlayConfig.value.forEach((item, i) => {
		item.actived = index === i && status ? true : false;
	});
};

// 提交表单的处理方法
const betFormRef = ref();
const handleSubmit = async ({ stake: betMoney }) => {
	const { gameCode, gamePlayCode, optionCode: nums } = currentItem.value;
	const { issueNum: issueNo } = props.lotteryDetail;
	const submitData = {
		list: [{ betCount: 1, multiple: 1, betMoney, nums, gameCode, gamePlayCode, issueNo }],
	};
	const res = await lotteryApi.betting(submitData);
	showToast($.t(`lottery['投注成功']`));
	betFormRef.value.clearForm();
};

onMounted(async () => {
	// 获取 单个彩种的动态的玩法与赔率信息
	const res = await lotteryApi.queryGamePlayOddsList(queryGamePlayOddsListParams);
	gamePlayConfig.value = integratePlaysConfig(playsConfigList, res.data);

	console.log("gamePlayConfig.value", gamePlayConfig.value);
});
</script>

<style lang="scss" scoped></style>
