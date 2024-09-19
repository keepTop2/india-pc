<!--排球-->
<template>
	<div class="title">{{ $t("bettingRules.volleyball.title") }}</div>

	<template v-for="(_, index) in Array.from({ length: 9 })" :key="index">
		<div class="title" v-text="$t(`bettingRules.volleyball.section.${index}.title`)"></div>
		<!-- <p v-if="![1].includes(index)" class="desc" v-text="$t(`bettingRules.volleyball.section.${index}.desc`)"></p> -->

		<ol v-if="![1].includes(index)" class="desc">
			<li v-for="(_, listIndex) in Array.from({ length: getLength(index) })" :key="listIndex">
				{{ $t(`bettingRules.volleyball.section.${index}.list.${listIndex}`) }}
				<p v-if="listIndex === 9" v-for="(_, childIndex) in Array.from({ length: 2 })">
					{{ $t(`bettingRules.volleyball.section.${index}.list.${listIndex}_${childIndex}`) }}
				</p>
			</li>
		</ol>
	</template>
</template>

<script setup lang="ts">
const getLength = (idx: number): number => {
	switch (idx) {
		case 0: {
			return 4;
		}

		case 4:
		case 6:
		case 7: {
			return 2;
		}

		// case 5:
		// case 7:
		// case 9: {
		// 	return 3;
		// }

		default:
			return 1;
	}
};
</script>
