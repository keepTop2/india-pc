import { DirectiveBinding } from "vue";
import defaultPng from "/@/assets/common/default.png";

// 管理 IntersectionObserver 实例
const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const imgEl = entry.target as HTMLImageElement;
			const imageUrl = imgEl.dataset.src;
			if (imageUrl) {
				imgEl.src = resolveImageUrl(imageUrl);
				imgEl.classList.add("fade-in");
			} else {
				imgEl.src = defaultPng; // 备用图像
			}
			observer.unobserve(imgEl); // 停止观察
		}
	});
});

function setupImage(el: HTMLImageElement, imageUrl: string) {
	if (!imageUrl) {
		el.src = defaultPng; // 默认占位图
		return;
	}
	// 数据属性用于存储图片 URL
	el.dataset.src = imageUrl;
	el.src = defaultPng; // 设置为默认占位图
	el.classList.remove("fade-in"); // 移除旧的动画类
	// 开始观察图像
	observer.observe(el);
}
export const lazyLoad = {
	mounted(el: HTMLImageElement, binding: DirectiveBinding<string>) {
		setupImage(el, binding.value);
	},
	updated(el: HTMLImageElement, binding: DirectiveBinding<string>) {
		if (binding.value !== binding.oldValue) {
			setupImage(el, binding.value);
		}
	},
};

function resolveImageUrl(url: string): string {
	// 判断是否是绝对 URL
	const absoluteUrlPattern = /^http?:\/\//i;
	if (absoluteUrlPattern.test(url)) {
		return url; // 直接使用绝对 URL
	}

	// 转换相对路径为绝对路径
	return new URL(url, import.meta.url).href;
}
