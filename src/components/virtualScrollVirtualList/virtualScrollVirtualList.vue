<!--
 * @Author: WangMingxin
 * @Description: 虚拟滚动组件-真实滚动高度
-->
<template>
	<div ref="listRef" class="infinite-list-container">
		<div ref="phantomRef" class="infinite-list-phantom" :style="{ height: `${listHeight}px` }"></div>
		<div ref="centerRef" class="infinite-list" v-if="listRef">
			<div
				class="infinite-list-item"
				ref="itemsRef"
				:h-top="state.positions[row?._key]?.top"
				:h-height="state.positions[row?._key]?.height"
				:h-bottom="state.positions[row?._key]?.bottom"
				:data-key="row?._key"
				:key="row?._key"
				v-for="row in  (visibleData as Array<ListRowType>) "
			>
				<CententItem :_key="row._key" :root="listRef" @InView="onDomeInView" @OutView="onDomeOutView" @domeUnmount="domeUnmount" @domeResize="changeUpdated">
					<slot :item="row.value" :index="row._key" :isExpand="state.positions[row._key]?.isExpand"></slot>
				</CententItem>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, onUpdated, reactive, ref, watch, watchEffect } from "vue";
// import listWorker from "./virtualScrollVirtualWorker.ts?worker&url";
import listWorker from "./virtualScrollVirtualWorker.ts?worker&inline";
import { debounce, throttle, cloneDeep, isEmpty } from "lodash-es";
import CententItem from "./cententItem/cententItem.vue";
import Common from "/@/utils/common";
import pubSub from "/@/pubSub/pubSub";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
const SportAttentionStore = useSportAttentionStore();
const centerRef = ref();

interface VirtualListType {
	/** 所有列表数据 */
	listData: Array<any>;
	/** 预估 最大（默认高度） */
	itemMaxSize?: number;
	/** 预估 最小（默认高度） */
	itemMinSize?: number;
	/** 是否展开 */
	isExpand?: boolean;
	/** 高于计数(缓冲 顶部渲染) */
	aboveCount?: number;
	/** 所有列表数据 (缓冲 底部渲染)*/
	belowCount?: number;
	/** 子集序列对象 （利用子集计算一个卡片大致最高高度）  */
	childrenKey?: string;
	/**  可获取间隔-底部边距 class    */
	bottomClass?: string;
	/** 可获取缩小时展示的-标题高度 class    */
	minDivClass?: string;
	/** 可获取展开时-子集卡片高度 class    */
	childrenDivClass?: string;
}

/** 序列数据类型 */
export interface ListRowType {
	/**索引 */
	_key: number;
	/**具体值对象 */
	value: Object;
}
/** 下级组件传值数据类型 */
export interface ListItemType {
	/**索引 */
	_key: number;
	/**宽 */
	width: number;
	/**高 */
	height: number;
}
/** 定位对象类型 */
export interface PositionType {
	index: number;
	height: number;
	top: number;
	bottom: number;
	isExpand: boolean;
}
/** position (定位参数修改) 的参数类型  */
type basisParamsType = ListItemType | Array<PositionType>;
/** worker引用 */
const worker = new listWorker();
const listRef = ref();
const phantomRef = ref();
const itemsRef = ref();
const foldCount = ref(0);
const props = withDefaults(defineProps<VirtualListType>(), {
	listData: () => {
		return [];
	},
	itemMaxSize: 170,
	itemMinSize: 32,
	isExpand: true,
	aboveCount: 3,
	belowCount: 3,
	childrenKey: "events",
	/** 可获取间隔-底部边距 class    */
	bottomClass: "card-item",
	/** 可获取缩小时展示的-标题高度 class    */
	minDivClass: "tournament-header",
	/** 可获取展开时-子集卡片高度 class    */
	childrenDivClass: "content",
});

onUpdated(() => {
	nextTick(function () {
		if (!itemsRef.value || !itemsRef.value.length) {
			return;
		}
		//更新真实偏移量
		setStartOffset();
	});
});

const state = reactive({
	/**容器高度 100px or 50vh*/
	height: `100vh`,
	/**可视区域高度*/
	screenHeight: 0,
	/**起始索引*/
	start: 0,
	/**结束索引*/
	end: 5,
	/**数据定位；*/
	positions: [] as any,
	/**正在设置更新positons数据*/
	isSizeOption: false,
	/** 是否在进行初始化数据 */
	isInitOption: true,
	/** 数据列表是否变动 */
	isListChang: true,
	/** 内容最大高度 */
	itemMaxSize: 0,
	/** 内容最小高度 */
	itemMinSize: 0,
	/** 子卡片高度 */
	itemChildSize: 192.625,
	/** 二级容器边距  */
	itemChildMarginBottom: 13.76,
	/** 默认是否是展开状态 */
	isExpand: props.isExpand,
});

watch(
	() => props.itemMaxSize,
	(newValue, oldValue) => {
		if (newValue > 0) {
			//设置默认高度
			state.itemMaxSize = newValue;
		}
	},
	{
		immediate: true,
	}
);

/** 最大高度集合 （用于计算平均最大高度值）  */
const maxHegiht = ref([]);
/** 平均高度 */
const averageHeight = computed(() => {
	if (maxHegiht.value && maxHegiht.value.length) {
		let sum = maxHegiht.value.reduce((acc, val) => {
			return Common.add(acc, val);
		}, 0);
		// 将总和除以数组长度
		let ave = Common.div(sum, maxHegiht.value.length);
		return ave;
	} else {
		return props.itemMaxSize;
	}
});

/** 格式化后的所有数据 list-序列 */
const _listData = ref([]);
watchEffect(() => {
	let list = [];
	if (props.listData.length) {
		list = props.listData.reduce((init, cur, index) => {
			init.push({
				// _转换后的索引_第一项在原列表中的索引_本行包含几列
				_key: index,
				value: cur,
			});
			return init;
		}, []);
	}
	_listData.value = list;
	// return list;
});

//显示数据量
const visibleCount = computed(() => {
	let count = 4;
	if (visibleIsExpand.value) {
		count = Math.ceil(state.screenHeight / state.itemChildSize);
	} else {
		console.info("state.itemMinSize", state.itemMinSize, state.itemChildSize);
		count = Math.ceil(state.screenHeight / state.itemMinSize);
	}
	return count;
});

/**显示数据 */
const visibleData = computed(() => {
	let start = 0;
	let loadStart = state.start - props.aboveCount;
	if (loadStart >= 0) {
		start = loadStart;
	}
	let end = state.end + props.belowCount;
	const viewData = _listData.value.slice(start, end);
	return viewData;
});

/** 列表总高度 (设置为不固定依据展示数据动态修正高) */
const listHeight = ref();

/** 显示的数据定位及高度  */
const visiblePositions = computed(() => {
	let start = 0;
	let loadStart = state.start - props.aboveCount;
	if (loadStart >= 0) {
		start = loadStart;
	}
	let end = state.end + props.belowCount;
	const viewPositions = state.positions.slice(start, end);
	return viewPositions;
});
/** 显示数据是否全展开 */
const visibleIsExpand = computed(() => {
	let IsExpand = true;
	visiblePositions.value;
	for (let k = 0; k < visiblePositions.value.length; k++) {
		if (!visiblePositions.value[k].isExpand) {
			IsExpand = false;
			break;
		}
	}

	return IsExpand;
});

watch(
	() => visiblePositions.value,
	(newValue, oldValue) => {
		if (newValue && newValue.length) {
			// console.info("显示的数据定位 ======= ?", newValue);

			const viewlast = newValue[newValue.length - 1];
			if (viewlast && viewlast.index != state.positions.length - 1) {
				// listHeight.value = viewlast?.bottom;
			}
			/** 每一次数据更新时都进行一次数据最小高度获取*/
			findMinHeight();
			findMaxHeight();
		}
	}
);

watch(
	() => state.itemMinSize,
	(newValue, oldValue) => {
		/** 监听最小值变化 ，最小值小于默认高度且不和前一次相等时；重新调用数据渲染及数据量更改 */
		if (newValue && newValue < averageHeight.value && newValue != oldValue) {
			scrollEvent();
		}
	}
);

/**
 * @description:根据第一个渲染容器获取高度值
 */
const getStateDomeHeight = () => {
	let vindex = -1;
	/** 查找可视数据的第一个展开的节点 */
	for (let k = 0; k < visiblePositions.value.length; k++) {
		if (visiblePositions.value[k].isExpand) {
			vindex = k;
			break;
		}
	}
	if (vindex == -1) {
		/**如果没找到展开的节点 就使用最小高度 */
		try {
			const fistNode = itemsRef.value[0];
			const cardDome = fistNode.querySelector("." + props.bottomClass);
			/** 内部边距 */
			const cardDomeComputedStyle = getComputedStyle(cardDome);
			state.itemChildMarginBottom = parseFloat(cardDomeComputedStyle.marginBottom);
			/** 最小高度 */
			const headDome = fistNode.querySelector("." + props.minDivClass);
			state.itemMinSize = headDome.getBoundingClientRect().height;
		} catch (error) {
			// console.info(error)
		}
	} else {
		/**如果找到了展开的节点；获取完整的值 */
		if (itemsRef.value) {
			try {
				const fistNode = itemsRef.value[vindex];
				const cardDome = fistNode.querySelector("." + props.bottomClass);
				// 获取计算后的样式对象
				const cardDomeComputedStyle = getComputedStyle(cardDome);
				state.itemChildMarginBottom = parseFloat(cardDomeComputedStyle.marginBottom);
				// console.info("二级容器底部边距", state.itemChildMarginBottom);
				const headDome = fistNode.querySelector("." + props.minDivClass);
				state.itemMinSize = headDome.getBoundingClientRect().height;
				// console.info("最小高度", state.itemMinSize);
				const childrenDome = fistNode.querySelector("." + props.childrenDivClass);
				state.itemChildSize = childrenDome.getBoundingClientRect().height;
			} catch (error) {
				// console.info(error)
			}
		}
	}
};

//获取列表起始索引
const getStartIndex = (scrollTop = 0): number => {
	const positions = JSON.parse(JSON.stringify(state.positions));
	//二分法查找
	return binarySearch(positions, scrollTop);
};
const binarySearch = (list: any, value: any): any => {
	let start = 0;
	let end = list.length - 1;
	let tempIndex: number | null = null;

	try {
		while (start <= end) {
			let midIndex = parseInt((start + end) / 2);
			let midValue = list[midIndex].bottom;
			if (midValue === value) {
				return midIndex + 1;
			} else if (midValue < value) {
				start = midIndex + 1;
			} else if (midValue > value) {
				if (tempIndex === null || tempIndex > midIndex) {
					tempIndex = midIndex;
				}
				end = end - 1;
			}
		}
		return tempIndex;
	} catch (error) {
		listRef.value.scrollTop = 0;
		centerRef.value.style.transform = `translate3d(0,0,0)`;
		return 0;
	}
};

//获取当前的偏移量
const setStartOffset = () => {
	let startOffset;
	if (state.start >= 1) {
		try {
			/**头部缓存 定位 */
			let abovePosit = state.positions[state.start - props.aboveCount];
			/**开始是索引 定位 */
			const startPosit = state.positions[state.start];
			/** 开始位置的顶部距离 - 缓存区的距离  */
			let size = startPosit?.top - (abovePosit ? abovePosit.top : 0);
			/**开始是索引 的 前一位 */
			const startPositBefore = state.positions[state.start - 1];
			let sum = startPositBefore?.bottom - size;
			if (sum >= 0) {
				startOffset = sum;
			} else {
				startOffset = 0;
			}
		} catch (error) {
			console.warn(error, state.start);
			/** 偏移高度信息获取错误强制偏移顶部 */
			startOffset = 0;
			listRef.value.scrollTop = 0;
		}
	} else {
		startOffset = 0;
	}
	// console.info("偏移值", startOffset);
	centerRef.value.style.transform = `translate3d(0,${startOffset}px,0)`;
};

/**
 * @description: 滚动防抖处理
 */
const scrollDebounce = debounce(() => {
	/**如果父级容器没有找到则 直接销毁本次任务 */
	if (!listRef.value) {
		return;
	}
	//当前滚动位置
	let scrollTop = listRef.value.scrollTop;
	//此时的开始索引
	let loadStart = getStartIndex(scrollTop);
	// console.info("此时的开始索引", loadStart);
	// console.info("数据长度", state.positions.length);
	if (loadStart || loadStart == 0) {
		// console.info("此时的可视化", visibleCount.value);
		//此时的结束索引
		let loadEnd = loadStart + visibleCount.value;
		// console.info("此时的结束索引", loadEnd, loadStart, state.positions.length);
		if (loadEnd > state.positions.length - 1) {
			loadEnd = state.positions.length - 1;
		}
		state.start = loadStart;
		state.end = loadEnd;
		//此时的偏移量
		setStartOffset();
		state.isSizeOption = false;
	}
}, 50);

//滚动事件
const scrollEvent = (event?: any) => {
	state.isSizeOption = true;
	scrollDebounce();
};

/**  显示数据的最小高度*/
const findMinHeight = () => {
	const viewPositions = visiblePositions.value;
	try {
		const minValueObject = viewPositions.reduce((min, current) => {
			return current.height < min.height ? current : min;
		}, viewPositions[0]);
		if (minValueObject && minValueObject?.height && state.itemMinSize > minValueObject?.height) {
			state.itemMinSize = minValueObject.height;
		}
	} catch (error) {
		console.info(error);
	}
};

/**  显示数据的最大高度*/
const findMaxHeight = () => {
	const viewPositions = visiblePositions.value;
	try {
		const maxValueObject = viewPositions.reduce((min, current) => {
			return current.height > min.height ? current : min;
		}, viewPositions[0]);

		if (maxValueObject && maxValueObject?.height) {
			const height: number = maxValueObject.height;
			state.itemMaxSize = height;
			if (maxHegiht.value.indexOf(height) == -1) {
				maxHegiht.value.push(height);
			}
		}
	} catch (error) {
		console.info(error);
	}
};

/**
 * @description: 设置positions展开状态
 * @param {*} obj
 * @return {*}
 */
const setlistDataEisExpand = (obj: any) => {
	state.positions[obj.index].isExpand = obj.isExpand;
	//更新真实偏移量
	setStartOffset();

	// 设置折叠状态并更新计数
	foldCount.value += obj.isExpand ? -1 : 1;

	// 判断是否需要切换全部折叠状态或更新折叠计数
	const isAllExpanded = foldCount.value === 0;
	const isAllCollapsed = foldCount.value >= _listData.value.length;
	if (isAllExpanded || isAllCollapsed) {
		SportAttentionStore.setIsFold(isAllCollapsed);
	}
};

watch(
	() => _listData.value.length,
	(newValue, oldValue) => {
		if (newValue) {
			changeUpdated();
		}
	}
);

/**
 * @description: dome进入视图时
 * @param {*} val {进入时索引}
 * @return {*}
 */
const onDomeInView = (obj: ListItemType) => {
	const { _key, height, width } = obj;
	if (_key == state.positions.length - 1) {
		let height = listRef.value.scrollTop + state.screenHeight;
		listHeight.value = height;
		phantomRef.value.setAttribute("data-custom", height);
	} else if (_key < state.positions.length - 1) {
		let lastHeight = state.positions[state.positions.length - 1].height;
		let height = listRef.value.scrollTop + state.screenHeight + lastHeight;
		listHeight.value = height;
		phantomRef.value.setAttribute("data-custom", height);
	}
	/**每个组件进入时从自身开始进行后续的dome计算 */
	changeUpdated();
	scrollEvent();
};
/**
 * @description:dome移除视图时
 * @param {*} obj {移除时索引}
 * @return {*}
 */
const onDomeOutView = (obj: ListItemType) => {
	const { _key, height, width } = obj;
	if (_key == state.positions.length - 1) {
		let lastHeight = state.positions[state.positions.length - 1].height;
		let height = listRef.value.scrollTop + lastHeight;
		listHeight.value = height;
		phantomRef.value.setAttribute("data-custom", height);
	}
	changeUpdated();
	scrollEvent();
};

/**
 * @description: dome销毁时
 * @param {*} val {索引}
 * @return {*}
 */
const domeUnmount = (obj: ListItemType) => {
	/**组件销毁时进行全局计算 */
	const { _key, height, width } = obj;
	// console.info("组件销毁时进行全局计算", obj, state.positions.length);
	if (_key > state.positions.length - 1) {
		const lastPosition = state.positions[state.positions.length - 1];
		try {
			listRef.value.scrollTop = lastPosition?.top || 0;
			let lastHeight = lastPosition?.height || listRef.value.clientHeight;
			let height = listRef.value.scrollTop + lastHeight;
			listHeight.value = height;
		} catch (error) {}
	}
	// console.info("组件销毁时进行全局计算", listRef.value.scrollTop);
	changeUpdated();
	scrollEvent();
};

/**
 * @description:设置全局数据是否为展开状态
 * @param {*} isExpand
 * @return {*}
 */
const setAllIsExpand = (isExpand: boolean) => {
	state.isInitOption = true;
	state.isExpand = isExpand;

	const oldOptions = JSON.parse(JSON.stringify(state.positions));
	const newOptions: Array<any> = [];
	for (let k = 0; k < oldOptions.length; k++) {
		oldOptions[k].isExpand = state.isExpand;
		newOptions.push(oldOptions[k]);
	}
	state.positions = newOptions;
	state.isInitOption = false;
	nextTick(() => {
		if (!state.isExpand) {
			setScollTop();
		}
	});
};
/**
 * @description: 滚动到指定位置;
 * @param {*} val 滚动到索引位置；
 * @return {*}
 */
const setScollTop = async (val?: number) => {
	try {
		if (val && val >= 0) {
			listRef.value.scrollTop = state.positions[val].top;
			state.start = val;
		} else {
			listRef.value.scrollTop = 0;
			state.start = 0;
		}
		scrollEvent();
		changeUpdated();
	} catch (error) {}
};

/**
 * @description: webwork数据发送；
 * @param {*} type
 * @param {*} data
 * @return {*}
 */
const selfPostMessage = (type, data) => {
	const str = JSON.stringify({
		type: type,
		data: data,
	});
	worker.postMessage(str);
};

/**获取work消息 */
const getWorkMessage = () => {
	worker.onmessage = (e) => {
		const obj = JSON.parse(e.data);
		switch (obj.type) {
			case "setPositions":
				state.positions = obj.data;
				break;
			default:
				break;
		}
	};
};

onBeforeMount(() => {
	getWorkMessage();
	state.isExpand = props.isExpand;
	state.itemMaxSize = props.itemMaxSize;
	state.itemMinSize = props.itemMinSize;
	pubSub.subscribe(pubSub.PubSubEvents.SportEvents.onExpandAngCollapse.eventName, setAllIsExpand);
});
/**option 发生变化更新 */
const changeUpdated = throttle(
	() => {
		const data = {
			positions: state.positions,
			isExpand: state.isExpand,
			itemMinSize: state.itemMinSize,
			itemChildSize: state.itemChildSize,
			itemChildMarginBottom: state.itemChildMarginBottom,
			childrenKey: props.childrenKey,
			_listData: _listData.value,
		};
		selfPostMessage("infoPage", data);
	},
	300,
	{ trailing: false }
);

onMounted(() => {
	if (listRef.value) {
		state.screenHeight = listRef.value.clientHeight;
		state.start = 0;
		state.end = state.start + visibleCount.value;
		changeUpdated();
		nextTick(async () => {
			await getStateDomeHeight();
			changeUpdated();
		});
	}
});
onBeforeUnmount(() => {
	worker.terminate();
});

defineExpose({ setlistDataEisExpand, setAllIsExpand, setScollTop });
</script>

<style scoped lang="scss">
// a {
// 	transform: matrix3d();
// }
.infinite-list-container {
	overflow: auto;
	position: relative;
	-webkit-overflow-scrolling: touch;
	// min-height: 100vh;
	height: 100%;
}
.infinite-list-container::-webkit-scrollbar {
	width: 0; /* 设置滚动条宽度 */
}

.infinite-list-container::-webkit-scrollbar-track {
	background-color: transparent; /* 设置滚动条轨道背景色 */
}

.infinite-list-phantom {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	z-index: -1;
	overflow: hidden;
}

.infinite-list {
	left: 0;
	right: 0;
	top: 0;
	position: absolute;
}

.infinite-list-item {
	padding: 0px;
	margin: 0px;
	border: 0px;
	// color: #555;
	box-sizing: border-box;
	// border-bottom: 1px solid #999;
	/* height:200px; */
}
</style>
