// Función de activación Sigmoid
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

// Derivada de Sigmoid (asumiendo que 'y' ya es la salida de sigmoid)
function dsigmoid(y) {
    return y * (1 - y);
}

class SimpleNeuralNetwork {

    /**
     * @param {number} inputNodes - Nodos de entrada (3 para nosotros: %Sust, %Pot, %Hum)
     * @param {number} hiddenNodes - Nodos ocultos (ej. 4)
     * @param {number} outputNodes - Nodos de salida (4 para nuestras clases)
     */
    constructor(inputNodes, hiddenNodes, outputNodes) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;

        // Etiquetas de las clases para la predicción
        this.classLabels = ['Líder Humano', 'Colaborador Eficaz', 'Dependiente Pasivo', 'Autómata Controlado'];

        // Inicializar pesos y sesgos (biases) aleatoriamente
        this.weights_ih = this.randomMatrix(this.hiddenNodes, this.inputNodes);
        this.weights_ho = this.randomMatrix(this.outputNodes, this.hiddenNodes);

        this.bias_h = this.randomMatrix(this.hiddenNodes, 1);
        this.bias_o = this.randomMatrix(this.outputNodes, 1);

        this.learning_rate = 0.1;
    }

    // --- Funciones de Utilidad Interna ---

    // Genera una matriz (array de arrays) con valores aleatorios
    randomMatrix(rows, cols) {
        let matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols; j++) {
                matrix[i][j] = Math.random() * 2 - 1; // Valores entre -1 y 1
            }
        }
        return matrix;
    }

    // Convierte un array [1, 2, 3] a una matriz [[1], [2], [3]]
    arrayToMatrix(arr) {
        let matrix = [];
        for (let i = 0; i < arr.length; i++) {
            matrix[i] = [arr[i]];
        }
        return matrix;
    }

    // Convierte una matriz [[1], [2], [3]] de nuevo a un array [1, 2, 3]
    matrixToArray(matrix) {
        let arr = [];
        for (let i = 0; i < matrix.length; i++) {
            arr.push(matrix[i][0]);
        }
        return arr;
    }

    // Multiplicación de matrices (simplificada para este caso)
    matrixMultiply(a, b) {
        let rowsA = a.length;
        let colsA = a[0].length;
        let rowsB = b.length;
        let colsB = b[0].length;

        if (colsA !== rowsB) {
            console.error("Error: Dimensiones de matriz incompatibles para multiplicar");
            return null;
        }

        let result = this.zeroMatrix(rowsA, colsB);

        for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsB; j++) {
                let sum = 0;
                for (let k = 0; k < colsA; k++) {
                    sum += a[i][k] * b[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    // Operaciones de matrices (suma, resta)
    matrixMap(matrix, fn) {
        return matrix.map((row, i) => row.map((val, j) => fn(val, i, j)));
    }

    matrixAdd(a, b) {
        return this.matrixMap(a, (val, i, j) => val + b[i][j]);
    }
    
    matrixSubtract(a, b) {
        return this.matrixMap(a, (val, i, j) => val - b[i][j]);
    }
    
    matrixTranspose(matrix) {
        let rows = matrix.length;
        let cols = matrix[0].length;
        let result = this.zeroMatrix(cols, rows);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[j][i] = matrix[i][j];
            }
        }
        return result;
    }

    // Matriz de ceros
    zeroMatrix(rows, cols) {
        let matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix[i] = new Array(cols).fill(0);
        }
        return matrix;
    }

    // --- Funciones Principales ---

    /**
     * feedForward: Calcula la salida de la red para una entrada dada.
     * @param {number[]} inputArray - Array de entradas (ej. [30, 50, 20])
     * @returns {number[]} - Array de salidas (probabilidades de cada clase)
     */
    feedForward(inputArray) {
        // Normalizar entradas de 0-100 a 0-1
        let normalizedInputs = inputArray.map(x => x / 100);
        let inputs = this.arrayToMatrix(normalizedInputs);

        // 1. Calcular salidas de la capa oculta
        let hidden = this.matrixMultiply(this.weights_ih, inputs);
        hidden = this.matrixAdd(hidden, this.bias_h);
        hidden = this.matrixMap(hidden, (val) => sigmoid(val)); // Aplicar activación

        // 2. Calcular salidas de la capa de salida
        let outputs = this.matrixMultiply(this.weights_ho, hidden);
        outputs = this.matrixAdd(outputs, this.bias_o);
        outputs = this.matrixMap(outputs, (val) => sigmoid(val)); // Aplicar activación

        // 3. Devolver el resultado como un array simple
        return this.matrixToArray(outputs);
    }

    /**
     * train: Entrena la red usando Backpropagation.
     * @param {number[]} inputArray - Array de entradas (ej. [10, 20, 70])
     * @param {number[]} targetArray - Array de salidas deseadas (ej. [1, 0, 0, 0])
     */
    train(inputArray, targetArray) {
        // --- 1. FEEDFORWARD (convertir todo a matrices) ---
        
        // Normalizar entradas y convertir a matriz
        let normalizedInputs = inputArray.map(x => x / 100);
        let inputs = this.arrayToMatrix(normalizedInputs);
        let targets = this.arrayToMatrix(targetArray);

        // Calcular salidas de la capa oculta
        let hidden = this.matrixMultiply(this.weights_ih, inputs);
        hidden = this.matrixAdd(hidden, this.bias_h);
        hidden = this.matrixMap(hidden, (val) => sigmoid(val));

        // Calcular salidas de la capa de salida
        let outputs = this.matrixMultiply(this.weights_ho, hidden);
        outputs = this.matrixAdd(outputs, this.bias_o);
        outputs = this.matrixMap(outputs, (val) => sigmoid(val));

        // --- 2. BACKPROPAGATION ---

        // A. Calcular el error de la capa de salida (Target - Output)
        let output_errors = this.matrixSubtract(targets, outputs);

        // B. Calcular el gradiente de salida (Error * dsigmoid(Output) * LearningRate)
        let output_gradients = this.matrixMap(outputs, (val) => dsigmoid(val));
        output_gradients = this.matrixMap(output_gradients, (val, i, j) => val * output_errors[i][j]);
        output_gradients = this.matrixMap(output_gradients, (val) => val * this.learning_rate);

        // C. Calcular deltas de pesos (Salida-Oculta)
        let hidden_T = this.matrixTranspose(hidden);
        let delta_weights_ho = this.matrixMultiply(output_gradients, hidden_T);

        // D. Actualizar pesos y sesgos (Salida-Oculta)
        this.weights_ho = this.matrixAdd(this.weights_ho, delta_weights_ho);
        this.bias_o = this.matrixAdd(this.bias_o, output_gradients); // El delta del sesgo es solo el gradiente

        // E. Calcular el error de la capa oculta (trans(Pesos_HO) * Error_Salida)
        let weights_ho_T = this.matrixTranspose(this.weights_ho);
        let hidden_errors = this.matrixMultiply(weights_ho_T, output_errors);

        // F. Calcular el gradiente oculto (Error_Oculto * dsigmoid(Oculto) * LearningRate)
        let hidden_gradients = this.matrixMap(hidden, (val) => dsigmoid(val));
        hidden_gradients = this.matrixMap(hidden_gradients, (val, i, j) => val * hidden_errors[i][j]);
        hidden_gradients = this.matrixMap(hidden_gradients, (val) => val * this.learning_rate);
        
        // G. Calcular deltas de pesos (Oculta-Entrada)
        let inputs_T = this.matrixTranspose(inputs);
        let delta_weights_ih = this.matrixMultiply(hidden_gradients, inputs_T);

        // H. Actualizar pesos y sesgos (Oculta-Entrada)
        this.weights_ih = this.matrixAdd(this.weights_ih, delta_weights_ih);
        this.bias_h = this.matrixAdd(this.bias_h, hidden_gradients);
    }
    
    /**
     * predict: Devuelve la clasificación final para una entrada.
     * @param {number[]} inputArray - Array de entradas (ej. [30, 50, 20])
     * @returns {string} - La etiqueta de la clase con mayor probabilidad.
     */
    predict(inputArray) {
        let outputs = this.feedForward(inputArray);
        
        // Encontrar el índice del valor más alto
        let maxIndex = 0;
        let maxVal = -Infinity;
        for(let i = 0; i < outputs.length; i++) {
            if(outputs[i] > maxVal) {
                maxVal = outputs[i];
                maxIndex = i;
            }
        }
        
        return this.classLabels[maxIndex];
    }

    /**
     * setWeights: Carga pesos pre-entrenados.
     * (Lo usará Ojopi para cargar los pesos de Jhesmina)
     */
    setWeights(weightsData) {
        this.weights_ih = weightsData.weights_ih;
        this.weights_ho = weightsData.weights_ho;
        this.bias_h = weightsData.bias_h;
        this.bias_o = weightsData.bias_o;
    }
}