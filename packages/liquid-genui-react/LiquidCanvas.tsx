import React, { useEffect, useRef, useState } from 'react';
import { useLiquid } from './LiquidProvider';

export function LiquidCanvas({ items, ...otherData }: { items?: any; [key: string]: any }) {
  const { liquidHtml, systemSkills, setContextData, isGenerating } = useLiquid();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Combine items and any other custom props into context
  const dataToSet = items !== undefined ? { items, ...otherData } : { ...otherData };

  const [stableHtml, setStableHtml] = useState<string | null>(liquidHtml);

  useEffect(() => {
    // When generation finishes (or if it just starts and we have some starting point),
    // we sync the stable HTML to fully reload the iframe with all scripts inside.
    if (!isGenerating) {
      setStableHtml(liquidHtml);
    }
  }, [liquidHtml, isGenerating]);

  useEffect(() => {
    // During generation, we dynamically update the DOM to avoid re-evaluating the Tailwind script
    // every few milliseconds. This creates a smooth streaming effect.
    if (isGenerating && liquidHtml && iframeRef.current?.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      const bodyMatch = liquidHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const content = bodyMatch ? bodyMatch[1] : liquidHtml;
      
      if (doc.body) {
        doc.body.innerHTML = content;
      } else {
        doc.documentElement.innerHTML = content;
      }
    }
  }, [liquidHtml, isGenerating]);

  useEffect(() => {
    // Avoid infinite loops by deep-comparing the payload
    setContextData((prev: any) => {
      if (JSON.stringify(prev) === JSON.stringify(dataToSet)) {
        return prev;
      }
      return dataToSet;
    });
  }, [JSON.stringify(dataToSet), setContextData]);

  useEffect(() => {
    // 1. El Puente de Comunicación de Seguridad (El Gateway)
    const handleMessage = async (event: MessageEvent) => {
      // Ignorar mensajes que no sean del formato Liquid
      if (!event.data || event.data.type !== 'LIQUID_TRIGGER') return;
      
      const { endpoint, payload } = event.data;
      
      // 2. Verificar si el trigger existe en nuestro diccionario
      if (systemSkills[endpoint]) {
        try {
          // Ejecutar la función segura
          const result = await systemSkills[endpoint](payload);
          
          // 3. (Opcional) Enviar la respuesta de vuelta al iframe
          if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: 'LIQUID_RESPONSE',
              endpoint: endpoint,
              data: result
            }, '*');
          }
        } catch (error) {
          console.error("Error al ejecutar el skill:", error);
        }
      } else {
        console.warn(`El endpoint bloqueado o inexistente: ${endpoint}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [systemSkills]);

  const displayHtml = stableHtml || (isGenerating ? `<!DOCTYPE html><html><head><script src="https://unpkg.com/@tailwindcss/browser@4"></script><style>body{background:#0a0a0a;color:white;}</style></head><body></body></html>` : "");

  if (!displayHtml) return null;

  // 4. El Lienzo Seguro
  return (
    <div className="w-full h-full overflow-hidden relative">
      <iframe
        ref={iframeRef}
        srcDoc={displayHtml}
        title="Liquid UI Canvas"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          display: 'block'
        }}
      />
    </div>
  );
}
