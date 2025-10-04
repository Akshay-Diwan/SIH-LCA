'use client'
import React, { useState } from 'react';
import Plotly from "plotly.js-dist-min";


// Trial Data
const trialData = {
  energyIntensity: { value: 75, benchmark: 60 },
  waste: [
    { process: "Process A", waste: 12 },
    { process: "Process B", waste: 8 },
    { process: "Process C", waste: 15 }
  ],
  radar: {
    labels: ["Efficiency", "Yield", "Recovery", "Downtime", "Quality"],
    values: [70, 80, 65, 55, 75],
    benchmarks: [80, 85, 75, 70, 80]
  },
  processes: [
    { id: 1, name: "Process A", energy: 120, waste: 12, status: "critical" },
    { id: 2, name: "Process B", energy: 90, waste: 8, status: "moderate" },
    { id: 3, name: "Process C", energy: 60, waste: 15, status: "clean" }
  ],
  recommendations: [
    "Upgrade motor for Process A",
    "Reduce material loss in Process B",
    "Optimize scheduling for Process C"
  ]
};

// Energy Gauge Component
const EnergyGauge: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const data = [{
      type: 'indicator',
      mode: 'gauge+number+delta',
      value: trialData.energyIntensity.value,
      delta: { reference: trialData.energyIntensity.benchmark, increasing: { color: '#dc2626' } },
      gauge: {
        axis: { range: [0, 100], tickcolor: '#6b7280' },
        bar: { color: '#3b82f6' },
        bgcolor: '#1f2937',
        borderwidth: 2,
        bordercolor: '#374151',
        steps: [
          { range: [0, 50], color: '#22c55e' },
          { range: [50, 75], color: '#facc15' },
          { range: [75, 100], color: '#dc2626' }
        ],
        threshold: {
          line: { color: '#8b5cf6', width: 4 },
          thickness: 0.75,
          value: trialData.energyIntensity.benchmark
        }
      }
    }];

    const layout = {
      paper_bgcolor: '#111827',
      plot_bgcolor: '#111827',
      font: { color: '#e5e7eb', size: 14 },
      margin: { t: 40, b: 20, l: 20, r: 20 },
      height: 280
    };

    const config = { responsive: true, displayModeBar: false };

    Plotly.newPlot(containerRef.current, data as any, layout, config);

    return () => {
      if (containerRef.current) {
        Plotly.purge(containerRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg transition-all hover:shadow-xl">
      <h3 className="text-lg font-semibold text-gray-100 mb-2">Energy Intensity</h3>
      <div ref={containerRef} />
    </div>
  );
};

// Waste Bar Chart Component
const WasteBarChart: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const data = [{
      type: 'bar',
      x: trialData.waste.map(w => w.waste),
      y: trialData.waste.map(w => w.process),
      orientation: 'h',
      marker: {
        color: ['#dc2626', '#facc15', '#3b82f6'],
        line: { color: '#374151', width: 1 }
      },
      hovertemplate: '<b>%{y}</b><br>Waste: %{x} units<extra></extra>'
    }];

    const layout = {
      paper_bgcolor: '#111827',
      plot_bgcolor: '#111827',
      font: { color: '#e5e7eb', size: 12 },
      margin: { t: 20, b: 40, l: 80, r: 20 },
      height: 280,
      xaxis: {
        title: 'Waste (units)',
        gridcolor: '#374151',
        color: '#9ca3af'
      },
      yaxis: {
        gridcolor: '#374151',
        color: '#9ca3af'
      }
    };

    const config = { responsive: true, displayModeBar: false };

    Plotly.newPlot(containerRef.current, data as any, layout, config);

    return () => {
      if (containerRef.current) {
        Plotly.purge(containerRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg transition-all hover:shadow-xl">
      <h3 className="text-lg font-semibold text-gray-100 mb-2">Waste per Process</h3>
      <div ref={containerRef} />
    </div>
  );
};

// Efficiency Radar Component
const EfficiencyRadar: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const data = [
      {
        type: 'scatterpolar',
        r: [...trialData.radar.values, trialData.radar.values[0]],
        theta: [...trialData.radar.labels, trialData.radar.labels[0]],
        fill: 'toself',
        name: 'Current',
        line: { color: '#3b82f6' },
        fillcolor: 'rgba(59, 130, 246, 0.3)'
      },
      {
        type: 'scatterpolar',
        r: [...trialData.radar.benchmarks, trialData.radar.benchmarks[0]],
        theta: [...trialData.radar.labels, trialData.radar.labels[0]],
        fill: 'toself',
        name: 'Benchmark',
        line: { color: '#22c55e' },
        fillcolor: 'rgba(34, 197, 94, 0.2)'
      }
    ];

    const layout = {
      paper_bgcolor: '#111827',
      plot_bgcolor: '#111827',
      font: { color: '#e5e7eb', size: 12 },
      margin: { t: 40, b: 40, l: 60, r: 60 },
      height: 320,
      polar: {
        radialaxis: {
          visible: true,
          range: [0, 100],
          gridcolor: '#374151',
          color: '#9ca3af'
        },
        angularaxis: {
          gridcolor: '#374151',
          color: '#9ca3af'
        },
        bgcolor: '#1f2937'
      },
      showlegend: true,
      legend: {
        x: 0.5,
        xanchor: 'center',
        y: -0.1,
        yanchor: 'top',
        orientation: 'h',
        font: { color: '#e5e7eb' }
      }
    };

    const config = { responsive: true, displayModeBar: false };

    Plotly.newPlot(containerRef.current, data as any, layout, config);

    return () => {
      if (containerRef.current) {
        Plotly.purge(containerRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg transition-all hover:shadow-xl">
      <h3 className="text-lg font-semibold text-gray-100 mb-2">Efficiency Metrics</h3>
      <div ref={containerRef} />
    </div>
  );
};

// Process Card Component
const ProcessCard: React.FC<{ process: typeof trialData.processes[0] }> = ({ process }) => {
  const statusColors = {
    critical: { bg: 'bg-red-900/30', border: 'border-red-600', text: 'text-red-400', dot: 'bg-red-500' },
    moderate: { bg: 'bg-yellow-900/30', border: 'border-yellow-500', text: 'text-yellow-400', dot: 'bg-yellow-400' },
    clean: { bg: 'bg-green-900/30', border: 'border-green-600', text: 'text-green-400', dot: 'bg-green-500' }
  };

  const colors = statusColors[process.status];

  return (
    <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-4 transition-all hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-100">{process.name}</h4>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`} />
          <span className={`text-sm font-medium ${colors.text} uppercase`}>{process.status}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800/50 rounded p-2">
          <p className="text-xs text-gray-400">Energy</p>
          <p className="text-xl font-bold text-gray-100">{process.energy}</p>
          <p className="text-xs text-gray-500">kWh</p>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <p className="text-xs text-gray-400">Waste</p>
          <p className="text-xl font-bold text-gray-100">{process.waste}</p>
          <p className="text-xs text-gray-500">units</p>
        </div>
      </div>
    </div>
  );
};

// Recommendations Panel Component
const RecommendationsPanel: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg transition-all hover:shadow-xl">
      <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
        <span className="text-2xl">💡</span>
        Recommendations
      </h3>
      <div className="space-y-3">
        {trialData.recommendations.map((rec, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-blue-900/20 border border-blue-800/50 rounded-lg p-3 transition-all hover:bg-blue-900/30">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {idx + 1}
            </span>
            <p className="text-gray-200 text-sm leading-relaxed">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export Buttons Component
const ExportButtons: React.FC = () => {
  const handleExport = (format: string) => {
    alert(`Export as ${format} - Feature coming soon!`);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg transition-all hover:shadow-xl">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Export Data</h3>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleExport('CSV')}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
        >
          📄 Export as CSV
        </button>
        <button
          onClick={() => handleExport('JSON')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
        >
          📋 Export as JSON
        </button>
        <button
          onClick={() => handleExport('PDF')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
        >
          📑 Export as PDF
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Page
const DashboardPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0b1220]' : 'bg-gray-100'} transition-colors`}>
      {/* Top Bar */}
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} sticky top-0 z-10 shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Diagnostics Dashboard
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all ${
                darkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Row 1 */}
          <div className="lg:col-span-1">
            <EnergyGauge />
          </div>
          <div className="lg:col-span-1">
            <WasteBarChart />
          </div>
          <div className="lg:col-span-1">
            <EfficiencyRadar />
          </div>

          {/* Row 2 */}
          <div className="lg:col-span-1 space-y-4">
            {trialData.processes.map(process => (
              <ProcessCard key={process.id} process={process} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <RecommendationsPanel />
          </div>
          <div className="lg:col-span-1">
            <ExportButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;