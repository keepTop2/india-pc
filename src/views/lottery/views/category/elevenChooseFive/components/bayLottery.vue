<template>
	<div class="content">
		<div class="gameplay-container">
			<div style="width: 100%; flex: 1">
				<!-- 展示玩法配置的 Accordion 手风琴组件 -->
				<Accordion
					v-for="(gameplayItem, index) in mergedGameplayList"
					:key="gameplayItem.id"
					:isExpanded="gameplayItem.actived"
					@change="(status) => clearAccordionStatus(status, index)"
					:title="gameplayItem.gamePlayName"
					style="margin-bottom: 4px"
				>
					<!-- 手风琴内容，仅在激活时渲染 -->
					<template v-if="gameplayItem.actived" #content>
						<div class="gameplay gameplay-description">
							<!-- 使用 v-html 渲染描述内容，支持 HTML 标签如 <br> -->
							<p v-html="gameplayItem.desc"></p>
						</div>

						<!-- 展示每个玩法项 -->
						<AccordionItem
							v-for="(oddsListItem, i) in gameplayItem.oddsList"
							:key="oddsListItem.id"
							:actived="oddsListItem.actived"
							@select="(status) => handleExpanded(status, oddsListItem, gameplayItem)"
							:title="oddsListItem.title"
							:info="oddsListItem.desc"
							:odds="oddsListItem.itemOdds"
							style="margin-bottom: 4px"
						>
							<!-- 显示选择球组组件，当玩法类型为 'selectBall' 且激活时渲染 -->
							<template v-if="oddsListItem.actived && oddsListItem.type === 'selectBall'" #default>
								<div class="accordion-content-item-balls">
									<SelectBallGroup
										@clear="() => (balls = [])"
										:type="3"
										@select="(data) => handleSelectBalls(data, oddsListItem, gameplayItem)"
										:multiple="false"
										:renderBallNum="(oddsListItem.ballNum as number)"
										:maxLeng="1"
										:value="balls"
										:startIndex="oddsListItem.startIndex"
									/>
								</div>
							</template>
						</AccordionItem>
					</template>
				</Accordion>
			</div>

			<!-- 投注表单组件 -->
			<BetForm ref="betFormRef" @submit="handleSubmit" :value="currentGameplayItem" :actived="formActived" :currentOddsListItem="currentOddsListItem">
				<!-- 表单激活时显示的插槽内容 -->
				<template v-if="formActived" #default>
					<div class="bet-form-slot-header">
						<div>{{ currentGameplayItem.gamePlayName }}</div>
						<div>{{ currentGameplayItem.oddsList.title }}</div>
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
import { gameplayList } from "./playsConfig";
import useBetForm from "/@/views/lottery/components/BetForm/Index";
import useAccordion from "/@/views/lottery/components/Tools/Accordion/Index";
import useBall from "/@/views/lottery/components/Tools/Ball/Index";
import { useAccordion as useAccordionHook } from "/@/views/lottery/hooks/useAccordion";
import { useBet, type Props } from "/@/views/lottery/hooks/useBet";
import { useGameplayList } from "/@/views/lottery/hooks/useGameplayList";

const props = defineProps({
	lotteryDetail: { type: Object, default: () => ({}) },
});

// 使用各自的组件
const { Accordion, AccordionItem } = useAccordion();
const { Ball, SelectBallGroup } = useBall();
const { BetForm } = useBetForm();

// hooks
const { mergedGameplayList } = useGameplayList(gameplayList);
const { formActived, balls, clearAccordionStatus, handleSelectBalls, handleExpanded, currentGameplayItem, currentOddsListItem } = useAccordionHook(mergedGameplayList);
const { betFormRef, handleSubmit } = useBet(currentGameplayItem, currentOddsListItem, props as Props, balls);
</script>

<style lang="scss" scoped></style>
