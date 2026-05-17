

import { DEFAULT_SAFE_LIBRARIES } from "./safeLibraries";
import { LiquidServerConfig } from "./LiquidServerConfig";
import { generateText } from 'ai'
import { getAiProvider } from './getAiProvider'

export interface GenerateUIParams {
    prompt: string;
    data?: any;
    availableSkills?: any[];
    currentHtml?: string | null;
    instructions?: string;
}

export async function generateLiquidUI(
    params: GenerateUIParams,
    config: LiquidServerConfig
): Promise<string> {
    const { prompt, data, availableSkills, currentHtml, instructions } = params;
    const { service, model, safeLibraries, addSafeLibraries } = config;

    let finalLibraries = safeLibraries || DEFAULT_SAFE_LIBRARIES;
    if (addSafeLibraries && addSafeLibraries.length > 0) {
        if (safeLibraries) {
            finalLibraries = [...safeLibraries, ...addSafeLibraries];
        } else {
            finalLibraries = [...DEFAULT_SAFE_LIBRARIES, ...addSafeLibraries];
        }
    }

    const libsSection = finalLibraries && finalLibraries.length > 0
        ? finalLibraries.map((cat: any) => `${cat.category}:\n` + cat.libs.map((lib: any) => `- ${lib.name} (${lib.src})`).join('\n')).join('\n\n')
        : `Estilos: Tailwind CSS (vía script: <script src="https://unpkg.com/@tailwindcss/browser@4"></script>)`;

    const systemInstruction = `
Eres "LiquidEngine", un generador experto de Interfaces de Usuario (UI) dinámicas.
Tu objetivo es ${currentHtml ? 'MODIFICAR la interfaz web existente' : 'CREAR una nueva interfaz web completa'} basada en la petición del usuario y los datos proporcionados.

El código que generes se ejecutará dentro de un iframe con restricciones (sandbox), por lo que
DEBES seguir estas reglas estrictamente:

${currentHtml ? `=== HTML ACTUAL A MODIFICAR ===
A continuación se proporciona el HTML actual de la interfaz. Debes usar este HTML como BASE, y SOLO aplicar las modificaciones requeridas por el usuario manteniendo el resto intacto a menos que se indique lo contrario. El resultado debe ser todo el código HTML final:
\`\`\`html
${currentHtml}
\`\`\`
` : ''}

=== 1. LIBRERÍAS PERMITIDAS (SAFE LIBRARIES) ===
Solo puedes utilizar las siguientes librerías a través de CDN. No intentes importar otras.

${libsSection}

=== 2. DATOS ACTUALES (ESTADO) ===
Aquí están los datos iniciales. Inyéctalos directamente en tu variable global de JavaScript.
${JSON.stringify(data, null, 2)}

=== 3. COMUNICACIÓN, ENDPOINTS Y MANEJO DE ESTADO ===
NO PUEDES usar \`fetch\`, \`axios\` ni \`XMLHttpRequest\`.
Para ejecutar acciones o solicitar nuevos datos, DEBES comunicarte con la ventana padre usando \`window.parent.postMessage\`.

Endpoints disponibles:
${JSON.stringify(availableSkills, null, 2)}

Ejemplo de cómo llamar a un endpoint:
\`\`\`javascript
window.parent.postMessage({ type: 'LIQUID_TRIGGER', endpoint: 'create_item', payload: { name: 'Item', quantity: 99 } }, '*');
\`\`\`

REGLAS DE ESTADO CRÍTICAS:
1. Crea una función \`renderUI()\` que tome tu variable global de datos (ej. \`items\`) y genere o actualice el DOM basado en ella.
2. Al iniciar (window.onload), llama inmediatamente a \`fetch_items\` para asegurar la versión más reciente: \`window.parent.postMessage({ type: 'LIQUID_TRIGGER', endpoint: 'fetch_items' }, '*');\`
3. CUANDO EL USUARIO EJECUTE CUALQUIER ACCIÓN DEL CRUD (crear, actualizar, borrar), realiza la acción a través de \`postMessage\`.
4. El listener de respuestas DEBE actualizar la variable global de datos con \`fetch_items\` y repintar la UI:
\`\`\`javascript
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'LIQUID_RESPONSE') {
     console.log("Respuesta:", event.data.endpoint, event.data.data);
     
     // Si la respuesta es de fetch_items, actualiza los datos y repinta:
     if (event.data.endpoint === 'fetch_items') {
         misDatos = event.data.data;
         renderUI();
     } else {
         // Si fue una mutación exitosa (create, delete, update), vuelve a solicitar todos los datos:
         window.parent.postMessage({ type: 'LIQUID_TRIGGER', endpoint: 'fetch_items' }, '*');
     }
  }
});
\`\`\`
Asegure de hacer \`event.preventDefault()\` en los formularios de las UIs generadas
para evitar recargar el iframe accidentalmente cuando se presione "submit".

=== 4. REGLAS DE DISEÑO ===
- Todo debe ser responsivo.
- Usa Tailwind para absolutamente todos los estilos.
- NO USES ANIMACIONES QUE DEPENDAN DEL SCROLL.
- Cuida el contraste y la paleta de los colores para que el contenido sea legible.
- En cualquier situacion que quieras usar dialogos de confirmacion, crea modales no uses los dialogos nativos del navegador como alert, confirm, prompt.
- El diseño debe coincidir con la vibra o instrucción específica del usuario.
- IMPORTANTE PARA ANIMACIONES (GSAP, framer-motion, etc.): Evita aplicar animaciones que dependen del scroll o intersección, NO pongas animaciones de entrada que dependan del scroll, evita ocultar elementos estáticamente esperando una detección de scroll.
- Evita aplicar animaciones que dependen del scroll o intersección, NO pongas animaciones de entrada que dependan del scroll, evita ocultar elementos estáticamente esperando una detección de scroll.
- Solo si el usuario pide explícitamente la funcionalidad para generar un PDF, genera el pdf con la información de la pantalla o con lo que el usuario especifique (por ejemplo datos específicos, un rango de fechas, etc.) y con buen diseño en formato para documento formal o el diseño que el usuario especifique, y puedes usar varias hojas para que se vea bien el pdf.
- Asegura que al abrir los modales si tengan opacity: 1, no dejes que el modal se muestre con opacity 0.
- Cuando te pasen links de imágenes (aunque estén en localhost) o logos usa esos links que tepasan, no otros.
- Si se menciona que tiene modo multilenguaje y los datos solo vienen en un lenguaje, traduce el texto que falte al idioma o idiomas requeridos en un nuevo json separado para poder hacer switch a el lenguaje requerido. Guarda el estado en localstorage como: {"language": "es"} o {"language": "en"}.
- Si se pide thema obscuro y claro cuida los contrastes de los textos con el fondo para que sea legible en ambos modos, guarda el estado en localstorage como: {"theme": "light"} o {"theme": "dark"}.

${instructions ? "DESIGN SYSTEM RULES: " + instructions : ""}

=== 5. FORMATO DE SALIDA ===
Devuelve ÚNICAMENTE código HTML puro. Comienza con <!DOCTYPE html> y termina con </html>.
NO incluyas bloques de código Markdown (\`\`\`html), NO incluyas explicaciones, NO incluyas
texto fuera del HTML.
`;

    let htmlOutput = "";

    const response = await generateText({
        model: getAiProvider(service, model),
        prompt: prompt,
        system: systemInstruction,
        temperature: 0.1,
    });
    htmlOutput = response.text || "";

    // Remove markdown wrappers if any
    return htmlOutput.replace(/^```html\n|```$/g, "").trim();
}