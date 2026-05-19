<div align="center">

<a href="https://your-crm-demo.vercel.app" target="_blank" rel="noopener noreferrer">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/f1a5910c-3fe1-4876-8850-a5a1e4436845">
    <img width="100%" alt="LiquidGenUI Banner" src="https://github.com/user-attachments/assets/f1a5910c-3fe1-4876-8850-a5a1e4436845" />
  </picture>
</a>


# LiquidGenUI — The Generative UI Engine in realtime for React

[![npm version](https://img.shields.io/npm/v/liquid-genui-react.svg?color=green)](https://www.npmjs.com/package/liquid-genui-react)
[![npm version](https://img.shields.io/npm/v/liquid-genui-server.svg?color=green)](https://www.npmjs.com/package/liquid-genui-server)
[![Website](https://img.shields.io/badge/Website-000000?logo=vercel&logoColor=white)](https://liquidgenui.vercel.app/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-000000?logo=vercel&logoColor=white)](https://uni-airlines.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

**LiquidGenUI** is an experimental, local-first Generative UI framework for React and Node.js. It allows you to instantly mutate legacy, outdated, or basic interfaces into modern, high-fidelity components at runtime using the power of Generative AI. 

No hardcoded CSS, no static layouts. Just fluid, real-time UI generation mapped safely to your actual database endpoints.

---

<div align="center">

[Live Demo](https://your-crm-demo.vercel.app) · [NPM Packages](https://www.npmjs.com/package/liquid-genui-react) · English · [Leer en Español 🇪🇸](./README.es.md)

</div>

---

## What is LiquidGenUI?

<div align="center">
<img alt="LiquidGenUI Demo Mutation" width="100%" style="border-radius: 8px;" src="https://github.com/user-attachments/assets/a3c93151-7ddd-4c57-b65a-04b8b021333f" />
</div>

At the core of LiquidGenUI is a powerful paradigm shift: **UI as a fluid state**. Instead of treating an LLM as a text chatbot, LiquidGenUI uses it as a real-time rendering engine. 

**Core capabilities:**
- **Local-First Runtime** — Powered by `Dexie` (IndexedDB) for instant skin storage and zero-latency rendering across reloads.
- **Real-Time Fluid Mutations** — Seamless skin swapping at runtime powered by `framer-motion`.
- **Agnostic LLM Orchestration** — Built on top of the Vercel AI SDK. Native support for Gemini, OpenAI, Mistral, Grok, DeepSeek, Anthropic, and Nvidia's NIM models.
- **Backend Skill Registry** — Safely map endpoints of your REST API database so the AI can execute them natively.

## Quick Start

The fastest way to get started is by installing both the React provider and the Server engine:

```bash
# Install the Frontend Package
npm install liquid-genui-react

# Install the Backend Package
npm install liquid-genui-server
```

## How it works

Your components define what skills and information the configured model can use in your back-end and generate the UI with secure libraries.

```mermaid
flowchart LR
    A["Component Library"] --> B["Server Library"]
    B --> C["LLM"]
    C --> D["LiquidGenUI Engine"]
    D --> E["Real Realtime Renderer UI"]
    E --> F["Save Skin/Set Default"] 
```

1. Configure your component with Liquid GenUI and customize your endpoints.
2. Configure your back-end with a LiquidGenUI enpoint.
3. Describe your new UI in natural language.
4. Send that prompt with GEN button to back-end.
5. Stream LiquidGenUI output back to the client.
6. Render the output progressively with LiquidGenUI Engine.
7. Save your skins and assign your favorite as the default.

## Why LiquidGenUI

LiquidGenUI is designed for runtime UI mutations that need to be fluid, persistent, and perfectly synced with your backend.

- **Zero-Latency Caching** — Save massive amounts of LLM tokens. Once a skin is generated, you can save it is stored locally via dexie (IndexedDB) for instant rendering on future visits without calling the AI again.
- **Secure Skill Registry** — Restrict what the AI can do. Map your REST API endpoints to explicit "Skills" so the model can fetch or mutate data safely without ever touching your raw database structure.
- **Agnostic Orchestration** — Don't get locked into a single provider. Swap between Gemini, Mistral, Grok, OpenAI, or Nvidia NIM dynamically through our unified Vercel AI SDK backend wrapper.

### Supported models

Google, OpenAi, DeepSeek, Mistral, xAi & Anthropic - 
<a href="https://vercel.com/ai-gateway/models" target="_blank" rel="noopener noreferrer">
  View vercel Browse AI
</a>

NIM Models -
<a href="https://build.nvidia.com/models" target="_blank" rel="noopener noreferrer">
  View nvidia Models
</a>

## Documentation

**MyStaticApp.tsx**
<details>
<summary><b>View full code</b></summary>
  
```tsx
export const useInventorySkills = () => {
  const [items, setItems] = useState<Item[]>([]);

  const loadItems = async () => {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
    return data;
  };

  useEffect(() => {
    loadItems();
  }, []);

  {/* Your App Skills */}
  const systemSkills = {
    fetch_items: async () => {
      return await loadItems();
    },
    create_item: async (payload: { name: string; quantity: number }) => {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await loadItems();
      return await res.json();
    },
    update_item: async (payload: { id: number; name: string; quantity: number }) => {
      const res = await fetch(`/api/items/${payload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await loadItems();
      return await res.json();
    },
    delete_item: async (payload: { id: number }) => {
      const res = await fetch(`/api/items/${payload.id}`, {
        method: "DELETE",
      });
      await loadItems();
      return await res.json();
    },
  };

  return { items, loadItems, systemSkills };
};

{/* Your Skills configuration */}
export const configSkills = [
  { tag: "fetch_items" },
  { tag: "create_item", payload: { name: "string", quantity: "number" } },
  { tag: "update_item", payload: { id: "number", name: "string", quantity: "number" } },
  { tag: "delete_item", payload: { id: "number" } }
];
```
</details>

**App.tsx**
<details>
<summary><b>View full code</b></summary>
  
```tsx
import {
  LiquidProvider,
  LiquidCanvas,
  LiquidChat,
  DefaultSkin
} from "liquid-genui-react";
import { MyStaticApp, useMyStaticAppSkills, configSkills } from "./MyStaticApp";

{/* Your custom endpoints */}
const engineConfig = {
  apiEndpoint: '/api/generate-ui-stream', 
  saveSkinRemoteApiEndpoint: '/api/skins',
  getSkinsRemoteApiEndpoint: '/api/skins',
  deleteSkinRemoteApiEndpoint: '/api/skins',
  skills: configSkills,
};

const { items, loadItems, systemSkills } = useMyStaticAppSkills();

<LiquidProvider 
  config={engineConfig}
  skills={systemSkills}
>
  {/* Your raw static boring site */}
  <DefaultSkin component={MyStaticApp} items={items} loadItems={loadItems}/>
  {/* Where magic happens */}
  <LiquidCanvas items={items} />
  <LiquidChat />
</LiquidProvider>
```
</details>

**server.ts**
<details>
<summary><b>View full code</b></summary>
  
```ts
import { 
  generateLiquidUI, 
  generateLiquidUIStream, 
  type LiquidServerConfig 
} from "liquid-genui-server";

{/* LiquidGenUI Stream Endpoint */}
app.post('/api/generate-ui-stream', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const { prompt, data, availableSkills, currentHtml } = req.body;
    const config: LiquidServerConfig = {
      service: "google", // You can use 'nvidia' to use NIM models or (google, openai, deepseek, mistral, xai, anthropic)
      model: "gemini-3-flash-preview", // Add your NIM models using the full model name: deepseek-ai/deepseek-v4-pro or (gemini-3.1-pro-preview, gpt-5.5-pro-2026-04-23...)

      {/* Add your additional custom SafeLibraries using addSafeLibraries (optional) */}
      {/* Or use your own libraries by adding your list with safeLibraries (optional) */}
      addSafeLibraries: [
        {
          category: 'styles',
          libs: [{ name: 'custom-library', src: '<script src="https://unpkg.com/custom-library@1.0.0"></script>' }]
        }
      ]
    };

    const stream = generateLiquidUIStream({ prompt, data, availableSkills, currentHtml }, config);

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Generative UI Stream Error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message || 'Error generating UI' })}\n\n`);
    res.end();
  }
});
```
</details>

## License

This project is available under the terms described in [`LICENSE`](./LICENSE).
