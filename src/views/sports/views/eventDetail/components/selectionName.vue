<template>
	<span class="omit" v-if="!isOmit">{{ formatKeyName }}</span>
	<span class="noOmit" v-else>{{ formatKeyName }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const props = defineProps({
	name: String,
	betType: Number,
});

const primaryBetTypes = [
	1, 7, 17, 219, 609, 637, 701, 704, 708, 153, 155, 1303, 1308, 1316, 3904, 9002, 9008, 9012, 9018, 9024, 9028, 9034, 9040, 9046, 9052, 9059, 9076, 9077, 9091, 9093, 9116,
];
const secondaryBetTypes = [28, 124, 125, 453, 477, 478, 646];

const isOmit = computed(() => {
	return !primaryBetTypes.includes(props?.betType) && !secondaryBetTypes.includes(props?.betType);
});

const formatKeyName = computed(() => props.name);

onMounted(() => {
	// console.log("Component mounted");
});
</script>

<style scoped lang="scss">
.content {
}
</style>
