'use client'
import React, { useState } from 'react';
import Plot from 'react-plotly.js';

// TypeScript interfaces
interface KPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  description: string;
  benchmark: { min: number; max: number; good: number };
  aiRecommended?: boolean;
}

interface ProcessData {
  process: string;
  contribution: number;
}

type AnalysisMode = 'standard' | 'ai-recommended';

const CircularityDashboard: React.FC = () => {
  const [mode, setMode] = useState<AnalysisMode>('standard');
  const [hoveredKPI, setHoveredKPI] = useState<string | null>(null);

  // Mock KPI data
  const kpis: KPI[] = [
    {
      id: 'mci',
      name: 'Material Circularity Indicator (MCI)',
      value: 0.72,
      unit: '',
      description: 'MCI measures material reuse and lifetime extension in the product lifecycle',
      benchmark: { min: 0, max: 1, good: 0.7 },
      aiRecommended: true
    },
    {
      id: 'cmu',
      name: 'Circular Material Use Rate (CMU)',
      value: 18,
      unit: '%',
      description: 'CMU represents the share of material resources coming from recycled waste',
      benchmark: { min: 0, max: 100, good: 20 }
    },
    {
      id: 'eolrr',
      name: 'End-of-Life Recycling Rate (EoL-RR)',
      value: 65,
      unit: '%',
      description: 'EoL-RR measures the percentage of materials recycled at the end of product life',
      benchmark: { min: 0, max: 100, good: 70 }
    },
    {
      id: 'rp',
      name: 'Resource Productivity (GDP per ton)',
      value: 1450,
      unit: ' USD/ton',
      description: 'Resource Productivity indicates economic output generated per unit of material consumed',
      benchmark: { min: 0, max: 2000, good: 1500 }
    }
  ];

  // Mock process contribution data
  const processData: ProcessData[] = [
    { process: 'Recycling', contribution: 35 },
    { process: 'Reuse', contribution: 28 },
    { process: 'Remanufacturing', contribution: 22 },
    { process: 'Design Optimization', contribution: 15 }
  ];

  // Color coding function
  const getPerformanceColor = (kpi: KPI): string => {
    const normalized = kpi.unit === '%' ? kpi.value : (kpi.value / kpi.benchmark.max);
    const goodThreshold = kpi.unit === '%' ? kpi.benchmark.good : (kpi.benchmark.good / kpi.benchmark.max);
    
    if (normalized >= goodThreshold) return 'bg-green-500/20 border-green-500';
    if (normalized >= goodThreshold * 0.7) return 'bg-yellow-500/20 border-yellow-500';
    return 'bg-red-500/20 border-red-500';
  };

  const getTextColor = (kpi: KPI): string => {
    const normalized = kpi.unit === '%' ? kpi.value : (kpi.value / kpi.benchmark.max);
    const goodThreshold = kpi.unit === '%' ? kpi.benchmark.good : (kpi.benchmark.good / kpi.benchmark.max);
    
    if (normalized >= goodThreshold) return 'text-green-400';
    if (normalized >= goodThreshold * 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Radar chart data
  const radarData = {
    type: 'scatterpolar' as const,
    r: kpis.map(kpi => {
      if (kpi.unit === '%') return kpi.value;
      return (kpi.value / kpi.benchmark.max) * 100;
    }),
    theta: kpis.map(kpi => kpi.id.toUpperCase()),
    fill: 'toself',
    fillcolor: 'rgba(59, 130, 246, 0.3)',
    line: { color: 'rgb(59, 130, 246)' },
    marker: { color: 'rgb(59, 130, 246)', size: 8 }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">Circularity Dashboard</h1>
          
          {/* Dropdown Menu */}
          <div className="relative">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as AnalysisMode)}
              className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none pr-10"
            >
              <option value="standard">Standard Indicators</option>
              <option value="ai-recommended">AI Recommended Indicators ⭐</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi) => {
            const showAIBadge = mode === 'ai-recommended' && kpi.aiRecommended;
            
            return (
              <div
                key={kpi.id}
                className={`relative bg-gray-800 rounded-lg p-6 border-2 ${getPerformanceColor(kpi)} shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
                onMouseEnter={() => setHoveredKPI(kpi.id)}
                onMouseLeave={() => setHoveredKPI(null)}
              >
                {showAIBadge && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Recommended
                  </div>
                )}
                
                <h3 className="text-sm font-medium text-gray-400 mb-2">{kpi.name}</h3>
                <div className={`text-3xl font-bold ${getTextColor(kpi)} mb-2`}>
                  {kpi.value}{kpi.unit}
                </div>
                
                {/* Tooltip */}
                {hoveredKPI === kpi.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-700 text-gray-100 text-xs p-3 rounded-lg shadow-xl z-10 border border-gray-600">
                    <p>{kpi.description}</p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-700 border-r border-b border-gray-600"></div>
                  </div>
                )}
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getTextColor(kpi).replace('text', 'bg')}`}
                    style={{
                      width: `${kpi.unit === '%' ? kpi.value : (kpi.value / kpi.benchmark.max) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Performance Overview</h2>
            <Plot
              data={[radarData]}
              layout={{
                polar: {
                  radialaxis: {
                    visible: true,
                    range: [0, 100],
                    color: '#9ca3af',
                    gridcolor: '#374151'
                  },
                  angularaxis: {
                    color: '#9ca3af'
                  },
                  bgcolor: '#1f2937'
                },
                showlegend: false,
                paper_bgcolor: '#1f2937',
                plot_bgcolor: '#1f2937',
                font: { color: '#e5e7eb' },
                margin: { l: 60, r: 60, t: 40, b: 40 }
              }}
              config={{ displayModeBar: false }}
              style={{ width: '100%', height: '400px' }}
            />
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Process Contribution to Circularity</h2>
            <Plot
              data={[
                {
                  type: 'bar',
                  x: processData.map(d => d.process),
                  y: processData.map(d => d.contribution),
                  marker: {
                    color: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
                    line: { width: 0 }
                  },
                  hovertemplate: '<b>%{x}</b><br>Contribution: %{y}%<extra></extra>'
                }
              ]}
              layout={{
                paper_bgcolor: '#1f2937',
                plot_bgcolor: '#1f2937',
                font: { color: '#e5e7eb' },
                xaxis: {
                  color: '#9ca3af',
                  gridcolor: '#374151'
                },
                yaxis: {
                  title: 'Contribution (%)',
                  color: '#9ca3af',
                  gridcolor: '#374151',
                  range: [0, 40]
                },
                margin: { l: 60, r: 40, t: 40, b: 80 }
              }}
              config={{ displayModeBar: false }}
              style={{ width: '100%', height: '400px' }}
            />
          </div>
        </div>

        {/* AI Insights Section */}
        {mode === 'ai-recommended' && (
          <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6 border border-purple-500/50 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="bg-purple-500 rounded-full p-2 mt-1">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">AI Insight</h3>
                <p className="text-gray-300">
                  Based on industry benchmarks and your current performance, focusing on improving the <span className="font-semibold text-purple-400">Material Circularity Indicator (MCI)</span> could yield the highest impact on overall circularity. Your current MCI of 0.72 is strong, but optimizing material lifetime extension could push it above 0.80.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CircularityDashboard;