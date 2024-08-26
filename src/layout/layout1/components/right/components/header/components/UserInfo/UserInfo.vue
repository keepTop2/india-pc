<template>
	<div class="userInfo_box">
		<div class="vipInfo">
			<img :src="VipBg" alt="vip" />
			<span class="color_Text_a vip_num">0</span>
		</div>
		<div class="userInfo bg_Bg1 p_20">
			<div class="userIcon">
				<span><img class="size_80" :src="Icon" alt="" /></span>
				<p class="color_Text_s fs_16 fw_500 username">佩奇的一家</p>
				<p class="fs_14 fw_400 color_Text1 mb_20">ID：7987900098</p>
				<span class="edit bg_Bg3">
					<SvgIcon iconName="edit" @click="editVisible = true" width="16" height="16" />
				</span>
			</div>
			<div class="card bg_Bg3">
				<div class="title flex_space-between">
					<span class="flex_space-between color_Text_s fs_16"><img width="18" height="18" :src="xunzhang" alt="" /> {{ $t("home.勋章") }} 0</span>
					<!-- <span class="color_Theme flex_space-between more">更多 <SvgIcon iconName="arrowRight" /></span> -->
				</div>
				<div class="content flex_space-between" style="gap: 18px">
					<img class="xunzhang" v-for="i in 7" :key="i" :src="xunzhang1" alt="" />
				</div>
			</div>
			<Statistic @close="emit('close')" />
			<GameTop3 />
			<BettingMatch />
			<!-- <Medals v-model="showMedals" /> -->
			<!-- <userEditModal v-model:visible="editVisible" title="编辑" @close="editVisible = false" /> -->
		</div>
	</div>
</template>
<script setup lang="ts">
import { reactive, ref, defineEmits } from "vue";
import { setLang } from "/@/i18n/index";
import { useI18n } from "vue-i18n";
import { tabList, language, currencies } from "../mock";
import Tabs from "/@/components/Tabs/Tabs.vue";
import Table from "../Table/Table.vue";
import Medals from "./medals/medals.vue";

import Icon from "/@/assets/zh/default/UserInfo/icon.png";
import xunzhang from "/@/assets/zh/default/UserInfo/xunzhang.png";
import xunzhang1 from "/@/assets/zh/default/UserInfo/xunzhang1.png";
import CurrenciesList from "../CurrenciesList/CurrenciesList.vue";
import userEditModal from "/@/views/userDropDown/components/UserEditModal.vue";
import BettingMatch from "./BettingMatch/BettingMatch.vue";
import GameTop3 from "./gameTop3/gameTop3.vue";
import Statistic from "./statistic/statistic.vue";
import VipBg from "/@/assets/zh/default/UserInfo/vip.png";
const editVisible = ref(false);

const emit = defineEmits(["close"]);
const activeKey = ref(1);
const showMedals = ref(true);

const props = defineProps({
	visible: {
		type: Boolean,
	},
});
</script>
<style lang="scss">
@import "./style.scss";
</style>
