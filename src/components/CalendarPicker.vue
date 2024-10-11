<template>
	<div class="calendar-picker">
		<input type="text" v-model="formattedDate" @focus="toggleCalendar" @blur="closeCalendar" readonly />

		<div v-if="showCalendar" class="calendar">
			<div class="calendar-header">
				<button @click="prevMonth">‹</button>
				<span>{{ currentMonth.format("YYYY MMMM") }}</span>
				<button @click="nextMonth">›</button>
			</div>

			<div class="calendar-body">
				<div class="calendar-weekdays">
					<span v-for="day in weekdays" :key="day">{{ day }}</span>
				</div>
				<div class="calendar-days">
					<span v-for="day in daysInMonth" :key="day.date" :class="{ selected: isSelected(day.date), disabled: !day.isCurrentMonth }" @click="selectDate(day.date)">
						{{ day.date.date() }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";

// Props 和 emits
const props = defineProps({
	modelValue: String, // 用于双向绑定
});
const emit = defineEmits(["update:modelValue"]);

// 当前显示的月份
const currentMonth = ref(dayjs());

// 是否显示日历
const showCalendar = ref(false);

// 日期的格式化
const formattedDate = computed(() => {
	return props.modelValue ? dayjs(props.modelValue).format("YYYY-MM-DD") : "";
});

// 星期几（固定顺序）
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 获取当前月份的天数及其相关信息
const daysInMonth = computed(() => {
	const startOfMonth = currentMonth.value.startOf("month");
	const endOfMonth = currentMonth.value.endOf("month");

	const days = [];

	// 获取上个月的几天填充到当前月的开头
	const prevMonthDays = startOfMonth.day();
	for (let i = 0; i < prevMonthDays; i++) {
		const date = startOfMonth.subtract(prevMonthDays - i, "day");
		days.push({ date, isCurrentMonth: false });
	}

	// 当前月的天数
	for (let i = 0; i < endOfMonth.date(); i++) {
		const date = startOfMonth.add(i, "day");
		days.push({ date, isCurrentMonth: true });
	}

	// 下个月的几天填充到当前月的结尾
	const nextMonthDays = 6 - endOfMonth.day();
	for (let i = 1; i <= nextMonthDays; i++) {
		const date = endOfMonth.add(i, "day");
		days.push({ date, isCurrentMonth: false });
	}

	return days;
});

// 切换月份
const prevMonth = () => {
	currentMonth.value = currentMonth.value.subtract(1, "month");
};

const nextMonth = () => {
	currentMonth.value = currentMonth.value.add(1, "month");
};

// 选择日期
const selectDate = (date: any) => {
	emit("update:modelValue", date.format("YYYY-MM-DD"));
	closeCalendar();
};

// 检查是否为选中的日期
const isSelected = (date: any) => {
	return props.modelValue && dayjs(props.modelValue).isSame(date, "day");
};

// 显示/隐藏日历
const toggleCalendar = () => {
	showCalendar.value = !showCalendar.value;
};

// 关闭日历
const closeCalendar = () => {
	setTimeout(() => (showCalendar.value = false), 200); // 延迟关闭，以确保点击日期有效
};
</script>

<style scoped>
.calendar-picker {
	position: relative;
	display: inline-block;
}

input {
	width: 200px;
	padding: 8px;
	border: 1px solid #ccc;
	border-radius: 4px;
	cursor: pointer;
}

.calendar {
	position: absolute;
	top: 100%;
	left: 0;
	z-index: 1000;
	background-color: white;
	border: 1px solid #ccc;
	border-radius: 4px;
	padding: 10px;
	width: 250px;
}

.calendar-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.calendar-weekdays {
	display: flex;
	justify-content: space-between;
	font-weight: bold;
	margin-bottom: 10px;
}

.calendar-days {
	display: flex;
	flex-wrap: wrap;
}

.calendar-days span {
	width: 14.28%; /* 每行7天 */
	text-align: center;
	padding: 5px;
	cursor: pointer;
	border-radius: 4px;
}

.calendar-days span.selected {
	background-color: #007bff;
	color: white;
}

.calendar-days span.disabled {
	color: #ccc;
	pointer-events: none;
}
</style>
