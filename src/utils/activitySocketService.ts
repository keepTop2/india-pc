import pubsub from "../pubSub/pubSub";
import { useUserStore } from "/@/stores/modules/user";

class activitySocketService {
	private static instance: activitySocketService | null = null;
	private socket: WebSocket | null = null;
	private url: string;
	private reconnectAttempts: number = 0; // 重连尝试次数
	private maxReconnectAttempts: number = 5; // 最大重连尝试次数
	private heartbeatInterval: number = 5000; // 心跳间隔时间
	private heartbeatTimer: any = null; // 心跳定时器
	private isManuallyClosed: boolean = false; // 标志：是否手动关闭连接
	private constructor() {
		this.url = this.getUrl(); // 初始化WebSocket URL
	}

	// 获取单例实例
	static getInstance(): activitySocketService {
		if (!this.instance) {
			this.instance = new activitySocketService();
		}
		return this.instance;
	}

	// 根据环境变量获取对应的WebSocket URL
	private getUrl() {
		switch (import.meta.env.VITE_BASEENV) {
			case "development":
				return (window as any)["PLATFROM_CONFIG"].developmentWsURL;
			case "production":
				return (window as any)["PLATFROM_CONFIG"].productionWsUrl;
			default:
				return "";
		}
	}

	// 建立WebSocket连接并启动心跳
	connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			const userStore = useUserStore(); // 获取用户信息
			// 如果没有token则不建立连接
			if (!userStore.getLogin) return;
			this.socket = new WebSocket(`${this.url}?p=${userStore.token}`); // 使用token建立WebSocket连接
			// WebSocket连接打开时
			this.socket.onopen = () => {
				this.reconnectAttempts = 0; // 重置重连次数
				this.startHeartbeat(); // 启动心跳
				resolve(); // 连接成功
			};

			// 收到消息时根据消息类型推送出去
			this.socket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				switch (data.msgTopic) {
					case "/activity/redBagRain":
						if (data.data.code !== 10000) return;
						pubsub.publish("/activity/redBagRain", data.data.data); // 红包雨活动消息
						break;
					case "/activity/redBagRain/settlement":
						pubsub.publish("/activity/redBagRain/settlement", data.data); // 红包雨结算消息
						break;
					case "/activity/redBagRain/end":
						pubsub.publish("/activity/redBagRain/end"); // 红包雨结束消息
						break;
				}
			};

			// WebSocket发生错误时
			this.socket.onerror = (error) => {
				console.error("WebSocket发生错误:", error); // 打印错误信息
				reject(error); // 拒绝Promise
			};

			// WebSocket连接关闭时
			this.socket.onclose = () => {
				pubsub.publish("/activity/redBagRain/end");
				console.log("WebSocket连接已关闭"); // 打印连接关闭日志
				this.stopHeartbeat(); // 停止心跳
				if (!this.isManuallyClosed) {
					this.handleReconnect(); // 处理重连
				}
				reject(new Error("WebSocket连接已关闭")); // 拒绝Promise
			};
		});
	}

	// 发送消息
	send(message: any): Promise<void> {
		return new Promise((resolve, reject) => {
			// WebSocket连接打开时发送消息
			if (this.socket && this.socket.readyState === WebSocket.OPEN) {
				this.socket.send(message); // 发送消息
				resolve(); // 发送成功
			} else {
				console.error("WebSocket未连接，无法发送消息"); // 打印错误信息
				reject(new Error("WebSocket未连接，无法发送消息")); // 拒绝Promise
			}
		});
	}

	// 关闭WebSocket连接
	close(): void {
		this.isManuallyClosed = true; // 设置手动关闭标志
		if (this.socket) {
			this.socket.close(); // 关闭连接
			this.stopHeartbeat(); // 停止心跳
		}
	}

	// 处理WebSocket重连逻辑
	private handleReconnect(): void {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++; // 增加重连次数
			const timeout = Math.min(1000 * this.reconnectAttempts, 5000); // 重连延迟
			console.log(`尝试重新连接... (${this.reconnectAttempts})`); // 打印重连日志
			setTimeout(() => this.connect().catch(() => {}), timeout); // 延迟重连
		} else {
			console.error("达到最大重连尝试次数，停止重连。"); // 打印停止重连日志
		}
	}

	// 启动心跳定时器
	private startHeartbeat(): void {
		this.heartbeatTimer = setInterval(() => {
			if (this.socket && this.socket.readyState === WebSocket.OPEN) {
				this.send(1).catch((error) => {
					console.error("发送心跳失败", error); // 打印心跳发送失败日志
				});
			}
		}, this.heartbeatInterval);
	}

	// 停止心跳定时器
	private stopHeartbeat(): void {
		if (this.heartbeatTimer) {
			clearInterval(this.heartbeatTimer); // 清除心跳定时器
			this.heartbeatTimer = null; // 重置心跳定时器变量
		}
	}
}

export default activitySocketService;
