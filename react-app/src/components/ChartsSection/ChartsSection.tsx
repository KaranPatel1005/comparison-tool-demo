import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import type { ChartData } from '../../types';
import './ChartsSection.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ChartsSectionProps {
  chartData: ChartData | null;
  isFile4Uploaded: boolean;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ chartData, isFile4Uploaded }) => {
  if (!chartData) {
    return (
      <div id="charts-container">
        <div className="chart-overlay">
          <p>Please upload and compare files to see charts.</p>
        </div>
      </div>
    );
  }

  const doughnutData = {
    labels: ['Same', 'Partial', 'Different'],
    datasets: [
      {
        data: [chartData.sameCount, chartData.partialCount, chartData.diffCount],
        backgroundColor: ['#66BB6A', '#FFEE58', '#FFA726'],
      },
    ],
  };

  const barData = {
    labels: ['File2', 'File3', 'File4'],
    datasets: [
      {
        label: '% Different vs File1',
        data: [chartData.diff2Percent, chartData.diff3Percent, chartData.diff4Percent],
        backgroundColor: ['#42A5F5', '#AB47BC', '#EC407A'],
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

  return (
    <div id="charts-container">
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
