import { computed, defineComponent, reactive, ref, watch } from "vue";
import { ElInput } from "element-plus";
import { useUserStore } from "/@/stores/modules/user";
import Common from "/@/views/sports/utils/common";
import CommonFn from "/@/utils/common";
import "./index.scss";

export default () => {
	const BetForm = defineComponent({
		props: {
			actived: { type: Boolean, default: false }, // 控制显示投注输入框
			value: { type: Object, default: () => ({}) },
		},
		name: "BetForm",
		emits: ["submit"],
		setup(props, { slots, emit, expose }) {
			const { value } = props;

			// 用户信息 store
			const UserStore = useUserStore();
			const unit = UserStore.getUserInfo.mainCurrency;

			// 定义投注金额和表单校验
			const stake = ref("");
			const validForm = reactive({
				isSuccess: false,
				errMessage: "",
			});

			// 监听玩法 id 变化时，重置表单
			watch(
				() => props.value?.playMethod?.id,
				() => clearForm()
			);

			// 清空表单
			const clearForm = () => {
				validForm.isSuccess = false;
				validForm.errMessage = "";
				stake.value = "";
			};

			// 校验投注金额输入
			const validateStake = (price: string) => {
				const { minBet, maxBet } = props.value?.playMethod || {};
				const numericPrice = Number(price);

				if (numericPrice === 0) {
					validForm.isSuccess = false;
					validForm.errMessage = "";
				} else if (numericPrice < minBet) {
					validForm.isSuccess = false;
					validForm.errMessage = `投注金额不能小于 ${minBet}${unit}`;
				} else if (numericPrice > maxBet) {
					validForm.isSuccess = false;
					validForm.errMessage = `投注金额不能大于 ${maxBet}${unit}`;
				} else {
					validForm.isSuccess = true;
					validForm.errMessage = "";
				}
			};

			// 使用防抖函数校验输入
			const onInputEnter = Common.debounce(validateStake, 300);

			// 计算潜在回报
			const maxOdds = computed(() => {
				const odds = props.value?.playMethod?.odds || 0;
				return CommonFn.thousands(Number((odds * Number(stake.value)).toFixed(2)));
			});

			// 提交投注
			const handleSubmit = () => {
				if (validForm.isSuccess) {
					emit("submit", { stake: Number(stake.value), maxOdds: maxOdds.value });
				}
			};

			// 暴露给父组件的方法
			expose({ clearForm });

			return () => (
				<div class={`lottery-bet-form ${props.actived ? "actived" : ""}`}>
					{/* 渲染插槽内容 */}
					<div class="bet-form-header">{slots.default ? slots.default() : <span>请选择你的赌注</span>}</div>

					{/* 投注输入区域 */}
					<div class="bet-form-content">
						{props.actived ? (
							<div class={`input-item ${validForm.isSuccess ? "success" : ""}`}>
								<span>投注金额</span>
								<ElInput v-model={stake.value} type="number" min={value?.playMethod?.minBet} max={value?.playMethod?.maxBet} placeholder="请输入投注金额" onInput={onInputEnter}>
									{{
										suffix: () => <span>{unit}</span>,
									}}
								</ElInput>
								{validForm.errMessage && <span class="error-message">{validForm.errMessage}</span>}
							</div>
						) : (
							<div class="default-item">
								<span>投注金额</span>
								<span>0 {unit}</span>
							</div>
						)}

						{/* 潜在回报显示 */}
						<div class="default-item">
							<span>潜在回报</span>
							<span>
								{maxOdds.value} {unit}
							</span>
						</div>
					</div>

					{/* 提交按钮 */}
					<div class="bet-form-btn">
						<div class={`now-bet ${validForm.isSuccess ? "actived" : ""}`} onClick={handleSubmit}>
							<span>立即投注</span>
						</div>
					</div>
				</div>
			);
		},
	});

	return { BetForm };
};
