import { ChildrenAppsMapValue } from "/@/childrenAppsManage/childrenAppModels/childrenAppsManageModel";
import ChildrenAppNameEnum from "/@/childrenAppsManage/childrenAppEnums/childrenAppNameEnum";
import ChildrenAppsUtil from "/@/childrenAppsManage/childrenAppUtils/childrenAppsUtil";
/**
 * @description 子应用字典
 */
const childrenAppsMap: Map<ChildrenAppNameEnum, ChildrenAppsMapValue> = new Map([
	[
		ChildrenAppNameEnum.demo_app1,
		{
			renderAppOptions: {
				name: ChildrenAppNameEnum.demo_app1,
				url: ChildrenAppsUtil.getUrl("demoApp1Url", "http://localhost:5002"),
				container: "",
				iframe: true,
				"keep-router-state": true,
				"keep-alive": true,
			},
			preFetchApp: {
				name: ChildrenAppNameEnum.demo_app1,
				url: ChildrenAppsUtil.getUrl("demoApp1Url", "http://localhost:5002"),
				iframe: true,
			},
		},
	],
	[
		ChildrenAppNameEnum.demo_app2,
		{
			renderAppOptions: {
				name: ChildrenAppNameEnum.demo_app2,
				url: ChildrenAppsUtil.getUrl("demoApp2Url", "http://localhost:5003"),
				container: "",
			},
			preFetchApp: {
				name: ChildrenAppNameEnum.demo_app1,
				url: ChildrenAppsUtil.getUrl("demoApp1Url", "http://localhost:5003"),
				iframe: true,
			},
		},
	],
	[
		ChildrenAppNameEnum.sportA,
		{
			renderAppOptions: {
				name: ChildrenAppNameEnum.sportA,
				url: ChildrenAppsUtil.getUrl("sportA", "http://localhost:5004"),
				container: "",
				iframe: true,
				"keep-router-state": true,
				"keep-alive": true,
				"disable-scopecss": false,
			},
			preFetchApp: {
				name: ChildrenAppNameEnum.sportA,
				url: ChildrenAppsUtil.getUrl("sportA", "http://localhost:5004"),
				iframe: true,
				"disable-scopecss": false,
				level: 2,
				"default-page": "#/preFetchSportAView",
			},
		},
	],
]);

export default childrenAppsMap;
