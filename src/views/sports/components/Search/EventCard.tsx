import { computed, defineComponent } from "vue";
import useHeaderTools from "/@/views/sports/components/HeaderTools";
import SvgIcon from "/@/components/svgIcon/index.vue";
import SportsCommonFn from "/@/views/sports/utils/common";
import useGameTimer from "../../hooks/useGameTimer";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useLink } from "/@/views/sports/hooks/useLink";
import "./style/eventCard.scss";

export default () => {
	// 首字母大写
	const capitalizeFirstLetter = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	const EventCard = defineComponent({
		props: {
			data: {
				type: Object,
			},
		},
		setup(props) {
			const { toggleEventScoreboard } = useToolsHooks();
			const { gotoEventDetail } = useLink();
			// 收藏按钮
			const { Collection } = useHeaderTools(props.data);
			const computerData = computed(() => props.data);

			const { data } = props;
			// 判断是否已开赛
			const isStart = computed(() => SportsCommonFn.isStartMatch(data?.globalShowTime));

			// 红牌或黄牌
			const RedOrYellowCard = ({ name, className }: { name: string; className: string }) => {
				const number = data?.soccerInfo?.[name];
				if (number) {
					return <span className={className}>{number}</span>;
				}
				return <></>;
			};

			// 主队或客队
			const Team = ({ name }: { name: string }) => {
				return (
					<>
						<div className="left">
							<img className="icon" src={data?.teamInfo[`${name}IconUrl`]} alt="" />
							<span className="name">
								<span v-ok-tooltip>{data?.teamInfo[`${name}Name`]}</span>
							</span>
						</div>
						<div className="right">
							{/* 红牌黄牌数量 */}
							<div class="foul-info">
								<RedOrYellowCard className="yellow" name={`${name}YellowCard`} />
								<RedOrYellowCard className="red" name={`${name}RedCard`} />
							</div>
							{/* 得分 */}
							<span className="score">{isStart.value ? data?.gameInfo[`live${capitalizeFirstLetter(name)}Score`] : "-"}</span>
						</div>
					</>
				);
			};

			// 比赛时间标题
			const TimeTitle = () => {
				return (
					<>
						{!isStart.value ? <span className="date-title">未开赛:</span> : <></>}
						<span className="date">{SportsCommonFn.getEventsTitle(data)}</span>
					</>
				);
			};

			// 比赛时间
			const GameTime = () => {
				const { gameTime } = useGameTimer(computerData as any);
				if (gameTime.value) {
					return <span className="time">{gameTime.value}</span>;
				}
				return <></>;
			};

			// 盘口数量
			const MarketCount = ({ count }: { count: number }) => {
				return count ? <span className="count">+{count}</span> : <></>;
			};

			// 点击跳转详情页
			const handleGoDetail = () => {
				const { leagueId, eventId, sportType } = props.data as any;
				const params = {
					leagueId,
					eventId,
				};
				toggleEventScoreboard(props.data);
				gotoEventDetail(params, sportType);
			};

			return () => (
				<div className="event-card-item">
					<div className="header">
						<div className="left">
							{/* 联赛图标 */}
							<img className="league_icon" src={data?.leagueIconUrl} alt="" />
							{/* 联赛名称 */}
							<span className="title">
								<span v-ok-tooltip>{data?.leagueName}</span>
							</span>
						</div>
						<div className="right">
							{/* 收藏 */}
							<Collection />
						</div>
					</div>
					<div className="body">
						<div className="team home-team">
							{/* 主队 */}
							<Team name="home" />
						</div>
						<div className="team away-team">
							{/* 客队 */}
							<Team name="away" />
						</div>
					</div>
					<div className="line"></div>
					<div className="footer">
						<div className="left">
							<TimeTitle />
							<GameTime />
							<MarketCount count={data?.marketCount} />
						</div>
						<div className="right">
							<SvgIcon class="pointer" onClick={handleGoDetail} name="sports-arrow" size={14} />
						</div>
					</div>
				</div>
			);
		},
	});

	return { EventCard };
};
