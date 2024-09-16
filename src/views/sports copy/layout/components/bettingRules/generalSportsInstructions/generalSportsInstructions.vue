<!--一般体育说明-->
<template>
	<div class="title">{{ $t("bettingRules.generalSportsInstructions.title") }}</div>

	<template v-for="(_, index) in Array.from({ length: 4 })" :key="index">
		<div class="title" v-text="$t(`bettingRules.generalSportsInstructions.section.${index}.title`)"></div>
		<p class="desc" v-text="$t(`bettingRules.generalSportsInstructions.section.${index}.desc`)"></p>

		<ol v-if="[1, 2, 3].includes(index)" class="desc">
			<li v-for="(_, listIndex) in Array.from({ length: index === 1 ? 13 : 4 })" :key="listIndex">
				{{ $t(`bettingRules.generalSportsInstructions.section.${index}.list.${listIndex}`) }}
				<p v-if="listIndex === 11" v-for="(_, childIndex) in Array.from({ length: 4 })">
					{{ $t(`bettingRules.generalSportsInstructions.section.${index}.list.${listIndex}_${childIndex}`) }}
				</p>
			</li>
		</ol>
	</template>
</template>
