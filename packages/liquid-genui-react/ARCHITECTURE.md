# Arquitectura Interna: Generative UI React

## Patrón de Comunicación y Flujo

1. **Contexto Principal (\`LiquidProvider\`)**
   - Maneja el estado global: UI activa actualmente (\`liquidHtml\`), si el menú está abierto, historial de skins almacenados persistentemente vía Dexie.js (IndexedDB) con soporte retrocompatible y sincronización a API remota, etc.
   - Pasa los the \`skills\` dados y datos actualizados (\`contextData\`) dentro.
   - Envía el prompt y un diccionario formateado de los \`skills\` al backend (normalmente Node/Express) con fetch POST a \`/api/generate-ui\`.

2. **Inyección y Ejecución Segura (\`LiquidCanvas\`)**
   - Monta un \`<iframe sandbox="allow-scripts allow-forms">\`.
   - Utiliza la comunicación bidireccional por \`postMessage\`. LiquidCanvas escucha \`LIQUID_TRIGGER\` en \`message\`, luego ejecuta la función segura asociada (previamente inyectada localmente en \`LiquidProvider\`) correspondiente con la clave suministrada.

3. **Inferencia y Backend (Fuera de React)**
   - El sistema principal lee los \`skills\` e indica que la UI generada usará \`postMessage\` apuntando a \`endpoint\` al activar funciones dinámicas en la vista.
   - Retorna en código dinámico inyectable como \`aiGeneratedHtml\`.

## Árbol de Componentes de la Librería

- \`/src/liquid-genui-react\`
  - \`index.ts\` (Punto de entrada de importaciones simplificadas)
  - \`LiquidProvider.tsx\` (Variables de estado y peticiones REST configuradas vía config)
  - \`LiquidCanvas.tsx\` (\`postMessage\` handler && iFrame mount)
  - \`LiquidChat.tsx\` (Panel deslizable/flotante UI con Lucide)
  - \`DefaultSkin.tsx\` (Evita colisiones entre tu sitio "vanilla" y las simulaciones inyectadas)
  - \`LiquidSkinSelector.tsx\` (Selector de skins con Dexie.js para persistencia local y sincronización remota)
