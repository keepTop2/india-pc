import { ref, Ref } from 'vue';


interface Params {
	/**
	 * 组件索引
	 */
	componentActive?: number,
}

class DialogSingleton {
	private static instance: DialogSingleton | null = null;
	public loginDialogVisible: Ref<boolean>;
	public componentActive: Ref<number>;

	private constructor() {
		this.loginDialogVisible = ref(false);
		this.componentActive = ref(0);
	}

	public static getInstance(): DialogSingleton {
		if (!DialogSingleton.instance) {
			DialogSingleton.instance = new DialogSingleton();
		}
		return DialogSingleton.instance;
	}

	public showDialog(params: Params): void {
		// console.log('开启弹窗');
		this.loginDialogVisible.value = true;
		this.componentActive.value = params.componentActive || 0;
	}

	public hideDialog(): void {
		// console.log('关闭弹窗');
		this.loginDialogVisible.value = false;
	}
}

export default DialogSingleton.getInstance();
