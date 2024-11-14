import { defineComponent, onBeforeMount, reactive, watch, ref, onMounted } from "vue";
import BannerCom from "./banner.vue";
import SvgIcon from "/@/components/svgIcon/index.vue";
import VenueBanner from "/@/components/venueBanner.vue";
import Common from "/@/views/sports/utils/common";
import { bannerApi } from "/@/api/banner";
import { useRoute } from "vue-router";
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
					<SvgIcon class={`icon icon-${state.show ? 0 : 180}`} name="common-arrow_right_on" width="12px" height="8px" />
					<SvgIcon name="sports-show_banner" width={132} height={21} />
				</span>
			);
		},
	});

	// banner
	const Banner = defineComponent({
		setup() {
			const bannerList = ref([]);
			const getBannerList = () => {
				bannerApi
					.queryBannerList({
						gameOneClassId: "SBA",
					})
					.then((res) => {
						bannerList.value = res.data;
					});
			};
			onMounted(() => {
				getBannerList();
			});
			return () => (state.show ? <VenueBanner bannerList={bannerList.value} /> : <></>);
		},
	});

	const route = useRoute();
	watch(
		() => route.name,
		() => {
			// 详情不展示banner;
			const hasRoute = ["eventDetail"].includes(route.name as string);
			state.show = !hasRoute;
		},
		{
			immediate: true,
		}
	);

	return {
		BannerController,
		Banner,
	};
};
