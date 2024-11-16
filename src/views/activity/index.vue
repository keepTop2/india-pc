<template>
	<div class="mb_49">
		<venueBanner :bannerList="bannerList"></venueBanner>
		<div class="max-width">
			<div class="tabs mt_40 mb_40 mr_10 ml_10">
				<div v-for="(item, index) in activityTabsList" :key="index" class="tab" @click.stop="setCurrentTab(index)">
					<button class="btn" :class="currentTab === index ? 'active' : ''">
						{{ item.labNameI18Code }}
					</button>
				</div>
			</div>
			<LazyLoadList :loadMore="getactivityList" :finished="finished" :loading="isLoading" :noData="activityList.length < 1">
				<activityCard :activityList="activityList" />
			</LazyLoadList>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import activityCard from "./components/activityCard.vue";
import { activityApi } from "/@/api/activity";
import Common from "/@/utils/common";
import { useUserStore } from "/@/stores/modules/user";
import { bannerApi } from "/@/api/banner";
const activityList = ref([]);
const activityTabsList: any = ref([]);
const currentTab = ref(0);
const finished = ref(false);
const bannerList = ref([]);
const params = reactive({
	pageNumber: 1,
	pageSize: 10,
	labelId: "",
});
const isLoading = ref(false); // Track loading status

// Fetch activity tabs on mount
onMounted(() => {
	getactivityTabsList();
	getBannerList();
});
const getBannerList = () => {
	bannerApi
		.queryBannerList({
			gameOneClassId: 0,
		})
		.then((res) => {
			bannerList.value = res.data;
		});
};
// Load activity list based on current tab
const getactivityList = async () => {
	if (finished.value || isLoading.value) return; // Prevent fetching if already finished or loading

	isLoading.value = true; // Set loading to true
	if (currentTab.value !== 0) {
		params.labelId = activityTabsList.value[currentTab.value].id;
	} else {
		params.labelId = ""; // Reset labelId if tab 0
	}

	const res = await activityApi.activityPageList(params);
	if (res.code === Common.ResCode.SUCCESS) {
		activityList.value = activityList.value.concat(res.data.records);
		if (res.data.records.length < params.pageSize) {
			finished.value = true; // Mark as finished if no records are returned
		}
		params.pageNumber += 1; // Increment page number for next load
	}
	isLoading.value = false; // Reset loading status
};

// Fetch activity tabs from API
const getactivityTabsList = async () => {
	const res = await activityApi.activityTabsList();
	activityTabsList.value = res.data || [];
	activityTabsList.value.unshift({
		labNameI18Code: "全部",
	});
};

// Change current tab and reset activity list
const setCurrentTab = async (index: number) => {
	if (currentTab.value === index) return; // Prevent duplicate calls for the same tab
	currentTab.value = index;
	finished.value = false; // Reset finished status for new tab
	params.pageNumber = 1; // Reset page number for new tab
	activityList.value = []; // Clear current activity list
	await getactivityList(); // Fetch new activity list
};
</script>

<style scoped lang="scss">
.tabs {
	display: flex;
	gap: 7px;
	flex-wrap: wrap;
	.btn {
		background: var(--Butter);
		padding: 7px 12px;
		border: none;
		cursor: pointer;
		border-radius: 4px;
		color: var(--Text-1);
	}
	.btn:hover,
	.active {
		background: var(--Theme);
		color: var(--Text-a);
	}
}
</style>
