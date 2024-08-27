<template>
	<div class="bettingMatches">
		<h3 class="c_white fs_20 title">
			<SvgIcon iconName="clock" class="mr_10" />
			{{ $t("home.最近投注比赛") }}
		</h3>
		<div class="tabs">
			<ul>
				<li :class="{ active: tabsActiveKey === 0 }" @click="handleTabChange(0)">{{ $t("home.最近投注") }}</li>
				<li :class="{ active: tabsActiveKey === 1 }" @click="handleTabChange(1)">{{ $t("home.大额投注") }}</li>
				<li :class="{ active: tabsActiveKey === 2 }" @click="handleTabChange(2)">{{ $t("home.投注比赛") }}</li>
			</ul>
		</div>
		<div>
			<!-- Betting content based on tabsActiveKey -->
			<Table :data="betData" v-if="tabsActiveKey === 0 || tabsActiveKey === 1" />

			<div v-else>
				<!-- <Jackpot :data="betData" /> -->
			</div>
			<div class="showmore">
				<button>
					<span>展示更多</span> <el-icon><ArrowDown /></el-icon>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import Table from "../Table/Table.vue";
// import Jackpot from "./Jackpot/Jackpot.vue";
import { betData } from "../mock";
import { ArrowDown } from "@element-plus/icons-vue";

/**
 * 投注比赛
 */
const tabsActiveKey = ref(0);

const handleTabChange = (val: number) => {
	tabsActiveKey.value = val;
};
</script>

<style lang="scss">
@import "./bettingMatches.scss";
</style>
