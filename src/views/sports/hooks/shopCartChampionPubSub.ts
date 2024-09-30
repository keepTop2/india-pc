import { reactive } from "vue";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import Common from "/@/utils/common";
export default (function () {
	class shopCartChampionPubSub {
		// 单例实例变量
		private static instance: shopCartChampionPubSub;
		// 私有构造函数，确保单例模式
		private constructor() {
			// 初始化视图数据实体
			this.betValueState = reactive({
				// 键盘状态
				betNumberShow: true,
				singleTicketBetValue: "",
				singleTicketWinningAmount: 0,
			});
		}
		public betValueState;

		// 获取单例实例的静态方法
		public static getInstance(): shopCartChampionPubSub {
			if (!shopCartChampionPubSub.instance) {
				// 如果实例不存在，则创建
				shopCartChampionPubSub.instance = new shopCartChampionPubSub();
			}
			// 返回单例实例
			return shopCartChampionPubSub.instance;
		}

		// 读取单关投注金额
		public getSingleTicketBetValue(value: string) {
			const sportsBetInfo = useSportsBetInfoStore();
			// 如果 newStake 为空值，直接将 stake 设为空字符串
			if (value === null || value === undefined || value === "") {
				this.betValueState.singleTicketBetValue = ""; // 设为空字符串
				return; // 退出当前逻辑，不进行后续计算
			}
			const balance = Math.floor(Number(sportsBetInfo.balance));
			const maxBet = Math.floor(Number(sportsBetInfo.championSingleTicketInfo.maxBet));
			// 如果余额为负，设置 stake 为 "0"
			if (balance < 0) {
				this.betValueState.singleTicketBetValue = "0";
			} else {
				const currentBetValue = Number(value); // 获取变化后的 stake 值
				// 根据 balance 和 maxBet 限制 stake 的值
				if (balance < maxBet) {
					this.betValueState.singleTicketBetValue = currentBetValue > balance ? balance.toString() : currentBetValue.toString();
				} else {
					this.betValueState.singleTicketBetValue = currentBetValue > maxBet ? maxBet.toString() : currentBetValue.toString();
				}
			}
			console.log("this.betValueState.singleTicketBetValue", this.betValueState.singleTicketBetValue);
		}

		// 获取单关键盘显示状态
		public getBetNumberShow() {
			return this.betValueState.betNumberShow;
		}

		// 改变单关键盘显示状态
		public setBetNumberShow() {
			this.betValueState.betNumberShow = true;
		}

		// 单关赔率变化计算
		public decimalPrice(item) {
			const amount = Common.mul(item.price, this.betValueState.singleTicketBetValue);
			this.betValueState.singleTicketWinningAmount = Common.sub(amount, this.betValueState.singleTicketBetValue);
			return Common.formatFloat(item.price);
		}

		// 单关动态计算额度
		public getSingleTicketWinningAmount() {
			return Common.formatFloat(this.betValueState.singleTicketWinningAmount);
		}

		// 初始化
		public initializeState() {
			this.betValueState.singleTicketBetValue = "";
			this.betValueState.singleTicketWinningAmount = 0;
		}
	}

	return shopCartChampionPubSub.getInstance();
})();
