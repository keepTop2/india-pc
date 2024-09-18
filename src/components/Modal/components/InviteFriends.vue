<!-- src/components/RegisterForm.vue -->
<template>
	<div class="InviteFriends">
		<div>邀请好友赚取更多</div>
		<p>分享您的推荐链接：</p>
		<p>https://bc.game/i-bb442t-n/</p>

		<div>
			<button class="common_btn" @click="Common.copy(str)">复制链接</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import Common from "/@/utils/common";
const str = ref("12312");
</script>

<style lang="scss" scoped>
.InviteFriends {
	width: 610px;
	height: 462px;
	border-radius: 12px;
	background: var(--Bg1);
}
</style>
