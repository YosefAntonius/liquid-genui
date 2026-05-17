# Arquitectura Interna: Generative UI Server

El backend de **Generative UI** es el motor central que orquesta la generación de las interfaces (Liquid UI).

## Flujo de Datos y Componentes Principales

### 1. **Punto de Entrada (`liquidServer.ts`)**
- Contiene la función core `generateLiquidUI` y su stream `generateLiquidUIStream`.
- **System Prompt**: En este archivo está el "system instruction" maestro que convierte al LLM en "LiquidEngine", especificando las reglas para escribir en el iframe usando postMessage, actualizar datos remotos, y reglas de diseño estricto.
- **Model Adapter**: Acepta la abstracción de diferentes servicios LLM (`gemini`, `openai`, `anthropic`, `grok`, `mistral`, `deepseek` y `xai Grok`) para flexibilizar la conectividad del usuario y evitar *vendor lock-in*.
- Instala directrices sólidas con base a reglas estandarizadas (por ejemplo: el uso estricto de modales visuales vs de sistema, reglas tailwind, etc).

### 2. **Librerías Seguras (`safeLibraries.ts`)**
- Define `DEFAULT_SAFE_LIBRARIES`, un arreglo con colecciones de etiquetas `<script>` o `<link>` verificadas via CDNs públicos.
- Permite la sobrescritura y extensión inyectando código en el flujo del sistema. Esto aumenta drásticamente la capacidad y control del LLM cuando elabora vistas enriquecidas usando addSafeLibraries y safeLibraries.

## Integración con React
Para interactuar con la librería frontend `liquid-genui-react`:
- Recibe un `POST` (estándar REST) con datos como:
  - `prompt`: Instrucción del usuario.
  - `data`: El contexto o estado actual (BD).
  - `availableSkills`: Métodos invocables para mutación.
  - `currentHtml`: Para la característica "Use Actual" que evita crear desde cero.
- Retorna código HTML seguro inyectable al DOM en un `iframe`.
