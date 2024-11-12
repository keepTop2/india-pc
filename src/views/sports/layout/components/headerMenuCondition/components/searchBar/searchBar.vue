<template>
	<div class="search-bar">
		<!-- 搜索输入框，绑定搜索查询 -->
		<input ref="searchInput" v-model="searchQuery" type="text" :placeholder="placeholder" @input="debouncedSearch" />
		<!-- 点击取消按钮时调用取消搜索函数 -->
		<span class="cancel" @click="cancelSearch">取消</span>

		<!-- 搜索历史展示 -->
		<div class="search-results" v-if="!searchQuery && !searchResults.length && searchHistory.length">
			<div class="history-count">
				<span></span>
				<p>搜索历史</p>
				<!-- 显示“搜索历史”标题 -->
			</div>
			<!-- 遍历搜索历史，显示历史记录 -->
			<div v-for="(result, index) in searchHistory" :key="index" class="search-history-item">
				<div class="history-info">
					<!-- 点击历史记录设置搜索查询 -->
					<div class="history-title" @click="setSearchQuery(result.title)">
						{{ result.title }}
						<!-- 显示历史记录标题 -->
						<!-- 点击图标移除该历史记录 -->
						<svg-icon name="sports-remove" @click.stop="removeHistory(result.title)" />
					</div>
				</div>
			</div>
		</div>

		<!-- 显示搜索结果 -->
		<div class="search-results" v-else-if="searchResults.length">
			<div class="results-count">
				<span></span>
				<p>找到的比赛：{{ searchResults.length }}</p>
				<!-- 显示找到的比赛数量 -->
			</div>
			<!-- 遍历搜索结果，显示每一项 -->
			<div v-for="(result, index) in searchResults" :key="index" class="search-result-item">
				<div class="result-info">
					<!-- 点击结果标题显示事件详情 -->
					<div class="result-title" @click="showEventDetail(result)">
						<img class="icon" :src="result.sportIcon" size="20px" /> {{ result.title }}
						<!-- 显示赛事标题及图标 -->
					</div>
					<div class="result-subtitle">{{ result.subtitle }}</div>
					<!-- 显示副标题 -->
					<div class="result-subtitle">
						{{ getEventsTitle(result) }}
						<!-- 获取并显示赛事标题 -->
						<span v-if="(result.gameInfo?.livePeriod == 2 || result.gameInfo?.livePeriod == 1) && !result.gameInfo?.delayLive && !result.gameInfo?.isHt">
							{{ formattedGameTime(result) }}
							<!-- 格式化并显示比赛时间 -->
						</span>
						<!-- 显示当前比分 -->
						({{ result.gameInfo?.liveHomeScore }}-{{ result.gameInfo?.liveAwayScore }})
					</div>
				</div>
			</div>
		</div>

		<!-- 如果没有搜索结果和历史记录，则显示无数据提示 -->
		<div class="custom-empty" v-else>
			<NoneData />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeMount, onUnmounted } from "vue";
import { debounce } from "lodash-es";
import { useMatchEvents } from "/@/views/sports/hooks/eventMatch"; // 引入自定义的钩子
import SportsApi from "/@/api/sports/sports"; // 引入API
import SportsCommonFn from "/@/views/sports/utils/common"; // 引入公共函数
import Common from "/@/utils/common";
import { useRoute } from "vue-router"; // 引入路由
import pubsub from "/@/pubSub/pubSub"; // 引入pubsub
import { useLoading } from "/@/directive/loading/hooks"; // 引入加载指令
import { useLink } from "/@/views/sports/hooks/useLink"; // 引入链接钩子

// 获取跳转到事件详情的函数
const { gotoEventDetail } = useLink();
const { startLoading, stopLoading } = useLoading(); // 获取加载相关函数
const route = useRoute(); // 获取当前路由信息
const { getEventsTitle } = SportsCommonFn; // 获取公共函数
const { searchMatches } = useMatchEvents(); // 获取匹配事件函数

const searchInput = ref<HTMLInputElement | null>(null); // 用于引用搜索输入框
// 初始化搜索历史
const searchHistory = ref<Array<{ title: string }>>([
	{
		title: "菲律宾",
	},
]);
const searchQuery = ref<string>(""); // 当前搜索查询

/**
 * @description 搜索结果类型定义
 */
interface SearchResult {
	sportIcon: string; // 体育图标
	title: string; // 比赛标题
	subtitle: string; // 比赛副标题
	leagueId?: string | number; // 联赛ID
	eventId?: string | number; // 事件ID
	leagueIconUrl?: string; // 联赛图标URL
	leagueName: string; // 联赛名称
	teamInfo: {
		// 队伍信息
		homeName: string; // 主队名称
		awayName: string; // 客队名称
	};
	gameInfo?: {
		// 比赛信息
		livePeriod?: number; // 当前比赛阶段
		delayLive?: boolean; // 是否延迟直播
		isHt?: boolean; // 是否为中场
		seconds?: number; // 剩余秒数
		liveHomeScore?: number; // 主队实时比分
		liveAwayScore?: number; // 客队实时比分
	};
	globalShowTime?: string | number; // 全球显示时间
}

const searchResults = ref<SearchResult[]>([]); // 存储搜索结果

// 定义事件发射器
const emit = defineEmits<{
	(e: "search", query: string): void; // 发射搜索事件
	(e: "cancel"): void; // 发射取消事件
}>();

// 定义组件属性
interface Props {
	placeholder?: string; // 输入框占位符
	cancelText?: string; // 取消按钮文本
}

// 定义属性的默认值
const props = withDefaults(defineProps<Props>(), {
	placeholder: "搜索...", // 默认占位符
	cancelText: "取消", // 默认取消文本
});

// 在组件挂载前显示覆盖层
onBeforeMount(() => {
	pubsub.publish("showOverlay", true);
});

// 在组件卸载后隐藏覆盖层
onUnmounted(() => {
	pubsub.publish("showOverlay", false);
});

/**
 * @description 防抖搜索函数
 */
const debouncedSearch = Common.debounce(async () => {
	startLoading(); // 开始加载
	const { sportType } = route.query; // 获取路由查询参数中的体育类型

	// 构建查询参数
	const param = `$filter=(contains(homename,'${searchQuery.value}') or contains(awayname,'${searchQuery.value}') or contains(leagueName,'${searchQuery.value}')) and sportType in (${sportType}) &$orderby=globalShowTime asc`;
	try {
		const results = await SportsApi.GetEventInfo({
			query: param, // 发送请求
		});
		// 映射搜索结果
		searchResults.value = results.data.events.map((result: SearchResult) => ({
			...result,
			sportIcon: result.leagueIconUrl, // 赋值体育图标
			title: result.leagueName, // 赋值赛事标题
			subtitle: `${result.teamInfo.homeName} vs ${result.teamInfo.awayName}`, // 赋值副标题
		}));
	} catch (error) {
		console.error("搜索请求失败:", error);
	} finally {
		stopLoading(); // 停止加载
	}
}, 300);

/**
 * @description 格式化比赛开始时间
 * @param event 比赛事件对象
 */
const formattedGameTime = (event: SearchResult) => {
	if (!event.gameInfo?.seconds) return ""; // 如果没有剩余秒数，返回空
	const minutes = Math.floor(event.gameInfo.seconds / 60); // 计算分钟
	const seconds = event.gameInfo.seconds % 60; // 计算秒数
	return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`; // 返回格式化时间
};

/**
 * @description 取消搜索
 */
const cancelSearch = (): void => {
	searchQuery.value = ""; // 清空搜索查询
	searchResults.value = []; // 清空搜索结果
	emit("cancel"); // 发射取消事件
};

/**
 * @description 设置搜索查询
 * @param query 查询字符串
 */
const setSearchQuery = (query: string): void => {
	searchQuery.value = query; // 设置搜索查询
	debouncedSearch(); // 调用防抖搜索
};

/**
 * @description 移除搜索历史
 * @param title 要移除的历史记录标题
 */
const removeHistory = (title: string): void => {
	searchHistory.value = searchHistory.value.filter((item) => item.title !== title); // 过滤掉要移除的历史记录
};

/**
 * @description 显示事件详情
 * @param event 事件对象
 */
const showEventDetail = (event: SearchResult) => {
	const { sportType } = route.query; // 获取体育类型
	const params = {
		leagueId: event?.leagueId, // 获取联赛ID
		eventId: event?.eventId, // 获取事件ID
	};
	gotoEventDetail(params, sportType as string); // 跳转到事件详情页面
	cancelSearch(); // 清空搜索
};

// 在组件挂载后聚焦搜索输入框
onMounted(() => {
	searchInput.value?.focus();
});

// 监听搜索查询的变化
watch(searchQuery, (newValue: string) => {
	if (newValue === "") {
		searchResults.value = []; // 清空搜索结果
		emit("search", ""); // 发射搜索事件，查询为空
	}
});
</script>

<style lang="scss" scoped>
.search-bar {
	display: flex;
	align-items: center;
	height: 50px;
	width: 100%;
	padding: 10px 24px;
	position: relative;

	input {
		flex-grow: 1;
		padding: 8px 12px;
		border: 1px solid #ccc;
		background-color: var(--Bg-2);
		height: 30px;
		padding: 4.5px 40px 4.5px 10px;
		border: none;
		border-radius: 4px;
		font-size: 14px;
		outline: none;
		color: var(--Text-1);
	}

	.cancel {
		margin-left: 10px;
		color: var(--Text-1);
		cursor: pointer;
		font-size: 14px;
		position: absolute;
		right: 34px;
		&:hover {
			text-decoration: underline;
		}
	}
	.custom-empty {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		height: 410px;
		background-color: var(--Bg-1);
		border-top: none;
		border-radius: 0 0 4px 4px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 10;
		overflow-y: auto;
		padding: 0 24px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		p {
			color: var(--Text-2);
		}
		svg {
			margin-bottom: 10px;
		}
	}
	.search-results {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		height: 410px;
		background-color: var(--Bg-1);
		border-top: none;
		border-radius: 0 0 4px 4px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 10;
		overflow-y: auto;
		padding: 0 24px;

		.search-result-item {
			display: flex;
			align-items: center;
			padding: 10px 0;
			border-bottom: 1px solid var(--Border1);

			&:last-child {
				border-bottom: none;
			}

			.result-info {
				flex-grow: 1;
				border-bottom: 1px solid var(--Line-2);
				padding-bottom: 6px;
				img {
					width: 20px;
					height: 20px;
				}
				.result-title {
					font-size: 16px;
					font-weight: bold;
					color: var(--Text-s);
					display: flex;
					gap: 8px;
					padding: 9px 0;
					cursor: pointer;
				}

				.result-subtitle {
					font-size: 14px;
					color: var(--Text-1);
					cursor: pointer;
				}
			}
		}
		.search-history-item {
			height: 40px;
			line-height: 40px;
			color: var(--Text-s);
			font-size: 14px;
			.history-title {
				display: flex;
				border-bottom: 1px solid var(--Line-2);
				justify-content: space-between;
				align-items: center;
				svg {
					width: 18px;
					height: 18px;
					cursor: pointer;
				}
			}
		}
		.results-count,
		.history-count {
			display: flex;
			gap: 10px;
			color: var(--Text-s);
			font-size: 16px;
			padding: 8px 0px;
			span {
				background: var(--Theme);
				height: 24px;
				width: 4px;
				border-radius: 6px;
			}
		}
	}
}
</style>
