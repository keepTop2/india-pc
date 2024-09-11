<!--提前结算规则-->
<template>
	<div class="title">{{ $t("bettingRules.advanceSettlementRules.title") }}</div>

	<template v-for="(_, index) in Array.from({ length: 2 })" :key="index">
		<div class="title" v-text="$t(`bettingRules.advanceSettlementRules.section.${index}.title`)"></div>
		<p class="desc" v-text="$t(`bettingRules.advanceSettlementRules.section.${index}.desc`)"></p>

		<ol class="desc">
			<li v-for="(_, listIndex) in Array.from({ length: index === 0 ? 7 : 3 })" :key="listIndex">
				{{ $t(`bettingRules.advanceSettlementRules.section.${index}.list.${listIndex}`) }}

				<p v-if="[3, 5, 6].includes(listIndex)" v-for="(_, childIndex) in Array.from({ length: listIndex === 3 ? 3 : listIndex === 5 ? 2 : 1 })">
					{{ $t(`bettingRules.advanceSettlementRules.section.${index}.list.${listIndex}_${childIndex}`) }}
				</p>
			</li>
		</ol>
	</template>
</template>
