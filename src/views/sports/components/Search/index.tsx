import { reactive, defineComponent, watch } from "vue";
import { ElDialog } from "element-plus";
import useHotRecommend from "./HotRecommend";
import useSearchContent from "./SearchContent";
import SvgIcon from "/@/components/svgIcon/index.vue";
import { useRoute } from "vue-router";

import "./style/index.scss";

export default () => {
	const state = reactive({
		open: false,
		loading: false,
	});

	/**
	 * @description 打开搜索弹窗
	 */
	const openSearch = () => {
		state.open = true;
	};

	/**
	 * @description 关闭搜索弹窗
	 */
	const closeSearch = () => {
		state.open = false;
	};

	const Search = defineComponent({
		name: "Search",
		setup() {
			const { HotRecommend, hotState } = useHotRecommend();
			const { SearchContent, SInput, searchState } = useSearchContent();

			watch([() => hotState.loading, () => searchState.loading], ([hotLoading, searchLoading]) => {
				state.loading = hotLoading?.valueOf() || searchLoading?.valueOf();
			});

			return () => (
				<ElDialog close-on-click-modal={false} destroy-on-close align-center className="sport-search-dialog" v-model={state.open} width={1276} show-close={false}>
					{{
						// 自定义头部
						header: ({ close, titleId, titleClass }: { close: () => void; titleId: string; titleClass: string }) => (
							<div class="search-header">
								{/* 标题 */}
								<h4 id={titleId} className={titleClass}>
									搜索
								</h4>
								{/* 关闭按钮 */}
								<div classname="common-close">
									<SvgIcon name="sports-dlzc_gb" width={30} height={30} onClick={close} />
								</div>
							</div>
						),
						default: () => (
							<div className="search-body">
								{/* 搜索输入框 */}
								<SInput />
								<div className="content" v-ok-loading={state.loading}>
									{/* 搜索内容 */}
									<SearchContent />
									{/* 热门推荐 */}
									<HotRecommend />
								</div>
							</div>
						),
					}}
				</ElDialog>
			);
		},
	});

	return {
		Search,
		openSearch,
		closeSearch,
	};
};
