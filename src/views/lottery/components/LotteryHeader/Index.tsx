import { defineComponent } from "vue";
import useTimer from "/@/views/lottery/components/Tools/Timer";
import useLotteryCard from "/@/views/lottery/components/lotteryCard/Index";
import "./index.scss";

// 定义主组件
export default (props: { data: any; immediate?: boolean }) => {
	const { data, immediate = true } = props;
	// 使用自定义的定时器 hook，获取时间相关的状态和方法
	const { TimeGroup, start, pause, reset } = useTimer({ seconds: data.seconds, immediate });

	// 使用自定义的 LotteryCard hook，获取组件内容和页脚
	const { Content, Footer } = useLotteryCard();

	const LotteryHeader = defineComponent({
		name: "LotteryHeader",
		setup() {
			return () => (
				<div class="lottery-header">
					{/* 左侧部分，包含彩票卡片和倒计时 */}
					<div class="left lottery-card">
						<div class="lottery-card-box">
							{/* 彩票卡片内容 */}
							<Content {...data} />
							{/* 倒计时组件 */}
							<TimeGroup />
						</div>
						{/* 彩票卡片的页脚 */}
						<Footer amount={data.recentlyAwarded} />
					</div>

					{/* 右侧部分，展示彩票信息图片 */}
					<div class="right">
						<img src="/@/assets/zh-CN/lottery/lottery-info.png" alt="Lottery Info" />
					</div>
				</div>
			);
		},
	});

	return {
		LotteryHeader,
		startTime: start, // 开始倒计时
		pauseTime: pause, // 暂停倒计时
		resetTime: reset, // 重置倒计时
	};
};
