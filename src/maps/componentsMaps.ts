//公共组件字典
import dayjs from "dayjs";
import { TimeShortcutOptionsEnum } from "/@/enum/componentsEnum";
import { TimeShortcutOptionsModel } from "/@/models/componentsModels";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(tz);
/**
 * @description 日期范围选择器  时间快捷选项字典
 */
export const timeShortcutOptionsMap = new Map<TimeShortcutOptionsEnum, TimeShortcutOptionsModel>([
	[
		TimeShortcutOptionsEnum.d1,
		{
			code: TimeShortcutOptionsEnum.d1,
			startTime: (): number => dayjs().tz("America/New_York").subtract(24, "hour").valueOf(),
			endTime: (): number => dayjs().tz("America/New_York").valueOf(),
		},
	],
	[
		TimeShortcutOptionsEnum.d2,
		{
			code: TimeShortcutOptionsEnum.d2,
			startTime: (): number => dayjs().tz("America/New_York").subtract(7, "day").startOf("day").valueOf(),
			endTime: (): number => dayjs().tz("America/New_York").valueOf(),
		},
	],
	[
		TimeShortcutOptionsEnum.d3,
		{
			code: TimeShortcutOptionsEnum.d3,
			startTime: (): number => dayjs().tz("America/New_York").subtract(60, "day").startOf("day").valueOf(),
			endTime: (): number => dayjs().tz("America/New_York").valueOf(),
		},
	],
	[
		TimeShortcutOptionsEnum.d4,
		{
			code: TimeShortcutOptionsEnum.d4,
			startTime: (): number => dayjs().tz("America/New_York").subtract(90, "day").startOf("day").valueOf(),
			endTime: (): number => dayjs().tz("America/New_York").valueOf(),
		},
	],
]);
