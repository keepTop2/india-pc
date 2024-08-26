/**
 * @description 体育容器切换 小容器切换成大容器参数
 */
export interface SportAContainerChangeToMain {
	data: {
		path: string;
		data: {
			eventId: string;
			leagueId: string;
			sportType: string;
		};
	};
}
