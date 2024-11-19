import useAxiosApi from "/@/utils/useAxiosApi";

export const helpCenterApi = {
	getHelpCenterConfigList: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/app-helpCenter/api/getHelpCenterConfigList`, {
			method: "POST",
			data,
			headers: {},
		});
	},
	//  一级分类
	showTutorialPreLayer: (data = {}, headers = {}) => {
		return useAxiosApi(`/app/tutorial-display/api/showTutorialPreLayer`, {
			method: "POST",
			data,
			headers: {},
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
