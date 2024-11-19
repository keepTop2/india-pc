import "./index.scss";

import HeaderRightIcon from "/@/assets/zh-CN/lottery/lottery-info.png";
import { defineComponent } from "vue";
import { useLottery } from "/@/views/lottery/stores/lotteryStore";
import useLotteryCard from "/@/views/lottery/components/LotteryCard/Index";
import { useRoute } from "vue-router";
import useTimer from "/@/views/lottery/components/Tools/Timer";
import { useUserStore } from "/@/stores/modules/user";

// 定义主组件
export default () => {
	// 使用自定义的 LotteryCard hook，获取组件内容和页脚
	const route = useRoute();
	const { Content, Footer } = useLotteryCard();
	const { lotteryDetail } = useLottery();
	const maxWin = route.query.maxWin || 0;

	const LotteryHeader = defineComponent({
		name: "LotteryHeader",
		setup(props) {
			const {
				getUserInfo: { mainCurrency },
			} = useUserStore();

			// 使用自定义的定时器 hook，获取时间相关的状态和方法
			const { TimeGroup } = useTimer();

			return () => (
				<div class="lottery-header">
					{/* 左侧部分，包含彩票卡片和倒计时 */}
					<div class="left lottery-card">
						<div class="lottery-card-box">
							{/* 彩票卡片内容 */}
							<Content data={lotteryDetail} />
							{/* 倒计时组件 */}
							<TimeGroup data={lotteryDetail} />
						</div>
						{/* 彩票卡片的页脚 */}
						<Footer />
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
