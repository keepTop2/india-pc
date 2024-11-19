import "./index.scss";

import { computed, defineComponent, reactive, ref, watch } from "vue";
import { ElInput } from "element-plus";
import { useUserStore } from "/@/stores/modules/user";
import CommonFn from "/@/utils/common";
import { formatNumberMax3Digits } from "/@/views/lottery/utils/formatNumber";
import Common from "/@/views/sports/utils/common";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import { i18n } from "/@/i18n";
const $: any = i18n.global;
export default () => {
	const BetForm = defineComponent({
		props: {
			actived: { type: Boolean, default: false }, // 控制显示投注输入框
			value: { type: Object, default: () => ({}) },
			currentOddsListItem: { type: Object, default: () => ({}) },
		},
		name: "BetForm",
		emits: ["submit"],
		setup(props, { slots, emit, expose }) {
			const { value } = props;

			// 用户信息 store
			const UserStore = useUserStore();
			const SportsBetInfoStore = useSportsBetInfoStore();
			const unit = computed(() => UserStore.getUserInfo.mainCurrency || "USD");

			// 定义投注金额和表单校验
			const stake = ref("");
			const validForm = reactive({
				isSuccess: false,
				errMessage: "",
			});

			// 监听玩法 id 变化时，重置表单
			watch(
				() => props.value?.oddsList?.id,
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
				// 优先判断余额
				if (Number(price) > Number(SportsBetInfoStore.balance)) {
					validForm.isSuccess = false;
					validForm.errMessage = $.t(`lottery['余额不足']`) + "!";
					return;
				}
				const { minLimit, maxLimit } = props.value;
				const numericPrice = Number(price);
				if (numericPrice === 0) {
					validForm.isSuccess = false;
					validForm.errMessage = "";
				} else if (numericPrice < minLimit) {
					validForm.isSuccess = false;
					validForm.errMessage = $.t(`lottery['投注金额不能小于']`) + minLimit + unit.value;
				} else if (numericPrice > maxLimit) {
					validForm.isSuccess = false;
					validForm.errMessage = $.t(`lottery['投注金额不能大于']`) + maxLimit + unit.value;
				} else {
					validForm.isSuccess = true;
					validForm.errMessage = "";
				}
			};

			// 使用防抖函数校验输入
			const onInputEnter = Common.debounce(validateStake, 300);

			// 计算潜在回报
			const maxOdds = computed(() => {
				const odds = props.value?.oddsList?.odds || 0;
				return CommonFn.thousands(Number((odds * Number(stake.value)).toFixed(2)));
			});

			// 提交投注
			const handleSubmit = () => {
				if (validForm.isSuccess) {
					emit("submit", { stake: Number(stake.value), maxOdds: maxOdds.value });
				}
			};

			const preventDecimal = (event: KeyboardEvent) => {
				if (event.key === "." || event.key === "-" || event.key === "+") {
					event.preventDefault();
				}
			};

			// 暴露给父组件的方法
			expose({ clearForm });

			return () => (
				<div class={`lottery-bet-form ${props.actived ? "actived" : ""}`}>
					{/* 渲染插槽内容 */}
					<div class="bet-form-header">{slots.default ? slots.default() : <span>{$.t(`lottery['请选择你的赌注']`)}</span>}</div>

					{/* 投注输入区域 */}
					<div class="bet-form-content">
						{props.actived ? (
							<div class={`input-item ${validForm.isSuccess ? "success" : ""}`}>
								<span>{$.t(`lottery['投注金额']`)}</span>
								<ElInput
									v-model={stake.value}
									type="number"
									min={value?.minLimit}
									max={value?.maxLimit}
									placeholder={$.t(`lottery['请输入投注金额']`)}
									onInput={(inputValue: string) => {
										// 过滤非数字字符
										stake.value = inputValue.replace(/[^\d]/g, "");
										// 校验金额
										onInputEnter(stake.value);
									}}
									onKeydown={(event: KeyboardEvent) => {
										// 禁止输入小数点、负号、加号、空格等
										if (event.key === "." || event.key === "-" || event.key === "+" || event.key === " " || (event.key.length === 1 && !/[0-9]/.test(event.key))) {
											event.preventDefault();
										}
									}}
								>
									{{
										suffix: () => <span>{unit.value}</span>,
									}}
								</ElInput>
								{validForm.errMessage && <span class="error-message">{validForm.errMessage}</span>}
							</div>
						) : (
							<></>
						)}
						<div class="default-item">
							<span>{$.t(`lottery['投注金额']`)}</span>
							<span>
								{stake.value || 0} {unit.value}
							</span>
						</div>
						{/* 潜在回报显示 */}
						<div class="default-item">
							<span>{$.t(`lottery['潜在回报']`)}</span>
							<span>
								{formatNumberMax3Digits(+props.currentOddsListItem.itemOdds * +stake.value || 0)} {unit.value}
							</span>
						</div>
					</div>

					{/* 提交按钮 */}
					<div class="bet-form-btn">
						<div class={`now-bet ${validForm.isSuccess ? "actived" : ""}`} onClick={handleSubmit}>
							<span>{$.t(`lottery['立即投注']`)}</span>
						</div>
					</div>
				</div>
			);
		},
	});

	return { BetForm };
};
