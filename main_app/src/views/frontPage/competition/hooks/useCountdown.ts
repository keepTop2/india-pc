import { onMounted, onUnmounted, ref, Ref } from 'vue';

interface Countdown {
    hours: Ref<string>;
    minutes: Ref<string>;
    seconds: Ref<string>;
}

/**
 * @param initialTimeInSeconds 秒数
 */
export default function useCountdown(initialTimeInSeconds: number): Countdown {
    const hours = ref('00');
    const minutes = ref('00');
    const seconds = ref('00');
    let totalTime: number = initialTimeInSeconds;
    let timer: NodeJS.Timeout;

    function updateTime() {
        hours.value = String(Math.floor(totalTime / 3600)).padStart(2, '0');
        minutes.value = String(Math.floor((totalTime % 3600) / 60)).padStart(2, '0');
        seconds.value = String(totalTime % 60).padStart(2, '0');
    }

    function startCountdown() {
        timer = setInterval(() => {
            totalTime--;
            if (totalTime >= 0) {
                updateTime();
            } else {
                clearInterval(timer);
            }
        }, 1000);
    }

    onMounted(() => {
        updateTime();
        startCountdown();
    });

    onUnmounted(() => {
        clearInterval(timer);
    });

    return {
        hours,
        minutes,
        seconds
    };
}
