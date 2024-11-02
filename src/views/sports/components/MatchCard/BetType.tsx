import { defineComponent, h } from "vue";
import SvgIcon from "/@/components/svgIcon/index.vue";

// 赔率组件
export const OddsPrice = ({ decimalPrice, marketStatus }: { decimalPrice: number; marketStatus: string }) => {
	return marketStatus === "running" ? (
		<div class="value">
			<span>{decimalPrice}</span>
		</div>
	) : (
		<div class="lock">
			<SvgIcon name="sports-lock" size="16px" />
		</div>
	);
};

// 独赢
export const Moneyline = ({ cardData, market }: { cardData: any; market: any }) => (
	<div className="market-item">
		<div class="label">{cardData?.keyName?.slice(0, 1)}</div>
		<OddsPrice decimalPrice={cardData.oddsPrice.decimalPrice} marketStatus={market.marketStatus} />
	</div>
);

// 让球/让分
export const PointSpread = ({ cardData, market }: { cardData: any; market: any }) => (
	<div className="market-item">
		<div class="label">
			<span>{cardData?.point > 0 ? `+${cardData?.point}` : cardData?.point}</span>
		</div>
		<OddsPrice decimalPrice={cardData.oddsPrice.decimalPrice} marketStatus={market.marketStatus} />
	</div>
);

// 大小分
export const TotalPoints = ({ cardData, market }: { cardData: any; market: any }) => (
	<div className="market-item">
		<div class="label">
			<span>{cardData.keyName}</span>
			<span>{cardData?.point}</span>
		</div>
		<OddsPrice decimalPrice={cardData.oddsPrice.decimalPrice} marketStatus={market.marketStatus} />
	</div>
);

// BettingCom 组件
export const BettingCom = defineComponent({
	props: {
		betType: {
			type: String,
			required: true,
		},
		cardData: {
			required: true,
		},
		market: { type: Object, required: true },
	},
	setup(props) {
		// 根据 betType 动态选择对应的组件
		const renderBetTypeComponent = () => {
			const betComponents: Record<string, any> = {
				moneyline: Moneyline,
				pointSpread: PointSpread,
				totalPoints: TotalPoints,
			};
			const SelectedComponent = betComponents[props.betType];

			return props.cardData ? (
				h(SelectedComponent, { cardData: props.cardData, market: props.market })
			) : (
				<div className="market-item">
					<div className="noData">-</div>
				</div>
			);
		};

		return () => renderBetTypeComponent();
	},
});
