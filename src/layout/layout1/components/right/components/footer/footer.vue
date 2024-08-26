<template>
	<div class="layout1_right_footer">
		<div class="footer">
			<div class="mb_20 pl_32 pr_32">
				<h3 class="color_Text_s fs_20">转账方式</h3>
				<div class="currency">
					<SvgIcon width="44" v-for="i in 10" :key="i" height="44" iconName="btc" />
				</div>
			</div>
			<div class="Line"></div>
			<div class="mb_20 pl_32 pr_32">
				<h3 class="color_Text_s fs_20">赞助和博彩责任</h3>
				<div class="currency">
					<img v-for="(item, index) in imgList" :key="index" :src="item.src" />
				</div>
				<div class="currency2">
					<img :src="play9" />
				</div>
			</div>
			<div class="Line"></div>
			<div class="guanyuwomen pl_32 pr_32 pb_60">
				<div>
					<h3 class="color_Text_s fs_20">关于我们</h3>
					<ul>
						<li>关于我们</li>
						<li>帮助中心</li>
						<li>隐私政策</li>
						<li>规则与条款</li>
						<li>联系我们</li>
					</ul>
				</div>
				<div>
					<h3 class="color_Text_s fs_20">App下载</h3>
					<ul>
						<li>Ios下载</li>
						<li>Android下载</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import play1 from '/@/assets/zh/default/footer/play1.png';
import play2 from '/@/assets/zh/default/footer/play2.png';
import play3 from '/@/assets/zh/default/footer/play3.png';
import play4 from '/@/assets/zh/default/footer/play4.png';
import play5 from '/@/assets/zh/default/footer/play5.png';
import play6 from '/@/assets/zh/default/footer/play6.png';
import play9 from '/@/assets/zh/default/footer/play9.png';

const imgList = [
	{ id: 1, src: play1 },
	{ id: 2, src: play2 },
	{ id: 3, src: play3 },
	{ id: 3, src: play4 },
	{ id: 3, src: play5 },
	{ id: 3, src: play6 },
];
</script>

<style lang="scss" scoped>
.layout1_right_footer {
	margin-top: 50px;

	@include themeify {
		background-color: themed('Bg2');
	}

	@include flex_center;
	@import './footer.scss';
}
</style>
