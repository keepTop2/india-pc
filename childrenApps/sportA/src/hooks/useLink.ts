import { SportTypeEnum } from "/@/enum/sportEnum/sportEnum";
import { useRoute, useRouter } from "vue-router";

export const useLink = () => {
	const route = useRoute();
	const router = useRouter();

	const gotoEventDetail = (params: any, sportType: number | string) => {
		/** 路由地址处理 */
		const splArr = route.path.split("/");
		const getLastStr = splArr[splArr.length - 1];
		let path = route.path.replace(getLastStr, "detail");
		if (route.name === "sportsCollect") {
			path = `${route.path}/${sportType}`;
		}

		console.log(11111, route.path, path);
		router.push({ path: path, query: params });
	};

	return {
		gotoEventDetail,
	};
};
