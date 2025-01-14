import "./index.scss";

import { computed, defineComponent, type Ref } from "vue";

import { i18n } from "/@/i18n";
import { useLottery } from "/@/views/lottery/stores/lotteryStore";
import { type OddsItem, type OddsList } from "/@/views/lottery/types/index";

const ClearIcon = new URL("/src/assets/zh-CN/lottery/clear.svg", import.meta.url).href;
const KsxzIcon = new URL("/src/assets/zh-CN/lottery/ksxz.svg", import.meta.url).href;

const $: any = i18n.global;

export default () => {
	// 定义 SelectBallGroup 组件，用于显示多个球的选择
	const SelectBallGroup = defineComponent({
		name: "SelectBallGroup",
		props: {
			children: {
				// 选择球的个数
				type: Array,
				default: () => [],
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
			const { children, maxLeng, type = 1, multiple = true } = props;
			const { currentBalls } = useLottery();

			// 处理球的选择逻辑
			const handleSelect = (oddsItem: OddsItem, isRandom = false) => {
				const { optionCode } = oddsItem;
				const isIncluded = props.value.includes(optionCode);

				if (!multiple) {
					emit("select", {
						value: oddsItem,
						list: isIncluded && !isRandom ? [] : [oddsItem],
					});
					return;
				}
				// 如果球号已经选中，移除该球号
				if (isIncluded) {
					emit("select", {
						value: oddsItem,
						list: (props.value as OddsList).filter((v) => v.optionCode !== optionCode),
					});
				} else {
					// 如果未选中，并且未超过最大选择数量，添加该球号
					if (maxLeng && props.value.length === maxLeng) return; // 超过最大限制时不允许选择
					emit("select", {
						value: oddsItem,
						list: [...props.value, oddsItem],
					});
				}
			};

			// 生成球的数量列表
			const balls = computed(() => children) as Ref<OddsItem[]>;

			// 快速选择
			const handleRandomBall = () => {
				const index = Math.floor(Math.random() * balls.value.length);
				handleSelect(balls.value[index], true);
			};

			return () => (
				<div class="select-ball-group">
					{/* 提示信息 */}
					<div class="warn">{$.t(`lottery['请选择1个球号']`)}</div>
					<div className="control">
						{/* 清除全部选中 */}
						<div className="clear">
							<img src={ClearIcon} alt="" />
							<span onClick={() => emit("clear")}>{$.t(`lottery['清除全部']`)}</span>
						</div>
						{/* 快速选择区域 */}
						<div onClick={handleRandomBall} className="other">
							<img src={KsxzIcon} alt="" />
							<span>{$.t(`lottery['快速选择']`)}</span>
						</div>
					</div>

					{/* 显示球的区域 */}
					<div className="balls-box">
						{balls.value.map((item, index) => {
							const { optionCode } = item;
							return (
								<Ball
									key={index}
									onSelect={() => handleSelect(item)} // 绑定选择球的事件
									actived={(props.value as OddsList).map((v) => v.optionCode).includes(optionCode)} // 判断球是否被选中
									type={type} // 设置球的类型
									ballNumber={+optionCode} // 当前球的编号
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
				type: [Number, String],
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
				[1, new URL("/src/assets/svg/dark/sports/blueBall.svg", import.meta.url).href], // 蓝球
				[2, new URL("/src/assets/svg/dark/sports/redBall.svg", import.meta.url).href], // 红球
				[3, new URL("/src/assets/svg/dark/sports/defBall.svg", import.meta.url).href], //默认球
			]);

			console.log("bgTypeMap==========ball", bgTypeMap.get(props.type));
			// 根据球的类型选择不同的 SVG 图标
			const ballSvg = computed(() => bgTypeMap.get(props.type));

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
					<span class="ball">{+props.ballNumber!}</span>
				</div>
			);
		},
	});

	return {
		Ball,
		SelectBallGroup,
	};
};
