# Generative UI React

Una biblioteca que permite agregar interfaces generativas con inteligencia artificial (Liquid UI) a cualquier aplicación React con mínima configuración. Convierte vistas tradicionales en interfaces dinámicas inyectando LLM directamente en el ciclo de vida de React.

## Instalación (Ejemplo)

```bash
npm install liquid-genui-react
```

## Uso Rápido

1. Define tus funciones CRUD o de lógica de negocio usando \`skills\`
2. Pasa estas destrezas (\`skills\`) junto a la configuración del AI engine.
3. Envuelve tu componente principal con \`LiquidProvider\` y añade tu Canvas interactivo.

### Ejemplo Completo (\`App.jsx\` / \`App.tsx\`)

```jsx
import { useEffect, useState } from "react";
import { LiquidProvider, LiquidCanvas, LiquidChat, DefaultSkin } from 'liquid-genui-react';

const engineConfig = {
  piEndpoint: '/api/generate-ui-stream',
  saveSkinRemoteApiEndpoint: '/api/skins', 
  getSkinsRemoteApiEndpoint: '/api/skins', 
  deleteSkinRemoteApiEndpoint: '/api/skins', 
  skills: [
    {tag: "fetch_items"},
    {tag: "create_item", payload: { name: "string", quantity: "number" }},  
    {tag: "update_item", payload: { id: "number", name: "string", quantity: "number" }},  
    {tag: "delete_item", payload: { id: "number" }}  
  ]
};

function App() {
  const [items, setItems] = useState([]);

  const loadItems = async () => {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
    return data;
  };

  useEffect(() => { loadItems(); }, []);

  const systemSkills = {
    fetch_items: async () => await loadItems(),
    create_item: async (payload) => fetch("/api/items", { method: "POST", body: JSON.stringify(payload) }),
    update_item: async (payload) => fetch(`/api/items/${payload.id}`, { method: "PUT", body: JSON.stringify(payload) }),
    delete_item: async (payload) => fetch(`/api/items/${payload.id}`, { method: "DELETE" }),
  };

  return (
    <LiquidProvider config={engineConfig} skills={systemSkills}>
      {/* Componente estándar */}
      <DefaultSkin component={MiInterfazViejaAburrida} items={items} /> 
      
      {/* El lienzo donde se inyecta la magia */}
      <LiquidCanvas items={{ items }} />
      
      {/* El prompt de chat pegado al usuario */}
      <LiquidChat placeholder="Imagina tu UI ideal..." />
    </LiquidProvider>
  );
}
```

## Componentes

- **\`LiquidProvider\`**: Provee contexto global (conexión persistente vía Dexie.js para IndexedDB y soporte remoto, habilidades, historial).
- **\`DefaultSkin\`**: Muestra una vista estándar antes de que una UI generada sobrescriba la misma.
- **\`LiquidCanvas\`**: El portal \`iframe\` inyectado dinámicamente con aislamiento seguro (\`sandbox\`). Ejecuta el código LLM generado evaluando los triggers locales a través de \`postMessage\`.
- **\`LiquidChat\`**: Modal flotante tipo chat para solicitar o visualizar UI renderizadas.
