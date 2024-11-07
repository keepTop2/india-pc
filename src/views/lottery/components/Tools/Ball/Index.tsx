import { computed, defineComponent, watch } from "vue";
import "./index.scss";

export default () => {
	// 定义 SelectBallGroup 组件，用于显示多个球的选择
	const SelectBallGroup = defineComponent({
		name: "SelectBallGroup",
		props: {
			renderBallNum: {
				// 选择球的个数
				type: Number,
				required: true,
			},
			maxLeng: {
				// 最大选择个数
				type: Number,
				default: Infinity, // 默认没有限制
			},
			type: {
				// 球的类型：1 蓝球，2 红球
				type: Number,
				default: 1,
			},
			value: {
				// 当前选中的球号
				type: Array,
				default: () => [],
				required: true,
			},
		},
		// 自定义事件：选择球、清除全部选中
		emits: ["select", "clear"],

		setup(props, { emit }) {
			const { renderBallNum, maxLeng, type = 1 } = props;

			// 处理球的选择逻辑
			const handleSelect = (ballNum: number) => {
				// 如果球号已经选中，移除该球号
				if (props.value.includes(ballNum)) {
					emit("select", {
						value: ballNum,
						list: props.value.filter((item) => item !== ballNum),
					});
				} else {
					// 如果未选中，并且未超过最大选择数量，添加该球号
					if (maxLeng && props.value.length === maxLeng) return; // 超过最大限制时不允许选择
					emit("select", {
						value: ballNum,
						list: [...props.value, ballNum],
					});
				}
			};

			// 生成球的数量列表
			const balls = computed(() => new Array(renderBallNum).fill(0));

			return () => (
				<div class="select-ball-group">
					{/* 提示信息 */}
					<div class="warn">选择至少一个球号</div>
					<div className="control">
						{/* 清除全部选中 */}
						<div className="clear">
							<span onClick={() => emit("clear")}>清除全部</span>
						</div>
						{/* 快速选择区域 */}
						<div className="other">
							<span>快速选择</span>
						</div>
					</div>

					{/* 显示球的区域 */}
					<div className="balls-box">
						{balls.value.map((_, index) => (
							<Ball
								key={index}
								onSelect={() => handleSelect(index + 1)} // 绑定选择球的事件
								actived={props.value.includes(index + 1)} // 判断球是否被选中
								type={type} // 设置球的类型
								ballNumber={index + 1} // 当前球的编号
							/>
						))}
					</div>
				</div>
			);
		},
	});

	// 定义 Ball 组件，用于显示每个球
	const Ball = defineComponent({
		name: "Ball",
		props: {
			actived: {
				// 是否被选中
				type: Boolean,
				default: true,
			},
			type: {
				// 球的类型：1 红球，2 蓝球
				type: Number,
				default: 1,
			},
			ballNumber: {
				// 球的编号
				type: Number,
			},
		},
		emits: ["select"], // 修正事件名称为 "select"

		setup(props, { emit }) {
			// 点击球时触发选择事件
			const handleClick = () => {
				emit("select");
			};

			// 根据球的类型选择不同的 SVG 图标
			const ballSvg = computed(() => `/@/assets/svg/dark/sports/${props.type === 1 ? "red" : "blue"}Ball.svg`);

			// 渲染球组件
			return () => (
				<div
					style={{
						"background-image": `url(${props.actived ? ballSvg.value : ""})`, // 根据是否选中决定是否显示背景图
					}}
					onClick={handleClick} // 点击球触发选择事件
					class={`lottery-ball${props.actived ? " actived" : ""}`} // 根据是否选中设置不同的样式
				>
					<span class="ball">{props.ballNumber}</span>
				</div>
			);
		},
	});

	return {
		Ball,
		SelectBallGroup,
	};
};
