<template>
	<div class="home_table">
		<el-table :data="data" style="width: 100%">
			<el-table-column prop="name" :label="$t('home.游戏')">
				<template #default="scope">
					<span class="color_Text1">{{ scope.row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="player" :label="$t('home.玩家')">
				<template #default="scope">
					<span class="color_Text_s">{{ scope.row.player }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="BetAmount" :label="$t('home.投注金额')">
				<template #default="scope">
					<span class="color_Text_s">{{ scope.row.BetAmount }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="Multiplier" :label="$t('home.倍数')">
				<template #default="scope">
					<span class="color_Text1">{{ scope.row.Multiplier }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="Profit" :label="$t('home.盈利')">
				<template #default="scope">
					<span :class="(scope.row.Profit && 'Theme') || 'Warn'">{{ scope.row.Profit }}</span>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElTable, ElTableColumn } from 'element-plus';

const props = defineProps({
	data: {
		type: Array as () => Array<{
			name: string;
			player: string;
			BetAmount: string;
			Multiplier: string;
			Profit: string;
		}>,
		required: true,
	},
});
</script>

<style lang="scss" scoped>
@import './table.scss';
</style>
