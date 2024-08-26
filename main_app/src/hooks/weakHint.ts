import { ElMessage, MessageHandler } from "element-plus";

let openCenter: MessageHandler;

export default function () {
	/**
	 * @param message 弹出的内容
	 * @param addendTo 插入的位置 默认shopCart-position
	 * @param options 配置
	 */
	const weakOpen = (message: string, addendTo: string = ".shopCart-position", options?: object) => {
		/*如果没有传递options则给个默认配置*/
		if (!options)
			options = {
				message: message,
				appendTo: addendTo,
				customClass: "weak-hint",
			};
		openCenter = ElMessage(options);
	};

	/*关闭弹框*/
	const weakClose = () => {
		openCenter?.close();
	};

	return { weakOpen, weakClose };
}
