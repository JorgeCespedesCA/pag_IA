# pag_IA
# El Infiltrado Arcano

**Proyecto:** El Infiltrado Arcano — Grupo 5  
**Asignatura:** Inteligencia Artificial  
**Autores / Integrantes (Grupo 5):**  
- Jorge Cespedes Calderon  
- Mario Alejandro Ojopi  
- Osmar Suárez Arteaga  
- Jhesmina Apaza Yujra  
- Daniela Yugar Apaza

---

## 1. Descripción general
"El Infiltrado Arcano" es una aplicación web tipo *serious game* diseñada para **concientizar sobre el uso responsable de la Inteligencia Artificial**. Mediante una narrativa interactiva el jugador enfrenta decisiones en las que puede: confiar plenamente en la IA (Sustitución), usarla como ayuda parcial (Potenciación), o confiar en el juicio humano (Humano). Al final de la partida el juego presenta un diagnóstico que muestra el grado de dependencia a la IA y promueve la reflexión sobre prácticas de uso responsable.

---

## 2. Objetivo del proyecto
Generar conciencia en estudiantes y usuarios sobre las consecuencias de depender excesivamente de la IA. El objetivo es que, tras jugar, el usuario entienda la diferencia entre:
- **Potenciar**: usar la IA como herramienta que complementa y amplía tus capacidades, y  
- **Sustituir**: delegar el pensamiento crítico y las decisiones en la IA.

El entregable principal es **el diagnóstico final** que clasifica el estilo de interacción del jugador, no una puntuación convencional.

---

## 3. Estructura y archivos principales del repositorio
- `juego.html` — interfaz y lógica del juego (HTML + JS integrados).  
- `neural_network.js` — implementación de la Red Neuronal creada por Jorge Céspedes (clases y funciones de predicción / carga de pesos).  
- `train_model.js` — script usado para generar el dataset sintético y entrenar el modelo (offline).  
- `trained_weights.js` — pesos y sesgos exportados después del entrenamiento (carga estática en el cliente).  
- `README.md` — este archivo (documentación del proyecto).

---

## 4. Nueva arquitectura técnica: cómo se integra la Red Neuronal
1. **Recolección de comportamiento (cliente):** durante la partida el juego registra el número de decisiones de tipo `sustituir`, `potenciar` y `humano`.  
2. **Preparación de entrada:** al finalizar la partida se calculan tres porcentajes:
   - `porcentajeSustituir`  
   - `porcentajePotenciar`  
   - `porcentajeHumano`  
   Estos forman el vector de entrada `[porcentajeSustituir, porcentajePotenciar, porcentajeHumano]` que alimentará la red neuronal. (Si la red espera valores en 0..1, estos porcentajes se normalizan dividiéndolos por 100).
3. **Modelo (cliente):** la red neuronal implementada en `neural_network.js` (diseñada por Jorge Céspedes) se instancia en el navegador y carga pesos desde `trained_weights.js`. La red se usa únicamente para **predicción** (no hay entrenamiento en vivo).
4. **Salida y reporte:** la red devuelve una clasificación entre las categorías del proyecto (por ejemplo: "Líder Humano", "Colaborador Eficaz", "Dependiente Pasivo", "Autómata Controlado"). Esa clasificación se muestra en el `showFinalReport()` con una explicación simple que relaciona el diagnóstico con los porcentajes del jugador.
5. **Razonamiento responsable:** el sistema está diseñado para ser transparente: el reporte muestra los porcentajes que motivaron la clasificación, evitando la “caja negra” y permitiendo una reflexión informada.

---

## 5. Cómo ejecutar localmente
1. Abrir `juego.html` en cualquier navegador moderno (no se requiere servidor).  
2. Asegurarse de que los archivos `neural_network.js` y `trained_weights.js` estén en la misma carpeta y sean cargados por `juego.html`.  
3. Jugar la partida completa para que se calcule el reporte final y la clasificación de la IA.