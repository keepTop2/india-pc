import { reactive, defineComponent } from "vue";
import { ElDialog } from "element-plus";
import SvgIcon from "/@/components/svgIcon/index.vue";
import "./index.scss";

export default () => {
	const state = reactive({
		open: false,
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
		setup() {
			return () => {
				<ElDialog className="sport-search-dialog" v-model={state.open}>
					{{
						header: ({ close, titleId, titleClass }: { close: () => void; titleId: string; titleClass: string }) => (
							<div class="my-header">
								{/* 标题 */}
								<h4 id={titleId} className={titleClass}>
									搜索
								</h4>
								{/* 关闭按钮 */}
								<div className="close">
									<span> </span>
								</div>
							</div>
						),
					}}
				</ElDialog>;
			};
		},
	});
};
