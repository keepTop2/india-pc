<!--独赢及规则-->
<template>
	<div class="title">{{ $t("bettingRules.winAndRules.title") }}</div>

	<template v-for="(_, index) in Array.from({ length: 2 })" :key="index">
		<div class="title" v-text="$t(`bettingRules.winAndRules.section.${index}.title`)"></div>
		<p class="desc" v-text="$t(`bettingRules.winAndRules.section.${index}.desc`)"></p>

		<ul v-if="[0].includes(index)" class="desc">
			<li v-for="(_, listIndex) in Array.from({ length: 7 })" :key="listIndex">
				{{ $t(`bettingRules.winAndRules.section.${index}.list.${listIndex}`) }}
				<p v-if="listIndex === 6" v-for="(_, childIndex) in Array.from({ length: 2 })">
					{{ $t(`bettingRules.winAndRules.section.${index}.list.${listIndex}_${childIndex}`) }}
				</p>
			</li>
		</ul>

		<ol v-if="[1].includes(index)" class="desc">
			<li v-for="(_, listIndex) in Array.from({ length: 5 })" :key="listIndex">
				{{ $t(`bettingRules.winAndRules.section.${index}.list.${listIndex}`) }}
			</li>
		</ol>
	</template>
</template>
