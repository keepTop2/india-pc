import { ChildrenToMainCommon } from "/@/ChildrenAppportAManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";
import childrenAppportAManage from "/@/ChildrenAppportAManage/ChildrenAppportAManage";

export function useRequestErrorCommon() {
	/**
	 * @description 注册控制器
	 */
	const requestErrorCommon = (res) => {
		const childrenToMainCommonData: ChildrenToMainCommon = {
			transactionName: "RequestErrorCommonController",
			apiName: "requestErrorCommon",
			data: {
				res,
			},
		};
		childrenAppportAManage.forceDispatch(childrenToMainCommonData);
	};

	return {
		requestErrorCommon,
	};
}
