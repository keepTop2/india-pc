import { computed, defineComponent, PropType } from "vue";
import useHeaderTools from "/@/views/sports/components/HeaderTools";
import SvgIcon from "/@/components/svgIcon/index.vue";
import SportsCommonFn from "/@/views/sports/utils/common";
import useGameTimer from "../../hooks/useGameTimer";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useLink } from "/@/views/sports/hooks/useLink";

// TS接口定义
interface CardData {
	globalShowTime: string;
	leagueIconUrl: string;
	leagueName: string;
	marketCount: number;
	gameInfo: Record<string, any>;
	teamInfo: Record<string, any>;
	soccerInfo: Record<string, any>;
	[key: string]: any;
}

// 红牌或黄牌组件
export const RedOrYellowCard = ({ name, className, cardData }: { name: string; className: string; cardData: CardData }) => {
	const number = cardData?.soccerInfo?.[name];
	return number ? <span className={className}>{number}</span> : null;
};

// 主队或客队组件
export const Team = ({ name, cardData, isStart }: { name: string; cardData: CardData; isStart: boolean }) => {
	// 首字母大写
	const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
	return (
		<>
			<div className="left">
				<img className="icon" src={cardData?.teamInfo[`${name}IconUrl`]} alt="" />
				<span className="name">
					<span v-ok-tooltip>{cardData?.teamInfo[`${name}Name`]}</span>
				</span>
			</div>
			<div className="right">
				{/* 红牌黄牌数量 */}
				<div className="foul-info">
					<RedOrYellowCard className="yellow" name={`${name}YellowCard`} cardData={cardData} />
					<RedOrYellowCard className="red" name={`${name}RedCard`} cardData={cardData} />
				</div>
				{/* 得分 */}
				<span className="score">{isStart ? cardData?.gameInfo[`live${capitalizeFirstLetter(name)}Score`] : ""}</span>
			</div>
		</>
	);
};

// 比赛时间标题组件
export const TimeTitle = ({ isStart, cardData }: { isStart: boolean; cardData: CardData }) => (
	<>
		{!isStart && <span className="date-title">未开赛:</span>}
		<span className="date">{SportsCommonFn.getEventsTitle(cardData)}</span>
	</>
);

// 比赛时间组件
export const GameTime = ({ cardData }: { cardData: any }) => {
	const { gameTime } = useGameTimer(computed(() => cardData));
	return gameTime.value ? <span className="time">{gameTime.value}</span> : null;
};

// 详情Icon组件
export const ToDetail = ({ cardData, size, ...other }: { cardData: CardData; size?: string; other?: Record<string, any> }) => {
	const { toggleEventScoreboard } = useToolsHooks();
	const { gotoEventDetail } = useLink();
	// 点击跳转详情页
	const handleGoDetail = () => {
		const { leagueId, eventId, sportType } = cardData;
		toggleEventScoreboard(cardData);
		gotoEventDetail({ leagueId, eventId }, sportType);
	};
	return <SvgIcon class="pointer" onClick={handleGoDetail} name="sports-arrow" size={size} {...other} />;
};

// 盘口数量组件
export const MarketCount = ({ count }: { count: number }) => (count ? <span className="count">+{count}</span> : null);

// EventCard主组件
const EventCard = defineComponent({
	props: {
		data: {
			type: Object as PropType<CardData>,
			required: true,
		},
	},
	setup(props) {
		const events = computed(() => props.data);
		const { Collection } = useHeaderTools(events);

		// 判断是否已开赛
		const isStart = computed(() => SportsCommonFn.isStartMatch(props.data.globalShowTime));

		return () => (
			<div className="event-card-item">
				<div className="header">
					<div className="left">
						{/* 联赛图标 */}
						<img className="league_icon" src={props.data.leagueIconUrl} alt="" />
						{/* 联赛名称 */}
						<span className="title">
							<span v-ok-tooltip>{props.data.leagueName}</span>
						</span>
					</div>
					<div className="right">
						{/* 收藏按钮 */}
						<Collection />
					</div>
				</div>
				<div className="body">
					<div className="team home-team">
						{/* 主队 */}
						<Team name="home" cardData={props.data} isStart={isStart.value} />
					</div>
					<div className="team away-team">
						{/* 客队 */}
						<Team name="away" cardData={props.data} isStart={isStart.value} />
					</div>
				</div>
				<div className="line"></div>
				<div className="footer">
					<div className="left">
						<TimeTitle isStart={isStart.value} cardData={props.data} />
						<GameTime cardData={props.data} />
						<MarketCount count={props.data.marketCount} />
					</div>
					<div className="right">
						<ToDetail cardData={props.data} size="14px" />
					</div>
				</div>
			</div>
		);
	},
});

export default EventCard;
