import ResCode from "/@/utils/resCode";
import { useUserStore } from "/@/stores/modules/user";
import pubsub from "/@/pubSub/pubSub";
import { ElMessage } from "element-plus";
// import dialogSingleton from "/@/layout/layout1/login/dialogSingleton";

export function useRequestError() {
	const handleRequestError = (response: any) => {
		const UserStore = useUserStore();
		const { name, res } = response;
		if (res.code === ResCode.LOGIN_EXPIRE || res.code === ResCode.TOKEN_INVALID || res.code === ResCode.TOKEN_MISSION) {
			//退出登陆（清除用户信息及跳转登陆）
			UserStore.clearInfo();
			// dialogSingleton.showDialog({ componentActive: 1 });
		} else if (res.code === ResCode.SERVICE_MAINTENANCE) {
			// 服务维护
			pubsub.publish("maintain");
		} else if (res.code === ResCode.REGIONAL_RESTRICTIONS) {
			// 区域限制
			pubsub.publish("accessRestriction");
		} else {
			ElMessage.error(res.message);
		}
	};

	return {
		handleRequestError,
	};
}
