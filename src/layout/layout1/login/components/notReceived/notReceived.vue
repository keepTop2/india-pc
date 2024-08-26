<template>
	<div class="notReceived">
		<div class="header">
			<SvgIcon iconName="back_icon" :size="28" @click="onNextStep()" />
			<h2 class="title">{{ $t('login["未收到验证码"]') }}</h2>
		</div>

		<div class="from">
			<div class="text1 mb_10">
				<p v-if="props.fromParams.type == '1'">{{ $t('login["e-请尝试"]') }}</p>
				<p v-if="props.fromParams.type == '2'">{{ $t('login["p-请尝试"]') }}</p>
			</div>
			<div v-if="props.fromParams.type == '1'" class="text2">
				<p>{{ $t('login["e-1"]') }}</p>
				<p>{{ $t('login["e-2"]') }}</p>
				<p>
					3、<span class="tips">{{ $t('login["e-3"]') }}</span>
				</p>
			</div>
			<div v-if="props.fromParams.type == '2'" class="text2">
				<p>{{ $t('login["p-1"]') }}</p>
				<p>{{ $t('login["p-2"]') }}</p>
				<p>{{ $t('login["p-3"]') }}</p>
				<p>
					4、<span class="tips">{{ $t('login["p-4"]') }}</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const emit = defineEmits(['step']);

const props = withDefaults(
	defineProps<{
		fromParams?: any;
		forget: undefined | boolean;
	}>(),
	{
		forget: undefined,
	}
);

const onNextStep = () => {
	if (props.forget) {
		emit('step', 4);
	} else {
		emit('step', 2, props.fromParams);
	}
};
</script>

<style scoped lang="scss">
.notReceived {
	.header {
		display: flex;
		padding: 26px 22px;

		.icon {
			color: #fff;
		}

		.title {
			@include themeify {
				color: themed('Text_s');
			}
			font-family: 'PingFang SC';
			font-size: 20px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}
	}
	.from {
		padding: 20px 32px 20px;

		.text1 {
			@include themeify {
				color: themed('Text1');
			}
			color: var(--Text1-1, #98a7b5);
			font-family: 'PingFang SC';
			font-size: 18px;
			font-weight: 400;
		}
		.text2 {
			@include themeify {
				color: themed('Text4');
			}
			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
			p {
				margin-top: 6px;
			}
		}

		.tips {
			@include themeify {
				color: themed('Theme');
			}
			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
			cursor: pointer;
		}
	}
}
</style>
