<!--冰球-->
<template>
	<div class="title">{{ $t("bettingRules.iceHockey.title") }}</div>

	<template v-for="(_, index) in Array.from({ length: 11 })" :key="index">
		<div class="title" v-text="$t(`bettingRules.iceHockey.section.${index}.title`)"></div>
		<p v-if="![1].includes(index)" class="desc" v-text="$t(`bettingRules.iceHockey.section.${index}.desc`)"></p>

		<ol v-if="![1].includes(index)" class="desc">
			<li v-for="(_, listIndex) in Array.from({ length: getLength(index) })" :key="listIndex">
				{{ $t(`bettingRules.iceHockey.section.${index}.list.${listIndex}`) }}
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

		case 5:
		case 6:
		case 9: {
			return 2;
		}

		case 8: {
			return 3;
		}

		case 10: {
			return 4;
		}

		default:
			return 1;
	}
};
</script>
