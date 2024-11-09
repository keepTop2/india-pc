<template>
	<div class="lottery-result">
		<div class="search">
			<el-select :teleported="false" v-model="selectValue" placeholder="排序: 按时间排序" clearable filterable @change="handleChange">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
			</el-select>
		</div>

		<div class="table">
			<el-table :data="tableData" border :row-class-name="'row-cell'" header-cell-class-name="table-header-cell" :highlight-current-row="false">
				<!-- 发行数量 -->
				<el-table-column :label="$t(`lottery['发行数量']`)" align="left" :resizable="false">
					<template #default="{ row, column, $index }">
						<div class="serial-number">{{ row.nums }}</div>
					</template>
				</el-table-column>
				<!-- 中奖号码 -->
				<el-table-column :label="$t(`lottery['中奖号码']`)" align="right" :resizable="false">
					<template #default="{ row, column, $index }">
						<div class="balls">
							<Ball size="30px" :type="3" :ball-number="item" v-for="(item, index) in row.balls" :key="index" />
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<Pagination v-model:current-page="pagination.pageNumber" :pageSize="pagination.pageSize" :total="pagination.total" @sizeChange="sizeChange" />
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import useBall from "/@/views/lottery/components/Tools/Ball/Index";
// 分页组件
import { Pagination } from "/@/components/Pagination";
const { Ball } = useBall();
const options = [
	{
		label: "排序: 抽奖时间升序",
		value: 1,
	},
	{
		label: "排序: 抽奖时间降序",
		value: 2,
	},
];
const selectValue = ref(1);
const tableData = ref([
	{
		id: 1,
		nums: "20241003-097",
		balls: [1, 2, 3, 4, 5],
	},
	{
		id: 2,
		nums: "20241003-097",
		balls: [6, 7, 8, 9, 10],
	},
]);
const pagination = reactive({
	pageNumber: 1,
	pageSize: 10,
	total: tableData.value.length,
});
const handleChange = () => {};
const sizeChange = () => {};
</script>
