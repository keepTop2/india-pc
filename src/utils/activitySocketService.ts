import pubsub from "../pubSub/pubSub";
import { useUserStore } from "/@/stores/modules/user";
import { webSocketMsgTopicEnum } from "/@/enum/webSocketEnum";
class activitySocketService {
	private static instance: activitySocketService | null = null;
	private socket: WebSocket | null = null;
	private url: string;
	private reconnectAttempts: number = 0;
	private maxReconnectAttempts: number = 5;
	private heartbeatInterval: number = 10000; // 心跳间隔时间
	private heartbeatTimer: any = null;

	private constructor() {
		this.url = this.getUrl();
	}

	static getInstance(): activitySocketService {
		if (!this.instance) {
			this.instance = new activitySocketService();
		}
		return this.instance;
	}

	private getUrl() {
		switch (import.meta.env.VITE_BASEENV) {
			case "development":
				return (window as any)["PLATFROM_CONFIG"].developmentWsURL;
			case "production":
				return `wss://${window.location.host}/websocket/baowang/websocket`;
			default:
				return "";
		}
	}

	connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			const userStore = useUserStore();
			this.socket = new WebSocket(`${this.url}?p=${userStore.token}`);

			this.socket.onopen = () => {
				console.log("WebSocket连接已建立");
				this.reconnectAttempts = 0;
				this.startHeartbeat();
				resolve();
			};

			this.socket.onmessage = (event) => {
				// this.handleMessage(event.data);
				switch (event.data.msgTopic) {
					case "/activity/redBagRain":
						pubsub.publish(webSocketMsgTopicEnum.redBagRain, event.data);
						break;
					case "/activity/redBagRain/settlement":
						pubsub.publish(webSocketMsgTopicEnum.settlement, event.data);
						break;
				}
			};

			this.socket.onerror = (error) => {
				console.error("WebSocket发生错误:", error);
				reject(error);
			};

			this.socket.onclose = () => {
				console.log("WebSocket连接已关闭");
				this.stopHeartbeat();
				this.handleReconnect();
				reject(new Error("WebSocket连接已关闭"));
			};
		});
	}

	private handleMessage(data: string): void {
		const parsedData = JSON.parse(data);
		// 直接通过 Promise 返回消息
		this.resolveMessage(parsedData);
	}

	send(message: any): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.socket && this.socket.readyState === WebSocket.OPEN) {
				this.socket.send(message);
				resolve();
			} else {
				console.error("WebSocket未连接，无法发送消息");
				reject(new Error("WebSocket未连接，无法发送消息"));
			}
		});
	}

	receiveMessage(): Promise<any> {
		return new Promise((resolve) => {
			this.resolveMessage = resolve;
		});
	}

	private resolveMessage: (message: any) => void = () => {};

	close(): void {
		if (this.socket) {
			this.socket.close();
		}
	}

	private handleReconnect(): void {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++;
			const timeout = Math.min(1000 * this.reconnectAttempts, 5000);
			console.log(`尝试重新连接... (${this.reconnectAttempts})`);
			setTimeout(() => this.connect().catch(() => {}), timeout);
		} else {
			console.error("达到最大重连尝试次数，停止重连。");
		}
	}

	private startHeartbeat(): void {
		this.heartbeatTimer = setInterval(() => {
			if (this.socket && this.socket.readyState === WebSocket.OPEN) {
				this.send(1).catch((error) => {
					console.error("发送心跳失败", error);
				});
			}
		}, this.heartbeatInterval);
	}

	private stopHeartbeat(): void {
		if (this.heartbeatTimer) {
			clearInterval(this.heartbeatTimer);
			this.heartbeatTimer = null;
		}
	}
}

export default activitySocketService;
