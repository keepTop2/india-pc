<template lang="">
	<div class="card bg_Bg3">
		<div class="title">
			<span class="flex_space-between color_Text_s fs_16">{{ $t('home.投注比赛') }}</span>
		</div>
		<div class="content" style="gap: 18px">
			<el-table class="user_bet_table" :data="list" style="width: 100%" border>
				<el-table-column prop="name" :label="$t('home.投注时间')">
					<template #default="scope">
						<span class="color_Text1">{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="player" :label="$t('home.投注金额')">
					<template #default="scope">
						<span class="color_Text1">{{ scope.row.player }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="BetAmount" :label="$t('home.奖金')">
					<template #default="scope">
						<span class="color_Text1">{{ scope.row.BetAmount }}</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const list = ref([
	{
		name: '麻将',
		player: 'Tom',
		BetAmount: '1.00',
		BetType: 'xx',
		Multiplier: '0.00x',
		Profit: '0.000099',
	},
	{
		name: '麻将',
		player: 'Tom',
		BetAmount: '1.00',
		BetType: 'xx',
		Multiplier: '0.00x',
		Profit: '0.000099',
	},
]);
</script>
<style lang=""></style>
