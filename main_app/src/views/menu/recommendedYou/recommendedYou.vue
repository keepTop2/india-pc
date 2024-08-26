<!--
 * @Author: WangMingxin
 * @Description: 为你推荐
-->
<template>
	<div class="base-body">
		<div class="base-container">
			<div class="container-main">
				<GameList :pageItem="pageItem"></GameList>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { GameList } from './components';
import { i18n } from '/@/i18n/index';
const $: any = i18n.global;
const pageName = $.t('gameList["为你推荐"]');
const pageItem = ref({
	id: '',
	iconCode: 'xsyx_mr_icon',
	name: pageName,
	sort: 0,
	modelCode: 'GAME',
	active: true,
});
</script>

<style lang="scss" scoped>
.base-body {
	display: block;
	position: relative;
	flex: 1;
	flex-shrink: 0;
	width: 100%;
}
.base-container {
	display: flex;
	justify-content: center;
	.container-main {
		width: 1200px;
		background: none;

		.hall-plan {
			padding-top: 34px;
		}
	}
}
</style>
