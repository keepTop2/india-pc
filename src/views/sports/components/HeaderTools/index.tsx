import { reactive, defineComponent, computed } from "vue";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import { Refresh as RefreshIcon } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import { ElIcon } from "element-plus";
import { debounce } from "lodash-es";
import SvgIcon from "/@/components/svgIcon/index.vue";

// 定义自定义 Hook 返回的按钮类型
interface HeaderTools {
	/** 控制展示比分板和直播 */
	Tv: ReturnType<typeof defineComponent>;
	/** 直播按钮 */
	Live: ReturnType<typeof defineComponent>;
	/** 比分板按钮 */
	Scoreboard: ReturnType<typeof defineComponent>;
	/** 刷新按钮 */
	Refresh: ReturnType<typeof defineComponent>;
	toolState: {
		isOpen: Boolean;
		[x: string]: any;
	};
}

const style = { cursor: "pointer" };

export default (eventsInfo: any): HeaderTools => {
	const route = useRoute();
	const { toggleEventScoreboard, sliderData } = useToolsHooks();
	const SidebarStore = useSidebarStore();

	const state = reactive({
		isOpen: true,
		videoLoading: false,
		isSuccess: false,
		rotation: 0, //旋转角度
		loading: false, //盘口数据loading状态
	});

	// 比分板按钮
	const Scoreboard = defineComponent({
		name: "Scoreboard",
		setup() {
			const isEventActive = computed(() => sliderData.value?.eventId === eventsInfo.value?.eventId);

			const handleClick = () => {
				console.log(SidebarStore.getEventsInfo, eventsInfo.value, "比分板按钮");
				toggleEventScoreboard(eventsInfo.value);
				state.isOpen = true;
				SidebarStore.getSidebarStatus("scoreboard");
			};
			return () => (
				<SvgIcon
					style={style}
					onClick={handleClick}
					name={isEventActive.value ? (SidebarStore.sidebarStatus === "scoreboard" ? "sports-score_icon_active" : "sports-score_icon") : "sports-score_icon"}
					width="23px"
					height="16px"
				/>
			);
		},
	});

	// 直播按钮
	const Live = defineComponent({
		name: "Live",
		setup() {
			const isEventActive = computed(() => sliderData.value?.eventId === eventsInfo.value?.eventId);

			const handleClick = () => {
				toggleEventScoreboard(
					{
						...eventsInfo.value,
						callback: (status: string | Error) => {
							state.isSuccess = typeof status === "boolean";
						},
					},
					true
				);
				state.isOpen = true;
				SidebarStore.getSidebarStatus("live");
			};
			return () =>
				eventsInfo.value?.streamingOption != 0 && eventsInfo.value?.channelCode ? (
					<SvgIcon
						style={style}
						onClick={handleClick}
						name={isEventActive.value ? (SidebarStore.sidebarStatus === "live" ? "sports-live_icon_active" : "sports-live_icon") : "sports-live_icon"}
						width="23px"
						height="16px"
					/>
				) : (
					<></>
				);
		},
	});

	// 刷新按钮
	const Refresh = defineComponent({
		name: "Refresh",
		props: {
			time: {
				type: Number,
				default: 1000,
			},
		},
		emits: ["onChange"],
		setup(props, { emit }) {
			const refreshState = reactive({
				rotation: 0,
			});
			const handleClick = debounce(
				() => {
					// 切换旋转状态
					refreshState.rotation += 180;
					emit("onChange");
				},
				props.time,
				{ leading: true }
			);
			return () => (
				<ElIcon style={style} onClick={handleClick} size="18px" class="Text1" style={{ transform: `rotate(${refreshState.rotation}deg)`, transition: "transform 1s ease" }}>
					<RefreshIcon />
				</ElIcon>
			);
		},
	});

	// 侧边栏tv按钮 总控制器
	const Tv = defineComponent({
		name: "Tv",
		setup() {
			const handleClick = () => {
				state.isOpen = !state.isOpen;
			};
			return () => <SvgIcon style={style} onClick={handleClick} name={`sports-tv_icon${state.isOpen ? "_on" : ""}`} width="23px" height="16px"></SvgIcon>;
		},
	});

	return {
		Tv,
		Live,
		Scoreboard,
		Refresh,
		toolState: state,
	};
};
