<template>
  <div class="search-bar">
    <input
      ref="searchInput"
      v-model="searchQuery"
      type="text"
      :placeholder="placeholder"
      @input="debouncedSearch"
    />
    <span class="cancel" @click="cancelSearch">取消</span>
    <div class="search-results" v-if="!searchQuery && !searchResults.length && searchHistory.length">
      <div class="history-count">
        <span></span>
        <p>搜索历史</p>
      </div>
      <div v-for="(result, index) in searchHistory" :key="index" class="search-history-item">
        <div class="history-info">
          <div class="history-title" @click="setSearchQuery(result.title)"> 
            {{ result.title }}
            <svg-icon name="sports-remove" @click="removeHistory(index)" />
          </div>
        </div>
      </div>
    </div>
    <div class="search-results" v-else-if="searchResults.length">
      <div class="results-count">
        <span></span>
        <p>找到的比赛：{{ searchResults.length }}</p>
      </div>
      <div v-for="(result, index) in searchResults" :key="index" class="search-result-item">
        <div class="result-info">
          <div class="result-title"  @click="showEventDetail(result)"> <img class="icon" :src="result.sportIcon" size="20px" /> {{ result.title }}</div>
          <div class="result-subtitle">{{ result.subtitle }}</div>
          <div class="result-subtitle">
            {{ getEventsTitle(result) }}
            <span v-if="(result.gameInfo.livePeriod == 2 || result.gameInfo.livePeriod == 1) && !result.gameInfo.delayLive && !result.gameInfo.isHt">{{
              formattedGameTime(result)
            }}</span>
            <!-- <span>
             {{ timeFormate(result?.globalShowTime).date }}
            </span> -->
          ({{ result.gameInfo?.liveHomeScore }}-{{ result.gameInfo?.liveAwayScore }})</div>
        </div>
      </div>
    </div>
    <div class="custom-empty" v-else>
      <svg-icon name="no_data" width="142" height="120" />
      <p>哎呀！还没有数据！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeMount, onUnmounted } from 'vue';
import { debounce } from 'lodash-es';
import { useMatchEvents } from '/@/views/sports/hooks/eventMatch';
import SportsApi from '/@/api/sports/sports';
import SportsCommonFn from "/@/views/sports/utils/common";
import { useRoute } from 'vue-router';
import pubsub from '/@/pubSub/pubSub';
import { useLoading } from '/@/directive/loading/hooks';
import { useLink } from '/@/views/sports/hooks/useLink';
const { gotoEventDetail } = useLink();
const { startLoading, stopLoading } = useLoading();
const route = useRoute();
const { getEventsTitle,timeFormate } = SportsCommonFn;
const { searchMatches } = useMatchEvents();

const searchInput = ref<HTMLInputElement | null>(null);
const searchHistory = ref([{
  title:'菲律宾'
}]);
const searchQuery = ref<string>('');
const searchResults = ref<Array<{
  sportIcon: string;
  title: string;
  subtitle: string;
}>>([]);

const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'cancel'): void;
}>();

interface Props {
  placeholder?: string;
  cancelText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索...',
  cancelText: '取消'
});

onBeforeMount(() => {
  pubsub.publish('showoVerlay', true);
})
onUnmounted(() => {
  pubsub.publish('showoVerlay', false);
})
/**
 * @description 计算是上半场还是下半场 根据 livePeriod 判断当前是第几节
 */
 const livePeriod = computed(() => {
	const tennisInfo = SportsCommonFn.safeAccess(props.event, ["tennisInfo"]);
	const { currentSet } = tennisInfo;
	if (currentSet == 1) {
		return "第1盘";
	}
	if (currentSet == 2) {
		return "第2盘";
	}
	if (currentSet == 3) {
		return "第3盘";
	}
	if (currentSet == 4) {
		return "第4盘";
	}
	if (currentSet == 5) {
		return "第5盘";
	}
	const globalShowTime = SportsCommonFn.safeAccess(props.event, ["globalShowTime"]);
	return convertUtcToUtc5AndFormatMD(globalShowTime);
});
const debouncedSearch = debounce(async () => {
  startLoading();
  const { sportType } = route.query;
  const param =  `$filter=(contains(homename,'${searchQuery.value}') or contains(awayname,'${searchQuery.value}') or contains(leagueName,'${searchQuery.value}')) and sportType in (${sportType}) &$orderby=globalShowTime asc`;
  const results = await SportsApi.GetEventInfo({
    query:param
  });
  stopLoading();
  console.log(results, '====results');
  searchResults.value = results.data.events.map((result: { leagueIconUrl: any; leagueName: any; teamInfo: { homeName: any; awayName: any; }; }) => ({
    sportIcon: result.leagueIconUrl,
    title: result.leagueName,
    subtitle: `${result.teamInfo.homeName} vs ${result.teamInfo.awayName}`,
    ...result
  }));
}, 300);


// 定义计算属性 格式化比赛开始时间
const formattedGameTime = (event: { gameInfo: { seconds: number; }; }) => {
  console.log(event,'=====event')
	const minutes = Math.floor(event.gameInfo.seconds / 60);
  const seconds = event.gameInfo.seconds % 60;
  console.log(minutes,seconds,'====minutes')
	return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const cancelSearch = (): void => {
  searchQuery.value = '';
  searchResults.value = [];
  emit('cancel');
};
const setSearchQuery = (query: string): void => {
  searchQuery.value = query;
  debouncedSearch();
}
const removeHistory = (title: string): void => {
  searchHistory.value = searchHistory.value.filter((item) => item.title !== title);
};

const showEventDetail = (event: { leagueId: any; eventId: any; sportIcon: string; title: string; subtitle: string;  }) => {
  console.log(event,'====event')
  const { sportType } = route.query;
	const params = {
		leagueId: event?.leagueId,
		eventId: event?.eventId,
	};
  gotoEventDetail(params, sportType as string);
  cancelSearch();
}

onMounted(() => {
  searchInput.value?.focus();
});

watch(searchQuery, (newValue: string) => {
  if (newValue === '') {
    searchResults.value = [];
    emit('search', '');
  }
});
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  height: 50px;
  width: 100%; 
  padding: 10px 24px;
  position: relative;
  
  input {
    flex-grow: 1;
    padding: 8px 12px;
    border: 1px solid #ccc;
    background-color: var(--Bg2);
    height: 30px;
    padding: 4.5px 40px 4.5px 10px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
    color: var(--Text1);
  }
  
  .cancel {
    margin-left: 10px;
    color: var(--Text1);
    cursor: pointer;
    font-size: 14px;
    position: absolute;
    right: 34px;
    &:hover {
      text-decoration: underline;
    }
  }
  .custom-empty{
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 410px;
    background-color: var(--Bg1);
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
    overflow-y: auto;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p{
      color:var(--Text2)
    }
    svg{
      margin-bottom: 10px;
    }
  }
  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 410px;
    background-color: var(--Bg1);
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
    overflow-y: auto;
    padding: 0 24px;

    .search-result-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid var(--Border1);

      &:last-child {
        border-bottom: none;
      }

      .result-info {
        flex-grow: 1;
        border-bottom: 1px solid var(--Line_2);
        padding-bottom: 6px;
        img{
          width: 20px;
          height: 20px;
        }
        .result-title {
          font-size: 16px;
          font-weight: bold;
          color: var(--Text_s);
          display: flex;
          gap:8px;
          padding: 9px 0;
          cursor: pointer;
        }

        .result-subtitle {
          font-size: 14px;
          color: var(--Text1);
          cursor: pointer;
        }
      }
    }
    .search-history-item{
      height: 40px;
      line-height: 40px;
      color:var(--Text_s);
      font-size: 14px;
      .history-title{
        display: flex;
        border-bottom: 1px solid var(--Line_2);
        justify-content: space-between;
        align-items: center;
        svg{
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      }
    }
    .results-count,.history-count{
      display: flex;
      gap:10px;
      color: var(--Text_s);
      font-size: 16px;
      padding:8px 0px;
      span{
        background: var(--Theme);
        height: 24px;
        width: 4px;
        border-radius: 6px;
      }
    }
  }
}
</style>
