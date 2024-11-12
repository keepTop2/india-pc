import { ref, Ref } from "vue";
import { lotteryApi } from "/@/api/lottery";
import showToast from "/@/hooks/useToast";
import { useModalStore } from "/@/stores/modules/modalStore";
import { useUserStore } from "/@/stores/modules/user";
import { SUCCESS_CODE } from "/@/utils/useAxiosLottery";
import { DEFAULT_LANG, langMaps } from "/@/views/lottery/constant/index";
import { useLoginGame } from "/@/views/lottery/stores/loginGameStore";
import { type LotteryDetail, type MergedLotteryItem, type OddsListItem } from "/@/views/lottery/types/index";
import { getIndexInfo } from "/@/views/sports/utils/commonFn";

export interface Props {
	lotteryDetail: LotteryDetail;
}

export function useBet(
	currentLotteryItem: Ref<MergedLotteryItem>,

	currentOddsListItem: Ref<OddsListItem>,

	props: Props
) {
	const betFormRef = ref(); // 提交表单的处理方法
	const userStore = useUserStore();
	const { satoken, isThirdPartyLoggedin, merchantInfo } = useLoginGame();
	const modalStore = useModalStore();

	// 校验函数
	function verify(stake: number) {
		const { getUserInfo = {} } = userStore;
		const { token = "", totalBalance = 0 } = getUserInfo;
		// 1. 校验是否登录 token 和 satoken
		if (![token, isThirdPartyLoggedin.value].every(Boolean)) {
			modalStore.openModal("LoginModal"); // 弹出登录框
			return { message: "", isPassed: false };
		}

		// 2. 校验余额是否足够
		if (stake > totalBalance) {
			return { message: "余额不足", isPassed: false };
		}

		// 3. 校验是否小于 minLimit
		const { maxLimit = 0, minLimit = 0 } = currentLotteryItem.value;
		if (stake < minLimit) {
			return { message: `投注金额不能小于${minLimit}`, isPassed: false };
		}

		// 4. 校验是否大于 maxLimit
		if (stake > maxLimit) {
			return { message: `投注金额不能大于${maxLimit}`, isPassed: false };
		}

		return { message: "", isPassed: true };
	}

	/**
	 * @description 下注函数
	 * @param
	 */
	async function handleSubmit({ stake: betMoney }: { stake: string }) {
		// 1. 发送请求之前的校验
		const { message, isPassed } = verify(+betMoney);
		if (!isPassed) {
			message && showToast(message);
			return;
		}

		// 2. 下注
		// 2.1 准备一下入参
		const { gameCode, gamePlayCode, optionCode: nums } = currentOddsListItem.value;
		const { issueNum: issueNo } = props.lotteryDetail;
		const { merchantNo: operatorId, userAccount: operatorAccount } = merchantInfo.value;
		const language = userStore.getLang;
		const lang = (langMaps as any)[language] || DEFAULT_LANG;

		console.log("issueNo", issueNo);
		const submitData = {
			lang,
			operatorId,
			operatorAccount,
			token: satoken.value,
			list: [{ betCount: 1, multiple: 1, betMoney, nums, gameCode, gamePlayCode, issueNo }],
		};
		console.log("submitData", submitData);

		// 2.2 准备好了，发送请求
		const res = await lotteryApi.betting(submitData);
		const { code, msg } = res;
		showToast(msg);

		// 这里这个 code 需要特殊判断一下
		if (code !== SUCCESS_CODE) {
			return;
		}

		getIndexInfo({}, { showLoading: false }); // 拉一下用户信息更新一下余额，后面可以考虑做成 ws 推送
		betFormRef.value.clearForm(); // 成功才清空文本框
	}

	return {
		betFormRef,
		handleSubmit,
	};
}