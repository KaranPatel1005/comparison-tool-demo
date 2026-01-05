import React from 'react';
import type { KPIMetrics } from '../../types';
import './KPISection.css';

interface KPISectionProps {
  metrics: KPIMetrics;
  isFile4Uploaded: boolean;
}

const KPISection: React.FC<KPISectionProps> = ({ metrics, isFile4Uploaded }) => {
  return (
    <div className="kpi-section">
      <div className="kpi-box">Total Features: {metrics.totalFeatures}</div>
      <div className="kpi-box">Same: {metrics.sameCount}</div>
      <div className="kpi-box">Partial: {metrics.partialCount}</div>
      <div className="kpi-box">Different: {metrics.diffCount}</div>
      <div className="kpi-box">Missing Cells: {metrics.missingCellCount}</div>
      <div className="kpi-box">File2 Diff: {metrics.diff2Percent}</div>
      <div className="kpi-box">File3 Diff: {metrics.diff3Percent}</div>
      {isFile4Uploaded && <div className="kpi-box">File4 Diff: {metrics.diff4Percent}</div>}
    </div>
  );
};

export default KPISection;
