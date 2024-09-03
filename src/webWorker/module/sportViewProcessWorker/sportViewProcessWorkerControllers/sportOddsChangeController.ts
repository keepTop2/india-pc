import { OddsChangeParam } from "/@/models/sportViewModels";
import viewSportDataU from "/@/webWorker/module/utils/viewSportDataU";

/**
 * @description 体育赔率变更控制器
 */
class SportOddsChangeController {
	/**
	 * @description 清理赔率状态
	 */
	public clearOddsChange(data: OddsChangeParam) {
		/**
		 * @description 处理冠军清理状态逻辑
		 */
		if (data.webToPushApi == "champion") {
			const { leagueId, team } = data;
			// 获取 盘口index；
			const index = viewSportDataU.viewSportData.outrights.findIndex((item: any) => item.leagueId == leagueId);
			if (index != -1) {
				//获取market
				const outright = viewSportDataU.viewSportData.outrights[index] as any;
				//匹配对应的selection
				const teamsIndex = outright?.teams.findIndex((item) => item.orid == team?.orid);
				//设置oddsChange为空
				outright.teams[teamsIndex].oddsChange = "";
			}
		} else {
			const { marketId, selection } = data;
			// 获取 盘口index；
			const index = viewSportDataU.viewSportData.markets.findIndex((item: any) => item.marketId == marketId);
			if (index != -1) {
				//获取market
				const market = viewSportDataU.viewSportData.markets[index] as any;
				//匹配对应的selection
				const selectionIndex = market?.selections.findIndex((item) => item.key == selection?.key);
				//设置oddsChange为空
				market.selections[selectionIndex].oddsChange = "";
			}
		}
	}
}
const sportOddsChangeController = new SportOddsChangeController();
export default sportOddsChangeController;
