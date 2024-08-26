<template>
	<div class="problem">
		<p class="title">常见问题</p>
		<div>
			<el-collapse v-model="activeNames" @change="handleChange">
				<el-collapse-item :name="item.id" v-for="(item, index) in problemList" :key="index">
					<template #title>
						<div class="collapse-title">
							<span>{{ item.title }}</span>
							<span class="icon" :class="activeNames.includes(item.id) && 'active'">
								{{ activeNames.includes(item.id) ? '' : '+' }}
							</span>
						</div>
						<!-- <i class="iconfont" :class="judgeActive('1') != -1 ? 'icon-bofang-copy-copy' : 'icon-bofang'"></i> -->
					</template>
					{{ item.desc }}
				</el-collapse-item>
			</el-collapse>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const problemList = reactive([
	{
		id: 0,
		title: '什么是“升级奖励”？',
		desc: '为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。',
	},
	{
		id: 2,
		title: '什么是“下雨”？',
		desc: '为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。',
	},
	{
		id: 3,
		title: '什么是“投币”？',
		desc: '为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。',
	},
	{
		id: 4,
		title: '什么是“提示”？',
		desc: '为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。',
	},
	{
		id: 5,
		title: '什么是“充值”？',
		desc: '为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。',
	},
	{
		id: 6,
		title: '什么是“每周现金返还”？',
		desc: '为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。',
	},
	{
		id: 7,
		title: '什么是“体育周奖金”？',
		desc: '为了表达我们对玩家的感激之情，我们会在他们达到下一级别时奖励他们升级奖励。一旦玩家达到 38 级及以上，我们就会将升级奖励提高到略高于较低级别的常规升级奖励。',
	},
]);
const activeNames = ref([0]);
const handleChange = (val: string[]) => {
	console.log(val);
};
</script>

<style scoped lang="scss">
.problem {
	padding: 20px 20px 50px;
	border-right: 5px;

	@include themeify {
		background: themed('Bg1');
	}

	&>.title {
		margin-bottom: 20px;

		@include themeify {
			color: themed('Text_s');
		}
	}

	:deep {
		.el-collapse {
			--el-collapse-border-color: #373a40;
		}

		.el-collapse-item__header,
		.el-collapse-item__wrap {
			@include themeify {
				background: themed('Bg1');
			}
		}

		.el-collapse-item__header {
			@include themeify {
				color: themed('Text_s');
			}

			.el-collapse-item__arrow {
				display: none;
			}
		}

		.el-collapse-item__content {
			@include themeify {
				color: themed('Text1');
			}
		}
	}
}

.collapse-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;

	.active {
		@include themeify {
			background: themed('Theme') !important;
		}

		&::after {
			content: '';
			display: inline-block;
			border-radius: 99px;
			width: 16px;
			height: 3px;

			@include themeify {
				background: themed('Bg1') !important;
			}
		}
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		font-size: 30px;
		transition: .2s;

		@include themeify {
			color: themed('Bg1');
		}

		@include themeify {
			background: themed('icon');
		}
	}
}
</style>
