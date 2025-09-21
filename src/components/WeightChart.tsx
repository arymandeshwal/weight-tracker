'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { type WeightEntry } from './types';

interface WeightChartProps {
  data: WeightEntry[];
}

const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  const arymanData = data.filter(d => d.who === 'Aryman').map(d => [d.date, d.kg]);
  const amalData = data.filter(d => d.who === 'Amal').map(d => [d.date, d.kg]);

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Aryman', 'Amal'],
      textStyle: { color: '#9ca3af' }, // gray-400 for light text
      top: 'top', // Position legend at the top
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '12%', // Add top margin to avoid overlap with legend
      containLabel: true
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      },
      axisLabel: { color: '#9ca3af' }
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: {
        lineStyle: {
          color: '#374151' // gray-700 for subtle grid lines
        }
      },
      axisLabel: { color: '#9ca3af' }
    },
    series: [
      {
        name: 'Aryman',
        type: 'line',
        smooth: true,
        data: arymanData,
        itemStyle: { color: '#34d399' }, // emerald-400
        markLine: {
          silent: true, // Ignore mouse events
          symbol: 'none', // No symbols on the line ends
          lineStyle: {
            type: 'dashed',
            color: '#34d399'
          },
          data: [{ yAxis: 75 }],
          label: {
            position: 'insideEndTop',
            formatter: 'Goal: 75kg',
            color: '#34d399'
          }
        }
      },
      {
        name: 'Amal',
        type: 'line',
        smooth: true,
        data: amalData,
        itemStyle: { color: '#fbbf24' }, // amber-400
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            type: 'dashed',
            color: '#fbbf24'
          },
          data: [{ yAxis: 70 }],
          label: {
            position: 'insideEndTop',
            formatter: 'Goal: 70kg',
            color: '#fbbf24'
          }
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} notMerge={true} lazyUpdate={true} />;
};

export default WeightChart;
