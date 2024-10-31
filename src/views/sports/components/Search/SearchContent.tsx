import { defineComponent, reactive } from "vue";
import Common from "/@/views/sports/utils/common";
import { ElInput } from "element-plus";
import SportsApi from "/@/api/sports/sports";
import SvgIcon from "/@/components/svgIcon/index.vue";
import { SearchResultType } from "./interface/index";
import { useRoute } from "vue-router";
import useEventCard from "./EventCard";

interface SearchContentType {
	SearchContent: ReturnType<typeof defineComponent>;
	SInput: ReturnType<typeof defineComponent>;
	searchState: StateType;
}

interface StateType {
	inputValue: string;
	results: SearchResultType[];
	loading: boolean;
}

export default (): SearchContentType => {
	const state = reactive<StateType>({
		inputValue: "",
		results: [],
		loading: false,
	});

	const { EventCard } = useEventCard();
	const route = useRoute();

	const handleSearch = Common.debounce(async () => {
		const { sportType } = route.query; // 获取路由查询参数中的体育类型
		const value = state.inputValue;
		// 输入框无内容清空数据
		if (!value.trim().length) {
			state.results = [];
			state.loading = false;
			return;
		}

		// 构建查询参数
		const param = `$filter=(contains(homename,'${value}') or contains(awayname,'${value}') or contains(leagueName,'${value}')) and sportType in (${sportType}) &$orderby=globalShowTime asc`;
		try {
			const results = await SportsApi.GetEventInfo({
				query: param, // 发送请求
			});
			// 映射搜索结果
			state.results = results.data.events.map((result: SearchResultType) => ({
				...result,
				sportIcon: result.leagueIconUrl, // 赋值体育图标
				title: result.leagueName, // 赋值赛事标题
				subtitle: `${result.teamInfo.homeName} vs ${result.teamInfo.awayName}`, // 赋值副标题
			}));
		} catch (error) {
			console.error("搜索请求失败:", error);
		} finally {
			setTimeout(() => {
				state.loading = false;
			}, 400);
			// state.loading = false; // 停止加载
		}
	}, 500);

	// 输入框
	const SInput = () => (
		<div className="search-input">
			<ElInput
				onInput={() => {
					state.loading = true;
					handleSearch();
				}}
				v-model={state.inputValue}
				placeholder="请输入赛事名称/球队名"
				prefix-icon={<SvgIcon name="sports-search" size={20} />}
			/>
		</div>
	);

	// 内容
	const Content = () => (
		<div className="event-card-list">
			{state.results?.map((item) => (
				<EventCard key={item.eventId} data={item} />
			))}
		</div>
	);

	// 无搜索结果
	const Empty = () => (
		<>
			{state.inputValue.trim() && !state.results.length && !state.loading ? (
				<div className="empty">
					<SvgIcon name="sports-empty" width={142} height={120} />
					<p>哎呀！还没有数据！</p>
				</div>
			) : (
				<></>
			)}
		</>
	);

	const SearchContent = defineComponent({
		name: "SearchContent",
		setup() {
			return () => (
				<div className="search-content">
					{/* 无数据返回 */}
					<Empty />
					{/* 搜索内容 */}
					<Content />
				</div>
			);
		},
	});

	return {
		SearchContent,
		SInput,
		searchState: state,
	};
};
