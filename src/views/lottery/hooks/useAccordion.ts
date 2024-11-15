import { Ref, ref } from "vue";
import { type GameplayItem, type MergedGameplayList, type OddsListItem } from "/@/views/lottery/types/index";

interface BallParams {
	value?: number;
	list?: number[];
}

type Balls = number[];

export function useAccordion(mergedGameplayList: Ref<MergedGameplayList>) {
	const formActived = ref(false);
	const balls = ref([] as Balls);
	const currentGameplayItem = ref(); // 当前选中的大菜单
	const currentOddsListItem = ref({} as OddsListItem); // 当前选中高亮的项
	const currentK10OddsList = ref<string[]>([]); // 当前选中高亮的项
	// 清除手风琴展开状态的处理方法
	const clearAccordionStatus = (status: boolean, index: number) => {
		mergedGameplayList.value.forEach((item, i) => {
			item.actived = index === i && status;
		});
	};

	// 选择球组的处理方法
	const handleSelectBalls = ({ list }: BallParams, oddsListItem: OddsListItem, gameplayItem: GameplayItem) => {
		console.log("list", list);
		console.log("oddsListItem", oddsListItem);
		console.log("gameplayItem", gameplayItem);

		formActived.value = (list as Balls).length ? true : false;
		currentGameplayItem.value = (list as Balls).length ? { ...gameplayItem, oddsList: { ...oddsListItem } } : null;

		balls.value = list as Balls;
	};

	// const handleSelectBalls = ({ list }, childData: any, data: any) => {
	// 	formActived.value = list.length ? true : false;
	// 	currentGameplayItem.value = list.length ? { ...data, oddsList: { ...childData } } : null;
	// 	console.log("currentGameplayItem.value", currentGameplayItem.value);
	// 	balls.value = list;
	// 	currentOddsListItem.value = childData;
	// };

	// k10 选择球
	const handleSelectBallsK10 = (childData: any, parentData: any) => {
		if (currentK10OddsList.value.includes(childData.optionCode)) {
			balls.value = [];
			currentK10OddsList.value = [];
			currentOddsListItem.value = {} as OddsListItem;
			return;
		}
		balls.value = [childData.optionName];
		currentK10OddsList.value = [childData.optionCode];
		currentOddsListItem.value = {
			...parentData,
			...childData,
		};
		console.log("currentOddsListItem.value", currentOddsListItem.value);
	};

	/**
	 * @description 手风琴展开玩法项的处理方法
	 * @param status 当前子项选中状态
	 * @param childData 当前子项数据
	 * @param data 父数据
	 */
	const handleExpanded = (status: boolean, childData: any, data: any) => {
		mergedGameplayList.value.forEach((v) => {
			v.oddsList.forEach((w) => (w.actived = false));
		});
		childData.actived = status;
		currentOddsListItem.value = childData;
		balls.value = [];
		currentK10OddsList.value = [];
		// 排除选择球玩法
		if (childData.type !== "selectBall") {
			formActived.value = status;
			currentGameplayItem.value = status ? { ...data, oddsList: { ...childData } } : null;
		}
	};

	return {
		formActived,
		balls,
		clearAccordionStatus,
		handleSelectBalls,
		handleSelectBallsK10,
		currentK10OddsList,
		handleExpanded,
		currentGameplayItem,
		currentOddsListItem,
	};
}
