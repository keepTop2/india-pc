import { computed, defineComponent, watch, toRefs } from "vue";
import useTimer from "/@/views/lottery/components/Tools/Timer";
import useLotteryCard from "/@/views/lottery/components/lotteryCard/Index";
import "./index.scss";

// 定义主组件
export default () => {
	// 使用自定义的 LotteryCard hook，获取组件内容和页脚
	const { Content, Footer } = useLotteryCard();

	const LotteryHeader = defineComponent({
		name: "LotteryHeader",
		props: { data: { type: Object, required: true, default: () => {} } },
		setup(props) {
			const propsData = computed(() => props.data);
			// 使用自定义的定时器 hook，获取时间相关的状态和方法
			const { TimeGroup } = useTimer(propsData);
			return () => (
				<div class="lottery-header">
					{/* 左侧部分，包含彩票卡片和倒计时 */}
					<div class="left lottery-card">
						<div class="lottery-card-box">
							{/* 彩票卡片内容 */}
							<Content {...props.data} />
							{/* 倒计时组件 */}
							<TimeGroup {...props.data} />
						</div>
						{/* 彩票卡片的页脚 */}
						<Footer {...props.data} />
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
	};
};
