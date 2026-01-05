import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import type { ChartData } from '../../types';
import './ChartsSection.css';
import { cn } from '../../utils/utils';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ChartsSectionProps {
  chartData: ChartData;
  isFile4Uploaded: boolean;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ chartData = {
  totalFeatures: 0,
  sameCount: 0,
  partialCount: 0,
  diffCount: 0,
  missingCellCount: 0,
  diff2Percent: '0%',
  diff3Percent: '0%',
  diff4Percent: '0%',
}, isFile4Uploaded }) => {


  const doughnutData = {
    labels: ['Same', 'Partial', 'Different'],
    datasets: [
      {
        data: [chartData?.sameCount, chartData?.partialCount, chartData?.diffCount],
        backgroundColor: ['#66BB6A', '#FFEE58', '#FFA726'],
      },
    ],
  };

  // Conditionally build bar chart data based on uploaded files
  const barData = {
    labels: isFile4Uploaded ? ['File2', 'File3', 'File4'] : ['File2', 'File3'],
    datasets: [
      {
        label: '% Different vs File1',
        data: isFile4Uploaded
          ? [chartData?.diff2Percent, chartData?.diff3Percent, chartData?.diff4Percent]
          : [chartData?.diff2Percent, chartData?.diff3Percent],
        backgroundColor: isFile4Uploaded
          ? ['#42A5F5', '#AB47BC', '#EC407A']
          : ['#42A5F5', '#AB47BC'],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  // Determine if we should show the overlay (no data uploaded yet)
  const showOverlay = useMemo(() => {
    return chartData.sameCount === 0 &&
      chartData.partialCount === 0 &&
      chartData.diffCount === 0 &&
      chartData.diff2Percent === 0 &&
      chartData.diff3Percent === 0 &&
      chartData.diff4Percent === 0;
  }, [chartData]);

  console.log("show", showOverlay)
  console.log("chartData", chartData)
  return (
    <div id="charts-container" className={cn(showOverlay && "py-4")}>

      {showOverlay && <div className="chart-overlay">
        <p>Please upload and compare files to see charts.</p>
      </div>}

      <div className="chart-wrapper">
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
      <div className="chart-wrapper">
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default ChartsSection;
