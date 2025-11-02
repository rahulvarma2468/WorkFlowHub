import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Zap, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const StatCard = ({ icon: Icon, label, value, change }: { icon: any, label: string, value: string, change?: string }) => (
  <div className="p-6 rounded-2xl glassmorphism">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
    </div>
    <div className="flex items-baseline gap-2">
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {change && <p className="text-sm font-semibold text-green-500 dark:text-green-400 flex items-center gap-1"><TrendingUp size={14} /> {change}</p>}
    </div>
  </div>
);

const AnalyticsPage: React.FC = () => {
  const { theme } = useTheme();

  const chartOptions = useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#9CA3AF' : '#6B7280';
    const tooltipBg = isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)';
    const tooltipBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const tooltipColor = isDark ? '#E5E7EB' : '#1F2937';
    const axisLineColor = isDark ? '#4B5563' : '#D1D5DB';
    const splitLineColor = isDark ? '#374151' : '#E5E7EB';

    return {
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      tooltip: { 
        trigger: 'axis', 
        backgroundColor: tooltipBg, 
        borderColor: tooltipBorder, 
        textStyle: { color: tooltipColor },
        confine: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLine: { lineStyle: { color: axisLineColor } },
        axisLabel: { color: textColor },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisLabel: { color: textColor },
        splitLine: { lineStyle: { color: splitLineColor } },
      },
      series: [{
        name: 'Workflow Triggers',
        type: 'line',
        smooth: true,
        data: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1500, 1680, 1890, 2300],
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(139, 92, 246, 0.4)' }, { offset: 1, color: 'rgba(139, 92, 246, 0)' }]
          }
        },
        lineStyle: {
          width: 2,
          color: '#8B5CF6'
        },
        itemStyle: {
          color: '#8B5CF6'
        }
      }]
    };
  }, [theme]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Analytics</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Insights into your automation performance.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Zap} label="Total Runs (Month)" value="8,423" change="+12.5%" />
        <StatCard icon={CheckCircle} label="Success Rate" value="99.2%" change="+0.1%" />
        <StatCard icon={Clock} label="Avg. Time Saved" value="~42h" />
        <StatCard icon={TrendingUp} label="Top Workflow" value="CRM Sync" />
      </div>

      <div className="p-6 rounded-2xl glassmorphism">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workflow Triggers Over Time</h3>
        <div style={{ height: '400px' }}>
          <ReactECharts option={chartOptions} style={{ height: '100%', width: '100%' }} notMerge={true} lazyUpdate={true} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
