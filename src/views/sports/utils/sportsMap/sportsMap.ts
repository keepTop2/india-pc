import { i18n } from "/@/i18n/index";

const $: any = i18n.global;

/**
 * @description 体育类型字典的每个项的接口定义
 */
interface Sport {
	name: string; // 体育名称
	icon: string; // 体育对应的图标
	label?: string; // 翻译后的标签（动态添加，默认为可选属性）
}

/**
 * @description 体育类型字典的类型定义，键为字符串，值为 Sport 类型
 */
type SportsMap = Record<string, Sport>;

/**
 * @description 体育类型字典
 */
let sportsMap: SportsMap = {
	"1": { name: "足球", icon: "football" },
	"2": { name: "篮球", icon: "basketball" },
	"3": { name: "美式足球", icon: "americanSoccer" },
	"4": { name: "冰上曲棍球", icon: "iceHockey" },
	"5": { name: "网球", icon: "tennis" },
	"6": { name: "排球", icon: "volleyball" },
	"7": { name: "斯诺克/台球", icon: "billiards" },
	"8": { name: "棒球", icon: "baseball" },
	"9": { name: "羽毛球", icon: "badminton" },
	"43": { name: "电子竞技", icon: "eSports" },
};

// 动态为每个体育类型添加翻译后的标签

// Object.keys(sportsMap).forEach(([key, value]) => {
// 	sportsMap[key].label = $.t(`sports['${key}']`);
// });

export default sportsMap;
