import { computed, defineComponent, h } from "vue";

// 获取比赛得分的通用逻辑
const ScoreList = ({ homeScores, awayScores, currentPeriod }: { homeScores: number[]; awayScores: number[]; currentPeriod: number }) => (
	<div className="score-list">
		{homeScores.map((score, index) => (
			<div className={`score-list-item ${currentPeriod === index + 1 ? "theme" : ""}`} key={index}>
				{score} - {awayScores[index]}
			</div>
		))}
	</div>
);

// 获取比分通用组件
const RightSroce = ({ gameInfo, currentSet, gameSession }: any) => {
	const { homeTotalScore, awayTotalScore, totalScore } = gameInfo;
	return (
		<div className="total">
			<span>
				{gameSession}局{Math.ceil(gameSession / 2)}胜
			</span>
			{currentSet > 0 && (
				<>
					<span>|</span>
					<span>
						总局数&nbsp;
						<span className="theme">
							{homeTotalScore} - {awayTotalScore}
						</span>
						<span className="theme">({totalScore})</span>
					</span>
				</>
			)}
		</div>
	);
};

// 篮球组件
const Basketball = ({ events: { basketballInfo = {} } }: any) => {
	const { homeGameScore, awayGameScore, homeOverTimeScore, awayOverTimeScore, latestLivePeriod } = basketballInfo;

	// 计算比赛节数
	const getPeriods = computed(() => {
		const periods =
			latestLivePeriod > 4
				? [...homeGameScore.map((score, index) => [score, awayGameScore[index]]), [homeOverTimeScore, awayOverTimeScore]]
				: homeGameScore.slice(0, latestLivePeriod).map((score, index) => [score, awayGameScore[index]]);
		return periods;
	});

	return latestLivePeriod > 0 ? (
		<ScoreList homeScores={getPeriods.value.map((item) => item[0])} awayScores={getPeriods.value.map((item) => item[1])} currentPeriod={latestLivePeriod} />
	) : (
		<CommonFooter />
	);
};

// 网球组件
const Tennis = ({ events }: { events: { tennisInfo: { homeGameScore: number[]; awayGameScore: number[]; currentSet: number }; gameSession: number } }) => {
	const { tennisInfo, gameSession } = events;

	// 预计算总分，避免重复计算
	const homeTotalScore = tennisInfo?.homeGameScore.flat().reduce((a, b) => a + b, 0);
	const awayTotalScore = tennisInfo?.awayGameScore.flat().reduce((a, b) => a + b, 0);
	const totalScore = homeTotalScore + awayTotalScore;

	return (
		<div className="score-list total-score">
			{tennisInfo?.currentSet > 0 && (
				<div>
					{tennisInfo.homeGameScore.slice(0, tennisInfo.currentSet).map((item, index) => (
						<span className={`score-list-item ${tennisInfo.currentSet === index + 1 ? "theme" : ""}`} key={index}>
							{item} - {tennisInfo.awayGameScore[index]}
						</span>
					))}
				</div>
			)}
			<RightSroce gameSession={gameSession} gameInfo={{ homeTotalScore, awayTotalScore, totalScore }} currentSet={tennisInfo?.currentSet} />
		</div>
	);
};

// 排球组件
const Volleyball = ({ events }: { events: { volleyballInfo: { homeGameScore: number[]; awayGameScore: number[]; livePeriod: number }; gameSession: number } }) => {
	const { volleyballInfo, gameSession } = events;

	// 预计算总分，避免重复计算
	const homeTotalScore = volleyballInfo?.homeGameScore?.flat().reduce((a, b) => a + b, 0);
	const awayTotalScore = volleyballInfo?.awayGameScore?.flat().reduce((a, b) => a + b, 0);
	const totalScore = homeTotalScore + awayTotalScore;

	return (
		<div className="score-list total-score">
			{volleyballInfo?.livePeriod > 0 && (
				<div>
					{volleyballInfo.homeGameScore.slice(0, volleyballInfo.livePeriod).map((item, index) => (
						<span className={`score-list-item ${volleyballInfo.livePeriod === index + 1 ? "theme" : ""}`} key={index}>
							{item} - {volleyballInfo.awayGameScore[index]}
						</span>
					))}
				</div>
			)}
			<RightSroce gameSession={gameSession} gameInfo={{ homeTotalScore, awayTotalScore, totalScore }} currentSet={volleyballInfo?.livePeriod} />
		</div>
	);
};

// 棒球组件
const Baseball = ({
	events,
}: {
	events: {
		baseballInfo: { homeGameScore: number[]; awayGameScore: number[]; homeOverTimeScore: number; awayOverTimeScore: number; currentInning: number; currentOuts: number };
		gameSession: number;
	};
}) => {
	const { homeGameScore, awayGameScore, homeOverTimeScore, awayOverTimeScore, currentInning, currentOuts } = events.baseballInfo || {};

	// 判断是否延长赛
	if (currentInning > 9) {
		homeGameScore.push(homeOverTimeScore);
		awayGameScore.push(awayOverTimeScore);
	}

	return (
		<div className="score-list total-score">
			{currentInning > 0 && (
				<div>
					{homeGameScore.slice(0, currentInning).map((item, index) => (
						<span className={`score-list-item ${currentInning === index + 1 ? "theme" : ""}`} key={index}>
							{item} - {awayGameScore[index]}
						</span>
					))}
				</div>
			)}
			<div className="total">
				{currentInning > 0 && (
					<div className="current-outs">
						<span>
							出局：<span className="theme">{currentOuts}</span>
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

// 羽毛球组件
const Badminton = ({ events }: { events: { badmintonInfo: { homeGameScore: number[]; awayGameScore: number[]; currentSet: number }; gameSession: number } }) => {
	const { badmintonInfo, gameSession } = events;

	// 预计算总分，避免重复计算
	const homeTotalScore = badmintonInfo?.homeGameScore.flat().reduce((a, b) => a + b, 0);
	const awayTotalScore = badmintonInfo?.awayGameScore.flat().reduce((a, b) => a + b, 0);
	const totalScore = homeTotalScore + awayTotalScore;

	return (
		<div className="score-list total-score">
			{badmintonInfo?.currentSet > 0 && (
				<div>
					{badmintonInfo.homeGameScore.slice(0, badmintonInfo.currentSet).map((item, index) => (
						<span className={`score-list-item ${badmintonInfo.currentSet === index + 1 ? "theme" : ""}`} key={index}>
							{item} - {badmintonInfo.awayGameScore[index]}
						</span>
					))}
				</div>
			)}
			<RightSroce gameSession={gameSession} gameInfo={{ homeTotalScore, awayTotalScore, totalScore }} currentSet={badmintonInfo?.currentSet} />
		</div>
	);
};

// 公共页脚组件
const CommonFooter = () => <div className="score-list"></div>;

// 主组件，动态渲染不同运动类型的得分组件
export const FooterScore = defineComponent({
	props: {
		sportType: {
			type: Number,
			required: true,
		},
		cardData: {
			type: Object,
			required: true,
		},
	},
	setup(props) {
		// 根据 sportType 动态选择对应的组件
		const renderBetTypeComponent = () => {
			const betComponents: Record<number, any> = {
				2: Basketball,
				3: CommonFooter,
				4: CommonFooter,
				5: Tennis,
				6: Volleyball,
				7: CommonFooter,
				8: Baseball,
				9: Badminton,
				43: CommonFooter,
			};

			const SelectedComponent = betComponents[props.sportType];
			return SelectedComponent ? h(SelectedComponent, { events: props.cardData }) : <></>;
		};

		return () => renderBetTypeComponent();
	},
});
