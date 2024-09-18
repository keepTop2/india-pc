import { reactive, ref } from "vue";
import { isArray, filter, map } from "lodash-es";
import { SportTypeEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import { formatDateToTimeStamp } from "/@/webWorker/module/utils/formattingChildrenViewData";
import { QueryFormType, QueryOptionItemType } from "/@/views/sports/models/sportResultModel";
import Common from "/@/views/sports/utils/common";
import sportsApi from "/@/api/sports/sports";
import moment from "moment";

type Enum = { [s: number]: string };
// 判断值是否在enum中
const isEnumValue = <T extends Enum>(enumSrc: T, value: unknown): value is T[keyof T] => {
	return Number.isInteger(enumSrc[enumSrc[value as keyof T] as any as keyof T]);
};

export const useResultHook = () => {
	// 今日
	const Today = Common.todayDate();

	/**
	 * @description 调用获取支持球接口
	 */
	const getSportTypeOptions = async () => {
		// 获取当前日期往前12天
		const sevenDays = moment(Today).subtract(6, "day");

		//今日日期筛选；
		const params = {
			language: "zhcn",
			from: `${sevenDays.add(5, "hour").format("YYYY-MM-DDTHH:mm:ss")}`,
			until: `${moment(Today).add(5, "hour").format("YYYY-MM-DDTHH:mm:ss")}`,
		};

		const { data } = await sportsApi.GetSportResults(params).catch((err) => err);
		//获取赛果数量后 添加到sports中
		if (data && data.sportList && isArray(data.sportList)) {
			const { sportList } = data;

			const filterSportList = filter(sportList ?? [], (item) => isEnumValue(SportTypeEnum, item.sportType));

			return map(filterSportList, (item) => ({ ...item, label: item.sportName, value: item.sportType })) as QueryOptionItemType[];
		}
		return [] as QueryOptionItemType[];
	};

	/**
	 * @description: 预处理数据
	 */
	const preprocessData = (resultData: any[]) => {
		const newArr: any[] = [];
		resultData.forEach((item) => {
			item.events?.forEach((event: any) => {
				event.timestamp = formatDateToTimeStamp(event.eventTime);

			});
			item.events?.sort((a: any, b: any) => a.timestamp - b.timestamp);
			newArr.push(...item.events);
		});
		return newArr;
	};

	return {
		Today,
		getSportTypeOptions,
		preprocessData,
	};
};
