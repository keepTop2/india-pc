<template>
	<div class="notify">
		<div class="title">公告</div>
		<div class="content">
			<!-- direction="vertical" -->
			<Swiper @swiper="setBigwinsSwiper" :autoplay="true" :slidesPerView="1" :spaceBetween="300" :slidesPerGroup="1" :loop="true" :noSwiping="true" :modules="modules">
				<SwiperSlide v-for="(item, index) in announcementList" :key="index">
					<p class="ellipsis">{{ item.message }}</p>
				</SwiperSlide>
			</Swiper>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import moment from "moment";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import sportsApi from "/@/api/sports/sports";
import SportsCommon from "/@/views/sports/utils/common";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";

const modules = ref([Autoplay, Pagination, Navigation]);

const bigwinsRef = ref(null);
const setBigwinsSwiper = (swiper: any) => {
	bigwinsRef.value = swiper;
};

const next = () => {
	bigwinsRef.value && (bigwinsRef.value as any).slideNext();
};
const prev = () => {
	bigwinsRef.value && (bigwinsRef.value as any).slidePrev();
};

const SportsInfoStore = useSportsInfoStore();
/** 今日 */
const todayDate = moment(SportsCommon.todayDate()).subtract(6, "day").format("YYYY-MM-DD");
/**公告数据列表 */
const announcementList = ref();

onMounted(() => {
	// GetAnnouncement();
});

watch(
	() => SportsInfoStore.getSportsToken,
	(newValue, oldValue) => {
		if (newValue) {
			GetAnnouncement();
		}
	}
);

/**
 * @description: 获取沙巴平台公告数据
 * @return {*}
 */
const GetAnnouncement = async () => {
	/** 今日7天的开始结束 */
	const { startDate, endDate } = SportsCommon.getResultDateRange(todayDate, 6, "YYYY-MM-DD");
	const params = {
		start: startDate,
		end: endDate,
		stickOption: 0,
	};
	const res = await sportsApi.GetAnnouncement(params).catch((err) => {
		return err;
	});
	console.info("获取沙巴平台公告数据", res);
	const { status, data } = res;
	if (status == 200) {
		announcementList.value = data;
	}
};
</script>

<style scoped lang="scss">
.notify {
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;

	.title {
		font-family: "PingFang SC";
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		min-width: 75px;
		box-sizing: border-box;
		text-align: center;

		color: var(--Text1);
	}

	.content {
		flex: 1;
		font-family: "PingFang SC";
		font-size: 12px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		width: 100%;

		// color: var(--Text1-1, #98A7B5);
		color: var(--Text1);

		p.ellipsis {
			width: 100%;
			white-space: nowrap;
			/* 禁止换行 */
			overflow: hidden;
			/* 隐藏溢出内容 */
			text-overflow: ellipsis;
			/* 超出部分显示省略号 */
		}
	}
}
</style>
