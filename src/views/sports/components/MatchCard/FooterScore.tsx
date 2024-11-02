import { computed, defineComponent, h } from "vue";
// 篮球
export const Basketball = ({ events: { basketballInfo = {} } }: any) => {
	// 比赛节数
	const getPeriod = computed(() => {
		const { homeGameScore, awayGameScore, homeOverTimeScore, awayOverTimeScore, latestLivePeriod } = basketballInfo;
		// 加时赛
		if (latestLivePeriod > 4) {
			const periods = homeGameScore.map((score: number, index: number) => [score, awayGameScore[index]]);
			periods.push([homeOverTimeScore, awayOverTimeScore]);
			return periods;
		} else {
			return homeGameScore.slice(0, latestLivePeriod).map((score: number, index: number) => [score, awayGameScore[index]]);
		}
	});
	return basketballInfo.latestLivePeriod > 0 ? (
		<div className="score-list">
			{getPeriod.value.map((item: any, index: number) => (
				<div className={`score-list-item ${getPeriod.value.length === index + 1 ? " theme" : ""}`}>
					{item[0]}-{item[1]}
				</div>
			))}
		</div>
	) : (
		<></>
	);
};

export const FooterScore = defineComponent({
	props: {
		sportType: {
			type: Number,
			required: true,
		},
		cardData: { type: Object, required: true },
	},
	setup(props) {
		// 根据 sportType 动态选择对应的组件
		const renderBetTypeComponent = () => {
			const betComponents: Record<string, any> = {
				2: Basketball,
			};
			const SelectedComponent = betComponents[props.sportType];

			return SelectedComponent ? h(SelectedComponent, { events: props.cardData }) : <></>;
		};

		return () => renderBetTypeComponent();
	},
});
