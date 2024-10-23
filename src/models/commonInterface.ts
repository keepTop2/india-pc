import ResCode from "/@/utils/resCode";
import { LangEnum } from "../enum/appConfigEnum";
//主题色类型
export type ThemeKey = "light" | "dark";
//语言包
export type LangType = LangEnum;
//语言包
export type LangTypeList = Array<LangType>;
/**
 * @description 常用于前端Promise返回
 */
export interface WebResponse {
	/**
	 * @description 响应状态码
	 */
	code?: ResCode;

	/**
	 * @description 响应数据
	 */
	data?: any;

	/**
	 * @description 响应提示
	 */
	message?: string;
}
