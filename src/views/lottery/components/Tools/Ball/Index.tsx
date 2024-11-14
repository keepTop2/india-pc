import "./index.scss";

import { computed, defineComponent } from "vue";

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
			startIndex: {
				// 球的起始序号。例如时时彩是从 1 开始的，幸运 28 是从 0 开始的
				type: Number,
				default: 1,
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
			multiple: {
				//是否多选
				type: Boolean,
				default: true,
			},
		},
		// 自定义事件：选择球、清除全部选中
		emits: ["select", "clear"],

		setup(props, { emit }) {
			const { renderBallNum, maxLeng, type = 1, multiple = true, startIndex } = props;

			// 处理球的选择逻辑
			const handleSelect = (ballNum: number) => {
				console.log("ballNum", ballNum);
				if (!multiple) {
					emit("select", { value: ballNum, list: props.value.includes(ballNum) ? [] : [ballNum] });
					return;
				}
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
					<div class="warn">请{props.multiple ? "至少" : ""}选择1个球号</div>
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
						{balls.value.map((_, index) => {
							const renderNumber = startIndex === 0 ? index : index + 1;
							return (
								<Ball
									key={renderNumber}
									onSelect={() => handleSelect(renderNumber)} // 绑定选择球的事件
									actived={props.value.includes(renderNumber)} // 判断球是否被选中
									type={type} // 设置球的类型
									ballNumber={renderNumber} // 当前球的编号
								/>
							);
						})}
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
				// 球的类型：1 红球，2 蓝球 3默认球
				type: Number,
				default: 1,
			},
			ballNumber: {
				// 球的编号
				type: Number,
			},
			size: {
				type: String,
				default: "36px",
			},
		},
		emits: ["select"], // 修正事件名称为 "select"

		setup(props, { emit }) {
			// 点击球时触发选择事件
			const handleClick = () => {
				emit("select");
			};

			const bgTypeMap = new Map([
				[1, "blueBall"], // 蓝球
				[2, "redBall"], // 红球
				[3, "defBall"], //默认球
			]);

			// 根据球的类型选择不同的 SVG 图标
			const ballSvg = computed(() => `/@/assets/svg/dark/sports/${bgTypeMap.get(props.type)}.svg`);

			// 渲染球组件
			return () => (
				<div
					style={{
						width: props.size,
						height: props.size,
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
