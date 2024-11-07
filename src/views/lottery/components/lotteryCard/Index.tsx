import { defineComponent } from "vue";
import useTimer from "/@/views/lottery/components/Tools/Timer";
import { useUserStore } from "/@/stores/modules/user"; // 引入用户信息 store
import Common from "/@/utils/common";
import "./index.scss";

// 主组件，使用 useTimer 获取计时器相关的状态和方法
export default () => {
	const { ClockTime, start, pause, reset } = useTimer({ seconds: 73000 });
	// 获取用户信息 store
	const {
		getUserInfo: { mainCurrency },
	} = useUserStore();

	// 定义卡片头部组件
	const Header = defineComponent({
		setup() {
			return () => (
				<div class="card-header">
					{/* 左侧图片 */}
					<div class="left">
						<img src="https://oss.playesoversea.pro/baowang/9ff561dda4224ababf5066866014bbae.png" alt="Header Image" />
					</div>
					{/* 右侧倒计时 */}
					<div class="right">
						<ClockTime />
					</div>
				</div>
			);
		},
	});

	// 定义卡片内容组件，可以根据需要传入 props 以便更灵活的显示不同内容
	const Content = defineComponent({
		props: {
			icon: { type: String },
			title: { type: String, required: true },
			desc: { type: String, required: true },
		},
		setup(props) {
			const { icon, desc, title } = props;
			return () => (
				<div class="card-content">
					{/* 左侧内容区域 */}
					<div class="left">
						<img src={icon} alt="Content Image" />
					</div>
					{/* 右侧类型名称和标题 */}
					<div class="right">
						<div class="type-name">{title || "-"}</div>
						<div class="title">{desc || "-"}</div>
					</div>
				</div>
			);
		},
	});

	// 定义卡片底部组件
	const Footer = defineComponent({
		props: {
			amount: { type: Number, required: true },
		},
		setup(props) {
			const { amount } = props;
			return () => (
				<div class="card-footer">
					<div class="left">
						<span>最近获奖</span>
					</div>
					<div class="right">
						<span>
							{Common.thousands(amount)} {mainCurrency}
						</span>
					</div>
				</div>
			);
		},
	});

	// 定义卡片按钮组件
	const Button = defineComponent({
		setup() {
			return () => <div class="card-button">立即投注</div>;
		},
	});

	// 普通的 LotteryCard 组件
	const LotteryCard = defineComponent({
		name: "LotteryCard",
		emits: ["select"],
		setup(_, { emit }) {
			return () => (
				<div onClick={() => emit("select")} class="lottery-card">
					{/* 卡片头部 */}
					<Header />
					{/* 分割线 */}
					<div class="line"></div>
					{/* 卡片内容 */}
					<Content />
					{/* 卡片底部 */}
					<Footer />
				</div>
			);
		},
	});

	// 热门的 LotteryCard 组件，包含按钮
	const HotLotteryCard = defineComponent({
		name: "HotLotteryCard",
		emits: ["select"],
		setup(_, { emit }) {
			return () => (
				<div class="lottery-card hot-lottery-card">
					{/* 卡片头部 */}
					<Header />
					{/* 卡片内容 */}
					<Content />
					{/* 卡片底部 */}
					<Footer />
					{/* 卡片按钮 */}
					<Button onClick={() => emit("select")} />
				</div>
			);
		},
	});

	return {
		LotteryCard,
		HotLotteryCard,
		Content,
		Footer,
		Header,
		Button,
		startTime: start, // 开始计时
		pauseTime: pause, // 暂停计时
		resetTime: reset, // 重置计时
	};
};
