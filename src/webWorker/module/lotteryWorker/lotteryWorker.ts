/**
 * @description 体育线程
 */
(function () {
	/**
	 * @description 接收体育主线程消息
	 * @param data
	 */
	onmessage = (data) => {
		console.log(data, "彩票子线程收到消息");
		if (data.data == "bbb") {
			start();
		}
		// postMessage("sport打算离开大家阿斯利康等哈上来看");
	};

	/**
	 * @description 启动体育线程
	 */
	const start = () => {
		console.log("启动彩票线程，”走了吗");
		postMessage("彩票子线程发个数据到主线程");
	};
})();
