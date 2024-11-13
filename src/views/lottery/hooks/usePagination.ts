import { onMounted, reactive } from "vue";

// 这个 hook 要注意，不能涉及单个彩种的业务。都是所有彩种通用的逻辑才能放在这里
export function usePagination(callback = Function.prototype) {
	const pagination = reactive({ pageNumber: 1, pageSize: 10, total: 0 });

	const handleChange = (lotteryTimeSort: number) => {
		callback({ lotteryTimeSort });
		resetPageNumber();
	};

	const sizeChange = (size: number) => {
		callback({ size });
		resetPageNumber();
	};

	const pageChange = (page: number) => {
		callback({ page });
	};

	function resetPageNumber() {
		pagination.pageNumber = 1;
	}

	onMounted(callback);

	return { pagination, handleChange, sizeChange, pageChange };
}
