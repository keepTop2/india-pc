import { MainTochildrenCommon } from "../childrenAppDTOs/mainToChildren/mainTochildrenCommon";
/**
 * @description 控制器接口
 */
export interface Controller {
	/**
	 * @description 请求处理
	 */
	handleRequest(childrenToMainCommonData: MainTochildrenCommon): void;
}
