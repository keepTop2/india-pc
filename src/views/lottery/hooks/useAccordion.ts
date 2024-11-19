import { Ref, ref } from "vue";
import { useLottery } from "/@/views/lottery/stores/lotteryStore";
import { type GameplayList, type OddsItem } from "/@/views/lottery/types/index";
interface BallParams {
	value?: number;
	list?: number[];
}

type Balls = number[];

export function useAccordion(gameplayList: Ref<GameplayList>) {
	const formActived = ref(false);
	const balls = ref([] as Balls);
	const currentGameplayItem = ref(); // 当前选中的大菜单
	const currentOddsItem = ref({} as OddsItem); // 当前选中高亮的项
	const { setOddsItem, setGameplayItem, setCurretnBalls } = useLottery();

	// 展开、折叠手风琴
	const toggleAccordion = (status: boolean, index: number) => {
		gameplayList.value.forEach((v) => (v.actived = false));
		const gameplayItem = gameplayList.value[index];
		gameplayItem.actived = status;
		setGameplayItem(gameplayItem);
	};

	// 选择球组的处理方法
	const chooseBalls = (balls: number[], gameplayIndex: number, oddsIndex: number) => {
		setCurretnBalls(balls);
	};

	// 选择 oddsItem
	const chooseOddsItem = (status: boolean, gameplayIndex: number, oddsIndex: number) => {
		const gameplayItem = gameplayList.value[gameplayIndex];
		const { oddsList } = gameplayItem;
		oddsList.forEach((v) => (v.actived = false));
		const oddsItem = oddsList[oddsIndex];
		oddsItem.actived = status;
		setOddsItem(oddsItem);
	};

	return {
		formActived,
		balls,
		toggleAccordion,
		chooseBalls,
		chooseOddsItem,
		currentGameplayItem,
		currentOddsItem,
	};
}
