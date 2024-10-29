import { reactive, defineComponent, ref, watch, onUnmounted } from "vue";
import { useUserStore } from "/@/stores/modules/user";
import videojs from "video.js";
import SvgIcon from "/@/components/svgIcon/index.vue";
interface VideoType {
	class: string;
}

export default () => {
	const VideoSource = defineComponent({
		name: "Video",
		props: {
			class: {
				type: String,
				required: true,
			},
			source: {
				type: Object,
				required: true,
			},
		},
		setup(props) {
			const UserStore = useUserStore();
			const videoContainer = ref<HTMLElement>();
			const iframeLoaded = ref(false);
			const myPlayer = ref();
			const videoSrc = ref("");

			const initVideo = async (info: { [x: string]: any }) => {
				const lang = UserStore.getLang;
				const { streamingUrlH5, streamingUrlCN, streamingUrlNonCN } = info;

				if (videoSrc.value) {
					videoSrc.value = "";
					iframeLoaded.value = false;
				}

				if (streamingUrlH5) {
					videoSrc.value = streamingUrlH5;
				} else {
					const streamingUrl = lang === "zh-CN" ? streamingUrlCN : streamingUrlNonCN;

					// 清除旧的视频播放器
					if (myPlayer.value) {
						myPlayer.value.dispose();
					}

					// 创建新的video元素
					const videoElement = document.createElement("video");
					videoElement.className = props.class;
					if (videoContainer.value) {
						videoContainer.value.innerHTML = "";
						videoContainer.value.appendChild(videoElement);
					}

					// 初始化新的视频播放器
					myPlayer.value = videojs(videoElement, {
						controls: false,
						autoplay: true,
						preload: "auto",
						sources: [
							{
								src: streamingUrl,
								type: "application/x-mpegURL",
							},
						],
					});
				}
			};

			const clearVideo = () => {
				iframeLoaded.value = false;
				videoSrc.value = "";
				if (myPlayer.value) {
					myPlayer.value.dispose();
					myPlayer.value = null;
				}
			};

			const onIframeLoad = () => {
				if (videoSrc.value) {
					iframeLoaded.value = true;
				}
			};

			watch(
				() => props.source,
				(source) => {
					if (Object.keys(source).length) {
						initVideo(source);
					} else {
						clearVideo();
					}
				}
			);

			onUnmounted(() => clearVideo());

			return () => (
				<>
					<div ref={videoContainer} className={props.class} />
					{!Object.keys(props.source).length ? <SvgIcon class="request-failed-svg" name="sports-request_failed" /> : <></>}

					{iframeLoaded.value ? (
						<div class="live">
							<iframe
								className="eventVideo"
								onLoad={onIframeLoad}
								src={videoSrc}
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen
							/>
						</div>
					) : (
						<></>
					)}
				</>
			);
		},
	});

	return {
		VideoSource,
	};
};
