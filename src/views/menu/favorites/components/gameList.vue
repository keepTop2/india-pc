<template>
	<div class="gameList">
		<div class="gl-header">
			<h3>{{ pageItem?.name || $t(`gameList['收藏夹']`) }}</h3>
		</div>
		<div class="main">
			<!-- 普通游戏列表 -->
			<InfiniteScroll ref="InfiniteScrollRef" :scrollLoad="gamePageList" :page-size="18" :loaded-number="listLength">
				<template #default>
					<GameCard v-for="(item, Index) in gameList" :key="Index" :CardItem="item" @clickCollect="onFormChange">
					</GameCard>
				</template>
			</InfiniteScroll>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch, defineModel, nextTick } from 'vue';
import type { ModelRef } from 'vue';
import pubSub from '/@/pubSub/pubSub';
import { Notification } from '/@/components/index';
import { InfiniteScroll } from '/@/components/InfiniteScroll';
import { GameCard } from '/@/components/gameCard';
import Common from '/@/utils/common';
import { CasionApi } from '/@/api/menu/casion/casion';
import { useUserStore } from '/@/stores/modules/user';
import { i18n } from '/@/i18n/index';
const $: any = i18n.global;
const UserStore = useUserStore();

const showLogin = () => {
	nextTick(() => {
		//发布登陆弹窗事件
		pubSub.publish(pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.eventName, pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.params[1]);
		Notification({
			title: $.t('gameList["提示"]'),
			content: $.t('gameList["请登陆后再进行收藏"]'),
		});
	});
};
const token = computed(() => {
	return UserStore.getUserInfo.token;
});

//列表数组长度
const listLength = defineModel('listLength', {
	default: () => 0,
});

const InfiniteScrollRef = ref();
const props = withDefaults(defineProps<{ pageItem?: any }>(), {
	pageItem: {
		id: '',
		iconCode: 'dat_icon',
		name: '',
		sort: 0,
		modelCode: 'GAME',
		active: true,
	},
});
const gameList = ref([]);

//搜索刷新时使用
const onFormChange = (val?: any) => {
	if (InfiniteScrollRef.value) {
		gameList.value = [];
		InfiniteScrollRef.value.reset();
	}
};

//获取页面数据
const gamePageList = async (page: any, loading: any, finished: any, error: any) => {
	let params: any = {
		pageNumber: page.value.current,
		pageSize: page.value.pageSize,
	};

	if (!token.value) {
		finished.value = true;
		return;
	}
	loading.value = true;
	let res: any = await CasionApi.gameCollectionList(params).catch((err: any) => {
		loading.value = false;
		error.value = true;
	});
	const { code, data } = res;
	if (code == Common.ResCode.SUCCESS) {
		loading.value = false;
		const { total, records } = data;
		if (records && records.length) {
			gameList.value = gameList.value.concat(records);
			if (records.length >= page.value.pageSize) {
				page.value.current += 1;
			} else {
				finished.value = true;
			}
		} else {
			finished.value = true;
		}
	}
};
watch(
	() => gameList.value,
	(newValue, oldValue) => {
		listLength.value = newValue.length;
	},
	{
		immediate: true,
	}
);
watch(
	() => props.pageItem,
	(newValue, oldValue) => {
		if (InfiniteScrollRef.value) {
			gameList.value = [];
			InfiniteScrollRef.value.reset();
		}
	}
);
watch(
	() => token.value,
	(newValue, oldValue) => {
		if (!newValue) {
			showLogin();
		}
		onFormChange();
	},
	{
		immediate: true,
	}
);

defineExpose({ onFormChange });
</script>

<style lang="scss" scoped>
.gameList {
	width: 100%;
	padding-bottom: 34px;

	.gl-header {
		height: 78px;

		h3 {
			// color: var(--text-s, #fff);
			font-family: 'PingFang SC';
			font-size: 20px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
			line-height: 78px;

			@include themeify {
				color: themed('Text_s');
			}
		}
	}
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
</style>
