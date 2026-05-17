import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { deepseek } from "@ai-sdk/deepseek"
import { mistral } from "@ai-sdk/mistral"
import { xai } from "@ai-sdk/xai";
import { anthropic } from "@ai-sdk/anthropic";
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

export function getAiProvider(service: string, model: string) {
    if (service === 'google') {
        return google(model);
    }
    if (service === 'openai') {
        return openai(model);
    }
    if (service === 'deepseek') {
        return deepseek(model);
    }
    if (service === 'mistral') {
        return mistral(model);
    }
    if (service === 'xai') {
        return xai(model);
    }
    if (service === 'anthropic') {
        return anthropic(model);
    }
    if (service === 'nvidia') {
        const nim = createOpenAICompatible({
            name: 'nim',
            baseURL: 'https://integrate.api.nvidia.com/v1',
            headers: {
                Authorization: `Bearer ${process.env.NIM_API_KEY}`,
            },
        });
        return nim.chatModel(model);
    }
    throw new Error(`Unknown service: ${service}`);
}
