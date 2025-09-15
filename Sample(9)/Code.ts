import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// --- Type Definitions for a more robust application ---

/**
 * Interface for the main data item structure.
 */
interface AppDataItem {
    id: number;
    product: string;
    category: string;
    sales: number;
}

/**
 * Interface for the props of the MetricCard component.
 */
interface MetricCardProps {
    title: string;
    value: string | number;
    color: string;
}

/**
 * Interface for the props of the Sidebar component.
 */
interface SidebarProps {
    activeView: string;
    onViewChange: (view: string) => void;
}

/**
 * Interface for the props of the ChartSettings component.
 */
interface ChartSettingsProps {
    chartType: string;
    onChartTypeChange: (type: string) => void;
    colorPalette: string;
    onColorPaletteChange: (palette: string) => void;
    dataCount: number;
    onDataCountChange: (count: number) => void;
}

// --- Reusable Components ---

const MetricCard: React.FC<MetricCardProps> = ({ title, value, color }) => (
    <div className="card flex flex-col items-center justify-center p-6">
        <span className={`text-4xl font-bold ${color}`}>{value}</span>
        <p className="text-gray-500 mt-1">{title}</p>
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => (
    <aside className="sidebar fixed top-0 left-0 bottom-0 z-10 w-[280px] bg-gray-900 text-white p-8 flex flex-col gap-4">
        <div className="text-2xl font-bold mb-8 text-center text-blue-400">
            Data Dashboard
        </div>
        <nav className="flex flex-col gap-2">
            <button
                className={`nav-button ${activeView === 'dashboard-view' ? 'active' : ''}`}
                onClick={() => onViewChange('dashboard-view')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10v11m6-9v9m6-5v5m6-5v5m-19 3h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v9a2 2 0 002 2z" />
                </svg>
                Dashboard
            </button>
            <button
                className={`nav-button ${activeView === 'table-view' ? 'active' : ''}`}
                onClick={() => onViewChange('table-view')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Data Table
            </button>
            <button
                className={`nav-button ${activeView === 'settings-view' ? 'active' : ''}`}
                onClick={() => onViewChange('settings-view')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.44 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
            </button>
        </nav>
    </aside>
);

const ChartSettings: React.FC<ChartSettingsProps> = ({ chartType, onChartTypeChange, colorPalette, onColorPaletteChange, dataCount, onDataCountChange }) => (
    <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Chart Settings</h2>
        <div className="flex flex-col gap-6">
            <div>
                <label htmlFor="chart-type" className="block text-gray-700 font-medium mb-1">Chart Type</label>
                <select
                    id="chart-type"
                    value={chartType}
                    onChange={(e) => onChartTypeChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="doughnut">Doughnut Chart</option>
                </select>
            </div>
            <div>
                <label htmlFor="color-palette" className="block text-gray-700 font-medium mb-1">Color Palette</label>
                <select
                    id="color-palette"
                    value={colorPalette}
                    onChange={(e) => onColorPaletteChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="default">Default</option>
                    <option value="pastel">Pastel</option>
                    <option value="vibrant">Vibrant</option>
                </select>
            </div>
            <div>
                <label htmlFor="data-count" className="block text-gray-700 font-medium mb-1">
                    Number of Data Points: <span id="data-count-value">{dataCount}</span>
                </label>
                <input
                    type="range"
                    id="data-count"
                    min="3"
                    max="20"
                    value={dataCount}
                    onChange={(e) => onDataCountChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
    </div>
);

const DataTable: React.FC<{ data: AppDataItem[] }> = ({ data }) => (
    <div className="table-container overflow-x-auto">
        <table className="data-table w-full">
            <thead>
                <tr>
                    <th className="p-3 text-left bg-gray-50 text-xs font-semibold uppercase tracking-wider">ID</th>
                    <th className="p-3 text-left bg-gray-50 text-xs font-semibold uppercase tracking-wider">Product</th>
                    <th className="p-3 text-left bg-gray-50 text-xs font-semibold uppercase tracking-wider">Category</th>
                    <th className="p-3 text-left bg-gray-50 text-xs font-semibold uppercase tracking-wider">Sales</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {data.map((item: AppDataItem) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="p-3 whitespace-nowrap">{item.id}</td>
                        <td className="p-3 whitespace-nowrap">{item.product}</td>
                        <td className="p-3 whitespace-nowrap">{item.category}</td>
                        <td className="p-3 whitespace-nowrap">${item.sales.toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


// --- Main Application Component ---

const App: React.FC = () => {
    // State management for view and chart settings
    const [activeView, setActiveView] = useState<string>('dashboard-view');
    const [chartType, setChartType] = useState<string>('bar');
    const [dataCount, setDataCount] = useState<number>(10);
    const [colorPalette, setColorPalette] = useState<string>('default');
    
    // State for data and loading status
    const [appData, setAppData] = useState<AppDataItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // useRef to manage the chart instance
    const chartRef = useRef<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // --- Utility Functions ---

    const generateRandomData = (count: number): { labels: string[]; data: number[] } => {
        const labels = Array.from({ length: count }, (_, i) => `Data Point ${i + 1}`);
        const data = Array.from({ length: count }, () => Math.floor(Math.random() * 500) + 100);
        return { labels, data };
    };

    const generateColors = (count: number, palette: string): string[] => {
        const colors: { [key: string]: string[] } = {
            default: [
                '#4299e1', '#667eea', '#9f7aea', '#d53f8c', '#ed64a6', '#f6e05e',
                '#48bb78', '#38b2ac', '#4fd1c5', '#718096', '#a0aec0'
            ],
            pastel: [
                '#a7f3d0', '#6ee7b7', '#dbeafe', '#bfdbfe', '#fef3c7', '#fde68a',
                '#dcfce7', '#bae6fd', '#fbcfe8', '#e9d5ff'
            ],
            vibrant: [
                '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6',
                '#6366f1', '#a855f7', '#d946ef', '#ef4444'
            ]
        };
        return colors[palette].slice(0, count);
    };

    // --- React Hooks for Lifecycle and State Management ---

    // Effect to simulate data fetching on component mount
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const fetchedData: AppDataItem[] = [
                { id: 1, product: 'Laptops', category: 'Electronics', sales: 1500 },
                { id: 2, product: 'Smartphones', category: 'Electronics', sales: 2200 },
                { id: 3, product: 'Coffee Maker', category: 'Appliances', sales: 750 },
                { id: 4, product: 'Headphones', category: 'Electronics', sales: 980 },
                { id: 5, product: 'Blender', category: 'Appliances', sales: 600 },
                { id: 6, product: 'Desk Chair', category: 'Furniture', sales: 450 },
                { id: 7, product: 'Keyboard', category: 'Electronics', sales: 300 },
                { id: 8, product: 'Dining Table', category: 'Furniture', sales: 1100 },
                { id: 9, product: 'Webcam', category: 'Electronics', sales: 400 },
                { id: 10, product: 'Toaster', category: 'Appliances', sales: 250 },
                { id: 11, product: 'Monitor', category: 'Electronics', sales: 850 },
                { id: 12, product: 'Sofa', category: 'Furniture', sales: 1800 },
                { id: 13, product: 'Microwave', category: 'Appliances', sales: 350 },
                { id: 14, product: 'Speakers', category: 'Electronics', sales: 650 },
                { id: 15, product: 'Bookshelf', category: 'Furniture', sales: 200 }
            ];
            setAppData(fetchedData);
            setIsLoading(false);
        }, 1500); // Simulate network delay
    }, []);

    // Effect to manage the Chart.js instance. It re-runs whenever relevant state changes.
    useEffect(() => {
        if (activeView !== 'dashboard-view' || !canvasRef.current || isLoading) {
            return;
        }

        // Clean up previous chart instance
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const { labels, data } = generateRandomData(dataCount);
        const backgroundColors = generateColors(dataCount, colorPalette);
        const borderColors = backgroundColors.map(color => color.replace('1)', '0.8)'));
        
        const chartConfig: Chart.ChartConfiguration = {
            type: chartType as 'bar' | 'line' | 'pie' | 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sample Data',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: chartType !== 'pie' && chartType !== 'doughnut' },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    x: { display: chartType !== 'pie' && chartType !== 'doughnut' },
                    y: { display: chartType !== 'pie' && chartType !== 'doughnut', beginAtZero: true }
                }
            }
        };

        // Create the new chart instance
        chartRef.current = new Chart(canvasRef.current, chartConfig);

    }, [activeView, chartType, dataCount, colorPalette, isLoading]);

    // Derived values for performance metrics
    const totalRevenue = appData.reduce((sum, item) => sum + item.sales, 0);
    const newUsers = Math.floor(Math.random() * 500) + 100;
    const conversionRate = (Math.random() * 5 + 2).toFixed(2);

    const renderView = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-[50vh]">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="ml-4 text-gray-500">Loading data...</p>
                </div>
            );
        }
        
        switch (activeView) {
            case 'dashboard-view':
                return (
                    <div className="view-section active">
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Performance Metrics</h2>
                            <canvas ref={canvasRef} id="myChart"></canvas>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <MetricCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} color="text-blue-500" />
                            <MetricCard title="New Users" value={newUsers} color="text-green-500" />
                            <MetricCard title="Conversion Rate" value={`${conversionRate}%`} color="text-yellow-500" />
                        </div>
                    </div>
                );
            case 'table-view':
                return (
                    <div className="view-section active">
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Raw Data Table</h2>
                            <DataTable data={appData} />
                        </div>
                    </div>
                );
            case 'settings-view':
                return (
                    <div className="view-section active">
                        <ChartSettings
                            chartType={chartType}
                            onChartTypeChange={setChartType}
                            colorPalette={colorPalette}
                            onColorPaletteChange={setColorPalette}
                            dataCount={dataCount}
                            onDataCountChange={setDataCount}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-inter">
            {/* Custom Styles */}
            <style>
                {`
                    body {
                        font-family: 'Inter', sans-serif;
                        background-color: #f3f4f6;
                    }
                    .container {
                        min-height: 100vh;
                        display: flex;
                        transition: all 0.3s ease;
                    }
                    .sidebar {
                        transition: width 0.3s ease;
                        padding-top: 4rem;
                    }
                    .content {
                        margin-left: 280px;
                        flex-grow: 1;
                        padding: 2rem;
                        transition: margin-left 0.3s ease;
                    }
                    .nav-button {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 0.75rem 1.25rem;
                        border-radius: 9999px;
                        text-align: left;
                        font-weight: 500;
                        cursor: pointer;
                        transition: background-color 0.2s ease, transform 0.1s ease;
                        background-color: transparent;
                        border: none;
                        color: white;
                    }
                    .nav-button:hover {
                        background-color: #374151;
                        transform: scale(1.02);
                    }
                    .nav-button.active {
                        background-color: #4b5563;
                    }
                    .card {
                        background-color: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        padding: 2rem;
                        margin-bottom: 2rem;
                    }
                    .view-section {
                        animation: fadeIn 0.5s ease-out;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .data-table th {
                        text-align: left;
                        padding: 0.75rem;
                        border-bottom: 1px solid #e5e7eb;
                        background-color: #f9fafb;
                        font-weight: 600;
                        color: #4b5563;
                        text-transform: uppercase;
                        font-size: 0.875rem;
                    }
                    .data-table td {
                        text-align: left;
                        padding: 0.75rem;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .spinner-border {
                        display: inline-block;
                        width: 2rem;
                        height: 2rem;
                        vertical-align: -0.125em;
                        border: 0.25em solid currentColor;
                        border-right-color: transparent;
                        border-radius: 50%;
                        -webkit-animation: .75s linear infinite spinner-border;
                        animation: .75s linear infinite spinner-border;
                    }
                    @keyframes spinner-border {
                        to {
                            -webkit-transform: rotate(360deg);
                            transform: rotate(360deg);
                        }
                    }
                    .visually-hidden {
                        position: absolute;
                        width: 1px;
                        height: 1px;
                        margin: -1px;
                        padding: 0;
                        overflow: hidden;
                        clip: rect(0, 0, 0, 0);
                        border: 0;
                    }
                `}
            </style>
            
            <Sidebar activeView={activeView} onViewChange={setActiveView} />
            
            <main className="content">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
                    <p className="text-gray-500 mt-2">Interactive data visualization and management system.</p>
                </header>
                {renderView()}
            </main>
        </div>
    );
};

export default App;
