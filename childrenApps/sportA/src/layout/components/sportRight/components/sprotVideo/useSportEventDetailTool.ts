import { isEmpty, get } from "lodash-es";
import { SportTypeEnum } from "/@/enum/sportEnum/sportEnum";
import { SportsRootObject } from "/@/models/interface";

/**
 * table表头显示类型
 */
export enum TitleTypeEnum {
	Img,
	Svg,
	Text,
}

export type TableSizeType = "small" | "large";

type SportTableColumnType = {
	dataIndex: string;
	title: string;
	className?: string;
	type: TitleTypeEnum;
	iconName: string;
	width: number;
	size: number;
};

export const useSportEventDetailTool = () => {
	/**
	 * 根据球类，组装球类赛事详情表格相关信息
	 * @param sportInfo
	 * @returns
	 */
	const getSportTableData = (sportInfo: SportsRootObject) => {
		const { teamInfo, sportType, soccerInfo, basketballInfo } = sportInfo ?? {};

		if (isEmpty(teamInfo)) {
			return [];
		}

		const baseHomeTeamInfo = {
			title: teamInfo.homeName,
			icon: teamInfo.homeIconUrl,
		};

		const baseAwayTeamInfo = {
			title: teamInfo.awayName,
			icon: teamInfo.awayIconUrl,
		};

		switch (sportType) {
			// 足球
			case SportTypeEnum.FootBall: {
				const homeTeam = {
					...baseHomeTeamInfo,
					field1: soccerInfo!.homeYellowCard,
					field2: soccerInfo!.homeRedCard,
				};
				const awayTeam = {
					...baseAwayTeamInfo,
					field1: soccerInfo!.awayYellowCard,
					field2: soccerInfo!.awayRedCard,
				};
				return [homeTeam, awayTeam];
			}

			// 篮球
			case SportTypeEnum.Basketball: {
				const homeGameScore = basketballInfo?.homeGameScore ?? [];
				const awayGameScore = basketballInfo?.awayGameScore ?? [];

				const [hQ1, hQ2, hQ3, hQ4] = homeGameScore ?? [];
				const [aQ1, aQ2, aQ3, aQ4] = awayGameScore ?? [];

				const homeTeam = {
					...baseHomeTeamInfo,
					field1: hQ1,
					field2: hQ2,
					field3: hQ3,
					field4: hQ4,
					field5: homeGameScore.reduce((a: number, b: number) => a + b, 0),
				};
				const awayTeam = {
					...baseAwayTeamInfo,
					field1: aQ1,
					field2: aQ2,
					field3: aQ3,
					field4: aQ4,
					field5: awayGameScore.reduce((a: number, b: number) => a + b, 0),
				};
				return [homeTeam, awayTeam];
			}

			default: {
				return [];
			}
		}
	};

	/**
	 * 根据球类，组装球类赛事详情表格表头信息
	 * @param sportInfo
	 * @returns
	 */
	const getSportTableColumn = (sportInfo: SportsRootObject, size: TableSizeType = "small"): SportTableColumnType[] => {
		const { teamInfo, sportType } = sportInfo ?? {};
		if (isEmpty(teamInfo)) {
			return [];
		}

		const isSmallSize = size === "small";

		switch (sportType) {
			// 足球
			case SportTypeEnum.FootBall: {
				return [
					{
						dataIndex: "field2",
						title: "",
						type: TitleTypeEnum.Svg,
						iconName: "red",
						width: isSmallSize ? 60 : 100,
						size: 14,
					},
					{
						dataIndex: "field1",
						title: "",
						type: TitleTypeEnum.Svg,
						iconName: "yellow",
						width: isSmallSize ? 60 : 100,
						size: 14,
					},
				];
			}

			// 篮球
			case SportTypeEnum.Basketball: {
				const prev = Array.from({ length: 4 }).map((_, idx) => ({
					dataIndex: `field${idx + 1}`,
					title: `Q${idx + 1}`,
					type: TitleTypeEnum.Text,
					iconName: "",
					width: isSmallSize ? 45 : 80,
					size: 14,
				}));

				return [
					...prev,
					{
						dataIndex: "field5",
						title: "总分",
						className: "yellow",
						type: TitleTypeEnum.Text,
						iconName: "",
						width: isSmallSize ? 50 : 100,
						size: 14,
					},
				];
			}

			default: {
				return [];
			}
		}
	};

	/**
	 * 计算比赛双方比分
	 */
	const getSportEventScore = (sportInfo: SportsRootObject) => {
		const { gameInfo, sportType, soccerInfo, basketballInfo } = sportInfo ?? {};

		let home = 0;
		let away = 0;
		if (isEmpty(sportInfo)) {
			return { home, away };
		}

		switch (sportType) {
			// 足球
			case SportTypeEnum.FootBall: {
				home = get(gameInfo, "liveHomeScore", 0);
				away = get(gameInfo, "liveAwayScore", 0);
				break;
			}

			// 篮球
			case SportTypeEnum.Basketball: {
				const homeGameScore = basketballInfo?.homeGameScore ?? [];
				const awayGameScore = basketballInfo?.awayGameScore ?? [];
				home = homeGameScore.reduce((a: number, b: number) => a + b, 0);
				away = awayGameScore.reduce((a: number, b: number) => a + b, 0);
				break;
			}
		}

		return { home, away };
	};

	return {
		getSportTableData,
		getSportTableColumn,
		getSportEventScore,
	};
};
