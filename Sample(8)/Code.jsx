import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const App = () => {
    // --- Global State and Data ---
    const [activeView, setActiveView] = useState('dashboard-view');
    const [chartType, setChartType] = useState('bar');
    const [dataCount, setDataCount] = useState(10);
    const [colorPalette, setColorPalette] = useState('default');
    
    // useRef hook to hold the chart instance, preventing re-creation on every render
    const chartRef = useRef(null);
    const canvasRef = useRef(null);

    const appData = [
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

    // --- Utility Functions ---

    const generateRandomData = (count) => {
        const labels = Array.from({ length: count }, (_, i) => `Data Point ${i + 1}`);
        const data = Array.from({ length: count }, () => Math.floor(Math.random() * 500) + 100);
        return { labels, data };
    };

    const generateColors = (count, palette) => {
        const colors = {
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

    const totalRevenue = appData.reduce((sum, item) => sum + item.sales, 0);
    const newUsers = Math.floor(Math.random() * 500) + 100;
    const conversionRate = (Math.random() * 5 + 2).toFixed(2);

    // --- React Hooks for Lifecycle and State Management ---

    // useEffect hook to manage the Chart.js instance
    useEffect(() => {
        if (activeView === 'dashboard-view') {
            const { labels, data } = generateRandomData(dataCount);
            const backgroundColors = generateColors(dataCount, colorPalette);
            const borderColors = backgroundColors.map(color => color.replace('1)', '0.8)'));
    
            const chartConfig = {
                type: chartType,
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
                        legend: { display: chartType !== 'pie' },
                        tooltip: { mode: 'index', intersect: false, }
                    },
                    scales: {
                        x: { display: chartType !== 'pie' },
                        y: { display: chartType !== 'pie', beginAtZero: true }
                    }
                }
            };
    
            if (chartRef.current) {
                chartRef.current.destroy();
            }
    
            // Create a new chart instance and store it in the ref
            chartRef.current = new Chart(canvasRef.current, chartConfig);
        }
    }, [activeView, chartType, dataCount, colorPalette]);

    // --- Render Logic ---
    const renderTable = () => (
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
                    {appData.map((item) => (
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

    const renderSettings = () => (
        <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Chart Settings</h2>
            <div className="flex flex-col gap-6">
                <div>
                    <label htmlFor="chart-type" className="block text-gray-700 font-medium mb-1">Chart Type</label>
                    <select
                        id="chart-type"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="pie">Pie Chart</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="color-palette" className="block text-gray-700 font-medium mb-1">Color Palette</label>
                    <select
                        id="color-palette"
                        value={colorPalette}
                        onChange={(e) => setColorPalette(e.target.value)}
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
                        onChange={(e) => setDataCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );

    const renderView = () => {
        switch (activeView) {
            case 'dashboard-view':
                return (
                    <div className="view-section active">
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Performance Metrics</h2>
                            <canvas ref={canvasRef} id="myChart"></canvas>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="card flex flex-col items-center justify-center p-6">
                                <span className="text-4xl font-bold text-blue-500">${totalRevenue.toLocaleString()}</span>
                                <p className="text-gray-500">Total Revenue</p>
                            </div>
                            <div className="card flex flex-col items-center justify-center p-6">
                                <span className="text-4xl font-bold text-green-500">{newUsers}</span>
                                <p className="text-gray-500">New Users</p>
                            </div>
                            <div className="card flex flex-col items-center justify-center p-6">
                                <span className="text-4xl font-bold text-yellow-500">{conversionRate}%</span>
                                <p className="text-gray-500">Conversion Rate</p>
                            </div>
                        </div>
                    </div>
                );
            case 'table-view':
                return (
                    <div className="view-section active">
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Raw Data Table</h2>
                            {renderTable()}
                        </div>
                    </div>
                );
            case 'settings-view':
                return (
                    <div className="view-section active">
                        {renderSettings()}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container font-inter">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="text-2xl font-bold mb-8 text-center text-blue-400">
                    Data Dashboard
                </div>
                <button
                    className={`nav-button ${activeView === 'dashboard-view' ? 'active' : ''}`}
                    onClick={() => setActiveView('dashboard-view')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10v11m6-9v9m6-5v5m6-5v5m-19 3h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v9a2 2 0 002 2z" />
                    </svg>
                    Dashboard
                </button>
                <button
                    className={`nav-button ${activeView === 'table-view' ? 'active' : ''}`}
                    onClick={() => setActiveView('table-view')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Data Table
                </button>
                <button
                    className={`nav-button ${activeView === 'settings-view' ? 'active' : ''}`}
                    onClick={() => setActiveView('settings-view')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.44 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                </button>
            </aside>
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
