import { type Ref } from "vue";
import { useLottery } from "/@/views/lottery/stores/lotteryStore";
import { type GameplayList, type OddsItem } from "/@/views/lottery/types/index";

interface Params {
	value: number;
	list: number[];
}

export function useAccordion(gameplayList: Ref<GameplayList>) {
	const { currentGameplayItem, setOddsItem, setGameplayItem, setCurrentBalls } = useLottery();

	// 展开、折叠手风琴
	const toggleAccordion = (status: boolean, index: number) => {
		gameplayList.value.forEach((v) => (v.actived = false));
		const gameplayItem = gameplayList.value[index];
		gameplayItem.actived = status;

		const { id } = currentGameplayItem.value;
		if (status && gameplayItem.id !== id) {
			gameplayItem.oddsList.forEach((v) => (v.actived = false));
			setOddsItem({} as OddsItem);
			setCurrentBalls([]);
		}
		setGameplayItem(gameplayItem);
	};

	// 选择球组的处理方法
	const chooseBalls = ({ value, list }: Params) => {
		setCurrentBalls(list);
	};

	// 选择 oddsItem
	const chooseOddsItem = (status: boolean, gameplayIndex: number, oddsIndex: number) => {
		const gameplayItem = gameplayList.value[gameplayIndex];
		const { oddsList } = gameplayItem;
		oddsList.forEach((v) => (v.actived = false));
		const oddsItem = oddsList[oddsIndex];
		oddsItem.actived = status;

		if (!status) {
			setOddsItem({} as OddsItem);

			return;
		}
		setCurrentBalls([]);
		setOddsItem(oddsItem);
	};

	return {
		toggleAccordion,
		chooseBalls,
		chooseOddsItem,
	};
}
