<template></template>

<script lang="ts" setup>
import useMatchCard from "/@/views/sports/components/MatchCard";
// 定义组件属性类型
interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 队伍数据 */
	teamData: any;
	isExpanded: boolean;
}

// 定义组件属性，使用默认值
const props = withDefaults(defineProps<teamDataType>(), {
	dataIndex: 0,
	teamData: () => ({}),
	isExpanded: true,
});
</script>

<style scoped lang="scss"></style>
