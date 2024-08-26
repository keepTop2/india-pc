/**
 * @description 子应用大工具类
 */
class ChildrenAppsUtil {
	/**
	 * @description 获取子应用url
	 * @param buildName  打包后的名称
	 * @param localUrl   本地开发url
	 * @returns
	 */
	public static getUrl(buildName: string, localUrl: string): string {
		switch (import.meta.env.VITE_BASEENV) {
			case "development":
				return localUrl;
			case "production":
				return window["PLATFROM_CONFIG"][buildName];
			default:
				return "";
		}
	}
}

export default ChildrenAppsUtil;
