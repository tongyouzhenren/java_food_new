<template>
  <div ref="chartRef" class="chart-panel" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { TrendSeriesPoint } from '/@/api/statistics';

interface HoverPayload {
  type: 'line';
  name: string;
}

const props = defineProps<{
  data: TrendSeriesPoint[];
  highlightedName?: string | null;
}>();

const emit = defineEmits<{
  (e: 'hover', payload: HoverPayload): void;
  (e: 'leave'): void;
}>();

const chartRef = ref<HTMLDivElement>();
type EChartsInstance = any;
let chart: EChartsInstance | null = null;

const buildOption = () => {
  const labels = props.data.map((item) => item.label);
  const pv = props.data.map((item) => item.pv);
  const uv = props.data.map((item) => item.uv);
  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['访问量', '访客数'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        data: pv,
        areaStyle: {
          color: 'rgba(47, 84, 235, 0.08)',
        },
      },
      {
        name: '访客数',
        type: 'line',
        smooth: true,
        data: uv,
        areaStyle: {
          color: 'rgba(114, 46, 209, 0.08)',
        },
      },
    ],
  };
};

const renderChart = () => {
  const echarts = (window as any).echarts;
  if (!chartRef.value || !echarts) return;
  if (!chart) {
    chart = echarts.init(chartRef.value);
    chart.on('mouseover', (params) => {
      if (params.seriesName) {
        emit('hover', { type: 'line', name: params.seriesName });
      }
    });
    chart.on('globalout', () => emit('leave'));
  }
  chart.setOption(buildOption());
  applyHighlight();
};

const applyHighlight = () => {
  if (!chart) return;
  ['访问量', '访客数'].forEach((name, index) => {
    chart!.dispatchAction({ type: 'downplay', seriesIndex: index });
    if (props.highlightedName === name) {
      chart!.dispatchAction({ type: 'highlight', seriesIndex: index });
    }
  });
};

const resize = () => {
  chart?.resize();
};

onMounted(() => {
  renderChart();
  window.addEventListener('resize', resize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  chart?.dispose();
  chart = null;
});

watch(
  () => props.data,
  () => renderChart(),
  { deep: true },
);

watch(
  () => props.highlightedName,
  () => applyHighlight(),
);
</script>

<style scoped>
.chart-panel {
  width: 100%;
  height: 360px;
}
</style>
