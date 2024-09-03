<!--
 * @Author: WangMingxin
 * @Description: 体育-右侧-热门
-->
<template>
	<spinner-wrap :model-value="loading" :top="200" v-if="computedHasEvent">
		<SprotVideo :eventDetail="currentEventInfo" :videoStreamingUrl="videoStreamingUrl" @refresh="refresh" :loading="loading" />
		<PlayingMethod :sportEvent="currentEventInfo" />
	</spinner-wrap>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, reactive } from "vue";
import { storeToRefs } from "pinia";
import { isEmpty, map } from "lodash-es";
import { SprotVideo, PlayingMethod } from "./components/index";
import sportsApi from "/@/api/menu/sports/sports";
import { useIntervalFn } from "@vueuse/core";
import { SportsRootObject } from "/@/models/interface";
import { formattingSportArrayData } from "/@/utils/sports/formattingViewData";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
import { useSportRightTool } from "./useSportRightTool";
import { SportControlEnum } from "/@/enum/sportEnum/sportEnum";
import { SpinnerWrap } from "/@/components/Spinner";

const SportHotStore = useSportHotStore();
const { currentEventInfo } = storeToRefs(SportHotStore);
const { initDataEvent, getVideoUrl } = useSportRightTool();

const loading = ref(false);

/** 视频流地址 */
const videoStreamingUrl = ref({});

/**
 * 增加轮训，热门赛事获取列表失败的场景
 */
// const { pause } = useIntervalFn(() => getHotEvents(), 5000);

/**
 * 判断是否有赛事
 */
const computedHasEvent = computed(() => !isEmpty(currentEventInfo.value));

/**
 * @description 调用获取热门赛事
 */
const getHotEvents = async () => {
	if (computedHasEvent.value) {
		// 暂停执行
		// pause();
	}

	const params = {
		language: "zhcn",
	};
	const res = await sportsApi.GetHotEvents(params).catch((err) => err);
	//获取赛果数量后 添加到sports中
	if (res.data) {
		const hotList = formattingSportArrayData(res.data);

		const index = hotList.findIndex((event: SportsRootObject) => {
			if (event?.streamingOption && event?.channelCode) {
				return true;
			} else {
				false;
			}
		});

		// 储存数据到Store
		SportHotStore.setHotEventList(hotList);
		// 此处或有问题， 是否取对应球类的赛事
		SportHotStore.setCurrentEvent(hotList[0]);
		getHotEventVideoInfo();
		console.info("序列化后的数据", index, hotList);
	}
};

onMounted(async () => {
	// await getHotEvents();
});

watch(
	/**
	 * 监听赛事ID， 重新获取对应赛事详情
	 */
	() => currentEventInfo.value.eventId,
	async (newVal, oldVal) => {
		if (newVal !== oldVal) {
			initDataEvent();
			await getHotEventVideoInfo();
		}
	}
);

/**
 * @description:获取视频url
 */
const getStreaming = async () => {
	const { streamingOption, channelCode, sportType } = currentEventInfo.value;
	const params = {
		streamingOption,
		channelCode: encodeURI(channelCode),
		sportType,
	};
	const res = await sportsApi.GetStreaming(params).catch((err) => {
		return err;
	});
	const { status, data } = res;

	if (status == 200) {
		videoStreamingUrl.value = data;
		const list = getVideoUrl(data);

		const hasVideo = list.some((item) => item.type === SportControlEnum.Video);
		const hasH5 = list.some((item) => item.type === SportControlEnum.Animation);
		const type = hasVideo ? SportControlEnum.Video : hasH5 ? SportControlEnum.Animation : SportControlEnum.Info;
		SportHotStore.updateControlType(type);
		SportHotStore.updateUseControlList(list);
	} else {
		const list = getVideoUrl({});
		SportHotStore.updateControlType(SportControlEnum.Info);
		SportHotStore.updateUseControlList(list);
	}
};

/**
 * 统一管理获取地址链接，当有热门赛事列表时执行
 */
const getHotEventVideoInfo = async () => {
	loading.value = true;
	if (computedHasEvent.value) {
		await getStreaming().finally(() => {
			loading.value = false;
		});
	}
};

/**
 * 刷新
 */
const refresh = async () => {
	await getHotEventVideoInfo();
};
</script>

<style scoped lang="scss"></style>
