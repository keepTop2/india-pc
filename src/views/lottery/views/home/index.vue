<template>
	<div class="lottery">
		<div class="lottery-list">
			<LotteryCard />
		</div>

		<div class="lottery-list mt-20">
			<HotLotteryCard />
		</div>

		<div class="lottery-header-box bg1 mt-20">
			<LotteryHeader />
		</div>
		<div style="margin: 20px 0 0 20px">
			<el-button type="primary" size="default" @click="startTime">开始</el-button>
			<el-button type="primary" size="default" @click="resetTime">重置</el-button>
		</div>

		<div class="lottery-ball-box bg1 mt-20">
			<div style="display: flex; column-gap: 10px">
				<Ball
					v-for="(item, index) in ballActiveds2"
					:key="index"
					@select="
						() => {
							ballActiveds2[index] = !ballActiveds2[index];
						}
					"
					:actived="item"
					:type="1"
					:ball-number="index + 1"
				/>
			</div>
		</div>

		<div class="lottery-ball-box bg1 mt-20">
			<div style="display: flex; column-gap: 10px">
				<Ball
					v-for="(item, index) in ballActiveds1"
					:key="index"
					@select="
						() => {
							ballActiveds1[index] = !ballActiveds1[index];
						}
					"
					:actived="item"
					:type="2"
					:ball-number="index + 1"
				/>
			</div>
		</div>

		<div class="lottery-ball-box bg1 mt-20">
			<div style="display: flex; column-gap: 10px">
				<Ball v-for="item in 7" :key="item" :ball-number="item" :type="1" />

				<Ball :ball-number="8" :type="2" />
			</div>
		</div>

		<div class="lottery-dice-box bg1 mt-20">
			<div style="display: flex; column-gap: 10px">
				<Dice v-for="item in 6" :points="item" :type="1" />

				<Dice v-for="item in 6" :points="item" :type="2" />
			</div>
		</div>

		<div class="lottery-bet-form-box bg1 mt-20">
			<div style="display: flex; justify-content: space-between; align-items: start; gap: 8px">
				<div style="width: 100%; flex: 1">
					<Accordion :isExpanded="expandedArr[0]" @change="(status) => (expandedArr[0] = status)" title="总和">
						<template v-if="expandedArr[0]" #content>
							<div class="gameplay">
								<p>总和大小：开奖号码之和≥23为“大”，≤22为“小”。</p>
								<p>总和单双：开奖号码之和的个位数为1、3、5、7、9为“单”，0、2、4、6、8为“双”。</p>
							</div>
							<AccordionItem
								:actived="activdIndex === 0"
								@select="(status) => handleExpanded(0, status, { title: '总和', rule: '大' })"
								title="大"
								info="开奖号码之和≥23为“大”"
								:odds="1.995"
							/>
						</template>
					</Accordion>

					<Accordion :isExpanded="expandedArr[1]" @change="(status) => (expandedArr[1] = status)">
						<template #title>
							<span>选择球</span>
						</template>
						<template v-if="expandedArr[1]" #content>
							<div class="gameplay">
								<p>总和大小：开奖号码之和≥23为“大”，≤22为“小”。</p>
								<p>总和单双：开奖号码之和的个位数为1、3、5、7、9为“单”，0、2、4、6、8为“双”。</p>
							</div>
							<AccordionItem :actived="activdIndex === 1" @select="(status) => handleBallsExpanded(1, status, { title: '总和', rule: '选择球' })" title="选择球" :odds="1.995" />
							<div v-if="showBalls" class="accordion-content-item-balls">
								<SelectBallGroup @clear="() => (balls = [])" :type="2" @select="handleSelectBalls" :renderBallNum="27" :maxLeng="3" :value="balls" />
							</div>
						</template>
					</Accordion>
				</div>
				<BetForm @submit="handleSubmit" :actived="gameInfo ? true : false">
					<template v-if="gameInfo" #default>
						<div class="bet-form-slot-header">
							<div>{{ gameInfo?.title }}</div>
							<div>{{ gameInfo?.rule }}</div>
							<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px" v-if="showBalls">
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
import { ref, watch } from "vue";
// import useLotteryCard from "../../components/LotteryCard/index";
import useLotteryCard from "/@/views/lottery/components/LotteryCard/index";
import useLotteryHeader from "/@/views/lottery/components/LotteryHeader/Index";
import useBall from "/@/views/lottery/components/Tools/Ball/Index";
import useDice from "/@/views/lottery/components/Tools/Dice/Index";
import useBetForm from "/@/views/lottery/components/BetForm/Index";
import useAccordion from "/@/views/lottery/components/Tools/Accordion/Index";
const { LotteryCard, HotLotteryCard } = useLotteryCard();
const { LotteryHeader, startTime, pauseTime, resetTime } = useLotteryHeader({ seconds: 68, immediate: false });
const { Ball, SelectBallGroup } = useBall();
const { Dice } = useDice();
const { Accordion, AccordionItem } = useAccordion();
const { BetForm } = useBetForm();

const ballActiveds1 = ref(new Array(10).fill(false));
const ballActiveds2 = ref(new Array(10).fill(false));

const expandedArr = ref([true, false]);
const balls = ref([]);
const showBalls = ref(false);
const gameInfo = ref();
const activdIndex = ref();
const handleSelectBalls = ({ value, list }) => {
	balls.value = list;
};
const handleBallsExpanded = (index: number, status: boolean, data: any) => {
	showBalls.value = status;
	handleExpanded(index, status, data);
};
const handleExpanded = (index: number, status: boolean, data: any) => {
	activdIndex.value = status ? index : undefined;
	Ball.value = [];
	gameInfo.value = status ? { ...data } : null;
};
const handleSubmit = () => {};
</script>

<style lang="scss" scoped>
.lottery {
	width: 1308px;
	margin: 0 auto;
	margin-top: 24px;
	.lottery-list {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
		.lottery-card {
			width: calc((100% - 48px) / 4);
		}
	}
	.mt-20 {
		margin-top: 20px;
	}
	.bg1 {
		background-color: var(--Bg1);
	}
	.lottery-header-box {
		width: 100%;

		padding: 20px 0;
		:deep(.lottery-card) {
			height: auto;
		}
	}

	.lottery-ball-box {
		padding: 20px;
	}
	.lottery-dice-box {
		padding: 20px;
	}
	.lottery-bet-form-box {
		padding: 20px;
	}
	:deep(.lottery-accordion) {
		margin-bottom: 4px;
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
