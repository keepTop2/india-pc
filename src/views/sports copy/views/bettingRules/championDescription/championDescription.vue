<!--冠军-->
<template>
	<div class="title">{{ $t("bettingRules.championDescription.title") }}</div>

	<template v-for="(_, index) in Array.from({ length: 2 })" :key="index">
		<div class="title" v-text="$t(`bettingRules.championDescription.section.${index}.title`)"></div>
		<p class="desc" v-text="$t(`bettingRules.championDescription.section.${index}.desc`)"></p>

		<ol v-if="[0, 1].includes(index)" class="desc">
			<li v-for="(_, listIndex) in Array.from({ length: index === 0 ? 6 : 7 })" :key="listIndex">
				{{ $t(`bettingRules.championDescription.section.${index}.list.${listIndex}`) }}
				<!-- <p v-if="listIndex === 11" v-for="(_, childIndex) in Array.from({ length: 4 })">
					{{ $t(`bettingRules.championDescription.section.${index}.list.${listIndex}_${childIndex}`) }}
				</p> -->
			</li>
		</ol>
	</template>
</template>
