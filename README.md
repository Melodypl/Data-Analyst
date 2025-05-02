# Plataforma de Análise de Dados

Uma aplicação web simples e elegante para análise de dados, construída com HTML, Tailwind CSS e JavaScript puro.

## Funcionalidades

- Upload de arquivos CSV e JSON via drag-and-drop ou seleção manual
- Análise estatística automática (média, mediana, mínimo, máximo, desvio padrão)
- Visualização de dados com gráficos interativos
- Suporte para múltiplos tipos de gráficos (barras, linha, pizza)
- Interface responsiva e moderna
- Feedback visual durante o processamento

## Como Usar

1. Acesse a aplicação através do navegador
2. Arraste e solte um arquivo CSV ou JSON na área de upload, ou clique para selecionar
3. Os dados serão processados automaticamente
4. Visualize as estatísticas e gráficos gerados
5. Alterne entre diferentes tipos de gráficos usando os botões disponíveis
6. Selecione diferentes colunas numéricas para análise

## Formato dos Arquivos

### CSV
- Deve conter cabeçalho na primeira linha
- Valores separados por vírgula
- Exemplo:
```csv
idade,salario,experiencia
25,3500,2
30,4200,5
35,5100,8
```

### JSON
- Pode ser um array de objetos ou ter uma estrutura aninhada
- Exemplo:
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

## Tecnologias Utilizadas

- HTML5
- Tailwind CSS
- JavaScript (ES6+)
- Chart.js para visualizações
- Font Awesome para ícones
- Google Fonts (Inter)