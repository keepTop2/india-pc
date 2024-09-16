export function useMatchEvents() {
	// 搜索赛事的方法
	const searchMatches = (searchQuery: string) => {
		console.log("searchQuery", searchQuery);
	};

	// 筛选收藏赛事的方法
	const filterFavoriteMatches = () => {};

	return {
		searchMatches,
		filterFavoriteMatches,
	};
}
