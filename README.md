# Data Analysis Platform

A simple and elegant web application for data analysis, built with HTML, Tailwind CSS, and vanilla JavaScript.

## Feaures

- Upload CSV and JSON files via drag-and-drop or manual selection
- Automatic statistical analysis (mean, median, min, max, standard deviation)
- Data visualization with interactive charts
- Support for multiple chart types (bar, line, pie)
- Responsive and modern interface
- Visual feedback during processingo

## How to Use

1. Access the application through your browser
2. Drag and drop a CSV or JSON file into the upload area, or click to select
3. The data will be processed automatically
4. View the generated statistics and charts
5. Switch between different chart types using the available buttons
6. Select different numeric columns for analysis

## File Format

### CSV
- Must contain a header in the first row
- Values separated by commas
- Example:
```csv
idade,salario,experiencia
25,3500,2
30,4200,5
35,5100,8
```

### JSON
- Can be an array of objects or a nested sructure
- Example:
```json
{
    "dados": [
        {
            "idade": 25,
            "salario": 3500,
            "experiencia": 2
        },
        {
            "idade": 30,
            "salario": 4200,
            "experiencia": 5
        }
    ]
}
```

## Technologies Used

- HTML5
- Tailwind CSS
- JavaScript 
- Chart.js para visualizações
- Font Awesome para ícones
- Google Fonts (Inter)
