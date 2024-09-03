<template>
	<div v-if="teamData?.length">
		<SelectCard :teamName="teamName" :teamData="teamData"></SelectCard>
		<div class="box" v-for="(data, index) in teamData" :key="index">
			<component :is="listComponent" :teamData="data" :dataIndex="index" @oddsChange="oddsChange" :isExpand="isExpand"></component>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import SelectCard from "./selectCard.vue";

const emit = defineEmits(["oddsChange"]);

const props = defineProps({
	teamName: String,
	teamData: Array,
	listComponent: Object,
	isExpand: Boolean,
});

const oddsChange = (event: any) => {
	emit("oddsChange", event);
};
</script>
