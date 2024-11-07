import { defineComponent, ref } from "vue";
import { ElInput } from "element-plus"; // 引入 Element Plus 输入框组件
import { useUserStore } from "/@/stores/modules/user"; // 引入用户信息 store
import "./index.scss";

export default () => {
	const BetForm = defineComponent({
		props: {
			actived: { type: Boolean, default: false }, // 控制是否显示投注输入框
		},
		name: "BetForm",
		emits: ["submit"],
		setup(props, { slots, emit }) {
			// 获取用户信息 store
			const UserStore = useUserStore();

			// 定义投注金额
			const stake = ref<number>(0);

			// 示例投注信息，实际使用时替换为动态数据
			const sportsBetInfo = {
				singleTicketInfo: {
					minBet: 10, // 最小投注金额
					maxBet: 1000, // 最大投注金额
				},
			};

			// 输入框的事件处理：按回车提交输入值
			const onInputEnter = (value: string) => {
				console.log(value);
			};

			// 投注
			const handleClick = () => {
				console.log(stake.value, "stake.value ");

				emit("submit", { stake: stake.value });
			};

			// 渲染组件
			return () => (
				<div class={`lottery-bet-form${props.actived ? " actived" : ""}`}>
					{/* 渲染 BetForm 组件的头部，使用插槽渲染自定义内容 */}
					<div class="bet-form-header">{slots.default ? slots.default() : <span>请选择你的赌注</span>}</div>

					{/* 投注内容区域 */}
					<div className="bet-form-content">
						{/* 判断 actived 是否为 true，决定是否渲染投注金额输入框 */}

						{props.actived ? (
							<div className="input-item">
								<span>投注金额</span>
								<ElInput
									modelValue={stake.value} // 绑定投注金额的值
									type="number" // 设置为数字类型输入框
									min={sportsBetInfo.singleTicketInfo.minBet} // 设置最小投注金额
									max={sportsBetInfo.singleTicketInfo.maxBet} // 设置最大投注金额
									placeholder="请输入投注金额" // 输入框提示文本
									onInput={onInputEnter} // 输入时触发事件
									onUpdate:modelValue={(value) => (stake.value = Number(value))} // 输入值变化时更新投注金额
								>
									{{
										suffix: () => <span>{UserStore.getUserInfo.mainCurrency}</span>, // 输入框后缀显示用户的货币单位
									}}
								</ElInput>
							</div>
						) : (
							<div className="default-item">
								<span>投注金额</span>
								<span>0 {UserStore.getUserInfo.mainCurrency}</span> {/* 未激活状态时显示默认金额 */}
							</div>
						)}

						{/* 潜在回报区域，当前固定为 0，实际情况根据需要动态计算 */}
						<div className="default-item">
							<span>潜在回报</span>
							<span>0 {UserStore.getUserInfo.mainCurrency}</span>
						</div>
					</div>

					{/* 投注按钮区域 */}
					<div className="bet-form-btn">
						<div onClick={handleClick} className="now-bet">
							<span>立即投注</span>
						</div>
					</div>
				</div>
			);
		},
	});

	return {
		BetForm,
	};
};
