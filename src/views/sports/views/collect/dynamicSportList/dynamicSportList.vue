<template>
	<div v-if="teamData?.length">
		<SelectCard :teamName="teamName" :teamData="teamData" @toggle="toggleExpand"></SelectCard>
		<div v-show="isExpanded" class="box" v-for="(data, index) in teamData" :key="index">
			<component :is="listComponent" :teamData="data" :dataIndex="index" @oddsChange="oddsChange" :isExpand="isExpand"></component>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import SelectCard from "./selectCard.vue";

const emit = defineEmits(["oddsChange"]);

const props = defineProps({
	teamName: String,
	teamData: Array,
	listComponent: Object,
	isExpand: Boolean,
});

const isExpanded = ref(true);

const toggleExpand = () => {
	isExpanded.value = !isExpanded.value;
};

const oddsChange = (event: any) => {
	emit("oddsChange", event);
};
</script>
