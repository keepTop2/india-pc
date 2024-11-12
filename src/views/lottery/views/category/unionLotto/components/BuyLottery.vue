<template>
	<div class="content">
		<div class="gameplay-container">
			<div style="width: 100%; flex: 1">
				<!-- 玩法选择区 -->
				<Accordion
					v-for="(item, index) in mergedLotteryList"
					:key="item.id"
					:isExpanded="item.actived"
					@change="(status) => clearAccordionStatus(status, index)"
					:title="item.gamePlayName"
					style="margin-bottom: 4px"
				>
					<template v-if="item.actived" #content>
						<div class="gameplay gameplay-description">
							<p v-html="item.desc"></p>
						</div>

						<AccordionItem
							v-for="plays in item.oddsList"
							:key="plays.id"
							:actived="plays.actived"
							@select="(status) => handleExpanded(status, plays, item)"
							:title="plays.title"
							:info="plays.desc"
							:odds="plays.itemOdds"
							style="margin-bottom: 4px"
						>
							<!-- 选号区域 -->
							<template v-if="plays.actived && plays.type === 'selectBall'" #default>
								<div class="ball-selection">
									<!-- 红球区 -->
									<div class="red-balls">
										<div class="title">红球号码</div>
										<SelectBallGroup
											@clear="clearRedBalls"
											:type="1"
											@select="(data) => handleSelectRedBalls(data, plays, item)"
											:multiple="true"
											:renderBallNum="plays.ballNum"
											:maxLeng="6"
											:value="redBalls"
										/>
									</div>

									<!-- 蓝球区 -->
									<div class="blue-balls">
										<div class="title">蓝球号码</div>
										<SelectBallGroup
											@clear="clearBlueBalls"
											:type="2"
											@select="(data) => handleSelectBlueBalls(data, plays, item)"
											:multiple="false"
											:renderBallNum="plays.blueBallNum || 16"
											:maxLeng="1"
											:value="blueBalls"
										/>
									</div>
								</div>
							</template>
						</AccordionItem>
					</template>
				</Accordion>
			</div>

			<!-- 投注表单 -->
			<BetForm ref="betFormRef" @submit="handleSubmit" :value="betFormValue" :actived="formActived">
				<!-- 投注表单插槽 -->
				<template v-if="!formActived" #default>
					<span>选择你的幸运号码</span>
				</template>
				<template v-if="formActived" #default>
					<div class="bet-form-slot-header">
						<div class="play-info">
							<div class="play-name">{{ gameInfo.gamePlayName }}</div>
							<div class="play-method">{{ gameInfo.playMethod.title }}</div>
						</div>
						<div v-if="formActived" class="selected-balls">
							<template v-if="currentOddsListItem.type === 'selectBall'">
								<div class="red-balls" v-if="redBalls.length">
									<Ball v-for="ball in redBalls" :key="ball" :ball-number="ball" :type="1" />
								</div>
								<div class="blue-balls" v-if="blueBalls.length">
									<Ball v-for="ball in blueBalls" :key="ball" :ball-number="ball" :type="2" />
								</div>
							</template>
							<template v-else>
								<div class="selected-option">
									{{ currentOddsListItem.title }}
								</div>
							</template>
						</div>
					</div>
				</template>
			</BetForm>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { mergeLotteryList } from "../../../../utils/mergeLotteryList";
import { lotteryList, queryGamePlayOddsListParams } from "./playsConfig";
import { lotteryApi } from "/@/api/lottery";
import showToast from "/@/hooks/useToast";
import Common from "/@/utils/common";
import useBetForm from "/@/views/lottery/components/BetForm/Index";
import useAccordion from "/@/views/lottery/components/Tools/Accordion/Index";
import useBall from "/@/views/lottery/components/Tools/Ball/Index";
import { useWebSocket } from "/@/views/lottery/hooks/useWebSocket";
import { useLoginGame } from "/@/views/lottery/stores/loginGameStore";
import { type MergedLotteryList, type OddsListItem } from "/@/views/lottery/types/index";
import { getIndexInfo } from "/@/views/sports/utils/commonFn";

const props = defineProps({
	lotteryDetail: { type: Object, default: () => ({}) },
});

// 组件引用
const { Accordion, AccordionItem } = useAccordion();
const { Ball, SelectBallGroup } = useBall();
const { BetForm } = useBetForm();
const { satoken } = useLoginGame();
useWebSocket();

// 状态管理
const mergedLotteryList = ref<MergedLotteryList>([]);
const redBalls = ref<number[]>([]); // 红球
const blueBalls = ref<number[]>([]); // 蓝球
const gameInfo = ref();
const formActived = ref(false);
const currentOddsListItem = ref<OddsListItem>({} as OddsListItem);

// 清空选球
const clearRedBalls = () => (redBalls.value = []);
const clearBlueBalls = () => (blueBalls.value = []);

// 选球处理
const handleSelectRedBalls = ({ list }, childData: any, data: any) => {
	redBalls.value = list;
	updateFormStatus(childData, data);
};

const handleSelectBlueBalls = ({ list }, childData: any, data: any) => {
	blueBalls.value = list;
	updateFormStatus(childData, data);
};

// 更新表单状态
const updateFormStatus = (childData: any, data: any) => {
	const isValid = redBalls.value.length === 6 && blueBalls.value.length === 1;
	formActived.value = isValid;
	gameInfo.value = isValid ? { ...data, playMethod: { ...childData } } : null;
};

// 展开处理
const handleExpanded = (status: boolean, childData: any, data: any) => {
	mergedLotteryList.value.forEach((v) => {
		v.oddsList.forEach((w) => (w.actived = false));
	});
	childData.actived = status;
	currentOddsListItem.value = childData;
	clearRedBalls();
	clearBlueBalls();

	if (childData.type !== "selectBall") {
		formActived.value = status;
		gameInfo.value = status ? { ...data, playMethod: { ...childData } } : null;
	}
};

// 清除状态
const clearAccordionStatus = (status: boolean, index: number) => {
	mergedLotteryList.value.forEach((item, i) => {
		item.actived = index === i && status;
	});
};

// 投注表单数据
const betFormValue = computed(() => {
	if (!gameInfo.value || !currentOddsListItem.value) return null;

	return {
		playMethod: {
			...currentOddsListItem.value,
			odds: Number(currentOddsListItem.value.itemOdds),
			minBet: currentOddsListItem.value.minBet || 2,
			maxBet: currentOddsListItem.value.maxBet || 10000,
		},
		...gameInfo.value,
	};
});

// 提交处理
const handleSubmit = async ({ stake: betMoney, maxOdds }: { stake: number; maxOdds: string }) => {
	const { gameCode, gamePlayCode } = currentOddsListItem.value;
	const { issueNum: issueNo } = props.lotteryDetail;

	let nums = "";
	if (currentOddsListItem.value.type === "selectBall") {
		nums = redBalls.value.length ? `${redBalls.value.join(",")}|${blueBalls.value.join(",")}` : blueBalls.value.join(",");
	} else {
		nums = currentOddsListItem.value.optionCode;
	}

	const submitData = {
		token: satoken.value,
		list: [
			{
				betCount: 1,
				multiple: 1,
				betMoney,
				nums,
				gameCode,
				gamePlayCode,
				issueNo,
			},
		],
	};

	try {
		const res = await lotteryApi.betting(submitData);
		const { code, msg } = res;

		if (code !== Common.ResCode.SUCCESS) {
			showToast(msg);
			return;
		}

		getIndexInfo();
		betFormRef.value.clearForm();
		clearRedBalls();
		clearBlueBalls();
		showToast("投注成功");
	} catch (error) {
		showToast("投注失败");
	}
};

onMounted(async () => {
	const res = await lotteryApi.queryGamePlayOddsList(queryGamePlayOddsListParams);
	mergedLotteryList.value = mergeLotteryList(lotteryList, res.data) as MergedLotteryList;
});
</script>

<style lang="scss" scoped>
.ball-selection {
	padding: 12px;

	.title {
		font-size: 14px;
		color: #666;
		margin-bottom: 8px;
	}

	.red-balls,
	.blue-balls {
		margin-bottom: 16px;
	}
}

.selected-balls {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	margin-top: 8px;

	.red-balls,
	.blue-balls {
		display: flex;
		gap: 4px;
	}
}
</style>
