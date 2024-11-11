import { useWebSocket as useWebSocketFromVueUse, type UseWebSocketReturn } from "@vueuse/core";

interface WebSocketResponseData {
	categoryCode: string;
	gameCode: string;
	gameName: string;
	issueNum: string;
	lotteryNum: string;
	gameName18n: { [key: string]: string };
}

interface WebSocketResponseMessage {
	id: number | null;
	cmd: string;
	action: string;
	data: WebSocketResponseData | null;
}

interface InstancesMap {
	[key: string]: UseWebSocketReturn<WebSocketResponseMessage>;
}

/**
 * @description 彩种详情页切换购买彩票、开奖结果的 tabs 逻辑
 * @param
 * @returns
 */
const BASE_URL = (window as any)["PLATFROM_CONFIG"].developmentLotteryWsURL;
const instancesMap: InstancesMap = {};
export function useWebSocket(callback = Function.prototype, baseURL = BASE_URL) {
	let websocketInstance = instancesMap[baseURL];

	// 一个 ws 连接只支持一个实例
	if (websocketInstance) {
		return websocketInstance;
	}

	const KEEP_ALIVE = "KEEP_ALIVE";
	const HEART_BEAT_INTERVAL = 5000;
	// const { status, data, send, open, close } =

	websocketInstance = instancesMap[baseURL] = useWebSocketFromVueUse(baseURL, {
		heartbeat: {
			message: JSON.stringify({
				cmd: KEEP_ALIVE,
				action: KEEP_ALIVE,
			}),
			interval: HEART_BEAT_INTERVAL,
			pongTimeout: HEART_BEAT_INTERVAL,
		},
		autoReconnect: {
			retries: 3,
			delay: HEART_BEAT_INTERVAL,
			onFailed() {
				alert("Failed to connect WebSocket after 3 retries");
			},
		},
		onMessage(ws: WebSocket, event: MessageEvent) {
			let message = {} as WebSocketResponseMessage;
			try {
				message = JSON.parse(event.data);
			} catch {
				message = {} as WebSocketResponseMessage;
			}
			console.log("WebSocketResponseMessage", message);
			isValidWebSocketMessage(message.id) && callback(message);
		},
	});

	const { status, data, send, open, close } = websocketInstance;

	return { status, data, send, open, close };
}

/**
 * @description 这个函数是判断是否为有效的 ws 消息。参考下面注释的 heartBeatResponseMessage 和 webSocketResponseMessage
 * @param id 返回的数据的 id
 * @returns
 */
function isValidWebSocketMessage(id: number | null): boolean {
	return Number.isInteger(id);
}

// 这是心跳消息返回的数据格式
// const heartBeatResponseMessage = {
// 	id: null,
// 	cmd: "KEEP_ALIVE",
// 	action: "KEEP_ALIVE",
// 	data: null,
// };

// 这是有效数据返回的 ws 数据格式，根据 id 是否为数字判断是否为有效消息
// const webSocketResponseMessage = {
// 	id: 1855900023081468000,
// 	cmd: "GROUP",
// 	action: "LOTTERY_DRAW",
// 	data: {
// 		gameName: "极速11选5",
// 		gameName18n: {
// 			"1FSYXW:en": "Speed 11 Pick 5",
// 			"1FSYXW:zh": "极速11选5",
// 		},
// 		lotteryNum: "08 04 05 11 09",
// 		issueNum: "20241111-1027",
// 		gameCode: "1FSYXW",
// 		categoryCode: "SYXW",
// 	},
// };
