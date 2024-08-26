<template>
	<div class="jackpot">
		<!-- Content for other tabs -->
		<ul class="top">
			<li>
				<div class="left">
					<img :src="computedImages.home_bsjc" class="home_bsjc" alt="" />
				</div>
				<div class="right">
					<h3 class="fs_20 color_Text_s">{{ $t("jackpot.比赛奖池") }}</h3>
					<span class="money f1 bg_Bg3">$ 125.22.444</span>
				</div>
			</li>
			<li class="ljcy" style="flex: 1">
				<div v-if="!UserStore.token">
					<div style="width: 300px">
						<SvgIcon class="home_" width="16" height="48" iconName="home_ljcy1" />
						<span class="color_Text_s"> {{ $t("jackpot.描述") }} </span>
						<SvgIcon class="home_bsjc" width="16" height="48" iconName="home_ljcy2" />
					</div>
					<button>{{ $t("jackpot.立即参与") }}</button>
				</div>
				<div v-else>
					<p class="fs_14 color_Text1 mb_12 fw_400">剩余时间</p>
					<CountDown :time="countTime" />
				</div>
			</li>
			<li>
				<div>
					{{ $t("jackpot.上届冠军") }}
					<SvgIcon @click="changeRuleVisible" style="float: right" width="22" height="22" iconName="home_yjjlgz_mr" />
				</div>
				<dl>
					<dt>
						<Avatar class="home_bsjc" :size="52" />
					</dt>
					<dd>
						<h3>玩家昵称</h3>
						<p>{{ $t("jackpot.奖金") }}：<span>$12,348,998.00</span></p>
					</dd>
				</dl>
			</li>
		</ul>
		<ul class="userInfo" v-if="UserStore.token">
			<li class="lh_80">
				<dl>
					<dt>
						<Avatar class="home_bsjc" :size="52" />
					</dt>
					<dd>
						<h3>玩家昵称</h3>
					</dd>
				</dl>
			</li>
			<li class="ljcy">
				<p class="color_Text1">{{ $t("jackpot.我的位置") }}</p>
				<span class="f1">50+</span>
			</li>
			<li>
				<p class="color_Text1">{{ $t("jackpot.赌注") }}</p>
				<span class="f1">50.00$</span>
			</li>
			<li>
				<p class="color_Text1">{{ $t("jackpot.投注") }}</p>
				<span class="color_Text_s">4,564,545.00 $ {{ $t("jackpot.达到") }} <span style="background-color: #ffa8005e; padding: 0 5px" class="f1">前十名</span> </span>
			</li>
		</ul>
		<div class="bg2 p10">
			<div class="Text2_1 p10" style="overflow: hidden">
				{{ Time }} <button class="history" @click="changeHistoryVisible">{{ $t("jackpot.历史") }}</button>
			</div>
			<div class="Line"></div>
			<Table :data="data" />
		</div>
		<Dialog v-model="ruleVisible" title="规则" width="480" :showFooter="false">
			<div class="message">
				{{ $t("jackpot.规则") }}-{{ $t("jackpot.每日投注大赛") }}<br />
				{{ Time }}<br />
				1.比赛奖池与资金密切相关，玩家下注越多，奖池越大。当前奖池将显示在竞赛页面上。<br />
				2. 10名下注最多的玩家瓜分奖池。<br />
				3.本次比赛支持投注币种：XEN, MATIC, COP, APT, UAH, IOTX, SHIB, KES, XOF, NEAR, WLD, HNT, FLOOR, IDR, RUNE, DOG, DGB, VNDC, BCD, BSV, NBX,
				BCH、SUI、CAKE、DOT、BCL、JST、BANANO、SUNOLD、BTCB、GMT、BTC、TWT、ARB、AVAX、TON、GMX、BTG、AMPL、XAF、UZS、FTM、BTTOLD、ONE、JPEG、SUSHI、
				ALGO、KRW、ATOM、BIGTIME、WBTC、SAMO、GODS、SNX、KUMA、KGS、MANA、EUR、ROSE、WAXP、SATS、ARS、VTHO、DAI、MXN、USD、SOL、ETC、ICP、BNB、USTC、
				BLUR、ETH、CELO、KLAY、TOMO、ADA、ICX、PAR、VET、MMK、DOGE、GBP、USDC.e、USDT、HBAR、RVN、DASH、NANO、TZS、WAVES、VND、XRP、WBNB、SNACK、卢布、FLOKI、EGP、TRX、NFT、AZN、日元、马币、SUNNEW、GHS、JOE、KAVA、SAND、AMP、澳元、巴西雷亚尔、BDT、AVC、UGX、泰铢、DCR、PEN、KZT、TUSD、NZD、
				USDT.e、EGLD、LTC、USDC、KAS、KHR、THETA、VSYS、ENJ、CRO、AED、CRV、CLP、NEXO、TFUEL、LUNA、NEWBTT、AAVE、EURS、NGN、UNI、MDL、NOK、MAGIC、
				CAD、XLM、PHP、LINK、YFI、QTUM、XTZ、OP、KSM、ELON、GM、INR、TAMA、EOS、FIL、GST、WETH、BIT、AXE、GALA、BAT、APE、YGG、HEX、PEOPLE、 AXS、ZIL、XMR、WCK、PKR<br />
				4.您可以使用以上任意币种下注，所有币种均会按照当前汇率兑换为USDT。<br />
				5.所有奖品均以BCD形式发送。<br />
				6.奖品将在比赛结束时在通知页面发送。<br />
				7. BC.GAME 保留在比赛任何阶段排除违反我们规则的玩家的权利。<br />
				8. BC.GAME保留自行决定更改任何规则和条件的权利，恕不另行通知。<br />
				🌟🌟祝你好运，玩得开心！🌟🌟<br />
				<br />
				<h3>奖金计算公式</h3>
				第一名–每日竞赛奖金池的50%<br />
				第二名–每日竞赛奖金池的25%<br />
				第三名–每日竞赛奖金池的12%<br />
				第四名 –每日竞赛奖金池的6%<br />
				第五名 –每日竞赛奖金池的3%<br />
				第六名–每日竞赛奖金池的1.5%<br />
				第七名–每日竞赛奖金池的0.9%<br />
				第八名 –每日竞赛奖金池的0.7%<br />
				第九名 –每日竞赛奖金池的0.5%<br />
				第十名 –每日竞赛奖金池的0.4%<br />
			</div>
		</Dialog>
		<Dialog v-model="historyVisible" :title="$t('jackpot.历史')" width="780" :showFooter="false">
			<template #header>
				<div class="color_Text_s p10 bg_Bg2 p_15 fs_20 fw_500 pl_22 pr_22 line" style="overflow: hidden">
					{{ $t("jackpot.历史") }} <span class="color_Text2_1 fs_14">{{ Time }}</span>
				</div>
				<div class="Line"></div>
			</template>
			<Table class="pt_10 bg_Bg2" :data="data" />
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import Dialog from "/@/components/Dialog/Dialog.vue";
import CountDown from "/@/components/CountDown/CountDown.vue";
import { useUserStore } from "/@/stores/modules/user";
import Table from "./Table/Table.vue";
import { useThemesStore } from "/@/stores/modules/themes";
import { Avatar } from "/@/components/User";

const ruleVisible = ref(false);
const historyVisible = ref(false);
const Time = ref("2024/01/05 ～ 2024/01/06");
const countTime = ref(500);
const UserStore = useUserStore();
const themesStore = useThemesStore();
const props = defineProps({
	jackpotInfo: {
		type: Object,
	},
	data: {
		type: Array as () => Array<{
			name: string;
			player: string;
			BetAmount: string;
			Multiplier: string;
			Profit: string;
		}>,
		required: true,
	},
});

const computedImages = computed(() => {
	return {
		home_bsjc: new URL(`../../../../../../assets/zh/${themesStore.themeName}/home/bsjc_img.png`, import.meta.url).href,
	};
});

const changeRuleVisible = () => {
	ruleVisible.value = !ruleVisible.value;
};
const changeHistoryVisible = () => {
	historyVisible.value = !historyVisible.value;
};
</script>

<style lang="scss">
@import "./jackpot.scss";
</style>
