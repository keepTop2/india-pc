import { defineComponent, reactive } from "vue";
import BannerCom from "./banner.vue";
import SvgIcon from "/@/components/svgIcon/index.vue";
import Common from "/@/views/sports/utils/common";
import "./style/bannerController.scss";
export default () => {
	const state = reactive({
		show: true,
	});

	const handleClick = Common.throttle(() => {
		state.show = !state.show;
	}, 500);

	// 控制banner显示隐藏
	const BannerController = defineComponent({
		setup() {
			return () => (
				<span onClick={handleClick} className="banner-controller">
					<SvgIcon class={`icon icon-${state.show ? 0 : 180}`} name="arrow_right_on" width="12px" height="8px" />
					<SvgIcon name="sports-show_banner" width={132} height={21} />
				</span>
			);
		},
	});

	// banner
	const Banner = defineComponent({
		setup() {
			return () => (state.show ? <BannerCom /> : <></>);
		},
	});

	return {
		BannerController,
		Banner,
	};
};
