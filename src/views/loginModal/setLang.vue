<!-- src/components/RegisterForm.vue -->
<template>
	<div class="loginWrapper">
		<div class="title">{{ $t(`login['语言切换']`) }}</div>

		<div class="langList">
			<div v-for="item in userStore.getLangList" class="flex_space-between langItem" :class="userStore.getLang == item.code ? 'active' : ''" @click="setLang(item.code)">
				<span class="flex-center" style="gap: 4px">
					<img v-lazy-load="item.iconFileUrl" alt="" />
					{{ item.name }}</span
				>
				<svg-icon :name="userStore.getLang == item.code ? 'common-cricle_theme' : 'common-cricle'" size="16px"> </svg-icon>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from "/@/stores/modules/user";
import { LangEnum } from "/@/enum/appConfigEnum";
const userStore = useUserStore();
const setLang = (lang: LangEnum) => {
	userStore.setLangs(lang);
	location.reload();
};
</script>

<style lang="scss" scoped>
.loginWrapper {
	width: 412px;
	height: 547px;
	border-radius: 12px;
	background: var(--Bg-1);
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
		font-size: 14px;
		img {
			width: 14px;
			height: 14px;
			border-radius: 50%;
			margin-right: 4px;
		}
	}

	.langItem:hover {
		border-radius: 4px;
		background: var(--Bg-4);
	}
	.langItem.active {
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
