<!--
 * @Author: Relax
 * @Description: 体育-足球-搜索
-->
<template>
	<div>
		<div class="box">
			<div class="search">
				<SearchInput v-model="searchValue" type="text" :placeholder="`搜索`">
					<template v-slot:left>
						<SvgIcon style="margin-right: 5px" iconName="search" :size="22" />
					</template>
					<template v-slot:right>
						<SvgIcon @click="eliminate" class="close_svg" iconName="close" :size="18" />
					</template>
				</SearchInput>
			</div>
			<el-button class="close_button" round @click="onClose"><span>关闭</span></el-button>
		</div>
		<div class="box_two" v-if="searchHistory.length > 0 && searchValue === ''">
			<div>
				<div class="history">
					<i></i>
					<span>搜索历史</span>
				</div>
				<div class="historical_data">
					<div class="historical_data_one" v-for="(historyItem, index) in searchHistory" :key="index">
						<div @click="reSearch(historyItem)">
							<span>{{ historyItem }}</span>
						</div>
						<SvgIcon @click="deleteHistory(index)" class="close_svg" iconName="trashcan_icon" :size="18" />
					</div>
				</div>
			</div>
		</div>
		<div class="box_two" v-else>
			<div v-if="leaguesList.length">
				<div class="history">
					<i></i>
					<span>找到的比赛: {{ leaguesList.length }}</span>
				</div>
				<div class="historical_data">
					<template v-for="(item, index) in leaguesList" :key="index">
						<MarketCard :cardData="item" @onClick="handleSubmit"></MarketCard>
					</template>
				</div>
			</div>
			<div class="nonedata" v-else>
				<NoneData></NoneData>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";

import { debounce } from "lodash-es";

// import FromInput from '/@/components/Input/fromInput.vue';
import { MarketCard, SearchInput } from "./components/index";
import sportsApi from "/@/api/menu/sports/sports";
import { useSportLeagueSeachStore } from "/@/stores/modules/sports/sportLeagueSeach";
import { useRouter, useRoute } from "vue-router";
const SportLeagueSeachStore = useSportLeagueSeachStore();
const router = useRouter();
const route = useRoute();
const searchValue = ref("");

/**
 * @description 获取联赛列表
 */
const getLeagues = async () => {
	// const filterLeagueId = (activeLeagues.value.length > 0 && ` and leagueid in (${activeLeagues.value})`) || "";
	const res = await sportsApi.GetLeagues({ query: `$filter=contains(leaguename,'${searchValue.value}') and sporttype eq ${route.query.sportType}` }).catch((err) => err);
	//获取联赛数据
	if (res.data) {
		// 使用Map来去重，基于leagueId
		const uniqueLeaguesMap = new Map();
		res.data.leagues.forEach((item) => {
			uniqueLeaguesMap.set(item.leagueId, item);
		});
		// 从Map中提取去重后的值，转换回数组
		leaguesList.value = Array.from(uniqueLeaguesMap.values());
	}
};

const activeLeagues = ref<any>(SportLeagueSeachStore.getLeagueSelect);
interface League {
	leagueId: number | never;
	leagueName: string;
}
const leaguesList = ref<League[]>([]);

// 搜索历史记录
const searchHistory = ref<string[]>([]);

// 在页面加载时从 LocalStorage 中获取搜索历史
onMounted(() => {
	const storedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
	searchHistory.value = storedHistory;
	/** 进入移除点击记录 */
	SportLeagueSeachStore.clearLeagueSelect();
	//获取联赛数据
	getLeagues();
});

// 监听搜索值的变化
watch(
	() => searchValue.value,
	() => {
		searchLeagues();
	}
);

/**
 * @description 添加防抖函数
 */
const searchLeagues = debounce(getLeagues, 300);

/**
 * @description 保存联赛数据到 pinia 中
 */

const handleSubmit = (val: any) => {
	// 将选中的数据添加到搜索历史
	if (val.leagueName && !searchHistory.value.includes(val.leagueName)) {
		searchHistory.value.push(val.leagueName);
		// 保持历史记录最多十条
		if (searchHistory.value.length > 10) {
			searchHistory.value.shift();
		}
		// 保存到 LocalStorage
		localStorage.setItem("searchHistory", JSON.stringify(searchHistory.value));
	}
	// console.info("保存联赛数据到 pinia 中", val);
	SportLeagueSeachStore.setSportsLeagueSelect([val?.leagueId]);
	onClickLeft();
	// if (activeLeagues.value.length > 0) {
	//   SportLeagueSeachStore.setSportsLeagueSelect(activeLeagues.value);
	//   onClickLeft();
	// }
};

// 回退至上一个路由
const onClickLeft = () => {
	router.go(-1);
};

/**
 * @description 清理数据
 */
const eliminate = () => {
	searchValue.value = "";
};

/**
 * @description 点击关闭 返回上一页
 */
const onClose = () => {
	searchValue.value = "";
	router.go(-1);
};

// 重新搜索历史记录
const reSearch = (historyItem: string) => {
	searchValue.value = historyItem;
	searchLeagues();
};

// 删除历史记录
const deleteHistory = (index: number) => {
	searchHistory.value.splice(index, 1);
	// 保存更新后的历史记录到 LocalStorage
	localStorage.setItem("searchHistory", JSON.stringify(searchHistory.value));
	if (searchHistory.value.length > 10) {
		searchHistory.value.shift();
	}
};
</script>

<style scoped lang="scss">
.box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 16px;

	.search {
		flex: 1;

		.from-input {
			padding: 11px 8px 11px 20px;
			border-radius: 8px;
			background: var(--Bg1-1, #24262b);
		}

		.close_svg {
			color: var(--icon);
		}
	}

	.close_button {
		margin-left: 16px;
		width: 78px;
		height: 32px;
		flex-shrink: 0;
		border-radius: 16px;
		background: var(--Bg3-3, #2e3035);

		border: 1px solid var(--Text2_1);

		span {
			color: var(--Text1-1, #98a7b5);
			text-align: center;
			font-family: "PingFang SC";
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			text-transform: uppercase;
		}
	}
}

.box_two {
	margin: 16px 0;

	.history {
		padding: 8px 24px;
		display: flex;
		align-items: center;

		i {
			display: block;
			width: 4px;
			height: 24px;
			border-radius: 6px;
			background: var(--Theme-P, #3bc116);
		}

		span {
			margin-left: 10px;
			color: var(--text-s, #fff);
			font-family: "PingFang SC";
			font-size: 16px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}
	}

	.historical_data {
		.historical_data_one {
			padding: 10px 0;
			margin: 0 24px;
			border-bottom: 1px solid var(--Line-, #373a40);
			display: flex;
			align-items: center;
			justify-content: space-between;

			span {
				color: var(--text-s, #fff);
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}

			.close_svg {
				color: var(--icon);
			}
		}
	}
}

.nonedata {
	margin-top: 340px;
}
</style>
