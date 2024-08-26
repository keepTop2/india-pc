<!--网球-->
<template>
	<div class="title">{{ $t("bettingRules.tennis.title") }}</div>

	<template v-for="(_, index) in Array.from({ length: 10 })" :key="index">
		<div class="title" v-text="$t(`bettingRules.tennis.section.${index}.title`)"></div>
		<!-- <p v-if="![1].includes(index)" class="desc" v-text="$t(`bettingRules.tennis.section.${index}.desc`)"></p> -->

		<ol v-if="![1].includes(index)" class="desc">
			<li v-for="(_, listIndex) in Array.from({ length: getLength(index) })" :key="listIndex">
				{{ $t(`bettingRules.tennis.section.${index}.list.${listIndex}`) }}
				<p v-if="listIndex === 9" v-for="(_, childIndex) in Array.from({ length: 2 })">
					{{ $t(`bettingRules.tennis.section.${index}.list.${listIndex}_${childIndex}`) }}
				</p>
			</li>
		</ol>
	</template>
</template>

<script setup lang="ts">
const getLength = (idx: number): number => {
	switch (idx) {
		case 0: {
			return 10;
		}

		case 3:
		case 6: {
			return 2;
		}

		case 5:
		case 7:
		case 9: {
			return 3;
		}

		case 4: {
			return 4;
		}

		default:
			return 1;
	}
};
</script>
