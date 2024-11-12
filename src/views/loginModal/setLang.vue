<!-- src/components/RegisterForm.vue -->
<template>
	<div class="loginWrapper">
		<div class="title">语言切换</div>
		<div class="search-component" ref="resultList">
			<!-- 搜索框 -->
			<div class="search_icon">
				<svg-icon name="search" size="18px"></svg-icon>
			</div>
			<input type="text" v-model="searchQuery" placeholder="搜索" class="search-input" />
		</div>
		<div class="langList">
			<div v-for="item in userStore.getLangList" class="flex_space-between langItem" :class="userStore.getLang == item.code ? 'active' : ''" @click="setLang(item.code)">
				<span>
					<img v-lazy-load="item.iconFileUrl" alt="" />
					{{ item.name }}</span
				>
				<span><svg-icon :name="userStore.getLang == item.code ? 'common-cricle_theme' : 'common-cricle'" size="16px"> </svg-icon> </span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from "/@/stores/modules/user";
import { LangEnum } from "/@/enum/appConfigEnum";
import { computed, ref } from "vue";
const userStore = useUserStore();
const searchQuery = ref("");
const setLang = (lang: LangEnum) => {
	userStore.setLangs(lang);
	location.reload();
};
const filteredResults = computed(() => {
	if (!searchQuery.value) {
		return []; // 如果搜索框为空，则显示全部
	}
	return userStore.getLangList.items.filter((item: any) => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});
</script>

<style lang="scss" scoped>
.loginWrapper {
	width: 412px;
	height: 720px;
	border-radius: 12px;
	background: var(--Bg);
	.langList {
		overflow-y: auto;
		height: calc(100% - 130px);
	}
	.title {
		text-align: center;
		font-size: 20px;
		color: var(--Text-s);
		padding: 24px;
	}
	.search-component {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		position: relative;
		margin: 0 24px;
		.search-input {
			width: 100%;
			height: 42px;
			background: var(--Bg-2);
			border-radius: 6px;
			font-size: 14px;
			border: 1px solid var(--Line-2);
			padding-left: 54px;
			color: var(--Text-s);
		}

		.search_icon {
			position: absolute;
			left: 12px;
			top: 50%;
			transform: translateY(-50%);
			margin-right: 24px;
			padding-right: 12px;
			border-right: 1px solid var(--Line-2);
			display: flex;
			align-items: center;
		}
	}
	.langItem {
		height: 40px;
		line-height: 40px;
		color: var(--Text-1);
		cursor: pointer;
		margin: 0 24px;
		padding: 0 12px;
		img {
			width: 14px;
			height: 14px;
			border-radius: 50%;
			margin-right: 8px;
		}
	}
	.langItem:hover {
		border-radius: 4px;
		background: var(--Bg-3);
	}
	.active.langItem {
		color: var(--Text-s);
		svg {
			color: var(--Theme);
		}
	}
}
</style>
