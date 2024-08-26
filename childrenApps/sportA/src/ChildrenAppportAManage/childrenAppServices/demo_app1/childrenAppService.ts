import { ChildrenToMainCommon } from "/@/ChildrenAppportAManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";

/**
 * @description childrenAppController1业务层
 */
class ChildrenAppService {
	public process1(childrenToMainCommonData: ChildrenToMainCommon) {
		console.log("到了service层", childrenToMainCommonData);
	}
}

export default ChildrenAppService;
