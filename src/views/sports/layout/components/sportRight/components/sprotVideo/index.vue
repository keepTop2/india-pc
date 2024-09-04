<template>
	<div class="video-container" v-if="!isEmpty(eventDetail)">
		<SportControl :eventDetail="eventDetail" @refresh="$emit('refresh')" :loading="loading" />
		<!-- 视频内容 -->
		<div class="video">
			<SportEventDetail v-if="controlType === SportControlEnum.Info" :sportInfo="eventDetail" />
			<WVideo v-else :videoStreamingItem="computedStreamingItem"></WVideo>
		</div>
		<SportInfo />
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { isEmpty, find } from "lodash-es";
import { WVideo } from "/@/components/wVideo";
import SportControl from "./sportControl.vue";
import SportInfo from "./sportInfo.vue";
import SportEventDetail from "./sportEventDetail.vue";
import { SportControlEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
const SportHotStore = useSportHotStore();

const emit = defineEmits(["refresh"]);

const props = withDefaults(
	defineProps<{
		eventDetail: any;
		loading?: boolean;
	}>(),
	{
		eventDetail: () => {
			return {};
		},
		loading: false,
	}
);

const { controlType, useControlList } = storeToRefs(SportHotStore);

const computedStreamingItem = computed(() => {
	return find(useControlList.value, (item) => item.type === controlType.value);
});
</script>

<style lang="scss" scoped>
.video-container {
	width: 390px;
	// height: 340px;
	border-radius: 8px;
	overflow: hidden;
	display: grid;
	grid-template-rows: 40px auto 68px;
	background: var(--Bg1);

	.video {
		min-height: 210px;
		// background-image: url("/@/assets/zh/default/menu/sports/football_bg.png");
		background-repeat: no-repeat;
		background-size: 100% auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
