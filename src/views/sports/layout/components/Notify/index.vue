<template>
	<div class="notifyWrapper">
		<div class="title mt_15 mb_15 ml_18">
			<svg-icon name="logo" width="132px" height="16px" />
			<span class="fs_14 Text1 ml_20"> 公告 </span>
		</div>
		<div class="notifyContentBox">
			<div class="notifyContent">
				<notifyItem v-for="(item, index) in stickyList" :key="index" :data="item" />
				<notifyItem v-for="(item, index) in notifyList" :key="index" :data="item" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import sportsApi from "/@/api/sports/sports";
import SportsCommon from "/@/views/sports/utils/common";
import moment from "moment";
import notifyItem from "./notifyItem.vue";
import { useLoading } from "/@/directive/loading/hooks";
const { startLoading, stopLoading } = useLoading();
onMounted(() => {
	getNotifyList();
});
interface notifyType {
	messageId: number;
	postTime: string;
	isSticky: Boolean;
	message: string;
}
const stickyList: Ref<Array<notifyType>> = ref([]);
const notifyList: Ref<Array<notifyType>> = ref([]);

const todayDate = moment(SportsCommon.todayDate()).subtract(6, "day").format("YYYY-MM-DD");
const getNotifyList = () => {
	startLoading();
	const { startDate, endDate } = SportsCommon.getResultDateRange(todayDate, 6, "YYYY-MM-DD");
	const params = {
		start: startDate,
		end: endDate,
		stickOption: 0,
	};
	sportsApi
		.GetAnnouncement(params)
		.then((res) => {
			res.data.forEach((item: notifyType) => {
				if (item.isSticky) {
					stickyList.value.push(item);
				} else {
					notifyList.value.push(item);
				}
			});
		})
		.finally(() => {
			stopLoading();
		});
};
</script>

<style scoped lang="scss">
.notifyWrapper {
	overflow: hidden;
	.notifyContentBox {
		overflow-y: auto;
		height: 80vh;
		margin-right: 5px;
		padding-left: 12px;
		min-height: 500px;
		.notifyContent {
			background: var(--Bg1);
			color: var(--Text1);
			font-size: 14px;
			margin-right: 5px;
			padding: 0 20px;
		}
	}
}
.notifyContentBox::-webkit-scrollbar {
	width: 6px;
}
.notifyContentBox::-webkit-scrollbar-track {
	background-color: transparent;
}
.notifyContentBox::-webkit-scrollbar-thumb {
	background: var(--Bg1);
	border-radius: 5px;
}
.title {
	color: var(--Text_s);
	font-size: 20px;
}
</style>
