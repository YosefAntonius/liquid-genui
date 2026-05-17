<div align="center">

<a href="https://your-crm-demo.vercel.app" target="_blank" rel="noopener noreferrer">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/f1a5910c-3fe1-4876-8850-a5a1e4436845">
    <img width="100%" alt="LiquidGenUI Banner" src="https://github.com/user-attachments/assets/f1a5910c-3fe1-4876-8850-a5a1e4436845" />
  </picture>
</a>


# LiquidGenUI — El motor de Generative UI en tiempo real para React

[![npm version](https://img.shields.io/npm/v/liquid-genui-react.svg?color=blue)](https://www.npmjs.com/package/liquid-genui-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-000000?logo=vercel&logoColor=white)](https://your-crm-demo.vercel.app)

</div>

**LiquidGenUI** es un framework de Generative UI experimental, *local-first*, para React y Node.js. Te permite mutar instantáneamente interfaces legacy, desactualizadas o básicas a componentes modernos y de alta fidelidad en tiempo de ejecución (runtime) usando el poder de la IA Generativa.

Sin CSS hardcodeado, sin layouts estáticos. Solo generación de UI fluida y en tiempo real, mapeada de forma segura a los endpoints de tu base de datos.

---

<div align="center">

[Live Demo](https://your-crm-demo.vercel.app) · [NPM Packages](https://www.npmjs.com/package/liquid-genui-react) · [English](./README.md) · Leer en Español 🇪🇸

</div>

---

## ¿Qué es LiquidGenUI?

<div align="center">
<img alt="LiquidGenUI Demo Mutation" width="100%" style="border-radius: 8px;" src="https://github.com/user-attachments/assets/a3c93151-7ddd-4c57-b65a-04b8b021333f" />
</div>

En el corazón de LiquidGenUI hay un poderoso cambio de paradigma: **la UI como un estado fluido**. En lugar de tratar a un LLM como un chatbot de texto, LiquidGenUI lo usa como un motor de renderizado en tiempo real.

**Capacidades principales:**
- **Runtime Local-First** — Impulsado por `Dexie` (IndexedDB) para el almacenamiento instantáneo de skins y renderizado con latencia cero a través de recargas (reloads).
- **Mutaciones Fluidas en Tiempo Real** — Intercambio (swapping) de skins sin interrupciones en runtime impulsado por `framer-motion`.
- **Orquestación Agnóstica de LLMs** — Construido sobre el Vercel AI SDK. Soporte nativo para los modelos Gemini, OpenAI, Mistral, Grok, DeepSeek, Anthropic y NIM de Nvidia.
- **Backend Skill Registry** — Mapea de forma segura los endpoints de tu API REST de la base de datos para que la IA pueda ejecutarlos de forma nativa.

## Quick Start

La forma más rápida de empezar es instalando tanto el provider de React como el engine del Server:

```bash
# Instalar el Frontend Package
npm install liquid-genui-react

# Instalar el Backend Package
npm install liquid-genui-server
```

## Cómo funciona

Tus componentes definen qué Skills e información puede usar el modelo configurado en tu back-end y generan la UI con librerías seguras.

```mermaid
flowchart LR
    A["Component Library"] --> B["Server Library"]
    B --> C["LLM"]
    C --> D["LiquidGenUI Engine"]
    D --> E["Real Realtime Renderer UI"]
    E --> F["Save Skin/Set Default"] 
```

1. Configura tu componente con LiquidGenUI y personaliza tus endpoints.
2. Configura tu back-end con un endpoint de LiquidGenUI.
3. Describe tu nueva UI en lenguaje natural (natural language prompt).
4. Envía ese prompt con el botón GEN al back-end.
5. Haz streaming de la respuesta de LiquidGenUI de vuelta al cliente.
6. Renderiza la respuesta progresivamente con LiquidGenUI Engine.
7. Guarda tus skins y asigna tu favorito como default.

## Por qué LiquidGenUI

LiquidGenUI está diseñado para mutaciones de UI en runtime que necesitan ser fluidas, persistentes y estar perfectamente sincronizadas con tu backend.

- **Caché de Latencia Cero** — Ahorra cantidades masivas de tokens de LLM. Una vez que se genera un skin, puedes guardarlo, almacenándose localmente a través de Dexie (IndexedDB) para un renderizado instantáneo en futuras visitas sin llamar a la IA nuevamente.
- **Secure Skill Registry** — Restringe lo que puede hacer la IA. Mapea tus endpoints de la API REST a "Skills" explícitas para que el modelo pueda obtener (fetch) o mutar datos de forma segura sin tocar nunca la estructura raw de tu base de datos.
- **Orquestación Agnóstica** — No te ates (vendor lock-in) a un solo proveedor. Intercambia dinámicamente entre Gemini, Mistral, Grok, OpenAI o Nvidia NIM a través de nuestro wrapper backend unificado del Vercel AI SDK.

### Modelos soportados

<a href="https://vercel.com/ai-gateway/models" target="_blank" rel="noopener noreferrer">
  Ver Vercel Browse AI
</a>


## Licencia

Este proyecto está disponible bajo los términos descritos en [`LICENSE`](./LICENSE).
