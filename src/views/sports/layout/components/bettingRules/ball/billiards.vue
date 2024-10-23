<!--斯诺克-->
<template>
	<div class="title">{{ $t("bettingRules.billiards.title") }}</div>

	<template v-for="(_, index) in Array.from({ length: 24 })" :key="index">
		<div class="title" v-text="$t(`bettingRules.billiards.section.${index}.title`)"></div>
		<p v-if="![1].includes(index)" class="desc" v-text="$t(`bettingRules.billiards.section.${index}.desc`)"></p>

		<ol v-if="![1].includes(index)" class="desc">
			<li v-for="(_, listIndex) in Array.from({ length: getLength(index) })" :key="listIndex">
				{{ $t(`bettingRules.billiards.section.${index}.list.${listIndex}`) }}
			</li>
		</ol>
	</template>
</template>

<script setup lang="ts">
const getLength = (idx: number): number => {
	switch (idx) {
		case 0: {
			return 6;
		}

		case 3:
		case 7:
		case 9:
		case 15:
		case 16:
		case 22: {
			return 2;
		}

		case 12: {
			return 3;
		}

		default:
			return 1;
	}
};
</script>
