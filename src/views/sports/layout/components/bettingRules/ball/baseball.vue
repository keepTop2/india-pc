<!--棒球-->
<template>
	<div class="title">{{ $t("bettingRules.baseball.title") }}</div>

	<template v-for="(_, index) in Array.from({ length: 19 })" :key="index">
		<div class="title" v-text="$t(`bettingRules.baseball.section.${index}.title`)"></div>
		<p v-if="![1].includes(index)" class="desc" v-text="$t(`bettingRules.baseball.section.${index}.desc`)"></p>

		<ol v-if="![1].includes(index)" class="desc">
			<li v-for="(_, listIndex) in Array.from({ length: getLength(index) })" :key="listIndex">
				{{ $t(`bettingRules.baseball.section.${index}.list.${listIndex}`) }}
				<p v-if="listIndex === 11" v-for="(_, childIndex) in Array.from({ length: 5 })">
					{{ $t(`bettingRules.baseball.section.${index}.list.${listIndex}_${childIndex}`) }}
				</p>
			</li>
		</ol>
	</template>
</template>

<script setup lang="ts">
const getLength = (idx: number): number => {
	switch (idx) {
		case 0: {
			return 13;
		}

		case 2:
		case 3:
		case 4:
		case 7:
		case 8:
		case 10:
		case 12:
		case 13:
		case 14:
		case 15: {
			return 2;
		}

		case 6: {
			return 7;
		}

		case 9:
		case 11:
		case 18: {
			return 3;
		}

		default:
			return 1;
	}
};
</script>
