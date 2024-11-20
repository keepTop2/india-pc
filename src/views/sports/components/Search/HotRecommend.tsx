import { defineComponent, onMounted, reactive } from "vue";
import SportsApi from "/@/api/sports/sports";
import EventCard from "./EventCard";
import SvgIcon from "/@/components/svgIcon/index.vue";
import "./style/hotRecommend.scss";
import "./style/eventCard.scss";
import { i18n } from "/@/i18n/index";
const $: any = i18n.global;
interface HotStateType {
	list: Record<string, any>[];
	loading: Boolean;
}
export default () => {
	const hotState = reactive<HotStateType>({
		list: [],
		loading: false,
	});

	// 获取热门赛事
	const GetPromotions = async () => {
		hotState.loading = true;
		// 指定足球，后期可能会更改
		let sportType = 1;
		const params = {
			query: `$filter=sporttype eq ${sportType}`,
			includeMarkets: "none",
		};
		try {
			const { data } = await SportsApi.GetPromotions(params).catch((err) => err);
			if (data) {
				hotState.list = data.events;
			}
			hotState.loading = false;
		} catch {
			hotState.loading = false;
		}
	};

	const HotRecommend = defineComponent({
		setup() {
			onMounted(() => GetPromotions());
			return () => (
				<div className="hot-recommend">
					<div className="hot-title">
						<SvgIcon size={24} name="sports-hot" />
						<span className="name">{$.t(`sports["热门推荐"]`)}</span>
					</div>
					<div className="event-card-list">
						{hotState.list?.map((item) => (
							<EventCard key={item.eventId} data={item} />
						))}
					</div>
				</div>
			);
		},
	});
	return {
		HotRecommend,
		hotState,
	};
};
