const betTypeConfigMap = new Map([
	[
		1, //足球
		[
			{ class: "capot", cardType: "moneyline", type: 5, selectionsLength: 3 }, // 全场独赢
			{ class: "handicap", cardType: "pointSpread", type: 1, selectionsLength: 2 }, // 全场让球
			{ class: "magnitude", cardType: "totalPoints", type: 3, selectionsLength: 2 }, // 全场大小
			{ class: "capot", cardType: "moneyline", type: 15, selectionsLength: 3 }, // 半场独赢
			{ class: "handicap", cardType: "pointSpread", type: 7, selectionsLength: 2 }, // 半场让球
			{ class: "magnitude", cardType: "totalPoints", type: 8, selectionsLength: 2 }, // 半场大小
		],
	],
	[
		2, //篮球
		[
			{ id: 1, cardType: "moneyline", type: 20, selectionsLength: 2 },
			{ id: 2, cardType: "pointSpread", type: 1, selectionsLength: 2 },
			{ id: 3, cardType: "totalPoints", type: 3, selectionsLength: 2 },
			{ id: 4, cardType: "totalPoints", type: [401, 402], selectionsLength: 2 },
		],
	],
]);

export default betTypeConfigMap;
