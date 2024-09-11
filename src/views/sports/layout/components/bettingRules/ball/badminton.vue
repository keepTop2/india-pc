<!--羽毛球-->
<template>
	<div class="title">{{ $t("bettingRules.badminton.title") }}</div>

	<template v-for="(_, index) in Array.from({ length: 9 })" :key="index">
		<div class="title" v-text="$t(`bettingRules.badminton.section.${index}.title`)"></div>
		<p v-if="![1].includes(index)" class="desc" v-text="$t(`bettingRules.badminton.section.${index}.desc`)"></p>

		<ol v-if="![1].includes(index)" class="desc">
			<li v-for="(_, listIndex) in Array.from({ length: index === 0 ? 6 : [4, 6, 7].includes(index) ? 2 : 1 })" :key="listIndex">
				{{ $t(`bettingRules.badminton.section.${index}.list.${listIndex}`) }}
			</li>
		</ol>
	</template>
</template>
