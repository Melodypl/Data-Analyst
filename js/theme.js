document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const isDark = localStorage.getItem('theme') === 'dark';
    
    
    if (isDark) {
        html.classList.add('dark');
        updateThemeIcon(true);
    }

    
    themeToggle.addEventListener('click', () => {
        const isDarkMode = html.classList.toggle('dark');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        updateThemeIcon(isDarkMode);
        updateChartTheme(isDarkMode);
    });
});


function updateThemeIcon(isDark) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = isDark ? 'fas fa-moon text-xl' : 'fas fa-sun text-xl';
}


function updateChartTheme(isDark) {
    if (window.mainChart) {
        const textColor = isDark ? '#e5e5e5' : '#1a1a1a';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        window.mainChart.options.plugins.title.color = textColor;
        window.mainChart.options.plugins.legend.labels.color = textColor;
        window.mainChart.options.scales.y.grid.color = gridColor;
        window.mainChart.options.scales.y.ticks.color = textColor;
        window.mainChart.options.scales.x.ticks.color = textColor;
        
        window.mainChart.update();
    }
}