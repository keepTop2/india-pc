import useAxiosApi from "/@/utils/useAxiosApi";

export const helpCenterApi = {
	//  一级分类
	showTutorialPreLayer: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/tutorial-display/api/showTutorialPreLayer`, {
			method: "POST",
			data,
			headers: {
				needLogin: true,
			},
		});
	},
	//  二级分类
	showTutorialTurnLayer: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/tutorial-display/api/showTutorialTurnLayer`, {
			method: "POST",
			data,
			headers: {
				showLoading: false,
			},
		});
	},
};
