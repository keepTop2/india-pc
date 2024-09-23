import { SportPushApi, WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { SportEventSourceInstanceModel, OpenSportEventSourceParams, SportEventSourceResponse } from "/@/views/sports/models/sportEventSourceModel";
import qs from "qs";
import { WebResponse } from "/@/models/commonInterface";
import ResCode from "/@/utils/resCode";
import sidebarEventService from "/@/webWorker/module/sidebarWorker/services/sidebarEventService";
/**
 * @description 体育SSE 控制器 (工具类)
 */
class SportEventSourceController {
	// 单例实例变量
	private static instance: SportEventSourceController;
	// 私有构造函数，确保单例模式
	private constructor() {}
	// 获取单例实例的静态方法
	public static getInstance(): SportEventSourceController {
		if (!SportEventSourceController.instance) {
			// 如果实例不存在，则创建
			SportEventSourceController.instance = new SportEventSourceController();
		}
		// 返回单例实例
		return SportEventSourceController.instance;
	}

	/**
	 * @description 业务处理
	 */
	private sportEventSourceService = new sidebarEventService();

	/**
	 * @description 开启的SSE集合
	 */
	private sourceList: Array<SportEventSourceInstanceModel> = [];

	/**
	 * @description 多个SSE控制器集合
	 */
	private abortControllers: Map<number, AbortController> = new Map();

	/**
	 * @description 开多个SSE 异步任务标记
	 */
	private multipleTag: number = 0;

	/**
	 * @description — 体育推送api路径字典
	 */
	public sportPushApi = SportPushApi;

	/**
	 * @description 前端业务字典
	 */
	public webToPushApi = WebToPushApi;

	/**
	 * @description 打开数据源推送通道
	 * @param sportPushApi 数据源推送通道名称
	 * @param webToPushApi 前端业务名称
	 * @param params 查询参数 默认为{}
	 * @param version 版本号 默认为V1
	 */

	public openSportEventSource({ sportPushApi, webToPushApi, params, version, isMultiple, apiUrl, language, token }: OpenSportEventSourceParams): Promise<WebResponse> {
		//根据 isMultiple 判断是否需要开启多个推送
		if (isMultiple) {
			return this.openMultipleSportEventSource({ sportPushApi, webToPushApi, params, version, apiUrl, language, token }, 5);
		} else {
			return this.openSingleSportEventSource({ sportPushApi, webToPushApi, params, version, isMultiple, apiUrl, language, token });
		}
	}

	/**
	 * @description 开单个SSE推送通道
	 * @param sportPushApi 数据源推送通道名称
	 * @param webToPushApi 前端业务名称
	 * @param params 查询参数 默认为{}
	 * @param version 版本号 默认为V1
	 */
	private openSingleSportEventSource({ sportPushApi, webToPushApi, params = {}, version = "V1", apiUrl, language, token }: OpenSportEventSourceParams): Promise<WebResponse> {
		return new Promise((resove, reject) => {
			//返回数据
			const resPonsedata: WebResponse = {};
			try {
				//连接必传的参数
				const requireParams = {
					token,
					// language: userStore.getLang,
					language,
				};

				// const userStore = useUserStore();

				//后端语言列表
				// ZH_CN("zh-CN", "CN", "中文"),
				// EN_US("en-US", "US", "英语-美国"),
				// HI_IN("hi-IN", "IN", "北印度语-印度"),
				// ID_ID("id-ID", "ID", "印尼-印尼"),
				// PT_BR("pt-BR", "BR", "葡萄牙语-巴西");

				//合并参数
				const requestParams = Object.assign({}, requireParams, params);
				// SSE连接实体
				const sportSource: SportEventSourceInstanceModel = {
					sportPushApi,
					webToPushApi,
					sourceInstance: null,
				};
				// console.log(requestParams, "推送前的参数");
				sportSource.sourceInstance = new EventSource(`${apiUrl}/sports/stream/${version}/${sportPushApi}?${qs.stringify(requestParams)}`);
				//打开通道 promise返回成功
				sportSource.sourceInstance.onopen = () => {
					// console.log(evennt, "看看呢");
					resPonsedata.code = ResCode.SUCCESS;
					//加到开启的SSE集合
					this.sourceList.push(sportSource);
					this.onMessage(sportPushApi, webToPushApi, sportSource.sourceInstance as EventSource);
					resove(resPonsedata);
				};

				//通道报错
				sportSource.sourceInstance.onerror = (err) => {
					resPonsedata.code = ResCode.ERR;
					console.error(err);
					this.sportEventSourceService.cancelLoading(resPonsedata);
					reject(resPonsedata);
				};
			} catch (err) {
				console.error(err);
				resPonsedata.code = ResCode.ERR;

				reject(resPonsedata);
			} finally {
			}
		});
	}

	/**
	 * @description 开多个SSE推送通道
	 * @param sportPushApi 数据源推送通道名称
	 * @param webToPushApi 前端业务名称
	 * @param params 查询参数 默认为{}
	 * @param version 版本号 默认为V1
	 * @param count 版本号 通道个数
	 */
	private async openMultipleSportEventSource({ sportPushApi, webToPushApi, params, version, apiUrl, language, token }, count: number): Promise<WebResponse> {
		// const { startLoading, stopLoading } = useLoading();
		// startLoading();
		//开始执行 将SSE标记加1
		this.multipleTag++;
		const tag = this.multipleTag;
		//返回数据
		const resPonsedata: WebResponse = {};
		//系数
		let coefficient = 0;
		//只有GetEvents_push 是250
		if (sportPushApi == this.sportPushApi.GetEvents_push) {
			coefficient = 250;
		} else {
			coefficient = 50;
		}
		let isErr = false;

		const abortController = new AbortController();
		this.abortControllers.set(tag, abortController);
		for (let i = 0; i < count; i++) {
			// 如果下一个多次SSE已经开始执行 上一个多次SSE还在执行中 则断掉上一个多次的循环
			if (this.multipleTag > tag) {
				// console.log(this.multipleTag, tag, "断循环==========================");

				this.closeSportEventSource(webToPushApi);
				// isbreak = true;
				break;
			}

			if (abortController.signal.aborted) {
				// console.log("这里面走没走==============================================================");
				isErr = true;
				break;
			}

			//如果有查询参数
			if (params.query) {
				if (i == 1) {
					//动态拼接 跳过250比订单
					params.query += `&$skip=${i * coefficient}`;
				} else if (i > 1) {
					params.query = params.query.replace(`$skip=${(i - 1) * coefficient}`, `$skip=${i * coefficient}`);
				}
			}
			const res = await this.openSingleSportEventSource({ sportPushApi, webToPushApi, params, version, apiUrl, language, token });
			if (i == 1) {
				resPonsedata.code = ResCode.SUCCESS;
				this.sportEventSourceService.cancelLoading(resPonsedata);
			}
			// stopLoading();
			if (res.code != ResCode.SUCCESS) {
				isErr = true;
				break;
			}
		}

		return new Promise((resove, reject) => {
			this.abortControllers.delete(tag);
			//执行结束 将多SSE标记减1
			this.multipleTag--;
			//如果中间报错
			if (isErr) {
				resPonsedata.code = ResCode.ERR;
				// //关闭当前所有SSE通道
				this.closeSportEventSource(webToPushApi);
				reject(resPonsedata);
				this.sportEventSourceService.cancelLoading(resPonsedata);
			} else {
				resPonsedata.code = ResCode.SUCCESS;
				resove(resPonsedata);
			}
			// console.log("这里是不是有问题");
		});
	}

	/**
	 * 接收数据源推送
	 * @param 前端业务名称
	 */
	private onMessage(sportPushApi: SportPushApi, webToPushApi: WebToPushApi, sourceInstance: EventSource) {
		sourceInstance.onmessage = (event) => {
			if (event.data == "KEEPALIVE") return;
			const data: SportEventSourceResponse = {
				sportPushApi,
				webToPushApi,
				payload: JSON.parse(event.data).payload,
			};
			// console.warn("第五步 controller到对应service");
			this.sportEventSourceService.eventSourceOnMessageProcess(data);
		};
	}

	/**
	 * @description 单独关闭前端业务名称SSE推送
	 * @param webToPushApi 前端业务名称
	 */
	public closeSportEventSource(webToPushApi: WebToPushApi) {
		//从后向前删除 不会导致索引出错
		for (let i = this.sourceList.length - 1; i >= 0; i--) {
			if (this.sourceList[i].webToPushApi == webToPushApi) {
				//关闭该SSE连接释放内存 移出开启的SSE集合
				this.sourceList[i].sourceInstance?.close();
				this.sourceList[i].sourceInstance = null;
				this.sourceList.splice(i, 1);
			}
		}
	}

	/**
	 * @description 单独关闭某个类型的所有推送
	 * @param apiName 体育SSE推送类型
	 */
	public closeSportApiNameEventSource(sportPushApi: SportPushApi) {
		//从后向前删除 不会导致索引出错
		for (let i = this.sourceList.length - 1; i >= 0; i--) {
			if (this.sourceList[i].sportPushApi == sportPushApi) {
				//关闭该SSE连接释放内存 移出开启的SSE集合
				this.sourceList[i].sourceInstance?.close();
				this.sourceList[i].sourceInstance = null;
				this.sourceList.splice(i, 1);
			}
		}
	}

	/**
	 * @description 关闭所有体育SSE连接通道
	 */
	public closeAllSportEventSource() {
		return new Promise((resolve) => {
			this.sourceList.forEach((item) => {
				item.sourceInstance?.close();
				item.sourceInstance = null;
			});
			// this.isCloseAll = false;
			this.sourceList = [];
			this.abortControllers.forEach((controller) => controller.abort());
			this.abortControllers.clear();
			this.multipleTag = 0;

			setTimeout(() => {
				const resPonsedata: WebResponse = {};
				resPonsedata.code = ResCode.SUCCESS;
				resolve(resPonsedata);
			}, 0);
		});
	}
}
/**
 * @description 体育SSE连接实例 (单例)
 */
const sportEventSourceController = SportEventSourceController.getInstance();
export default sportEventSourceController;
