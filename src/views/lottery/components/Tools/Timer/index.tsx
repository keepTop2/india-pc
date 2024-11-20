import "./index.scss";

import SvgIcon from "/@/components/svgIcon/index.vue";
import { defineComponent } from "vue";
import { i18n } from "/@/i18n";
import { useCountDown } from "/@/views/lottery/components/Tools/Timer/useCountDown";

const $: any = i18n.global;

// 定义定时器组件
export default (callback = Function.prototype) => {
	// 定义 Timer 组件，显示倒计时
	const Timer = defineComponent({
		name: "Timer",
		props: {
			height: { default: "100%", type: String }, // 设置定时器的高度
			class: { type: String, default: "" }, // 可自定义的 class 样式
			hours: { type: Number, default: 0 },
			minutes: { type: Number, default: 0 },
			seconds: { type: Number, default: 0 },
		},
		setup(props) {
			return () => (
				<div className="lottery-time" style={{ height: props.height }}>
					{/* 小时 */}

					<div className="time-box">
						<span className="num_left text">{Math.floor(props.hours / 10)}</span>
						<span className="num_right text">{props.hours % 10}</span>
					</div>
					<span className="colon text">:</span>
					{/* 分钟 */}
					<div className="time-box">
						<span className="num_left text">{Math.floor(props.minutes / 10)}</span>
						<span className="num_right text">{props.minutes % 10}</span>
					</div>
					<span className="colon text">:</span>
					{/* 秒 */}
					<div className="time-box text">
						<span className="num_left text">{Math.floor(props.seconds / 10)}</span>
						<span className="num_right text">{props.seconds % 10}</span>
					</div>
				</div>
			);
		},
	});

	// 定义 ClockTime 组件，包含图标和定时器
	const ClockTime = defineComponent({
		props: {
			size: { type: String, default: "12px" }, // 设置图标的大小
			hours: { type: Number, default: 0 },
			minutes: { type: Number, default: 0 },
			seconds: { type: Number, default: 0 },
		},
		name: "ClockTime",
		setup(props) {
			return () => (
				<div className="lottery-clock-time">
					{/* 显示时钟图标 */}
					<SvgIcon size={props.size} name="sports-alarm_clock" />
					{/* 显示 Timer 组件 */}
					<Timer hours={props.hours} minutes={props.minutes} seconds={props.seconds} />
				</div>
			);
		},
	});

	// 定义 TimeGroup 组件，包含日期标签和状态
	const TimeGroup = defineComponent({
		name: "TimeGroup",
		props: {
			data: { type: Object, default: () => {} },
		},
		setup(props) {
			const { isAllowedToBet, hours, minutes, seconds } = useCountDown(props, callback);
			return () => (
				<div className="lottery-time-group">
					<div>
						<div className="date-tag">
							<span>{props.data.issueNum}</span>
							{/* 显示日期标签 */}
							<SvgIcon name="sports-date_tag" width="119px" height="36px" />
						</div>
						<div className="bet-status">
							{isAllowedToBet.value ? <span class="allowed">{$.t(`lottery['投注中']`)} </span> : <span class="not-allowed">{$.t(`lottery['封盘中']`)}</span>}
						</div>
					</div>

					{/* 显示 ClockTime 组件 */}
					<ClockTime size="26px" hours={hours.value} minutes={minutes.value} seconds={seconds.value} />
				</div>
			);
		},
	});

	// 返回定义的组件和控制定时器的函数
	return { ClockTime, Timer, TimeGroup };
};
