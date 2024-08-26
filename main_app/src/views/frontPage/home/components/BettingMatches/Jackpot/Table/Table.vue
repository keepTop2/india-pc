<template>
	<div class="jackpot_table">
		<el-table :data="data" style="width: 100%">
			<el-table-column prop="name" :label="$t(`home['排名']`)">
				<template #default="scope">
					<span class="home_paihang" v-if="scope.$index + 1 == 1">
						<SvgIcon width="30" height="36" iconName="home_jinpai" />
					</span>
					<span class="home_paihang" v-if="scope.$index + 1 == 2">
						<SvgIcon width="30" height="36" iconName="home_yinpai" />
					</span>
					<span class="home_paihang" v-if="scope.$index + 1 == 3">
						<SvgIcon width="30" height="36" iconName="home_tongpai" />
					</span>
					<span class="home_paihang color_Text1" v-if="scope.$index + 1 > 3">{{ scope.$index + 1 }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="player" :label="$t(`home['玩家']`)">
				<template #default="scope">
					<span class="color_Text1">{{ scope.row.player }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="BetAmount" :label="$t(`home['赌注']`)">
				<template #default="scope">
					<span class="Theme">{{ scope.row.BetAmount }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="Multiplier" :label="$t(`home['奖金']`)">
				<template #default="scope">
					<span class="Theme">{{ scope.row.Multiplier }}</span>
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
