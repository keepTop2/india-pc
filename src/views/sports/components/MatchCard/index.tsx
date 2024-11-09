import { defineComponent, ref, computed, onMounted } from "vue";
import SportsCommonFn from "/@/views/sports/utils/common";
import SvgIcon from "/@/components/svgIcon/index.vue";
import useHeaderTools from "/@/views/sports/components/HeaderTools";
import { Team, GameTime, MarketCount, ToDetail } from "/@/views/sports/components/Search/EventCard";
import BetSelector from "/@/views/sports/components/BetSelector/index.vue";
import { marketsMatchData } from "/@/views/sports/utils/formattingViewData";
import { BettingCom } from "./BetType";
import { FooterScore } from "./FooterScore";
import betTypeConfigMap from "./betTypeConfig";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import "./style/index.scss";
import "./style/sports-type.scss";

/**
 * 卡片组件的类型
 */
interface CardType {
	events: Record<string, any>;
	isExpanded: boolean;
	sportType: number;
}

/**
 * 头部组件
 * @param {CardType & { handleToggle: () => void }} props - 卡片组件的属性和事件处理函数
 */
const Header = ({ events, isExpanded, sportType, handleToggle }: CardType & { handleToggle: () => void }) => {
	return (
		<div onClick={handleToggle} className="card-header">
			{/* 联赛信息 */}
			<div className="league-info">
				{/* 联赛图标 */}
				<img className="league_icon" src={events.leagueIconUrl} alt="" />
				{/* 联赛名称，最大宽度根据展开状态动态调整 */}
				<div className="league_name">{events.leagueName}</div>
			</div>

			{/* 盘口表头，只有在展开状态下显示 */}
			<div className="market-name-info" style={{ display: isExpanded ? "flex" : "none" }}>
				{/* 渲染盘口类型列表 */}
				<div className="market-name-list">
					{SportsCommonFn.betTypeMap[sportType].map((betTypeName) => (
						<div className="label" key={betTypeName}>
							{betTypeName}
						</div>
					))}
				</div>
			</div>

			{/* 头部图标，根据展开状态旋转 */}
			<div className="header-icon">
				<span className={`icon${isExpanded ? "" : " icon-expanded"}`}>
					<SvgIcon name="sports-arrow" width="8px" height="12px"></SvgIcon>
				</span>
			</div>
		</div>
	);
};

/**
 * 联赛组件
 * @param {any} props - 组件的属性，包括比赛信息
 */
const League = (props: any) => {
	const isStart = computed(() => SportsCommonFn.isStartMatch(props.events?.globalShowTime));
	const { Collection } = useHeaderTools(props.events);

	return (
		<div className="content-left">
			<div class="league-info">
				<div className="team home-team">
					{/* 主队 */}
					<Team name="home" cardData={props.events} isStart={isStart.value} />
				</div>
				<div className="team away-team">
					{/* 客队 */}
					<Team name="away" cardData={props.events} isStart={isStart.value} />
				</div>
			</div>
			<div className="league-footer">
				<div className="left">
					{/* 赛时时间 */}
					<span className="date">{SportsCommonFn.getEventsTitle(props.events)}</span>
					<GameTime cardData={props.events} />
				</div>
				<div className="right">
					{/* 收藏 */}
					<Collection size="14px" />
					<div className="markets-qty">
						{/* 盘口数量 */}
						<MarketCount count={props.events.marketCount} />
						{/* 去详情 */}
						<span className="arrow-icon">
							<ToDetail {...{ width: "8px", height: "12px" }} cardData={props.events} />
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * 盘口组件
 * @param {{ cardData: any; sportType: number }} props - 包括卡片数据和体育类型
 */
const Markets = ({ cardData: sportInfo, sportType }: { cardData: any; sportType: number }) => {
	const sportsBetEvent = useSportsBetEventStore();
	const columns = (betTypeConfigMap.get(sportType) as any[]) || [];

	/**
	 * 判断当前盘口是否高亮
	 * @param {any} selection - 当前选项
	 * @param {any} market - 当前盘口
	 * @returns {boolean} 是否高亮
	 */
	const isBright = (selection: any, market: any): boolean => {
		return sportsBetEvent.getEventInfo[sportInfo.eventId]?.listKye === `${market?.marketId}-${selection?.key}`;
	};

	/**
	 * 处理下注事件
	 * @param {any} market - 当前盘口
	 * @param {any} selection - 当前选项
	 * @param {number} type - 盘口类型
	 */
	const handleBet = (market: any, selection: any, type: number): void => {
		if (market.marketStatus === "running") {
			if (isBright(selection, market)) {
				sportsBetEvent.removeEventCart(sportInfo);
			} else {
				sportsBetEvent.storeEventInfo(sportInfo.eventId, {
					marketId: market.marketId,
					betType: type,
					selectionKey: selection.key,
				});
				sportsBetEvent.addEventToCart({ ...sportInfo });
			}
		}
	};

	return (
		<>
			{columns.map((item) => {
				const renderMarket = (market: any, className: string, isRowLayout = false) => (
					<div className={`market-column ${className}`} key={market?.marketId} style={isRowLayout ? { marginTop: "4px", flexDirection: "row" } : {}}>
						{market?.selections?.map((selection: any) => (
							<div
								className={`${isBright(selection, market) ? "isBright market-content" : "market-content"}`}
								onClick={() => handleBet(market, selection, item.type)}
								key={`${market.marketId}-${selection?.key}`}
							>
								<BetSelector value={selection?.oddsPrice?.decimalPrice} id={`${market.marketId}-${selection?.key}`} isRun={market.marketStatus === "running"}>
									<BettingCom betType={item.cardType} cardData={selection} market={market} />
								</BetSelector>
							</div>
						))}
					</div>
				);

				if (typeof item.type === "number") {
					const market = marketsMatchData(sportInfo.markets, item.type, item.selectionsLength);
					return market ? renderMarket(market, item.class) : <div className="market-column" key={item.class} />;
				} else {
					return (
						<div className="market-item-group">
							{item.type.map((type: number, index: number) => {
								const market = marketsMatchData(sportInfo.markets, type, item.selectionsLength);
								return market ? renderMarket(market, "market-row", index > 0) : null;
							})}
						</div>
					);
				}
			})}
		</>
	);
};

/**
 * 比赛卡片组件
 * @description 展示比赛详情，包括联赛名称、队伍信息、盘口信息等
 */
const MatchCard = defineComponent({
	name: "MatchCard",
	props: {
		events: { type: Object, required: true },
		isExpanded: { type: Boolean, default: true, required: true },
		sportType: { type: Number, required: true },
		dataIndex: { type: Number },
		scoreboardId: { type: Number, required: true, default: 0 },
	},
	emits: ["toggleDisplay"],
	setup(props, { emit }) {
		const ShopCatControlStore = useShopCatControlStore();
		onMounted(() => {
			// 设置购物车为联赛类型
			ShopCatControlStore.setShopCartType("league");
		});
		return () => (
			<div className={`card-container card-container-${props.sportType}`}>
				{/* 头部 联赛名称 盘口信息 */}
				<Header
					handleToggle={() => {
						emit("toggleDisplay", props.dataIndex);
					}}
					{...props}
				/>
				{/* 主体 */}
				{props.events?.events?.map((item: any) => {
					const { Live, Scoreboard } = useHeaderTools({ value: item });
					return (
						<div key={item.eventId} style={{ display: props.isExpanded ? "flex" : "none" }} className="card-content">
							{/* 队伍信息 */}
							<League key={item.eventId} events={item} />
							{/* 盘口信息 */}
							<div className="markets-content">
								<div className="league-markets">
									<Markets cardData={item} sportType={props.sportType} />
								</div>
								{/* 底部赛事比分 */}
								<FooterScore cardData={item} sportType={props.sportType} />
							</div>
							{/* 比分板直播工具栏 */}
							<div className="league-option">
								<Scoreboard isCurrent={props.scoreboardId === item.eventId} />
								<Live isCurrent={props.scoreboardId === item.eventId} />
							</div>
						</div>
					);
				})}
			</div>
		);
	},
});

export default defineComponent(MatchCard);
