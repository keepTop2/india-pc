<!--
 * @Description: 列展开的详情数据
-->

<template>
	<div class="details">

		<div class="tab">
			<el-button round v-for="(tab, index) in tabList" :class="active === index && 'active'" @click="active = index">
				{{ tab }}
			</el-button>
		</div>

		<div class="list">
			<div class="item" v-for="item in 10">
				<span>{{ $t(`matchResult['全场大小']`)}}</span>
				<span></span>
			</div>
		</div>

	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
	item: object;
}>();

/*tab菜单*/
const tabList = ["全部", "进球", "角球", "罚牌"];
/*选中的tab下角标*/
const active = ref(0);
/*赛事数据*/
const list = ref([]);
</script>

<style scoped lang="scss">
.details {
	padding: 16px;

	.tab {
		display: flex;
		gap: 16px;

		.el-button {
			margin: 0;
			width: 98px;
			height: 32px;
			@include themeify {
				background: themed("Bg1");
				border: 1px solid themed("Text2");
				color: themed("Text1");
			}
		}

		.active {
			@include themeify {
				background: themed("Theme");
				color: themed("Text_s");
				border-color: themed("Theme");
			}
		}
	}

	.list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
		margin-top: 16px;

		.item {
			height: 40px;
			border-radius: 4px;
			padding: 0 14px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			@include themeify {
				background: themed("Bg3");
			}
		}
	}
}
</style>
