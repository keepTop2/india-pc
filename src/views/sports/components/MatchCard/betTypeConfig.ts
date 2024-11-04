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
	[
		3, //美式足球
		[
			{ cardType: "moneyline", type: 20, selectionsLength: 2 },
			{ cardType: "pointSpread", type: 1, selectionsLength: 2 },
			{ cardType: "totalPoints", type: 3, selectionsLength: 2 },
		],
	],
	[
		4, //冰上曲棍球
		[
			{ cardType: "moneyline", type: 20, selectionsLength: 2 },
			{ cardType: "pointSpread", type: 1, selectionsLength: 2 },
			{ cardType: "totalPoints", type: 3, selectionsLength: 2 },
			{ cardType: "totalPoints", type: 2, selectionsLength: 2 },
		],
	],
	[
		5, //网球
		[
			{ cardType: "moneyline", type: 20, selectionsLength: 2 }, // 全场独赢
			{ cardType: "pointSpread", type: 1303, selectionsLength: 2 }, // 让盘
			{ cardType: "totalPoints", type: 153, selectionsLength: 2 }, // 让局
			{ cardType: "totalPoints", type: 1306, selectionsLength: 2 }, // 总局数
		],
	],
	[
		6, //排球
		[
			{ cardType: "moneyline", type: 20, selectionsLength: 2 }, // 独赢
			{ cardType: "pointSpread", type: 704, selectionsLength: 2 }, // 让分
			{ cardType: "totalPoints", type: 705, selectionsLength: 2 }, // 总分
		],
	],
	[
		7, //斯诺克/台球
		[
			{ cardType: "moneyline", type: 20, selectionsLength: 2 }, // 全场独赢
			{ cardType: "pointSpread", type: 1, selectionsLength: 2 }, // 全场让球
			{ cardType: "totalPoints", type: 3, selectionsLength: 2 }, // 全场大小
		],
	],
	[
		8, //棒球
		[
			{ cardType: "moneyline", type: 20, selectionsLength: 2 }, // 全场独赢
			{ cardType: "pointSpread", type: 1, selectionsLength: 2 }, // 全场让球
			{ cardType: "totalPoints", type: 3, selectionsLength: 2 }, // 全场大小
			{ cardType: "totalPoints", type: 2, selectionsLength: 2 }, // 全场单双
		],
	],
	[
		9, //羽毛球
		[
			{ cardType: "moneyline", type: 20, selectionsLength: 2 }, // 全场独赢
			{ cardType: "pointSpread", type: 701, selectionsLength: 2 }, // 全场让球
			{ cardType: "totalPoints", type: 704, selectionsLength: 2 }, // 全场大小
			{ cardType: "totalPoints", type: 705, selectionsLength: 2 }, // 全场总分
		],
	],
	[
		43, //电子电竞
		[
			{ cardType: "moneyline", type: 20, selectionsLength: 2 }, // 全场独赢
			{ cardType: "pointSpread", type: 1, selectionsLength: 2 }, // 全场让球
			{ cardType: "totalPoints", type: 3, selectionsLength: 2 }, // 全场大小
		],
	],
]);

export default betTypeConfigMap;
