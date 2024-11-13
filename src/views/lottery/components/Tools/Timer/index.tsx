import "./index.scss";

import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

import SvgIcon from "/@/components/svgIcon/index.vue";

// 定义定时器组件
export default (props?: any) => {
	const state = reactive({
		time: props?.value?.seconds || 0, // 当前剩余时间（秒）
		hours: 0, // 小时
		minutes: 0, // 分钟
		seconds: 0, // 秒
		isRunning: false, // 定时器是否正在运行
	});

	// animationFrameId 用来存储动画帧的 ID，方便取消定时
	const animationFrameId = ref<number | null>(null);
	let startTime: number | null = null; // 存储定时器开始的时间戳

	// 更新定时器显示的时间
	const updateDisplay = () => {
		state.hours = Math.floor(state.time / 3600); // 小时数
		state.minutes = Math.floor((state.time % 3600) / 60); // 分钟数
		state.seconds = state.time % 60; // 秒数
	};

	// 定时器倒计时逻辑
	const countdown = (timestamp: number) => {
		if (!startTime) startTime = timestamp; // 第一次调用时记录开始时间

		// 计算经过的时间（秒）
		const elapsed = Math.floor((timestamp - startTime) / 1000);
		state.time = Math.max(props?.value?.seconds - elapsed, 0); // 计算剩余时间，不能小于 0

		updateDisplay(); // 更新显示

		// 如果还有剩余时间，继续递归调用 requestAnimationFrame
		if (state.time > 0) {
			animationFrameId.value = requestAnimationFrame(countdown);
		} else {
			state.isRunning = false; // 倒计时结束
		}
	};

	// 开始倒计时
	const start = () => {
		if (!state.isRunning && state.time > 0) {
			state.isRunning = true;
			startTime = null; // 重置开始时间
			animationFrameId.value = requestAnimationFrame(countdown); // 开始新的倒计时
		}
	};

	// 暂停倒计时
	const pause = () => {
		state.isRunning = false; // 设置为暂停状态
		if (animationFrameId.value) {
			cancelAnimationFrame(animationFrameId.value); // 取消动画帧
			animationFrameId.value = null;
		}
	};

	// 重置倒计时
	const reset = () => {
		pause(); // 暂停定时器
		state.time = props?.value?.seconds; // 重置时间为初始秒数
		updateDisplay(); // 更新显示
	};

	watch(
		() => props.value,
		(a) => {
			state.time = props?.value?.seconds || 0;
			start();
		},
		{ deep: true, immediate: true }
	);

	// 定义 Timer 组件，显示倒计时
	const Timer = defineComponent({
		name: "Timer",
		props: {
			height: { default: "100%", type: String }, // 设置定时器的高度
			class: { type: String, default: "" }, // 可自定义的 class 样式
			data: { type: Object, default: () => ({}) },
		},
		setup(_props) {
			// 组件挂载时初始化显示，并根据 immediate 设置是否立即启动定时器
			onMounted(() => {
				updateDisplay(); // 初始化显示
				props?.value?.immediate && start(); // 如果 immediate 为 true，则立即启动定时器
			});

			// 组件销毁时取消动画帧
			onBeforeUnmount(() => {
				if (animationFrameId.value) {
					cancelAnimationFrame(animationFrameId.value);
				}
			});

			// 定时器 UI 模板，显示小时、分钟和秒
			return () => (
				<div className="lottery-time" style={{ height: _props.height }}>
					{/* 小时 */}
					<div className="time-box">
						<span className="num_left text">{Math.floor(state.hours / 10)}</span>
						<span className="num_right text">{state.hours % 10}</span>
					</div>
					<span className="colon text">:</span>
					{/* 分钟 */}
					<div className="time-box">
						<span className="num_left text">{Math.floor(state.minutes / 10)}</span>
						<span className="num_right text">{state.minutes % 10}</span>
					</div>
					<span className="colon text">:</span>
					{/* 秒 */}
					<div className="time-box text">
						<span className="num_left text">{Math.floor(state.seconds / 10)}</span>
						<span className="num_right text">{state.seconds % 10}</span>
					</div>
				</div>
			);
		},
	});

	// 定义 ClockTime 组件，包含图标和定时器
	const ClockTime = defineComponent({
		props: {
			size: { type: String, default: "12px" }, // 设置图标的大小
			data: { type: Object, default: () => ({}) },
		},
		name: "ClockTime",
		setup(props) {
			return () => (
				<div className="lottery-clock-time">
					{/* 显示时钟图标 */}
					<SvgIcon size={props.size} name="sports-alarm_clock" />
					{/* 显示 Timer 组件 */}
					<Timer data={props.data} />
				</div>
			);
		},
	});

	// 定义 TimeGroup 组件，包含日期标签和状态
	const TimeGroup = defineComponent({
		name: "TimeGroup",
		props: {
			data: { type: Object, default: () => ({}) },
		},
		setup(props, { attrs }) {
			const isAllowed = computed(() => {
				return [state.hours, state.minutes, state.seconds].some((v) => v > 0);
			});
			return () => (
				<div className="lottery-time-group">
					<div>
						<div className="date-tag">
							<span>{props.data.issueNum}</span>
							{/* 显示日期标签 */}
							<SvgIcon name="sports-date_tag" width="119px" height="36px" />
						</div>
						<div className="bet-status">{isAllowed.value ? <span class="allowed"> 投注中</span> : <span class="not-allowed">封盘中</span>}</div>
					</div>

					{/* 显示 ClockTime 组件 */}
					<ClockTime size="26px" data={props.data} />
				</div>
			);
		},
	});

	// 返回定义的组件和控制定时器的函数
	return {
		ClockTime,
		Timer,
		TimeGroup,
		start,
		pause,
		reset,
	};
};
