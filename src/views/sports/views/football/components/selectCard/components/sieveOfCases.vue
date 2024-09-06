<template>
	<div>
		<el-dropdown
			trigger="click"
			:teleported="false"
			placement="bottom-start"
			:hide-on-click="true"
			popper-class="popperClass"
			@visible-change="handleVisibleChange"
			@command="handleCommand"
		>
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
import { useSportLeagueSeachStore } from "/@/stores/modules/sports/sportLeagueSeach";
const SportLeagueSeachStore = useSportLeagueSeachStore();
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

const handleVisibleChange = (isVisible: boolean) => {
	console.log("Dropdown visibility changed:", isVisible);
};

/**
 * @description: option选中
 * @param {*} command
 * @return {*}
 */
const handleCommand = (command: { index: number; value: string | null; label: string }) => {
	activeIndex.value = command.index;
	selectedOption.value = command.index !== 0 ? props.options[command.index - 1] : null;
	if (activeIndex.value > 0) {
		SportLeagueSeachStore.setSportsLeagueSelect([command.value]);
	} else {
		SportLeagueSeachStore.clearLeagueSelect();
	}
};

const totalEvents = computed(() => {
	return props.options.reduce((sum, item) => sum + (item.events?.length ?? item.teams?.length ?? 0), 0);
});

const optionsWithAll = computed(() => {
	return [{ leagueId: 0, leagueName: "全部", events: [] }, ...props.options];
});
</script>

<style scoped lang="scss">
@import "/@/views/sports/views/styles/sieveOfCases.scss";
</style>
