//公共组件模型

/**
 * @description 日期范围选择器 时间快捷选项模型
 */
export interface TimeShortcutOptionsModel {
	/**
	 * 唯一标记
	 */
	code: string;
	/**
	 * @description 开始时间
	 */
	startTime: () => number;
	/**
	 * @description 结束时间
	 */
	endTime: () => number;
}
