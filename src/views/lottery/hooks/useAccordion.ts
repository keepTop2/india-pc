import { type Ref } from "vue";
import { useLottery } from "/@/views/lottery/stores/lotteryStore";
import { type GameplayItem, type GameplayList, type OddsItem } from "/@/views/lottery/types/index";
interface BallParams {
	value?: number;
	list?: number[];
}

export function useAccordion(gameplayList: Ref<GameplayList>) {
	const { lotteryDetail, currentOddsItem, currentGameplayItem, curretnBalls, formActived, beginPageData, setOddsItem, setGameplayItem, setCurretnBalls } = useLottery();

	// 展开、折叠手风琴
	const toggleAccordion = (status: boolean, index: number) => {
		console.log("toggleAccordion");
		console.log("status", status);
		console.log("index", index);
		console.log("gameplayList", gameplayList);

		gameplayList.value.forEach((v) => (v.actived = false));
		const gameplayItem = gameplayList.value[index];
		console.log("gameplayItem", gameplayItem);
		gameplayItem.actived = status;

		if (!status) {
			gameplayItem.oddsList.forEach((v) => (v.actived = false));
			setGameplayItem({} as GameplayItem);
			setOddsItem({} as OddsItem);
			return;
		}
		setGameplayItem(gameplayItem);
	};

	// 选择球组的处理方法
	const chooseBalls = (balls: number[], gameplayIndex: number, oddsIndex: number) => {
		console.log("chooseBalls");
		console.log("balls", balls);
		setCurretnBalls(balls);
	};

	// 选择 oddsItem
	const chooseOddsItem = (status: boolean, gameplayIndex: number, oddsIndex: number) => {
		console.log("chooseOddsItem");
		console.log("gameplayIndex", gameplayIndex);
		console.log("oddsIndex", oddsIndex);

		const gameplayItem = gameplayList.value[gameplayIndex];
		const { oddsList } = gameplayItem;
		oddsList.forEach((v) => (v.actived = false));
		const oddsItem = oddsList[oddsIndex];
		oddsItem.actived = status;

		if (!status) {
			return setOddsItem({} as OddsItem);
		}
		setOddsItem(oddsItem);
	};

	return {
		toggleAccordion,
		chooseBalls,
		chooseOddsItem,
	};
}
