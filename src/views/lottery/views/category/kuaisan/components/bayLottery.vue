<template>
	<div class="content">
		<div class="gameplay-container">
			<div style="width: 100%; flex: 1">
				<!-- 展示玩法配置的 Accordion 手风琴组件 -->
				<Accordion
					v-for="(item, index) in mergedLotteryList"
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
			<BetForm ref="betFormRef" @submit="handleSubmit" :value="currentLotteryItem" :actived="formActived">
				<!-- 表单激活时显示的插槽内容 -->
				<template v-if="formActived" #default>
					<div class="bet-form-slot-header">
						<div>{{ currentLotteryItem.gamePlayName }}</div>
						<div>{{ currentLotteryItem.oddsList.title }}</div>
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
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { isSmp, lotteryList } from "./playsConfig";
import { mergeLotteryList } from "/@//views/lottery/utils/index";
import { lotteryApi } from "/@/api/lottery";
import showToast from "/@/hooks/useToast";
import { useUserStore } from "/@/stores/modules/user";
import useBetForm from "/@/views/lottery/components/BetForm/Index";
import useAccordion from "/@/views/lottery/components/Tools/Accordion/Index";
import useBall from "/@/views/lottery/components/Tools/Ball/Index";
import { useWebSocket } from "/@/views/lottery/hooks/useWebSocket";
import { useLoginGame } from "/@/views/lottery/stores/loginGameStore";
import { type MergedLotteryList, type OddsListItem } from "/@/views/lottery/types/index";
import { DEFAULT_LANG, langMaps } from "/@/views/lottery/views/category/kuaisan/components/playsConfig";
import { getIndexInfo } from "/@/views/sports/utils/commonFn";

const props = defineProps({
	lotteryDetail: { type: Object, default: () => ({}) },
});

// 使用各自的组件
const { Accordion, AccordionItem } = useAccordion();
const { Ball, SelectBallGroup } = useBall();
const { BetForm } = useBetForm();
const route = useRoute();
const { satoken, merchantInfo } = useLoginGame();
useWebSocket();
// 合并后的玩法列表
const mergedLotteryList = ref<MergedLotteryList>([]);

// 选中的球的数组，用于投注表单
const balls = ref([]);
const formActived = ref(false);
const currentLotteryItem = ref(); // 当前选中的大菜单
const currentOddsListItem = ref({} as OddsListItem); // 当前选中高亮的项
const UserStore = useUserStore();
const language = UserStore.getLang;
const lang = (langMaps as any)[language] || DEFAULT_LANG;

/**
 * @description 手风琴展开玩法项的处理方法
 * @param status 当前子项选中状态
 * @param childData 当前子项数据
 * @param data 父数据
 */
const handleExpanded = (status: boolean, childData: any, data: any) => {
	mergedLotteryList.value.forEach((v) => {
		v.oddsList.forEach((w) => (w.actived = false));
	});
	childData.actived = status;
	currentOddsListItem.value = childData;
	balls.value = [];
	// 排除选择球玩法
	if (childData.type !== "selectBall") {
		formActived.value = status;
		currentLotteryItem.value = status ? { ...data, oddsList: { ...childData } } : null;
	}
};

// 选择球组的处理方法
const handleSelectBalls = ({ list }, childData: any, data: any) => {
	formActived.value = list.length ? true : false;
	currentLotteryItem.value = list.length ? { ...data, oddsList: { ...childData } } : null;
	balls.value = list;
};

// 清除手风琴展开状态的处理方法
const clearAccordionStatus = (status: boolean, index: number) => {
	mergedLotteryList.value.forEach((item, i) => {
		item.actived = index === i && status;
	});
};

// 提交表单的处理方法
const betFormRef = ref();

const shouldLetPass = () => {};

/**
 * @description 发送请求下注
 * @param
 */
const handleSubmit = async ({ stake: betMoney }: { stake: string }) => {
	console.log("currentOddsListItem", currentLotteryItem.value);

	// 1. 校验是否登录 token 和 satoken

	// 2. 校验余额是否足够

	// 3. 校验是否超过了投注限额

	// 3.1 准备一下入参
	const { gameCode, gamePlayCode, optionCode: nums } = currentOddsListItem.value;
	const { issueNum: issueNo } = props.lotteryDetail;
	const { merchantNo: operatorId, userAccount: operatorAccount } = merchantInfo.value;

	const submitData = {
		lang,
		operatorId,
		operatorAccount,
		token: satoken.value,
		list: [{ betCount: 1, multiple: 1, betMoney, nums, gameCode, gamePlayCode, issueNo }],
	};
	console.log("submitData", submitData);

	// 3.2 准备好了，发送请求
	const res = await lotteryApi.betting(submitData);
	const SUCCESS_CODE = 0; // 这个 code 等需求做完了肯定是要抽出去的。但是现在还找不到项目哪个地方定义了，现已这里先放着
	const { code, msg } = res;
	showToast(msg);

	// 这里这个 code 需要特殊判断一下
	if (code !== SUCCESS_CODE) {
		return;
	}

	getIndexInfo({}, { showLoading: false }); // 拉一下用户信息更新一下余额，后面可以考虑做成 ws 推送
	betFormRef.value.clearForm(); // 成功才清空文本框
};

onMounted(async () => {
	// 1. 获取 单个彩种的动态的玩法与赔率信息

	// 1.1 准备一下入参 gameCode lang 两个入参
	const { gameCode = "" } = route.query;
	const submitData = { gameCode, isSmp, lang };

	// 1.2 准备好了，发送请求
	const res = await lotteryApi.queryGamePlayOddsList(submitData);
	mergedLotteryList.value = mergeLotteryList(lotteryList, res.data) as MergedLotteryList;
	console.log("mergedLotteryList.value", mergedLotteryList.value);
});
</script>

<style lang="scss" scoped></style>
