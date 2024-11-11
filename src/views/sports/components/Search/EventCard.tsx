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
export const RedOrYellowCard = defineComponent({
	name: "RedOrYellowCard",
	props: {
		cardData: { type: Object as PropType<CardData>, required: true },
		className: { type: String, default: "" },
		name: { type: String, required: true },
	},
	setup(props) {
		const number = computed(() => props.cardData?.soccerInfo?.[props.name]);
		return () => (number.value ? <span className={props.className}>{number.value}</span> : null);
	},
});

// 主队或客队组件
export const Team = defineComponent({
	name: "Team",
	props: {
		name: { type: String, required: true },
		cardData: { type: Object as PropType<CardData>, required: true },
		isStart: { type: Boolean, required: true },
	},
	setup(props) {
		// 首字母大写
		const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

		return () => (
			<>
				<div className="left">
					<img className="icon" src={props.cardData?.teamInfo[`${props.name}IconUrl`]} alt="" />
					<span className="name">
						<span v-ok-tooltip>{props.cardData?.teamInfo[`${props.name}Name`]}</span>
					</span>
				</div>
				<div className="right">
					{/* 红牌黄牌数量 */}
					<div className="foul-info">
						<RedOrYellowCard className="yellow" name={`${props.name}YellowCard`} cardData={props.cardData} />
						<RedOrYellowCard className="red" name={`${props.name}RedCard`} cardData={props.cardData} />
					</div>
					{/* 得分 */}
					<span className="score">{props.isStart ? props.cardData?.gameInfo[`live${capitalizeFirstLetter(props.name)}Score`] : ""}</span>
				</div>
			</>
		);
	},
});

// 比赛时间标题组件
export const TimeTitle = defineComponent({
	name: "TimeTitle",
	props: {
		isStart: { type: Boolean, required: true },
		cardData: { type: Object as PropType<CardData>, required: true },
	},
	setup(props) {
		return () => (
			<>
				{!props.isStart && <span className="date-title">未开赛:</span>}
				<span className="date">{SportsCommonFn.getEventsTitle(props.cardData)}</span>
			</>
		);
	},
});

// 比赛时间组件
export const GameTime = defineComponent({
	name: "GameTime",
	props: {
		cardData: { type: Object as PropType<CardData>, required: true },
	},
	setup(props) {
		const { gameTime } = useGameTimer(computed(() => props.cardData));
		return () => (gameTime.value ? <span className="time">{gameTime.value}</span> : null);
	},
});

// 详情Icon组件
export const ToDetail = defineComponent({
	name: "ToDetail",
	props: {
		cardData: { type: Object as PropType<CardData>, required: true },
		size: { type: String, default: "16px" },
	},
	setup(props) {
		const { toggleEventScoreboard } = useToolsHooks();
		const { gotoEventDetail } = useLink();
		// 点击跳转详情页
		const handleGoDetail = () => {
			const { leagueId, eventId, sportType } = props.cardData;
			toggleEventScoreboard(props.cardData);
			gotoEventDetail({ leagueId, eventId }, sportType);
		};
		return () => <SvgIcon class="pointer" onClick={handleGoDetail} name="sports-arrow" size={props.size} />;
	},
});

// 盘口数量组件
export const MarketCount = defineComponent({
	name: "MarketCount",
	props: {
		count: { type: Number, required: true },
	},
	setup(props) {
		return () => (props.count ? <span className="count">+{props.count}</span> : null);
	},
});

// EventCard 主组件
const EventCard = defineComponent({
	name: "EventCard",
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
