# Generative UI Server (\`liquidServer.ts\`)

Esta es la parte del backend requerida para usar **Generative UI**. Se encarga de conectarse con los modelos Fundacionales (Gemini, OpenAI, Anthropic, Grok), procesar las reglas de inyección segura (sandbox), armar el contexto y parsear el HTML resultante.

## Interfaz de Uso (\`liquidServer.ts\`)

La función principal es \`generateLiquidUI\`. Necesita dos objetos: \`GenerateUIParams\` (datos específicos de la petición actual) y \`LiquidServerConfig\` (configuración del motor backend).

### Ejemplo de integración en Express / Node.js (\`server.ts\`)

\`\`\`typescript
import express from 'express';
import { generateLiquidUI, LiquidServerConfig } from './src/liquid-genui-server/liquidServer';

const app = express();
app.use(express.json());

app.post('/api/generate-ui', async (req, res) => {
  try {
    const { prompt, data, availableSkills, currentHtml } = req.body;
    
    // 1. Configuración de Modelos y Librerías (Backend)
    const config: LiquidServerConfig = {
      service: "google", // "google" | "openai" | "anthropic" | "grok" | "xai" | "deepseek" | "mistral"
      model: "gemini-3.1-pro-preview", // O tu modelo favorito
      
      // (Opcional) Reemplazar TODAS las librerías seguras por defecto (sobrescribe):
      // safeLibraries: [ ... ]
      
      // (Opcional) Agregar MÁS librerías seguras a la lista por defecto
      addSafeLibraries: [
        {
          category: 'Custom Animation',
          libs: [
            {
              name: 'framer-motion',
              src: '<!-- tu import de framer -->'
            }
          ]
        }
      ]
    };

    // 2. Parámetros de la vista y contexto actual procedentes del front-end
    const params = {
      prompt,
      data,             // La data JSON del sistema en este momento (Ej: { items: [...] })
      availableSkills,  // Las destrezas mapeadas disponibles para invocar
      currentHtml       // En caso de que se pulse "Use actual", para editar la skin actual
    };

    // 3. Generación
    const html = await generateLiquidUI(params, config);
    res.json({ html });
    
  } catch (error: any) {
    console.error('Generative UI Error:', error);
    res.status(500).json({ error: error.message || 'Error generating UI' });
  }
});
\`\`\`

## Librerías Seguras (Safe Libraries)

Para mantener la seguridad y predictibilidad en la generación por LLM, inyectamos una lista blanca de librerías permitidas al prompt del sistema. 

El modelo viene con una amplia gama predefinida de librerías en \`DEFAULT_SAFE_LIBRARIES\` (almacenadas en el fichero modularizado \`safeLibraries.ts\`), incluyendo:
- Tailwind CSS
- Chart.js
- GSAP, Anime.js, AOS
- Lodash, Day.js, entre otros.

Se puede configurar el comportamiento:
- **Usar \`safeLibraries\`**: Sobrescribe y reemplaza toda la lista por defecto. Solo las enviadas aquí serán permitidas.
- **Usar \`addSafeLibraries\`**: Mantiene la lista de librerías por defecto pero añade nuevas que introduzcas.

## Soporte Multimodelo

\`liquidServer.ts\` abstrae las peticiones REST y del SDK para no atarte a un solo proveedor.
Basta con configurar en el objeto \`LiquidServerConfig\`:
- \`service: "openai"\`  ->  \`model: "gpt-4o"\`
- \`service: "anthropic"\` -> \`model: "claude-3-5-sonnet-20240620"\`
- \`service: "grok"\` -> \`model: "grok-beta"\`
