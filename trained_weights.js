// trained_weights.js
// Pesos Pre-entrenados de la Red Neuronal
// Autor: Jhesmina Apaza Yujra - Grupo 5
// Descripción: Contiene los pesos entrenados para usar en el juego

// IMPORTANTE: Estos pesos se generarán después de ejecutar el entrenamiento
// Ejecuta test_training.html, haz click en "Exportar Pesos" y pega aquí el resultado

const TRAINED_WEIGHTS = {
  // Metadatos del modelo
  metadata: {
    version: "1.0",
    autor: "Jhesmina Apaza Yujra - Grupo 5",
    fecha: "2024",
    arquitectura: {
      inputNodes: 3,    // [sustituir%, potenciar%, humano%]
      hiddenNodes: 6,   // 6 neuronas en capa oculta
      outputNodes: 4    // 4 clases de liderazgo
    },
    iteraciones: 10000,
    descripcion: "Modelo entrenado para clasificar estilos de liderazgo en el juego"
  },

  // Etiquetas de las clases (mismo orden que en neural_network.js)
  classLabels: [
    "Líder Humano",
    "Colaborador Eficaz", 
    "Dependiente Pasivo",
    "Autómata Controlado"
  ],

  // Descripciones detalladas de cada clase
  descripciones: {
    "Líder Humano": "Has demostrado una fuerte independencia y confianza en tu criterio. Usas la IA como una herramienta, no como un sustituto. Tu equipo humano sigue siendo tu mayor fortaleza. Mantienes el control de tus decisiones.",
    
    "Colaborador Eficaz": "Has encontrado el equilibrio perfecto. Sabes cuándo potenciar tus capacidades con IA y cuándo confiar en el juicio humano. Eres el ejemplo de liderazgo del futuro: tecnología y humanidad en armonía.",
    
    "Dependiente Pasivo": "Has delegado demasiado en la IA. Aunque la tecnología es útil, estás perdiendo tu autonomía y criterio propio. Cuidado: la dependencia excesiva puede llevarte a perder el control completamente.",
    
    "Autómata Controlado": "La IA ha tomado el control de tus decisiones. Has cedido tu autonomía casi por completo. Es momento de recuperar tu agencia como líder antes de que sea demasiado tarde."
  },

  // PESOS DE LA RED (Formato de Cespedes)
  // PESOS ENTRENADOS - Generados el 13/11/2025, 11:16:27 p. m.
// Copia estos valores dentro de TRAINED_WEIGHTS en trained_weights.js

weights_ih: [
  [
    -12.589843201311147,
    -6.014343860043992,
    16.825596634121467
  ],
  [
    34.47883369215839,
    -43.692170897064905,
    -10.174260017724576
  ],
  [
    -18.940059920124877,
    23.498104267141674,
    7.1029628248589685
  ],
  [
    27.039289335592567,
    -13.120651914535253,
    -16.856868749809998
  ],
  [
    -1.6231682005837313,
    22.27206955150228,
    -20.74925476137845
  ],
  [
    1.6948434355645075,
    2.769801948027468,
    1.8840606967634432
  ]
],

bias_h: [
  [
    -1.7281246182632726
  ],
  [
    -17.214263448849206
  ],
  [
    9.419317398866871
  ],
  [
    -1.4658848392630244
  ],
  [
    0.23164434156245903
  ],
  [
    5.1864438987846695
  ]
],

weights_ho: [
  [
    5.6898425054640756,
    -1.3614555737825433,
    0.41240350243014423,
    -2.3676549602541233,
    -5.53193482536768,
    -0.6709029745596916
  ],
  [
    -3.543537109885665,
    -1.7055112108375665,
    0.4051702978153792,
    -9.986987306562668,
    7.1347762450036045,
    -1.2036501461499483
  ],
  [
    -3.3785165505328445,
    -12.030151539905097,
    2.5077735466905016,
    11.902687637444478,
    0.5780492443840624,
    -4.505497736945428
  ],
  [
    -0.8015694495471396,
    9.929204174235755,
    -7.3207271646824,
    2.305726472485666,
    -4.7904727994467775,
    -0.16132491474188157
  ]
],

bias_o: [
  [
    0.15982452874174394
  ],
  [
    -1.1793806542153527
  ],
  [
    -3.4444505344364424
  ],
  [
    0.04246071025249561
  ]
]
};

/**
 * Función para cargar los pesos en una red neuronal existente
 * @param {SimpleNeuralNetwork} neuralNetwork - Instancia de la red neuronal
 * @returns {boolean} - true si se cargaron correctamente, false si no
 */
function cargarPesos(neuralNetwork) {
  if (!TRAINED_WEIGHTS.weights_ih) {
    console.error("❌ ERROR: Los pesos no han sido entrenados aún.");
    console.error("   Ejecuta test_training.html y entrena el modelo primero.");
    return false;
  }
  
  try {
    neuralNetwork.setWeights({
      weights_ih: TRAINED_WEIGHTS.weights_ih,
      weights_ho: TRAINED_WEIGHTS.weights_ho,
      bias_h: TRAINED_WEIGHTS.bias_h,
      bias_o: TRAINED_WEIGHTS.bias_o
    });
    
    console.log("✓ Pesos cargados correctamente en la red neuronal");
    return true;
  } catch (error) {
    console.error("❌ Error al cargar pesos:", error);
    return false;
  }
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TRAINED_WEIGHTS,
    cargarPesos
  };
}

// Exportar para el navegador
if (typeof window !== 'undefined') {
  window.TRAINED_WEIGHTS = TRAINED_WEIGHTS;
  window.cargarPesos = cargarPesos;
}