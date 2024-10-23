import { debounce, isEmpty } from "lodash-es";
// import _ from "lodash";
import Common from "./common";
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

/**实例创建 */
(function () {
	// console.info("实例话work");
	const worker: Worker = self as any;

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

	class Position {
		// 单例实例变量
		private static instance: any = null;
		/**数据定位；*/
		private positions: Array<PositionType> = [];
		/** 默认是否是展开状态 */
		private isExpand = true;

		private itemMinSize = 0;
		/** 子卡片高度 */
		private itemChildSize = 192.625;
		/** 二级容器边距  */
		private itemChildMarginBottom = 13.76;
		/** 子集序列对象 （利用子集计算一个卡片大致最高高度）  */
		private childrenKey = "";

		private _listData = [];
		constructor() {}
		// 获取单例实例的静态方法
		public static getInstance() {
			if (!Position.instance) {
				// 如果实例不存在，则创建
				Position.instance = new Position();
			}
			// 返回单例实例
			return Position.instance;
		}

		private setAllData(data) {
			const { positions, isExpand, itemMinSize, itemChildSize, itemChildMarginBottom, childrenKey, _listData } = data;
			this.positions = positions;
			this.isExpand = isExpand;
			this.itemMinSize = itemMinSize;
			this.itemChildSize = itemChildSize;
			this.itemChildMarginBottom = itemChildMarginBottom;
			this.childrenKey = childrenKey;
			this._listData = _listData;
			this.initPositions();
		}

		/**
		 * @description: 获取当前卡片计算高度
		 * @param {*} item
		 * @param {*} isExpand
		 * @return {*}
		 */
		private getItemHeight(item, isExpand, index?: number) {
			/**当前板块卡片高度 */
			let dHeight = this.itemMinSize;
			if (item && isExpand) {
				try {
					/**最大高度(展开时)；*/
					const eventsLength = item[this.childrenKey].length;
					const mul = Common.mul(eventsLength, this.itemChildSize);
					const add = Common.add(mul, this.itemMinSize);
					const add2 = Common.add(add, this.itemChildMarginBottom);
					dHeight = Number(Common.formatFloat(add2, 2));
				} catch (error) {
					// console.warn(error);
					/**错误时使用最小高度*/
					dHeight = Number(Common.add(this.itemMinSize, this.itemChildMarginBottom));
				}
			} else {
				/**最小高度(缩小时)；*/
				dHeight = Number(Common.add(this.itemMinSize, this.itemChildMarginBottom));
			}
			return dHeight;
		}
		/**
		 * @description: 获取单元距离头部距离
		 * @param {*} k
		 * @param {*} isExpand
		 * @return {*}
		 */
		private getTopHeight(k: number = 0) {
			let sum = 0;
			if (k) {
				for (let e = 0; e < k; e++) {
					const item = this._listData[e]?.value;
					let isExpand = this.isExpand;
					try {
						if (!isEmpty(this.positions[e])) {
							isExpand = this.positions[e]?.isExpand;
						}
					} catch (error) {}
					const itemHeight = this.getItemHeight(item, isExpand);
					sum = Common.add(sum, itemHeight);
				}
			}
			// console.info("获取单元距离头部距离", k, sum);
			return Number(Common.formatFloat(sum, 2));
		}

		/**
		 * @description: 获取距离底部高度；
		 * @param {*} k
		 * @return {*}
		 */
		private getBottomHeiht(k = 0) {
			let isExpand = this.isExpand;
			try {
				isExpand = this.positions[k].isExpand;
			} catch (error) {
				// console.info(error);
				/**未建立过的索引不会有扩展状态（使用静态扩展） */
				isExpand = this.isExpand;
			}
			const item = this._listData[k]?.value;
			const top = this.getTopHeight(k);
			const itemHeight = this.getItemHeight(item, isExpand, k);
			const bottom = Common.add(top, itemHeight);
			const val = Number(Common.formatFloat(bottom, 2));
			return val;
		}

		/**
		 * @description: 初始化缓存数据
		 * @return {*}
		 */
		private initPositions = () => {
			/**positions 非空数据时处理 */
			if (this.positions.length) {
				const oldPositions = JSON.parse(JSON.stringify(this.positions));
				this.positions = this._listData.map((d, index) => {
					const item = d?.value;
					if (oldPositions[index]) {
						return this.setPosition(item, index, oldPositions[index]);
					} else {
						return this.setPosition(item, index);
					}
				});
			} else {
				/**positions 空数据时处理 */
				this.positions = this._listData.map((d, index) => {
					const item = d?.value;
					const obj = this.setPosition(item, index);
					return obj;
				});
			}

			selfPostMessage("setPositions", this.positions);
		};
		/**
		 * @description: 设置定位(position)值
		 * @param {*} pIndex {定位索引}
		 *  @param {PositionType} oldPosition {旧的定位值}
		 * @return {*}
		 */
		private setPosition = (item, pIndex: number, oldPosition?: PositionType): PositionType => {
			const isExpand = this.isExpand;
			if (oldPosition) {
				/**当前板块卡片高度 */
				const dHeight = this.getItemHeight(item, oldPosition.isExpand);
				/** 预估 - 真实距离头部高度 */
				const top = this.getTopHeight(pIndex);
				const bottom = this.getBottomHeiht(pIndex);
				const position: PositionType = {
					index: pIndex,
					height: dHeight,
					top: top,
					bottom: bottom,
					isExpand: oldPosition.isExpand,
				};
				return position;
			} else {
				/**当前板块卡片高度 */
				const dHeight = this.getItemHeight(item, isExpand);
				/** 预估 - 真实距离头部高度 */
				const top = this.getTopHeight(pIndex);
				const bottom = this.getBottomHeiht(pIndex);
				const position: PositionType = {
					index: pIndex,
					height: dHeight,
					top: top,
					bottom: bottom,
					isExpand: isExpand,
				};
				return position;
			}
		};
	}

	const Instance: any = new Position();
	worker.onmessage = (e) => {
		// console.info(" worker.ts====>", e.data);
		const obj = JSON.parse(e.data);
		switch (obj.type) {
			case "infoPage":
				Instance.setAllData(obj.data);
				break;
			default:
				break;
		}
	};
})();
