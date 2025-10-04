'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import * as Plotly from 'plotly.js-dist-min';
import { ChevronDown, Download, Info } from 'lucide-react';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// Types
type LCIAMethod = 'ReCiPe' | 'TRACI' | 'CML' | 'EF 3.0';
type SeverityLevel = 'Critical' | 'Moderate' | 'Low';

interface ImpactCategory {
  name: string;
  value: number;
  unit: string;
  severity: SeverityLevel;
  definition: string;
  breakdown: { source: string; percentage: number }[];
}

interface MethodData {
  [key: string]: ImpactCategory;
}

// Dummy Data
const dummyData: Record<LCIAMethod, MethodData> = {
  'ReCiPe': {
    'Climate Change': {
      name: 'Climate Change',
      value: 3.5,
      unit: 'kg CO₂-eq',
      severity: 'Critical',
      definition: 'Measures greenhouse gas emissions contributing to global warming',
      breakdown: [
        { source: 'Energy', percentage: 60 },
        { source: 'Transport', percentage: 30 },
        { source: 'Materials', percentage: 10 }
      ]
    },
    'Acidification': {
      name: 'Acidification',
      value: 1.2,
      unit: 'kg SO₂-eq',
      severity: 'Moderate',
      definition: 'Measures emissions that cause acid rain and soil acidification',
      breakdown: [
        { source: 'Smelting', percentage: 55 },
        { source: 'Energy', percentage: 35 },
        { source: 'Transport', percentage: 10 }
      ]
    },
    'Eutrophication': {
      name: 'Eutrophication',
      value: 0.8,
      unit: 'kg PO₄-eq',
      severity: 'Low',
      definition: 'Measures nutrient enrichment in water bodies',
      breakdown: [
        { source: 'Wastewater', percentage: 50 },
        { source: 'Agriculture', percentage: 40 },
        { source: 'Runoff', percentage: 10 }
      ]
    },
    'Ozone Depletion': {
      name: 'Ozone Depletion',
      value: 0.05,
      unit: 'kg CFC-11-eq',
      severity: 'Low',
      definition: 'Measures destruction of stratospheric ozone layer',
      breakdown: [
        { source: 'Refrigerants', percentage: 70 },
        { source: 'Solvents', percentage: 20 },
        { source: 'Aerosols', percentage: 10 }
      ]
    },
    'Human Toxicity': {
      name: 'Human Toxicity',
      value: 2.8,
      unit: 'kg 1,4-DB-eq',
      severity: 'Critical',
      definition: 'Measures toxic emissions affecting human health',
      breakdown: [
        { source: 'Heavy Metals', percentage: 45 },
        { source: 'VOCs', percentage: 35 },
        { source: 'Particulates', percentage: 20 }
      ]
    },
    'Ecotoxicity': {
      name: 'Ecotoxicity',
      value: 1.5,
      unit: 'kg 1,4-DB-eq',
      severity: 'Moderate',
      definition: 'Measures toxic effects on ecosystems',
      breakdown: [
        { source: 'Pesticides', percentage: 50 },
        { source: 'Heavy Metals', percentage: 30 },
        { source: 'Industrial Waste', percentage: 20 }
      ]
    },
    'Land Use': {
      name: 'Land Use',
      value: 4.2,
      unit: 'm² crop-eq',
      severity: 'Moderate',
      definition: 'Measures land occupation and transformation impacts',
      breakdown: [
        { source: 'Agriculture', percentage: 60 },
        { source: 'Infrastructure', percentage: 25 },
        { source: 'Mining', percentage: 15 }
      ]
    },
    'Water Depletion': {
      name: 'Water Depletion',
      value: 1.9,
      unit: 'm³ water-eq',
      severity: 'Moderate',
      definition: 'Measures freshwater consumption',
      breakdown: [
        { source: 'Cooling', percentage: 45 },
        { source: 'Processing', percentage: 35 },
        { source: 'Cleaning', percentage: 20 }
      ]
    },
    'Resource Depletion': {
      name: 'Resource Depletion',
      value: 0.6,
      unit: 'kg Sb-eq',
      severity: 'Low',
      definition: 'Measures depletion of abiotic resources',
      breakdown: [
        { source: 'Metals', percentage: 55 },
        { source: 'Minerals', percentage: 30 },
        { source: 'Fossil Fuels', percentage: 15 }
      ]
    }
  },
  'TRACI': {
    'Climate Change': {
      name: 'Climate Change',
      value: 4.0,
      unit: 'kg CO₂-eq',
      severity: 'Critical',
      definition: 'Measures greenhouse gas emissions contributing to global warming',
      breakdown: [
        { source: 'Energy', percentage: 65 },
        { source: 'Transport', percentage: 25 },
        { source: 'Materials', percentage: 10 }
      ]
    },
    'Acidification': {
      name: 'Acidification',
      value: 1.0,
      unit: 'kg SO₂-eq',
      severity: 'Moderate',
      definition: 'Measures emissions that cause acid rain and soil acidification',
      breakdown: [
        { source: 'Smelting', percentage: 50 },
        { source: 'Energy', percentage: 40 },
        { source: 'Transport', percentage: 10 }
      ]
    },
    'Eutrophication': {
      name: 'Eutrophication',
      value: 0.6,
      unit: 'kg N-eq',
      severity: 'Low',
      definition: 'Measures nutrient enrichment in water bodies',
      breakdown: [
        { source: 'Wastewater', percentage: 55 },
        { source: 'Agriculture', percentage: 35 },
        { source: 'Runoff', percentage: 10 }
      ]
    },
    'Ozone Depletion': {
      name: 'Ozone Depletion',
      value: 0.04,
      unit: 'kg CFC-11-eq',
      severity: 'Low',
      definition: 'Measures destruction of stratospheric ozone layer',
      breakdown: [
        { source: 'Refrigerants', percentage: 75 },
        { source: 'Solvents', percentage: 15 },
        { source: 'Aerosols', percentage: 10 }
      ]
    },
    'Human Toxicity': {
      name: 'Human Toxicity',
      value: 3.1,
      unit: 'CTUh',
      severity: 'Critical',
      definition: 'Measures toxic emissions affecting human health',
      breakdown: [
        { source: 'Heavy Metals', percentage: 50 },
        { source: 'VOCs', percentage: 30 },
        { source: 'Particulates', percentage: 20 }
      ]
    },
    'Ecotoxicity': {
      name: 'Ecotoxicity',
      value: 1.7,
      unit: 'CTUe',
      severity: 'Moderate',
      definition: 'Measures toxic effects on ecosystems',
      breakdown: [
        { source: 'Pesticides', percentage: 45 },
        { source: 'Heavy Metals', percentage: 35 },
        { source: 'Industrial Waste', percentage: 20 }
      ]
    },
    'Land Use': {
      name: 'Land Use',
      value: 3.8,
      unit: 'm²',
      severity: 'Moderate',
      definition: 'Measures land occupation and transformation impacts',
      breakdown: [
        { source: 'Agriculture', percentage: 55 },
        { source: 'Infrastructure', percentage: 30 },
        { source: 'Mining', percentage: 15 }
      ]
    },
    'Water Depletion': {
      name: 'Water Depletion',
      value: 2.2,
      unit: 'm³',
      severity: 'Critical',
      definition: 'Measures freshwater consumption',
      breakdown: [
        { source: 'Cooling', percentage: 50 },
        { source: 'Processing', percentage: 30 },
        { source: 'Cleaning', percentage: 20 }
      ]
    },
    'Resource Depletion': {
      name: 'Resource Depletion',
      value: 0.7,
      unit: 'MJ surplus',
      severity: 'Low',
      definition: 'Measures depletion of abiotic resources',
      breakdown: [
        { source: 'Fossil Fuels', percentage: 60 },
        { source: 'Metals', percentage: 30 },
        { source: 'Minerals', percentage: 10 }
      ]
    }
  },
  'CML': {
    'Climate Change': {
      name: 'Climate Change',
      value: 3.8,
      unit: 'kg CO₂-eq',
      severity: 'Critical',
      definition: 'Measures greenhouse gas emissions contributing to global warming',
      breakdown: [
        { source: 'Energy', percentage: 62 },
        { source: 'Transport', percentage: 28 },
        { source: 'Materials', percentage: 10 }
      ]
    },
    'Acidification': {
      name: 'Acidification',
      value: 1.1,
      unit: 'kg SO₂-eq',
      severity: 'Moderate',
      definition: 'Measures emissions that cause acid rain and soil acidification',
      breakdown: [
        { source: 'Smelting', percentage: 52 },
        { source: 'Energy', percentage: 38 },
        { source: 'Transport', percentage: 10 }
      ]
    },
    'Eutrophication': {
      name: 'Eutrophication',
      value: 0.7,
      unit: 'kg PO₄-eq',
      severity: 'Low',
      definition: 'Measures nutrient enrichment in water bodies',
      breakdown: [
        { source: 'Wastewater', percentage: 52 },
        { source: 'Agriculture', percentage: 38 },
        { source: 'Runoff', percentage: 10 }
      ]
    },
    'Ozone Depletion': {
      name: 'Ozone Depletion',
      value: 0.045,
      unit: 'kg CFC-11-eq',
      severity: 'Low',
      definition: 'Measures destruction of stratospheric ozone layer',
      breakdown: [
        { source: 'Refrigerants', percentage: 72 },
        { source: 'Solvents', percentage: 18 },
        { source: 'Aerosols', percentage: 10 }
      ]
    },
    'Human Toxicity': {
      name: 'Human Toxicity',
      value: 2.9,
      unit: 'kg 1,4-DB-eq',
      severity: 'Critical',
      definition: 'Measures toxic emissions affecting human health',
      breakdown: [
        { source: 'Heavy Metals', percentage: 47 },
        { source: 'VOCs', percentage: 33 },
        { source: 'Particulates', percentage: 20 }
      ]
    },
    'Ecotoxicity': {
      name: 'Ecotoxicity',
      value: 1.6,
      unit: 'kg 1,4-DB-eq',
      severity: 'Moderate',
      definition: 'Measures toxic effects on ecosystems',
      breakdown: [
        { source: 'Pesticides', percentage: 48 },
        { source: 'Heavy Metals', percentage: 32 },
        { source: 'Industrial Waste', percentage: 20 }
      ]
    },
    'Land Use': {
      name: 'Land Use',
      value: 4.0,
      unit: 'm²',
      severity: 'Moderate',
      definition: 'Measures land occupation and transformation impacts',
      breakdown: [
        { source: 'Agriculture', percentage: 58 },
        { source: 'Infrastructure', percentage: 27 },
        { source: 'Mining', percentage: 15 }
      ]
    },
    'Water Depletion': {
      name: 'Water Depletion',
      value: 2.0,
      unit: 'm³',
      severity: 'Moderate',
      definition: 'Measures freshwater consumption',
      breakdown: [
        { source: 'Cooling', percentage: 47 },
        { source: 'Processing', percentage: 33 },
        { source: 'Cleaning', percentage: 20 }
      ]
    },
    'Resource Depletion': {
      name: 'Resource Depletion',
      value: 0.65,
      unit: 'kg Sb-eq',
      severity: 'Low',
      definition: 'Measures depletion of abiotic resources',
      breakdown: [
        { source: 'Metals', percentage: 52 },
        { source: 'Minerals', percentage: 33 },
        { source: 'Fossil Fuels', percentage: 15 }
      ]
    }
  },
  'EF 3.0': {
    'Climate Change': {
      name: 'Climate Change',
      value: 3.6,
      unit: 'kg CO₂-eq',
      severity: 'Critical',
      definition: 'Measures greenhouse gas emissions contributing to global warming',
      breakdown: [
        { source: 'Energy', percentage: 58 },
        { source: 'Transport', percentage: 32 },
        { source: 'Materials', percentage: 10 }
      ]
    },
    'Acidification': {
      name: 'Acidification',
      value: 1.15,
      unit: 'mol H+-eq',
      severity: 'Moderate',
      definition: 'Measures emissions that cause acid rain and soil acidification',
      breakdown: [
        { source: 'Smelting', percentage: 53 },
        { source: 'Energy', percentage: 37 },
        { source: 'Transport', percentage: 10 }
      ]
    },
    'Eutrophication': {
      name: 'Eutrophication',
      value: 0.75,
      unit: 'kg N-eq',
      severity: 'Low',
      definition: 'Measures nutrient enrichment in water bodies',
      breakdown: [
        { source: 'Wastewater', percentage: 51 },
        { source: 'Agriculture', percentage: 39 },
        { source: 'Runoff', percentage: 10 }
      ]
    },
    'Ozone Depletion': {
      name: 'Ozone Depletion',
      value: 0.042,
      unit: 'kg CFC-11-eq',
      severity: 'Low',
      definition: 'Measures destruction of stratospheric ozone layer',
      breakdown: [
        { source: 'Refrigerants', percentage: 71 },
        { source: 'Solvents', percentage: 19 },
        { source: 'Aerosols', percentage: 10 }
      ]
    },
    'Human Toxicity': {
      name: 'Human Toxicity',
      value: 3.0,
      unit: 'CTUh',
      severity: 'Critical',
      definition: 'Measures toxic emissions affecting human health',
      breakdown: [
        { source: 'Heavy Metals', percentage: 48 },
        { source: 'VOCs', percentage: 32 },
        { source: 'Particulates', percentage: 20 }
      ]
    },
    'Ecotoxicity': {
      name: 'Ecotoxicity',
      value: 1.65,
      unit: 'CTUe',
      severity: 'Moderate',
      definition: 'Measures toxic effects on ecosystems',
      breakdown: [
        { source: 'Pesticides', percentage: 49 },
        { source: 'Heavy Metals', percentage: 31 },
        { source: 'Industrial Waste', percentage: 20 }
      ]
    },
    'Land Use': {
      name: 'Land Use',
      value: 4.1,
      unit: 'Pt',
      severity: 'Moderate',
      definition: 'Measures land occupation and transformation impacts',
      breakdown: [
        { source: 'Agriculture', percentage: 59 },
        { source: 'Infrastructure', percentage: 26 },
        { source: 'Mining', percentage: 15 }
      ]
    },
    'Water Depletion': {
      name: 'Water Depletion',
      value: 2.1,
      unit: 'm³ depriv.',
      severity: 'Moderate',
      definition: 'Measures freshwater consumption',
      breakdown: [
        { source: 'Cooling', percentage: 48 },
        { source: 'Processing', percentage: 32 },
        { source: 'Cleaning', percentage: 20 }
      ]
    },
    'Resource Depletion': {
      name: 'Resource Depletion',
      value: 0.68,
      unit: 'kg Sb-eq',
      severity: 'Low',
      definition: 'Measures depletion of abiotic resources',
      breakdown: [
        { source: 'Metals', percentage: 54 },
        { source: 'Minerals', percentage: 31 },
        { source: 'Fossil Fuels', percentage: 15 }
      ]
    }
  }
};

// Severity Badge Component
const SeverityBadge: React.FC<{ severity: SeverityLevel }> = ({ severity }) => {
  const colors = {
    Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    Moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Low: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  const emoji = {
    Critical: '🔴',
    Moderate: '🟡',
    Low: '🟢'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${colors[severity]}`}>
      <span>{emoji[severity]}</span>
      {severity}
    </span>
  );
};

// Impact Card Component
const ImpactCard: React.FC<{ category: ImpactCategory }> = ({ category }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className={`relative ${showTooltip? "z-10": "z-5"} bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-100">{category.name}</h3>
        <Info className="w-4 h-4 text-gray-400" />
      </div>
      
      <div className="mb-3">
        <p className="text-3xl font-bold text-white">{category.value}</p>
        <p className="text-sm text-gray-400">{category.unit}</p>
      </div>

      <SeverityBadge severity={category.severity} />

      {showTooltip && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl">
          <p className="text-sm text-gray-300 mb-3">{category.definition}</p>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">Breakdown</p>
            {category.breakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm text-gray-300">{item.source}</span>
                <span className="text-sm font-semibold text-blue-400">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
const LCIADashboard: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<LCIAMethod>('ReCiPe');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const methods: { value: LCIAMethod; label: string; recommended?: boolean }[] = [
    { value: 'ReCiPe', label: 'ReCiPe', recommended: true },
    { value: 'TRACI', label: 'TRACI' },
    { value: 'CML', label: 'CML' },
    { value: 'EF 3.0', label: 'EF 3.0' }
  ];

  const currentData = dummyData[selectedMethod];
  const categories = Object.values(currentData);

  // Bar Chart Data
  const barChartData = {
    x: ['Energy', 'Transport', 'Materials', 'Processing', 'Waste'],
    y: [2.1, 1.05, 0.35, 0.7, 0.3],
    type: 'bar',
    marker: { color: '#3b82f6' }
  };

  // Sunburst Chart Data
  const sunburstData = {
    labels: ['Total', 'Raw Materials', 'Processes', 'Systems', 'Steel', 'Aluminum', 'Plastics', 'Smelting', 'Machining', 'Assembly', 'Production', 'Transport', 'Use Phase'],
    parents: ['', 'Total', 'Total', 'Total', 'Raw Materials', 'Raw Materials', 'Raw Materials', 'Processes', 'Processes', 'Processes', 'Systems', 'Systems', 'Systems'],
    values: [100, 30, 40, 30, 12, 10, 8, 18, 12, 10, 15, 8, 7],
    type: 'sunburst',
    marker: { colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6'] }
  };

  // Radar Chart Data
  const radarChartData = {
    r: categories.slice(0, 6).map(cat => cat.value),
    theta: categories.slice(0, 6).map(cat => cat.name),
    fill: 'toself',
    type: 'scatterpolar',
    marker: { color: '#3b82f6' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation Bar */}
      <nav className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              LCIA Dashboard
            </h1>

            {/* Method Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
              >
                <span className="text-sm font-medium">
                  {selectedMethod}
                  {methods.find(m => m.value === selectedMethod)?.recommended && ' ⭐'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                  {methods.map((method) => (
                    <button
                      key={method.value}
                      onClick={() => {
                        setSelectedMethod(method.value);
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm">{method.label}</span>
                      {method.recommended && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">
                          ⭐ AI Recommended
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Categories Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Impact Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, idx) => (
              <ImpactCard key={idx} category={category} />
            ))}
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Visual Analysis</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Bar Chart */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Process Contributions</h3>
              <Plot
                data={[barChartData]}
                layout={{
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  font: { color: '#e5e7eb' },
                  xaxis: { gridcolor: '#374151' },
                  yaxis: { gridcolor: '#374151', title: 'kg CO₂-eq' },
                  margin: { t: 20, r: 20, b: 40, l: 50 }
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: '100%', height: '300px' }}
              />
            </div>

            {/* Radar Chart */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Impact Profile Comparison</h3>
              <Plot
                data={[radarChartData]}
                layout={{
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  font: { color: '#e5e7eb' },
                  polar: {
                    radialaxis: { gridcolor: '#374151', color: '#9ca3af' },
                    angularaxis: { gridcolor: '#374151' }
                  },
                  margin: { t: 20, r: 80, b: 20, l: 80 }
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: '100%', height: '300px' }}
              />
            </div>
          </div>

          {/* Sunburst Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">System Breakdown</h3>
            <Plot
              data={[sunburstData]}
              layout={{
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#e5e7eb' },
                margin: { t: 0, r: 0, b: 0, l: 0 }
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%', height: '500px' }}
            />
          </div>
        </section>

        {/* AI Insights Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 backdrop-blur-sm border border-blue-700/50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500/20 rounded-lg p-2">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-300">AI-Generated Insights</h3>
                <p className="text-gray-300 mb-3">
                  Most of the <strong>Acidification</strong> impact comes from <strong>Smelting processes</strong> (55% contribution). Consider transitioning to renewable power sources to reduce SO₂ emissions.
                </p>
                <p className="text-gray-300 mb-3">
                  <strong>Climate Change</strong> is primarily driven by energy consumption. Implementing energy efficiency measures could reduce this impact by up to 40%.
                </p>
                <p className="text-gray-300">
                  <strong>Water Depletion</strong> shows moderate concern. Implementing closed-loop cooling systems could significantly decrease freshwater consumption.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Export Section */}
        <section>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Export Data</h3>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export as PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export as CSV
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export as JSON
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            LCIA Dashboard © 2025 - Environmental Impact Assessment Tool
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LCIADashboard