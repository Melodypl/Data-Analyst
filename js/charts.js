let mainChart = null;
let currentColumn = null;


function getThemeColors() {
    const isDark = document.documentElement.classList.contains('dark');
    return {
        text: isDark ? '#e5e5e5' : '#1a1a1a',
        grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        background: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.5)',
        border: isDark ? 'rgb(129, 132, 255)' : 'rgb(99, 102, 241)'
    };
}


function initializeChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    const colors = getThemeColors();
    
    mainChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Dados',
                data: [],
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: colors.text,
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Visualização dos Dados',
                    color: colors.text,
                    font: {
                        size: 16,
                        weight: 'bold',
                        family: 'Inter'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: colors.grid
                    },
                    ticks: {
                        color: colors.text,
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: colors.text,
                        font: {
                            family: 'Inter'
                        }
                    }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        }
    });

    
    window.mainChart = mainChart;
}


function updateChartsDisplay(data) {
    if (!data || data.length === 0) return;
    
    
    const numericColumns = findNumericColumns(data);
    if (numericColumns.length === 0) return;

   
    if (!currentColumn || !numericColumns.includes(currentColumn)) {
        currentColumn = numericColumns[0];
    }
    
    updateChartData(data);
    
    
    addColumnSelector(numericColumns);
    
    
    addChartTypeSelector();
}


function updateChartData(data) {
    if (!data || !currentColumn) return;
    
    const values = data.map(row => row[currentColumn]);
    const labels = data.map((_, index) => `Item ${index + 1}`);
    const colors = getThemeColors();

  
    if (!mainChart) {
        initializeChart();
    }

    mainChart.data.labels = labels;
    mainChart.data.datasets[0].data = values;
    mainChart.data.datasets[0].label = currentColumn;
    mainChart.data.datasets[0].backgroundColor = colors.background;
    mainChart.data.datasets[0].borderColor = colors.border;
    mainChart.options.plugins.title.text = `Visualização de ${currentColumn}`;
    
    mainChart.update();
}


function findNumericColumns(data) {
    const columns = Object.keys(data[0]);
    return columns.filter(column => {
        return data.every(row => !isNaN(row[column]));
    });
}


function addColumnSelector(columns) {
    let selector = document.getElementById('columnSelector');
    
    if (!selector) {
        const chartContainer = document.getElementById('mainChart').parentElement;
        
        selector = document.createElement('div');
        selector.id = 'columnSelector';
        selector.className = 'mb-4 flex gap-2 flex-wrap';
        
        columns.forEach(column => {
            const button = document.createElement('button');
            button.className = `px-3 py-2 rounded-md text-sm font-medium transition-colors
                              ${currentColumn === column ? 
                                'bg-indigo-600 text-white dark:bg-indigo-500' : 
                                'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`;
            button.textContent = column;
            
            button.addEventListener('click', () => {
                currentColumn = column;
                updateChartData(window.currentData);
                
                
                document.querySelectorAll('#columnSelector button').forEach(btn => {
                    btn.className = btn.textContent === column ?
                        'px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white dark:bg-indigo-500 transition-colors' :
                        'px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors';
                });
            });
            
            selector.appendChild(button);
        });

        chartContainer.insertBefore(selector, chartContainer.firstChild);
    }
}


function addChartTypeSelector() {
    let selector = document.getElementById('chartTypeSelector');
    
    if (!selector) {
        const chartContainer = document.getElementById('mainChart').parentElement;
        
        selector = document.createElement('div');
        selector.id = 'chartTypeSelector';
        selector.className = 'mb-4 flex gap-2';
        
        const chartTypes = [
            { type: 'bar', icon: 'fa-chart-bar', label: 'Barras' },
            { type: 'line', icon: 'fa-chart-line', label: 'Linha' },
            { type: 'pie', icon: 'fa-chart-pie', label: 'Pizza' }
        ];

        chartTypes.forEach(({ type, icon, label }) => {
            const button = document.createElement('button');
            button.className = `px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors
                              ${mainChart.config.type === type ? 
                                'bg-indigo-600 text-white dark:bg-indigo-500' : 
                                'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`;
            button.innerHTML = `<i class="fas ${icon}"></i> ${label}`;
            
            button.addEventListener('click', () => changeChartType(type));
            
            selector.appendChild(button);
        });

       
        const columnSelector = document.getElementById('columnSelector');
        if (columnSelector) {
            columnSelector.after(selector);
        } else {
            chartContainer.insertBefore(selector, chartContainer.firstChild);
        }
    }
}


function changeChartType(newType) {
    if (!mainChart) return;

   
    const data = mainChart.data;
    const colors = getThemeColors();
    const options = {
        ...mainChart.options,
        scales: {
            y: {
                ...mainChart.options.scales.y,
                display: newType !== 'pie',
                grid: {
                    color: colors.grid
                },
                ticks: {
                    color: colors.text
                }
            },
            x: {
                ...mainChart.options.scales.x,
                display: newType !== 'pie',
                ticks: {
                    color: colors.text
                }
            }
        }
    };
    
   
    mainChart.destroy();
    
   
    const ctx = document.getElementById('mainChart').getContext('2d');
    mainChart = new Chart(ctx, {
        type: newType,
        data: {
            ...data,
            datasets: [{
                ...data.datasets[0],
                backgroundColor: colors.background,
                borderColor: colors.border
            }]
        },
        options: options
    });

    
    window.mainChart = mainChart;

   
    const buttons = document.querySelectorAll('#chartTypeSelector button');
    buttons.forEach(button => {
        if (button.textContent.includes(newType === 'bar' ? 'Barras' : 
                                      newType === 'line' ? 'Linha' : 'Pizza')) {
            button.className = button.className.replace(
                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
                'bg-indigo-600 text-white dark:bg-indigo-500'
            );
        } else {
            button.className = button.className.replace(
                'bg-indigo-600 text-white dark:bg-indigo-500',
                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            );
        }
    });
}


document.addEventListener('DOMContentLoaded', initializeChart);