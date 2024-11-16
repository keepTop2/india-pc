import { ref, defineComponent } from "vue";
import SvgIcon from "/@/components/svgIcon/index.vue"; // 引入 SvgIcon 组件用于显示图标
import "./index.scss";

const AccordionItem = defineComponent({
	name: "AccordionItem",
	props: {
		title: {
			// 标题文本
			type: String,
			required: true,
		},
		info: {
			// 额外信息
			type: String,
			default: "",
		},
		odds: {
			// 赔率
			type: String,
			default: 0,
		},
		actived: {
			// 当前项是否激活
			type: Boolean,
			default: false,
		},
	},
	// 用于通知父组件当前项是否激活
	emits: ["select"],
	setup(props, { emit, slots }) {
		const handleClick = () => {
			// 通过事件传递新的激活状态
			emit("select", !props.actived);
		};
		console.log(props,'=====props');
		return () => (
			<div class={`accordion-content-item-box${props.actived ? " actived" : ""}`}>
				<div onClick={handleClick} className="accordion-content-item">
					<div>
						<div class="left">
							<span class="title">{props.title}</span>
							<span class="info">{props.info}</span>
						</div>
						<div class="right">
							<span class="odds">{props.odds ? `${props.odds}x` : ""}</span>
						</div>
					</div>
				</div>
				{/* 插槽内容 */}
				{slots.default ? slots.default() : <></>}
			</div>
		);
	},
});

export default () => {
	const Accordion = defineComponent({
		name: "Accordion",
		props: {
			isExpanded: {
				// 控制 Accordion 是否展开
				type: Boolean,
				default: false,
			},
			title: {
				// 标题
				type: String,
				required: false,
			},
		},
		emits: ["change"], // 父组件通过此事件接收展开状态
		setup(props, { emit, slots }) {
			// 切换 Accordion 展开状态
			const handleChange = () => {
				// 向父组件传递新的展开状态
				emit("change", !props.isExpanded);
			};

			return () => (
				<div class="lottery-accordion">
					<div onClick={handleChange} class={`accordion-header${props.isExpanded ? " expanded" : ""}`}>
						<div class="left header-title">
							{/* 使用插槽自定义标题，如果没有插槽则显示默认标题 */}
							{slots.title ? slots.title() : <span>{props.title}</span>}
						</div>
						<div class="header-icon right">
							{/* 展开/收起图标 */}
							<span class={`icon${props.isExpanded ? "" : " icon-expanded"}`}>
								<SvgIcon name="sports-arrow" width="8px" height="12px" />
							</span>
						</div>
					</div>
					{/* 如果有 content 插槽，显示内容 */}
					{slots.content ? <div class="accordion-content">{slots.content()}</div> : <></>}
				</div>
			);
		},
	});

	return {
		Accordion,
		AccordionItem,
	};
};
