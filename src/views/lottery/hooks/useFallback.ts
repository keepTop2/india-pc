import { useRouter } from "vue-router";

export function useFallBack(...conditionList: any[]) {
	const router = useRouter();
	if (conditionList.some((v) => !Boolean(v))) {
		router.push("/");
	}
}
