<!--
 * @Author: WangMingxin
 * @Description: 滚动到底部加载翻页数据；
-->
<template>
	<div class="infiniteScroll">
		<div class="back-plan">
			<div class="container" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
				<slot :count="count"></slot>
			</div>
		</div>
		<div class="status-plan" v-if="loading || noMore || error">
			<p v-if="loading">{{ loadingText || $t('common["加载中"]') }}</p>
			<p v-if="loadedNumber && noMore">{{ finishedText || $t('common["没有更多"]') }}</p>
			<NoneData v-if="!loadedNumber && noMore"></NoneData>
			<p v-if="error">{{ errorText || $t(`common["加载错误"]`) }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { i18n } from '/@/i18n/index';
const $: any = i18n.global;
// interface Page {
// 	count?: number;
// 	sizes?: number;
// 	current?: number;
// }

interface ScrollPage {
	// url?: string; //滚动到底部时，加载数据的 URL
	loadedNumber?: number; //已加载数据数量
	pageSize?: number; //每页加载量
	scrollLoad?: Function; //滚动到底部时，加载更多数据函数（传出：翻页/加载状态/数据完结状态/错误状态控制响应参数）
	// infiniteScrollDisabled?: boolean; //是否禁用（是否已加载完成，加载完成后不再触发 load 事件）
	infiniteScrollDelay?: number; //节流时延，单位为 ms
	infiniteScrollDistance?: number; //触发加载的距离阈值，单位为 px
	infiniteScrollImmediate?: boolean; //是否立即执行加载方法，以防初始状态下内容无法撑满容器。
	//列表是否处于加载状态，加载过程中不触发 load 事件
	// loading?: boolean;
	//是否已加载完成，加载完成后不再触发 load 事件
	// finished?: boolean;
	//是否加载失败，加载失败后点击错误提示可以重新触发 load 事件
	// error?: boolean;
	//加载过程提示文案
	loadingText?: string;
	//加载完成后的提示文案
	finishedText?: string;
	//加载失败后的提示文案
	errorText?: string;
}
const props = withDefaults(defineProps<ScrollPage>(), {
	// loading: false,
	// error: false,
	// finished: false,
	pageSize: 10,
	errorText: '',
	loadingText: '',
	finishedText: '',
	loadedNumber: 0,
});

const count = ref(18);
const loading = ref(false);
const finished = ref(false);
const error = ref(false);
const noMore = computed(() => finished.value);
const disabled = computed(() => loading.value || noMore.value || error.value);
const pagesize = ref({
	pageSize: props.pageSize, //每页显示条目个数
	current: 1, //当前页
	total: 100, //总条数
});

watch(
	() => props?.pageSize,
	(newValue, oldValue) => {
		pagesize.value.pageSize = newValue;
	},
	{
		deep: true,
		immediate: true,
	}
);

/**数据加载 */
const load = () => {
	(props as any).scrollLoad(pagesize, loading, finished, error);
};
/** 重置刷新 */
const reset = () => {
	pagesize.value.current = 1;
	loading.value = false;
	finished.value = false;
	error.value = false;
	load();
};

onMounted(() => {
	load();
});

defineExpose({ reset });
</script>

<style lang="scss" scoped>
.infiniteScroll {
	// min-height: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;
	.back-plan {
		flex: 1;
	}
	.container {
		display: grid;
		grid-template-columns: repeat(6, 190px);
		justify-self: center;
		grid-column: 1/-1;
		// justify-items: center;
		grid-column-gap: 12px;
		grid-row-gap: 12px;
		// min-height: 786px;
		// box-sizing: border-box;
		// padding-left: 24px;
	}
	.status-plan {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 34px 0;
		padding-bottom: 50px;
		p {
			// color: var(--Text2_1, #656e78);
			font-family: 'PingFang SC';
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			@include themeify {
				color: themed('Text2_1');
			}
		}
	}
}
</style>
