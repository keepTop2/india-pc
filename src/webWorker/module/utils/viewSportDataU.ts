import { SportViewModels, Sports } from "/@/views/sports/models/sportViewModels";
/**
 * @description  实现 SportViewModels接口 单例 工具类
 */

export default (function () {
	/**
	 * @description 实现 SportViewModels接口 单例 工具类
	 */
	class ViewSportDataU implements SportViewModels {
		// 单例实例变量
		private static instance: ViewSportDataU;
		// 私有构造函数，确保单例模式
		private constructor() {}
		// 获取单例实例的静态方法
		public static getInstance(): ViewSportDataU {
			if (!ViewSportDataU.instance) {
				// 如果实例不存在，则创建
				ViewSportDataU.instance = new ViewSportDataU();
			}
			// 返回单例实例
			return ViewSportDataU.instance;
		}

		/**
		 * @description 视图数据实体
		 */
		public viewSportData = {
			/**
			 * @description 外层Sports组件视图数据
			 */
			sports: [] as Sports[],
			leagues: [],
			events: [],
			markets: [],
			outrights: [],
			results: [],
			/**
			 * @description 各个子路由视图数据
			 */
			childrenViewData: {},
			promotionsViewData: {},
		};
	}

	return ViewSportDataU.getInstance();
})();
