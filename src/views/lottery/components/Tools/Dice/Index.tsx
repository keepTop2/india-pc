import { defineComponent, computed } from "vue";
import "./index.scss";

export default () => {
	const Dice = defineComponent({
		name: "Dice",
		props: {
			points: {
				// 骰子的点数，表示骰子上显示的点数
				type: Number,
				required: true,
			},
			type: {
				// 骰子的类型（1 为黑色骰子，2 为红色骰子）
				type: Number,
				default: 1,
			},
			actived: {
				// 是否激活骰子，控制是否加上激活状态样式
				type: Boolean,
				default: true,
			},
		},
		// 点击骰子时触发此事件
		emits: ["select"],
		setup(props, { emit }) {
			// 处理点击事件，触发 select 事件
			const handleClick = () => {
				emit("select"); // 通过事件向父组件传递选择的信息
			};

			// 根据骰子的类型来动态计算骰子的背景图
			const pointsSvg = computed(() => `/@/assets/svg/dark/sports/dice_${props.type === 2 ? "red" : "blue"}.svg`);

			// 根据传入的点数动态生成点数数组
			const pointsArr = computed(() => new Array(props.points).fill(0).map((_, index) => index + 1));

			return () => (
				<div style={{ "background-image": `url(/@/assets/svg/dark/sports/dice_bg.svg)` }} onClick={handleClick} class={`lottery-dice${props.actived ? " actived" : ""}`}>
					{/* 渲染点数对应的骰子点 */}
					{pointsArr.value.map(() => (
						<span class={`dice dice-${props.points}`} style={{ "background-image": `url(/@/assets/svg/dark/sports/dice_${props.type === 1 ? "black" : "red"}.svg)` }} />
					))}
				</div>
			);
		},
	});

	return {
		Dice,
	};
};
