import { reactive } from "vue";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import Common from "/@/utils/common";
export default (function () {
	class shopCartPubSub {
		// 单例实例变量
		private static instance: shopCartPubSub;
		// 私有构造函数，确保单例模式
		private constructor() {
			// 初始化视图数据实体
			this.betValueState = reactive({
				// 键盘状态
				betNumberShow: true,
				// 串关键盘状态
				betParlayTicketsNumberShow: false,
				// 串关选择输入索引
				inputActive: "",
				// 用户输入的投注金额 接受派发数据 同步业务计算
				singleTicketBetValue: "",
				singleTicketWinningAmount: 0,
				// 串关时 记录每个串关组合输入金额
				combos: {} as any,
			});
		}
		public betValueState;

		// 获取单例实例的静态方法
		public static getInstance(): shopCartPubSub {
			if (!shopCartPubSub.instance) {
				// 如果实例不存在，则创建
				shopCartPubSub.instance = new shopCartPubSub();
			}
			// 返回单例实例
			return shopCartPubSub.instance;
		}

		//设置单关投注金额
		public setSingleTicketBetValue(value: string) {
			const sportsBetInfo = useSportsBetInfoStore();
			// 如果 newStake 为空值，直接将 stake 设为空字符串
			if (value === null || value === undefined || value === "") {
				this.betValueState.singleTicketBetValue = ""; // 设为空字符串
				return; // 退出当前逻辑，不进行后续计算
			}
			const balance = Math.floor(Number(sportsBetInfo.balance));
			const maxBet = Math.floor(Number(sportsBetInfo.singleTicketInfo.maxBet));
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
		}

		// 设置串关投注金额
		public setParlayTicketsBetValue(comboItem: any) {
			const sportsBetInfo = useSportsBetInfoStore();
			const balance = Math.floor(Number(sportsBetInfo.balance));
			const maxBet = Math.floor(Number(comboItem.maxBet));

			// 确认 comboItem.comboType 是 betValueState 的有效键
			const comboTypeKey = comboItem.comboType as keyof typeof this.betValueState;

			// 如果余额为负，设置为 0
			if (balance < 0) {
				this.betValueState.singleTicketBetValue = "0";
			} else {
				// 如果余额小于最大投注金额
				if (balance < maxBet) {
					if (Number(this.betValueState.combos[comboTypeKey]) > balance) {
						this.betValueState.combos[comboTypeKey] = balance.toString();
					}
				} else {
					// 如果当前投注金额超过最大投注金额
					if (Number(this.betValueState.combos[comboTypeKey]) > maxBet) {
						this.betValueState.combos[comboTypeKey] = maxBet.toString();
					}
					// 计算串关投注可能的赢额
					this.getParlayTicketsWinningAmount();
				}
			}
		}

		// 单关赔率变化计算
		public decimalPrice(item: any) {
			const amount = Common.mul(item.betMarketInfo.decimalPrice, this.betValueState.singleTicketBetValue);
			this.betValueState.singleTicketWinningAmount = Common.sub(amount, this.betValueState.singleTicketBetValue);
			return item.betMarketInfo.decimalPrice;
		}

		// 单关动态计算额度
		public getSingleTicketWinningAmount() {
			return Common.formatFloat(this.betValueState.singleTicketWinningAmount);
		}

		// 串关动态计算可赢额度
		public getParlayTicketsWinningAmount() {
			const sportsBetInfo = useSportsBetInfoStore();
			let totalValue = 0;
			if (Array.isArray(sportsBetInfo.parlayTicketsInfo?.combos)) {
				totalValue = sportsBetInfo.parlayTicketsInfo?.combos.reduce((total, obj) => {
					// 计算小计
					const amount = Common.mul(obj.payoutRate, parseFloat(this.betValueState.combos[obj.comboType]));
					const stake = Common.mul(obj.betCount, parseFloat(this.betValueState.combos[obj.comboType]));
					const value = isNaN(stake) ? 0 : Common.sub(amount, stake);
					return total + value;
				}, 0);
			}
			return Common.formatFloat(totalValue);
		}

		// 更新串关
		public updateCombos(combos: any) {
			// 遍历数组 comboType，并过滤掉 this.betValueState.combos 中不匹配的 key
			Object.keys(this.betValueState.combos).forEach((key) => {
				if (!combos.some((item: any) => item.comboType === key)) {
					delete this.betValueState.combos[key]; // 删除 this.betValueState.combos 中不存在于 comboArray 的键
				}
			});
		}

		// 初始化
		public initializeState() {
			this.betValueState.singleTicketBetValue = "";
			this.betValueState.singleTicketWinningAmount = 0;
			const sportsBetInfo = useSportsBetInfoStore();
			if (sportsBetInfo.parlayTicketsInfo.combos) {
				sportsBetInfo.parlayTicketsInfo.combos.forEach((v) => {
					if (this.betValueState.combos[v.comboType]) {
						this.betValueState.combos[v.comboType] = "";
					}
				});
			}
		}
	}

	return shopCartPubSub.getInstance();
})();
