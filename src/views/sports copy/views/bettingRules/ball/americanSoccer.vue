<!--美式足球-->
<template>
	<div class="title">{{ $t("bettingRules.americanSoccer.title") }}</div>

	<template v-for="(_, index) in Array.from({ length: 19 })" :key="index">
		<div class="title" v-text="$t(`bettingRules.americanSoccer.section.${index}.title`)"></div>
		<p v-if="![1].includes(index)" class="desc" v-text="$t(`bettingRules.americanSoccer.section.${index}.desc`)"></p>

		<ol v-if="![1].includes(index)" class="desc">
			<li v-for="(_, listIndex) in Array.from({ length: getLength(index) })" :key="listIndex">
				{{ $t(`bettingRules.americanSoccer.section.${index}.list.${listIndex}`) }}
			</li>
		</ol>
	</template>
</template>

<script setup lang="ts">
const getLength = (idx: number): number => {
	switch (idx) {
		case 0: {
			return 9;
		}

		case 3:
		case 4:
		case 5:
		case 6:
		case 8:
		case 9: {
			return 2;
		}

		case 11:
		case 16:
		case 17:
		case 18: {
			return 3;
		}

		case 10:
		case 13: {
			return 4;
		}

		default:
			return 1;
	}
};
</script>
