import "./index.scss";

import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "/@/stores/modules/user"; // 引入用户信息 store
import Common from "/@/utils/common";
import useTimer from "/@/views/lottery/components/Tools/Timer";

// 主组件，使用 useTimer 获取计时器相关的状态和方法
export default () => {
	// 获取用户信息 store
	const {
		getUserInfo: { mainCurrency },
	} = useUserStore();

	// 定义卡片头部组件
	const Header = defineComponent({
		props: {
			icon: { type: String },
			seconds: { type: Number, required: true },
		},
		setup(props) {
			const { ClockTime } = useTimer({ value: props });
			console.log(props.icon, "=======icon");
			return () => (
				<div class="card-header">
					{/* 左侧图片 */}
					<div class="left">
						<img src={props.icon} alt="Header Image" />
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
		name: "Content",
		props: {
			data: { type: Object, default: () => ({}) },
		},
		setup(props) {
			return () => (
				<div class="card-content">
					{/* 左侧内容区域 */}
					<div class="left">
						<img src={props.data.iconPc} alt="Content Image" />
					</div>
					{/* 右侧类型名称和标题 */}
					<div class="right">
						<div class="type-name">{props.data.gameName}</div>
						<div class="title">{props.data.gameDesc}</div>
					</div>
				</div>
			);
		},
	});

	// 定义卡片底部组件
	const Footer = defineComponent({
		name: "Footer",
		setup(props) {
			const route = useRoute();
			const maxWin = +(route.query.maxWin || 0);
			return () => (
				<div class="card-footer">
					<div class="left">
						<span>最近获奖</span>
					</div>
					<div class="right">
						<span>
							{Common.thousands(maxWin)} {mainCurrency}
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
		props: {
			data: { type: Object, required: true },
		},
		setup(props, { emit }) {
			return () => (
				<div onClick={() => emit("select")} class="lottery-card">
					{/* 卡片头部 */}
					<Header data={props.data} />
					{/* 分割线 */}
					<div class="line"></div>
					{/* 卡片内容 */}
					<Content data={props.data} />
					{/* 卡片底部 */}
					<Footer data={props.data} />
				</div>
			);
		},
	});

	// 热门的 LotteryCard 组件，包含按钮
	const HotLotteryCard = defineComponent({
		name: "HotLotteryCard",
		emits: ["select"],
		props: {
			data: { type: Object, required: true },
		},
		setup(props, { emit }) {
			return () => (
				<div class="lottery-card hot-lottery-card">
					{/* 卡片头部 */}
					<Header {...props.data} />
					{/* 卡片内容 */}
					<Content {...props.data} />
					{/* 卡片底部 */}
					<Footer {...props.data} />
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
	};
};
