<template>
	<div>
		<div class="card bg_Bg3">
			<div class="title">
				<span class="flex_space-between color_Text_s fs_16">{{ $t('home.最喜欢游戏的前三名') }}</span>
			</div>
			<div class="content" style="gap: 18px">
				<ul class="gameList">
					<li class="flex_space-between bg_Bg1">
						<span class="fs_16 color_Text_s fw_500 flex_space-between">
							<img :src="gameImg" alt="" />
							Hacksaw
						</span>
						<span class="right">
							<span class="color_Text1 fs_14 fw_400">{{ $t('home.投注') }}</span>
							<span class="color_Text_s fs_16 fw_500">99.00$</span>
						</span>
					</li>
					<li class="flex_space-between bg_Bg1">
						<span class="fs_16 color_Text_s fw_500 flex_space-between">
							<img :src="gameImg" alt="" />
							Hacksaw
						</span>
						<span class="right">
							<span class="color_Text1 fs_14 fw_400">{{ $t('home.投注') }}</span>
							<span class="color_Text_s fs_16 fw_500">99.00$</span>
						</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script setup>
import gameImg from '/@/assets/zh/default/UserInfo/gameImg.png';
</script>
<style lang=""></style>
