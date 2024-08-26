import { ComponentPublicInstance, createApp } from "vue";
import Loading from "./index.vue";
import ChildrenAppportAManage from "/@/ChildrenAppportAManage/ChildrenAppportAManage";
import { TransactionNameCommonEnum } from "/@/ChildrenAppportAManage/childrenAppEnums/transactionNameCommonEnum";
import { ChildrenToMainCommon, ChildrenToMainLoading } from "/@/ChildrenAppportAManage/childrenAppDTOs/childrenToMain/childrenToMainCommon";

let loadingInstance = null as null | ComponentPublicInstance;

export function useLoading() {
	function startLoading() {
		const childrenToMainCommonData: ChildrenToMainCommon<ChildrenToMainLoading> = {
			transactionName: TransactionNameCommonEnum.childrenAppLoading,
			data: {
				loading: "1",
			},
		};
		ChildrenAppportAManage.childrenToMainLoading(childrenToMainCommonData);
		// if (loadingInstance) {
		// 	return; // 避免重复创建加载实例
		// }
		// const app = createApp(Loading);
		// const instance = app.mount(document.createElement('div'));
		// loadingInstance = instance;
		// appendEl(document.body);
	}

	function stopLoading() {
		const childrenToMainCommonData: ChildrenToMainCommon<ChildrenToMainLoading> = {
			transactionName: TransactionNameCommonEnum.childrenAppLoading,
			data: {
				loading: "2",
			},
		};
		ChildrenAppportAManage.childrenToMainLoading(childrenToMainCommonData);
		// if (loadingInstance) {
		// 	removeEl(document.body);
		// 	loadingInstance = null;
		// }
	}

	function appendEl(parentEl: HTMLElement) {
		parentEl.style.position = "relative";
		parentEl.style.overflow = "hidden";
		parentEl.appendChild(loadingInstance!.$el);
	}

	function removeEl(parentEl: HTMLElement) {
		parentEl.style.position = "";
		parentEl.style.overflow = "";
		const $el = loadingInstance!.$el;
		if (parentEl.contains($el)) {
			parentEl.removeChild($el);
		}
	}

	return {
		startLoading,
		stopLoading,
	};
}
