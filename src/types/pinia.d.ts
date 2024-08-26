/**
 * pinia 类型定义
 */

// 用户信息
declare interface UserInfos<T = any> {
	authBtnList: string[];
	photo: string;
	roles: string[];
	time: number;
	userName: string;
	[key: string]: T;
}
declare interface UserInfosState {
	userInfos: UserInfos;
}

// 路由缓存列表
declare interface KeepAliveNamesState {
	keepAliveNames: string[];
	cachedViews: string[];
}

// 后端返回原始路由(未处理时)
declare interface RequestOldRoutesState {
	requestOldRoutes: string[];
}

// TagsView 路由列表
declare interface TagsViewRoutesState<T = any> {
	tagsViewRoutes: T[];
	isTagsViewCurrenFull: Boolean;
}

// 路由列表
declare interface RoutesListState<T = any> {
	routesList: T[];
	isColumnsMenuHover: Boolean;
	isColumnsNavHover: Boolean;
}
