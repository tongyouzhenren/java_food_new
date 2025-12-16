<template>
  <div ref="chartRef" class="chart-panel" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { ChannelPieDatum } from '/@/api/statistics';

interface HoverPayload {
  type: 'pie';
  name: string;
}

const props = defineProps<{
  data: ChannelPieDatum[];
  highlightedName?: string | null;
}>();

const emit = defineEmits<{
  (e: 'hover', payload: HoverPayload): void;
  (e: 'leave'): void;
}>();

const chartRef = ref<HTMLDivElement>();
type EChartsInstance = any;
let chart: EChartsInstance | null = null;

const buildOption = () => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}次 ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: '渠道占比',
      type: 'pie',
      radius: '70%',
      center: ['50%', '50%'],
      data: props.data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
        },
      },
    },
  ],
});

const renderChart = () => {
  const echarts = (window as any).echarts;
  if (!chartRef.value || !echarts) return;
  if (!chart) {
    chart = echarts.init(chartRef.value);
    chart.on('mouseover', (params) => {
      if (params.name) {
        emit('hover', { type: 'pie', name: params.name });
      }
    });
    chart.on('globalout', () => emit('leave'));
  }
  chart.setOption(buildOption());
  applyHighlight();
};

const applyHighlight = () => {
  if (!chart) return;
  props.data.forEach((item, index) => {
    chart!.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: index });
    if (props.highlightedName === item.name) {
      chart!.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: index });
    }
  });
};

const resize = () => chart?.resize();

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
  height: 320px;
}
</style>
