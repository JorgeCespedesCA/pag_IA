// train_model.js
// Sistema de Entrenamiento de la Red Neuronal
// Autor: Jhesmina Apaza Yujra - Grupo 5
// Descripción: Define las clases de jugador, crea el dataset y entrena el modelo

// ===== DEFINICIÓN DE CLASES =====
// Cada clase representa un estilo de liderazgo basado en las decisiones del jugador
const CLASES = {
  LIDER_HUMANO: {
    nombre: "Líder Humano",
    codigo: [1, 0, 0, 0],
    descripcion: "Has demostrado una fuerte independencia y confianza en tu criterio. Usas la IA como una herramienta, no como un sustituto. Tu equipo humano sigue siendo tu mayor fortaleza. Mantienes el control de tus decisiones."
  },
  COLABORADOR_EFICAZ: {
    nombre: "Colaborador Eficaz",
    codigo: [0, 1, 0, 0],
    descripcion: "Has encontrado el equilibrio perfecto. Sabes cuándo potenciar tus capacidades con IA y cuándo confiar en el juicio humano. Eres el ejemplo de liderazgo del futuro: tecnología y humanidad en armonía."
  },
  DEPENDIENTE_PASIVO: {
    nombre: "Dependiente Pasivo",
    codigo: [0, 0, 1, 0],
    descripcion: "Has delegado demasiado en la IA. Aunque la tecnología es útil, estás perdiendo tu autonomía y criterio propio. Cuidado: la dependencia excesiva puede llevarte a perder el control completamente."
  },
  AUTOMATA_CONTROLADO: {
    nombre: "Autómata Controlado",
    codigo: [0, 0, 0, 1],
    descripcion: "La IA ha tomado el control de tus decisiones. Has cedido tu autonomía casi por completo. Es momento de recuperar tu agencia como líder antes de que sea demasiado tarde."
  }
};

// ===== DATASET DE ENTRENAMIENTO =====
// Vector de entrada: [% Sustituir, % Potenciar, % Humano]
// Cada ejemplo representa un patrón de comportamiento del jugador

const trainingDataset = [
  // LÍDER HUMANO: Alto % Humano, bajo % Sustituir
  { input: [5, 20, 75], output: CLASES.LIDER_HUMANO.codigo },
  { input: [10, 25, 65], output: CLASES.LIDER_HUMANO.codigo },
  { input: [0, 15, 85], output: CLASES.LIDER_HUMANO.codigo },
  { input: [8, 22, 70], output: CLASES.LIDER_HUMANO.codigo },
  { input: [12, 18, 70], output: CLASES.LIDER_HUMANO.codigo },
  { input: [5, 30, 65], output: CLASES.LIDER_HUMANO.codigo },

  // COLABORADOR EFICAZ: Alto % Potenciar, balanceado
  { input: [15, 65, 20], output: CLASES.COLABORADOR_EFICAZ.codigo },
  { input: [20, 70, 10], output: CLASES.COLABORADOR_EFICAZ.codigo },
  { input: [25, 60, 15], output: CLASES.COLABORADOR_EFICAZ.codigo },
  { input: [18, 68, 14], output: CLASES.COLABORADOR_EFICAZ.codigo },
  { input: [22, 65, 13], output: CLASES.COLABORADOR_EFICAZ.codigo },
  { input: [20, 55, 25], output: CLASES.COLABORADOR_EFICAZ.codigo },

  // DEPENDIENTE PASIVO: Alto % Sustituir, bajo % Humano
  { input: [65, 25, 10], output: CLASES.DEPENDIENTE_PASIVO.codigo },
  { input: [70, 20, 10], output: CLASES.DEPENDIENTE_PASIVO.codigo },
  { input: [60, 30, 10], output: CLASES.DEPENDIENTE_PASIVO.codigo },
  { input: [68, 22, 10], output: CLASES.DEPENDIENTE_PASIVO.codigo },
  { input: [72, 18, 10], output: CLASES.DEPENDIENTE_PASIVO.codigo },
  { input: [55, 35, 10], output: CLASES.DEPENDIENTE_PASIVO.codigo },

  // AUTÓMATA CONTROLADO: Muy alto % Sustituir, muy bajo % Humano
  { input: [85, 10, 5], output: CLASES.AUTOMATA_CONTROLADO.codigo },
  { input: [90, 8, 2], output: CLASES.AUTOMATA_CONTROLADO.codigo },
  { input: [80, 15, 5], output: CLASES.AUTOMATA_CONTROLADO.codigo },
  { input: [88, 9, 3], output: CLASES.AUTOMATA_CONTROLADO.codigo },
  { input: [92, 5, 3], output: CLASES.AUTOMATA_CONTROLADO.codigo },
  { input: [83, 12, 5], output: CLASES.AUTOMATA_CONTROLADO.codigo },

  // Casos intermedios para mejor generalización
  { input: [30, 40, 30], output: CLASES.COLABORADOR_EFICAZ.codigo },
  { input: [15, 35, 50], output: CLASES.LIDER_HUMANO.codigo },
  { input: [45, 40, 15], output: CLASES.DEPENDIENTE_PASIVO.codigo },
  { input: [75, 15, 10], output: CLASES.AUTOMATA_CONTROLADO.codigo }
];

// ===== FUNCIÓN DE ENTRENAMIENTO =====
/**
 * Entrena el modelo usando el dataset definido
 * @param {SimpleNeuralNetwork} SimpleNeuralNetwork - Clase de red neuronal de Cespedes
 * @returns {Object} - Pesos entrenados del modelo
 */
function entrenarModelo(SimpleNeuralNetwork) {
  console.log("=== INICIANDO ENTRENAMIENTO ===");
  console.log(`Dataset: ${trainingDataset.length} ejemplos`);
  
  // Crear instancia de la red neuronal
  // Constructor de Cespedes: (inputNodes, hiddenNodes, outputNodes)
  const nn = new SimpleNeuralNetwork(
    3,  // 3 entradas: [sustituir%, potenciar%, humano%]
    6,  // 6 neuronas en capa oculta
    4   // 4 salidas: una por cada clase
  );
  
  // Configurar tasa de aprendizaje
  nn.learning_rate = 0.3;
  
  // Entrenar el modelo
  console.log("Entrenando...");
  const iterations = 10000; // Aumentado para mejor aprendizaje
  
  for (let epoch = 0; epoch < iterations; epoch++) {
    // Entrenar con cada ejemplo del dataset
    for (let data of trainingDataset) {
      nn.train(data.input, data.output);
    }
    
    // Mostrar progreso cada 1000 iteraciones
    if (epoch % 1000 === 0) {
      console.log(`Iteración ${epoch}/${iterations}`);
    }
  }
  
  console.log("✓ Entrenamiento completado");
  
  // Validar el modelo con algunos ejemplos
  console.log("\n=== VALIDACIÓN DEL MODELO ===");
  validarModelo(nn);
  
  // Extraer y retornar los pesos entrenados
  const weights = {
    weights_ih: nn.weights_ih,
    weights_ho: nn.weights_ho,
    bias_h: nn.bias_h,
    bias_o: nn.bias_o
  };
  
  return weights;
}

// ===== FUNCIÓN DE VALIDACIÓN =====
/**
 * Valida el modelo entrenado con ejemplos de prueba
 * @param {SimpleNeuralNetwork} nn - Instancia de la red neuronal entrenada
 */
function validarModelo(nn) {
  const ejemplosTest = [
    { input: [10, 20, 70], esperado: "Líder Humano" },
    { input: [20, 70, 10], esperado: "Colaborador Eficaz" },
    { input: [70, 20, 10], esperado: "Dependiente Pasivo" },
    { input: [90, 8, 2], esperado: "Autómata Controlado" },
    { input: [5, 30, 65], esperado: "Líder Humano" },
    { input: [25, 60, 15], esperado: "Colaborador Eficaz" }
  ];

  let aciertos = 0;
  
  ejemplosTest.forEach((test, index) => {
    const prediccion = nn.predict(test.input);
    const correcto = prediccion === test.esperado;
    
    if (correcto) aciertos++;
    
    const simbolo = correcto ? "✓" : "✗";
    console.log(`${simbolo} Test ${index + 1}: [${test.input}] -> ${prediccion} (esperado: ${test.esperado})`);
  });
  
  const accuracy = ((aciertos / ejemplosTest.length) * 100).toFixed(1);
  console.log(`\n📊 Precisión del modelo: ${accuracy}% (${aciertos}/${ejemplosTest.length})`);
}

// ===== EXPORTAR FUNCIONES Y DATOS =====
// Para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    entrenarModelo,
    trainingDataset,
    CLASES
  };
}

// Para el navegador
if (typeof window !== 'undefined') {
  window.TrainingModule = {
    entrenarModelo,
    trainingDataset,
    CLASES
  };
}