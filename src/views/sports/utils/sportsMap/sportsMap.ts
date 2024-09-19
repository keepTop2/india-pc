import football from "/@/assets/zh-CN/sports/football.png";
import football_active from "/@/assets/zh-CN/sports/football_active.png";
import basketball from "/@/assets/zh-CN/sports/basketball.png";
import basketball_active from "/@/assets/zh-CN/sports/basketball_active.png";
import americanSoccer from "/@/assets/zh-CN/sports/americanSoccer.png";
import americanSoccer_active from "/@/assets/zh-CN/sports/americanSoccer_active.png";
import iceHockey from "/@/assets/zh-CN/sports/iceHockey.png";
import iceHockey_active from "/@/assets/zh-CN/sports/iceHockey_active.png";
import tennis from "/@/assets/zh-CN/sports/tennis.png";
import tennis_active from "/@/assets/zh-CN/sports/tennis_active.png";
import volleyball from "/@/assets/zh-CN/sports/volleyball.png";
import volleyball_active from "/@/assets/zh-CN/sports/volleyball_active.png";
import billiards from "/@/assets/zh-CN/sports/billiards.png";
import billiards_active from "/@/assets/zh-CN/sports/billiards_active.png";
import baseball from "/@/assets/zh-CN/sports/baseball.png";
import baseball_active from "/@/assets/zh-CN/sports/baseball_active.png";
import badminton from "/@/assets/zh-CN/sports/badminton.png";
import badminton_active from "/@/assets/zh-CN/sports/badminton_active.png";
import eSports from "/@/assets/zh-CN/sports/eSports.png";
import eSports_active from "/@/assets/zh-CN/sports/eSports_active.png";

/**
 * @description 体育类型字典
 */
const sportsMap = {
	1: {
		name: "足球",
		icon: football,
		activeIcon: football_active,
	},
	2: {
		name: "篮球",
		icon: basketball,
		activeIcon: basketball_active,
	},
	3: {
		name: "美式足球",
		icon: americanSoccer,
		activeIcon: americanSoccer_active,
	},
	4: {
		name: "冰上曲棍球",
		icon: iceHockey,
		activeIcon: iceHockey_active,
	},
	5: {
		name: "网球",
		icon: tennis,
		activeIcon: tennis_active,
	},
	6: {
		name: "排球",
		icon: volleyball,
		activeIcon: volleyball_active,
	},
	7: {
		name: "斯诺克/台球",
		icon: billiards,
		activeIcon: billiards_active,
	},
	8: {
		name: "棒球",
		icon: baseball,
		activeIcon: baseball_active,
	},
	9: {
		name: "羽毛球",
		icon: badminton,
		activeIcon: badminton_active,
	},
	43: {
		name: "电子竞技",
		icon: eSports,
		activeIcon: eSports_active,
	},
};

export default sportsMap;
