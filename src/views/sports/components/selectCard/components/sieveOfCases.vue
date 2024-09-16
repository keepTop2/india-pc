<template>
	<div>
		<el-dropdown trigger="click" :teleported="false" placement="bottom-start" :hide-on-click="true" popper-class="popperClass" @command="handleCommand">
			<div class="el-dropdown-content">
				<div class="left">
					<span class="name">{{ selectedOption ? selectedOption.leagueName : "全部" }}</span>
					<span> ({{ selectedOption ? selectedOption.events?.length ?? selectedOption.teams?.length ?? 0 : totalEvents }}) </span>
				</div>
				<span class="icon"><svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon></span>
			</div>

			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item
						v-for="(item, index) in optionsWithAll"
						:key="item.leagueId"
						:class="{ 'dropdown-item-active': activeIndex === index }"
						:command="{ index, value: item.leagueId, label: item.leagueName }"
					>
						<span class="value">{{ item.leagueName }}({{ item.leagueId == 0 ? totalEvents : item.events?.length ?? item.teams?.length ?? 0 }})</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { defineProps, withDefaults } from "vue";
import { useSportLeagueSearchStore } from "/@/stores/modules/sports/sportLeagueSearch";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useRoute } from "vue-router";
import pubsub from "/@/pubSub/pubSub";
const SportLeagueSearchStore = useSportLeagueSearchStore();
const route = useRoute();
interface Option {
	leagueId: number | null;
	leagueName: string;
	events?: any[]; // events 属性是可选的
	teams?: any[]; // teams 属性是可选的
}

const props = withDefaults(defineProps<{ options: Option[] }>(), {
	options: () => [],
});

const activeIndex = ref<number | null>(0);
const selectedOption = ref<Option | null>(null);

/**
 * @description: option选中
 * @param {*} command
 * @return {*}
 */
const handleCommand = (command: { index: number; value: string | null; label: string }) => {
	activeIndex.value = command.index;
	selectedOption.value = command.index !== 0 ? props.options[command.index - 1] : null;
	// 筛选派发事件
	pubsub.publish("selectFilterLeague", command.value);
	/*	if (activeIndex.value > 0) {
		SportLeagueSearchStore.setSportsLeagueSelect([command.value]);
	} else {
		SportLeagueSearchStore.clearLeagueSelect();
	}*/
};

// 计算所有联赛的总事件数量
const totalEvents = computed(() => {
	/**
	 * @description 球类列表
	 */
	const sports = viewSportPubSubEventData.viewSportData.sports;
	const sport = sports.filter((item) => item.sportType == 1)[0] as unknown as { gameCount: number; liveGameCount: number; count: number };
	if (route.query.sportsActive == "todayContest") {
		return sport?.gameCount;
	} else if (route.query.sportsActive == "rollingBall") {
		return sport?.liveGameCount;
	} else {
		return sport?.count;
	}
});

const optionsWithAll = computed(() => {
	return [{ leagueId: 0, leagueName: "全部", events: [] }, ...props.options];
});
</script>

<style scoped lang="scss">
@import "/@/views/sports/tournamentViews/styles/sieveOfCases.scss";
</style>
