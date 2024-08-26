class LengthWatcherArray<T> {
	// 私有数组，用于存储元素
	private array: T[] = [];
	// 长度变化的回调函数
	private lengthChangedCallback: (newLength: number) => void;

	// 构造函数，接受一个回调函数，当数组长度变化时调用该回调函数
	constructor(lengthChangedCallback: (newLength: number) => void) {
		this.lengthChangedCallback = lengthChangedCallback;
	}

	// 包装 push 方法，添加元素后调用回调函数
	public push(...items: T[]): number {
		const result = this.array.push(...items);
		this.lengthChangedCallback(this.array.length);
		return result;
	}

	// 包装 pop 方法，删除元素后调用回调函数
	public pop(): T | undefined {
		const result = this.array.pop();
		this.lengthChangedCallback(this.array.length);
		return result;
	}

	// 包装 unshift 方法，在数组开头添加元素后调用回调函数
	public unshift(...items: T[]): number {
		const result = this.array.unshift(...items);
		this.lengthChangedCallback(this.array.length);
		return result;
	}

	// 包装 shift 方法，在数组开头删除元素后调用回调函数
	public shift(): T | undefined {
		const result = this.array.shift();
		this.lengthChangedCallback(this.array.length);
		return result;
	}

	// 包装 splice 方法，删除/添加元素后调用回调函数
	public splice(start: number, deleteCount?: number, ...items: T[]): T[] {
		const result = this.array.splice(start, deleteCount, ...items);
		this.lengthChangedCallback(this.array.length);
		return result;
	}

	// 提供一个只读的 length 属性来获取当前数组的长度
	public get length(): number {
		return this.array.length;
	}

	// 提供一个方法来获取当前数组
	public getArray(): T[] {
		return this.array;
	}
}
export default LengthWatcherArray;
