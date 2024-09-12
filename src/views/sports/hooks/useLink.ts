import { useRoute, useRouter } from "vue-router";

export const useLink = () => {
	const route = useRoute();
	const router = useRouter();

	const gotoEventDetail = (params: any, sportType: number | string) => {
		console.log(params, sportType, "====gotoEvcentDetail");
		/** 路由地址处理 */
		router.push({ path: `/sports/${sportType}/detail`, query: params });
	};

	return {
		gotoEventDetail,
	};
};
