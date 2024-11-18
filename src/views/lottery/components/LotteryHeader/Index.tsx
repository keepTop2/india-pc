import "./index.scss";

import { computed, defineComponent } from "vue";
import Common from "/@/utils/common";
import useLotteryCard from "/@/views/lottery/components/LotteryCard/Index";
import useTimer from "/@/views/lottery/components/Tools/Timer";
import { useUserStore } from "/@/stores/modules/user";
import HeaderRightIcon from "/@/assets/zh-CN/lottery/lottery-info.png";
// 定义主组件
export default () => {
	// 使用自定义的 LotteryCard hook，获取组件内容和页脚
	const { Content, Footer } = useLotteryCard();

	const LotteryHeader = defineComponent({
		name: "LotteryHeader",
		props: {
			data: { type: Object, required: true, default: () => ({}) },
			timerEndCallback: { type: Function, default: Function.prototype },
		},
		setup(props) {
			const propsData = computed(() => props.data);
			const {
				getUserInfo: { mainCurrency },
			} = useUserStore();
			// 使用自定义的定时器 hook，获取时间相关的状态和方法
			const { TimeGroup } = useTimer(propsData, props.timerEndCallback);
			return () => (
				<div class="lottery-header">
					{/* 左侧部分，包含彩票卡片和倒计时 */}
					<div class="left lottery-card">
						<div class="lottery-card-box">
							{/* 彩票卡片内容 */}
							<Content data={props.data} />
							{/* 倒计时组件 */}
							<TimeGroup data={props.data} />
						</div>
						{/* 彩票卡片的页脚 */}
						<Footer data={props.data}>
							{{
								maxWin: (
									<span>
										{Common.thousands(props.data.maxWin)} {useUserStore().getUserInfo.mainCurrency || "USD"}
									</span>
								),
							}}
						</Footer>
					</div>

					{/* 右侧部分，展示彩票信息图片 */}
					<div class="right">
						<img src={HeaderRightIcon} alt="Lottery Info" />
					</div>
				</div>
			);
		},
	});

	return {
		LotteryHeader,
	};
};
