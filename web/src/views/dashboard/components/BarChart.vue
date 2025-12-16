<template>
  <div ref="chartRef" class="chart-panel" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { CategoryBarDatum } from '/@/api/statistics';

interface HoverPayload {
  type: 'bar';
  name: string;
}

const props = defineProps<{
  data: CategoryBarDatum[];
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
  const labels = props.data.map((item) => item.name);
  const orders = props.data.map((item) => item.orders);
  const revenue = props.data.map((item) => item.revenue);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['订单量', '营业额'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: labels,
        axisLabel: {
          rotate: 20,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '订单量',
        type: 'bar',
        data: orders,
        itemStyle: {
          color: '#2f54eb',
        },
        emphasis: {
          itemStyle: {
            color: '#1d39c4',
          },
        },
      },
      {
        name: '营业额',
        type: 'bar',
        data: revenue,
        itemStyle: {
          color: '#722ed1',
        },
        emphasis: {
          itemStyle: {
            color: '#531dab',
          },
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
      if (params.name) {
        emit('hover', { type: 'bar', name: params.name });
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
    chart!.dispatchAction({ type: 'downplay', seriesIndex: 1, dataIndex: index });
    if (props.highlightedName === item.name) {
      chart!.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: index });
      chart!.dispatchAction({ type: 'highlight', seriesIndex: 1, dataIndex: index });
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
