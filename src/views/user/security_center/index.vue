<template>
	<div class="max-width security_center">
		<div class="mt_28 mb_24 title">
			<svg-icon name="user-security" color="#fff" size="24px" />
			<span>安全中心</span>
		</div>
		<div class="content">
			<div>
				<span>登陆密码</span>
				<span>
					<svg-icon name="arrow_right" size="14px" />
				</span>
			</div>
			<div>
				<span>手机号</span>
				<span>
					<svg-icon name="arrow_right" size="14px" />
				</span>
			</div>
			<div>
				<span>电子邮箱</span>
				<span>
					<svg-icon name="arrow_right" size="14px" />
				</span>
			</div>
			<div>
				<span>交易密码</span>
				<span>
					<svg-icon name="arrow_right" size="14px" />
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.security_center {
	color: var(--Text_s);
	.title {
		font-size: 20px;
		display: flex;
		align-items: center;
		gap: 12px;
		font-weight: 500;
	}
	.content {
		background: var(--Bg1);
		padding: 40px 28px;
		border-radius: 12px;

		> div {
			height: 88px;
			background: var(--Bg3);
			margin-bottom: 16px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 24px;
			border-radius: 4px;
			font-size: 16px;
			color: var(--Text1);
			cursor: pointer;
		}
		> div:hover {
			background: rgba(0, 0, 0, 0.05);
		}
	}
}
</style>
