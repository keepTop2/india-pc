import { reactive, defineComponent, computed } from "vue";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import { Refresh as RefreshIcon } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import { debounce } from "lodash-es";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useUserStore } from "/@/stores/modules/user";
import SportsApi from "/@/api/sports/sports";
import PubSub from "/@/pubSub/pubSub";
import { AxiosResponse } from "axios";
import { i18n } from "/@/i18n/index";
import showToast from "/@/hooks/useToast";
import { useModalStore } from "/@/stores/modules/modalStore";
const $: any = i18n.global;
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
	/** 收藏按钮 */
	Collection: ReturnType<typeof defineComponent>;
	toolState: {
		isOpen: Boolean;
		[x: string]: any;
	};
}

const style = { cursor: "pointer" };

export default (eventsInfo: any): HeaderTools => {
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
		props: {
			isCurrent: { type: Boolean, default: true },
		},
		setup(props) {
			const { toggleEventScoreboard } = useToolsHooks();
			const SidebarStore = useSidebarStore();
			const handleClick = () => {
				toggleEventScoreboard(eventsInfo.value);
				state.isOpen = true;
				SidebarStore.getSidebarStatus("scoreboard");
			};
			return () => (
				<SvgIcon
					style={style}
					onClick={handleClick}
					name={props.isCurrent ? (SidebarStore.sidebarStatus === "scoreboard" ? "sports-score_icon_active" : "sports-score_icon") : "sports-score_icon"}
					width="23px"
					height="16px"
				/>
			);
		},
	});

	// 直播按钮
	const Live = defineComponent({
		name: "Live",
		props: { isCurrent: { type: Boolean, default: true } },
		setup(props) {
			const { toggleEventScoreboard } = useToolsHooks();
			const SidebarStore = useSidebarStore();

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
						name={props.isCurrent ? (SidebarStore.sidebarStatus === "live" ? "sports-live_icon_active" : "sports-live_icon") : "sports-live_icon"}
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
				<ElIcon onClick={handleClick} size="18px" class="Text1" style={{ transform: `rotate(${refreshState.rotation}deg)`, transition: "transform 1s ease", ...style }}>
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

	// 收藏按钮
	const Collection = defineComponent({
		props: {
			size: { type: String, default: "16px" },
		},
		setup(props) {
			const SportAttentionStore = useSportAttentionStore();
			// 判断是否收藏
			const isAttention = computed(() => {
				return SportAttentionStore.attentionEventIdList.includes(eventsInfo.eventId);
			});

			// 处理收藏或取消收藏操作
			const handleCollection = async (action: () => Promise<AxiosResponse<any, any>>, successMessage: string, errorMessage: string) => {
				try {
					await action();
					showToast(successMessage);
					// ElMessage({ type: "success", message: successMessage });
					// 关注触发事件
					PubSub.publish(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, {});
				} catch (error) {
					console.error(error);
					showToast(errorMessage);
					// ElMessage({ type: "error", message: errorMessage });
				}
			};

			// 点击事件
			const handleClick = () => {
				if (!useUserStore().getLogin) {
					useModalStore().openModal("LoginModal");
					return;
				}
				if (isAttention.value) {
					handleCollection(() => SportsApi.unFollow({ thirdId: [eventsInfo.eventId] }), "取消收藏成功！", "取消收藏失败！");
				} else {
					handleCollection(() => SportsApi.saveFollow({ thirdId: eventsInfo.eventId, type: 2 }), "收藏成功！", "收藏失败！");
				}
			};

			return () => <SvgIcon size={props.size} style={{ cursor: "pointer" }} onClick={handleClick} name={isAttention.value ? "sports-already_collected" : "sports-collection"} />;
		},
	});

	return {
		Tv,
		Live,
		Scoreboard,
		Refresh,
		Collection,
		toolState: state,
	};
};
