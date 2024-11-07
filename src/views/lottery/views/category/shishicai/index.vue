<template>
	<div class="lottery-bet-page lottery-shishicai">
		<!-- 头部 -->
		<LotteryHeader />
		<!-- 分割线 -->
		<div class="line" />

		<div class="tabs">
			<div :class="['tabs-item', tabsActived === item.value ? 'actived' : '']" @click="handleTabChange(item.value)" v-for="item in tabs" :key="item.value">{{ item.label }}</div>
		</div>

		<div class="content">
			<div style="display: flex; justify-content: space-between; align-items: start; gap: 8px">
				<div style="width: 100%; flex: 1">
					<Accordion
						style="margin-bottom: 4px"
						v-for="(item, index) in gamePlayConfig"
						:isExpanded="item.actived"
						@change="(status) => clearAccordionStatus(status, index)"
						:title="item.gamePlayName"
					>
						<template v-if="item.actived" #content>
							<div class="gameplay">
								<p v-html="item.desc"></p>
							</div>
							<AccordionItem
								style="margin-bottom: 4px"
								v-for="(plays, i) in item.playMethods"
								:actived="plays.actived"
								@select="(status) => handleExpanded(i, status, plays, item)"
								:title="plays.title"
								:info="plays.desc"
								:odds="plays.odds"
							>
								<template v-if="plays.actived && plays.type === 'selectBall'" #default>
									<div class="accordion-content-item-balls">
										<SelectBallGroup @clear="() => (balls = [])" :type="2" @select="handleSelectBalls" :renderBallNum="plays.ballNum" :maxLeng="3" :value="balls" />
									</div>
								</template>
							</AccordionItem>
						</template>
					</Accordion>
				</div>
				<BetForm @submit="handleSubmit" :actived="formActived">
					<template v-if="formActived" #default>
						<div class="bet-form-slot-header">
							<div>{{ gameInfo.gamePlayName }}</div>
							<div>{{ gameInfo.children.title }}</div>
							<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px" v-if="formActived">
								<Ball v-for="item in balls" :key="item" :ball-number="item" :type="2" />
							</div>
						</div>
					</template>
				</BetForm>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useLotteryHeader from "/@/views/lottery/components/LotteryHeader/Index";
import useAccordion from "/@/views/lottery/components/Tools/Accordion/Index";
import useBall from "/@/views/lottery/components/Tools/Ball/Index";
import useBetForm from "/@/views/lottery/components/BetForm/Index";
const mockData = {
	icon: "https://ctopalistat3.zengchenglm.com/pc/images/db_DB5FC2cea4e2f859029cdbda33fffda6ea1f2.png",
	title: "时时彩",
	desc: "五分钟一期",
	seconds: 100,
	betStatusName: "投注中",
	issuesNo: "20230812-084",
	recentlyAwarded: 5403.23,
};
const { LotteryHeader } = useLotteryHeader({ data: mockData });
const { Accordion, AccordionItem } = useAccordion();
const { Ball, SelectBallGroup } = useBall();
const { BetForm } = useBetForm();
const tabs = [
	{
		label: "购买彩票",
		value: 1,
	},
	{
		label: "开奖结果",
		value: 2,
	},
];

const gamePlayConfig = ref([
	{
		gamePlayName: "总和",
		gamePlayCode: "sum",
		desc: `总和大小：开奖号码之和≥23为“大”，≤22为“小”。<br> 总和单双：开奖号码之和的个位数为1、3、5、7、9为“单”，0、2、4、6、8为“双”。`,
		id: "1",
		actived: false,
		playMethods: [
			{
				title: "大",
				desc: "开奖号码之和≥23为“大”",
				odds: 1.995,
				id: "1-1",
				actived: false,
			},
			{
				title: "小",
				desc: "开奖号码之和≤22为“小”",
				odds: 2.395,
				id: "1-2",
				actived: false,
			},
			{
				title: "单",
				desc: "开奖号码之和≤22为“小”",
				odds: 1.05,
				id: "1-3",
				actived: false,
			},
			{
				title: "双",
				desc: "开奖号码之和的个位数为1、3、5、7、9为“单”",
				odds: 1.995,
				id: "1-4",
				actived: false,
			},
		],
	},
	{
		gamePlayName: "第一球",
		gamePlayCode: "selectBall",
		desc: `大小：开奖号码≥5为“大”，≤4为“小”。<br> 单双：开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。`,
		id: "2",
		actived: false,
		playMethods: [
			{
				title: "大",
				odds: 9.775,
				id: "2-1",
				desc: "开奖号码≥5为“大”",
				actived: false,
			},
			{
				title: "小",
				desc: "开奖号码≤4为“小”",
				odds: 2.395,
				id: "2-2",
				actived: false,
			},
			{
				title: "单",
				desc: "开奖号码1、3、5、7、9为“单”",
				odds: 1.05,
				id: "2-3",
				actived: false,
			},
			{
				title: "双",
				desc: "开奖号码0、2、4、6、8为“双”",
				odds: 1.995,
				id: "2-4",
				actived: false,
			},
			{
				title: "选择球",
				odds: 7.995,
				id: "2-5",
				actived: false,
				type: "selectBall",
				ballNum: 27,
			},
		],
	},
]);

const balls = ref([]);
const gameInfo = ref();
const formActived = ref(false);

const handleExpanded = (index: number, status: boolean, childData: any, data: any) => {
	gamePlayConfig.value.forEach((v) => {
		v.playMethods.forEach((w) => (w.actived = false));
	});
	childData.actived = status;
	balls.value = [];
	formActived.value = status;
	gameInfo.value = status ? { ...data, children: { ...childData } } : null;
};

const handleSelectBalls = ({ value, list }) => {
	balls.value = list;
};

const clearAccordionStatus = (status, index) => {
	gamePlayConfig.value.forEach((item, i) => {
		item.actived = index === i && status ? true : false;
	});
};

const handleSubmit = () => {};

const tabsActived = ref(1);
const handleTabChange = (id: number) => {
	tabsActived.value = id;
};
</script>

<style lang="scss" scoped>
.lottery-bet-page {
	width: 1308px;
	margin: 0 auto;
	margin-top: 24px;
	background-color: var(--Bg1);
	border-radius: 12px;
	padding: 20px;
	.line {
		border: 1px solid var(--lineBg);
		margin: 16px 0;
	}
	.tabs {
		display: flex;
		align-items: center;
		column-gap: 4px;
		margin-bottom: 16px;
		&-item {
			width: 96px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			color: var(--Text1);
			font-size: 14px;
			background-color: var(--button);
			border-radius: 4px;
			cursor: pointer;
			&.actived {
				background-color: var(--Bg5);
				color: var(--Text_a);
			}
		}
	}
	.accordion-content-item-balls {
		padding: 12px;
		background-color: var(--Bg1);
		border: 1px solid var(--Line_2);
		border-radius: 8px;
		margin-top: 4px;
	}
	.bet-form-slot-header {
		> div:nth-child(2) {
			font-size: 12px;
			margin-top: 8px;
		}
	}
}
</style>
