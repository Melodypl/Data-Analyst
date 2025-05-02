const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const statisticsContainer = document.getElementById('statistics');


window.currentData = null;


dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', handleDrop);
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);


function showLoading() {
    dropZone.innerHTML = `
        <div class="animate-pulse">
            <i class="fas fa-spinner fa-spin text-5xl text-indigo-500 mb-4"></i>
            <p class="text-gray-600">Processando arquivo...</p>
        </div>
    `;
}

function resetDropZone() {
    dropZone.innerHTML = `
        <i class="fas fa-cloud-upload-alt text-5xl text-indigo-500 mb-4"></i>
        <p class="text-gray-600 mb-2">Arraste e solte seu arquivo aqui ou</p>
        <button class="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium">
            Selecionar Arquivo
        </button>
        <p class="mt-2 text-sm text-gray-500">Formatos aceitos: CSV, JSON</p>
        <input type="file" id="fileInput" class="hidden" accept=".csv,.json">
    `;
    
   
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
}

function showError(message) {
    dropZone.innerHTML = `
        <div class="text-red-500">
            <i class="fas fa-exclamation-circle text-5xl mb-4"></i>
            <p>${message}</p>
            <button class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm" onclick="resetDropZone()">
                Tentar Novamente
            </button>
        </div>
    `;
}

function showSuccess() {
    dropZone.innerHTML = `
        <div class="text-green-500">
            <i class="fas fa-check-circle text-5xl mb-4"></i>
            <p>Arquivo processado com sucesso!</p>
            <button class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm" onclick="resetDropZone()">
                Carregar Outro Arquivo
            </button>
        </div>
    `;
}


function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}


async function processFile(file) {
    if (!isValidFileType(file)) {
        showError('Por favor, envie um arquivo CSV ou JSON válido.');
        return;
    }

    showLoading();

    try {
        const content = await readFileContent(file);
        const data = parseFileData(file, content);
        window.currentData = data;
        
        updateStatistics(data);
        updateCharts(data);
        showSuccess();
    } catch (error) {
        showError('Erro ao processar o arquivo: ' + error.message);
        console.error('Error processing file:', error);
    }
}

function isValidFileType(file) {
    const validTypes = ['.csv', '.json'];
    const fileName = file.name.toLowerCase();
    return validTypes.some(type => fileName.endsWith(type));
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Erro ao ler o arquivo'));
        reader.readAsText(file);
    });
}

function parseFileData(file, content) {
    if (file.name.toLowerCase().endsWith('.csv')) {
        return parseCSV(content);
    } else {
        const jsonData = JSON.parse(content);
        
        return Array.isArray(jsonData) ? jsonData : (jsonData.dados || jsonData.data || Object.values(jsonData)[0]);
    }
}

function parseCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(header => header.trim());
    
    const data = lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim());
        const row = {};
        headers.forEach((header, index) => {
            const value = values[index];
            row[header] = isNaN(value) ? value : parseFloat(value);
        });
        return row;
    });

    return data;
}


function updateStatistics(data) {
    if (!data || data.length === 0) return;

    const numericColumns = findNumericColumns(data);
    const statistics = calculateStatistics(data, numericColumns);
    
    displayStatistics(statistics);
}

function findNumericColumns(data) {
    const columns = Object.keys(data[0]);
    return columns.filter(column => {
        return data.every(row => !isNaN(row[column]));
    });
}

function calculateStatistics(data, columns) {
    const stats = {};

    columns.forEach(column => {
        const values = data.map(row => row[column]).filter(val => !isNaN(val));
        
        stats[column] = {
            média: calculateMean(values),
            mediana: calculateMedian(values),
            mínimo: Math.min(...values),
            máximo: Math.max(...values),
            desvio: calculateStandardDeviation(values)
        };
    });

    return stats;
}

function calculateMean(values) {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(2);
}

function calculateMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
        return ((sorted[middle - 1] + sorted[middle]) / 2).toFixed(2);
    }
    
    return sorted[middle].toFixed(2);
}

function calculateStandardDeviation(values) {
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    const variance = squareDiffs.reduce((acc, val) => acc + val, 0) / values.length;
    return Math.sqrt(variance).toFixed(2);
}

function displayStatistics(statistics) {
    statisticsContainer.innerHTML = '';

    Object.entries(statistics).forEach(([column, stats]) => {
        const statDiv = document.createElement('div');
        statDiv.className = 'bg-gray-50 p-4 rounded-lg fade-in';
        
        statDiv.innerHTML = `
            <h4 class="font-semibold text-gray-700 mb-2">${column}</h4>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-gray-600">Média</p>
                    <p class="font-medium">${stats.média}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Mediana</p>
                    <p class="font-medium">${stats.mediana}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Mínimo</p>
                    <p class="font-medium">${stats.mínimo}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Máximo</p>
                    <p class="font-medium">${stats.máximo}</p>
                </div>
                <div class="col-span-2">
                    <p class="text-sm text-gray-600">Desvio Padrão</p>
                    <p class="font-medium">${stats.desvio}</p>
                </div>
            </div>
        `;
        
        statisticsContainer.appendChild(statDiv);
    });
}