<template>
	<div class="content">
		<div class="gameplay-container">
			<div style="width: 100%; flex: 1">
				<!-- 展示玩法配置的 Accordion 手风琴组件 -->
				<Accordion
					v-for="(gameplayItem, gameplayIndex) in gameplayList"
					:key="gameplayItem.id"
					:isExpanded="gameplayItem.actived"
					@change="(status) => toggleAccordion(status, gameplayIndex)"
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
							v-for="(oddsItem, oddsIndex) in gameplayItem.oddsList"
							:key="oddsItem.id"
							:actived="oddsItem.actived"
							@select="(status) => chooseOddsItem(status, gameplayIndex, oddsIndex)"
							:title="oddsItem.title"
							:info="oddsItem.desc"
							:odds="oddsItem.itemOdds"
							style="margin-bottom: 8px"
						>
							<!-- 显示选择球组组件，当玩法类型为 'selectBall' 且激活时渲染 -->
							<template v-if="oddsItem.actived && oddsItem.type === SELECT_BALL" #default>
								<div class="accordion-content-item-balls">
									<SelectBallGroup
										@clear="() => (currentBalls = [])"
										:type="3"
										@select="(params) => chooseBalls(params)"
										:multiple="false"
										:children="oddsItem.children"
										:maxLeng="1"
										:value="currentBalls" 
									/>
								</div>
							</template>
						</AccordionItem>
					</template>
				</Accordion>
			</div>

			<!-- 投注表单组件 -->
			<BetForm ref="betFormRef" @submit="handleSubmit">
				<!-- 表单激活时显示的插槽内容 -->
				<template v-if="formActived" #default>
					<div class="bet-form-slot-header">
						<div>{{ currentGameplayItem.gamePlayName }}</div>
						<div>{{ currentOddsItem.title }}</div>
						<div v-if="formActived && currentBalls.length" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px">
							<Ball v-for="item in currentBalls" :key="item.id" :ball-number="item.optionCode" :type="3" />
						</div>
					</div>
				</template>
			</BetForm>
		</div>
	</div>
</template>

<script setup lang="ts">
import { gameplayList as l1 } from "./playsConfig";
import useBetForm from "/@/views/lottery/components/BetForm/Index";
import useAccordion from "/@/views/lottery/components/Tools/Accordion/Index";
import useBall from "/@/views/lottery/components/Tools/Ball/Index";
import { useAccordion as useAccordionHook } from "/@/views/lottery/hooks/useAccordion";
import { useBet, type Props } from "/@/views/lottery/hooks/useBet";
import { useGameplayList } from "/@/views/lottery/hooks/useGameplayList";
import { SELECT_BALL } from "/@/views/lottery/constant/index";
import { onMounted } from "vue";
import { useLottery } from "/@/views/lottery/stores/lotteryStore";

// 使用各自的组件
const { Accordion, AccordionItem } = useAccordion();
const { Ball, SelectBallGroup } = useBall();
const { BetForm } = useBetForm();

// hooks
const { gameplayList, queryGamePlayOddsList } = useGameplayList();
const { toggleAccordion, chooseBalls, chooseOddsItem } = useAccordionHook(gameplayList);
const { setCurrentBalls, currentOddsItem, currentGameplayItem, currentBalls, formActived } = useLottery();
const { betFormRef, handleSubmit } = useBet();

onMounted(() => queryGamePlayOddsList(l1));
</script>

<style lang="scss" scoped></style>
