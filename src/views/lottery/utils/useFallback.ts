import router from "/@/router/index";

export function useFallBack(...conditionList: any[]) {
	if (conditionList.some((v) => !Boolean(v))) {
		router.push("/");
	}
}
