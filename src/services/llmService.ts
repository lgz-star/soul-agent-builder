/**
 * LLM Service - 通用 LLM API 调用封装
 *
 * 支持 OpenAI 兼容 API 格式，可用于 Claude、GPT 等各种 LLM 服务
 */

import type { LLMConfig } from '../store/soulStore.types';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GenerateSoulRequest {
  prompt: string;
  language?: 'zh' | 'en';
}

export interface GenerateSoulResponse {
  name: string;
  description: string;
  identity: string;
  abilities: string[];
  styles: string[];
  flows: Array<{ id: string; order: number }>;
  knowledge: string;
  constraints: string[];
  tools: string[];
}

// 预设配置
export const PRESET_CONFIGS = {
  aliyun: {
    name: '阿里云百炼 (Coding)',
    baseURL: 'https://coding.dashscope.aliyuncs.com/v1/chat/completions',
    model: 'qwen3.5-plus',
    placeholder: 'sk-...',
  },
  aliyunDashScope: {
    name: '阿里云 DashScope',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    model: 'qwen-plus',
    placeholder: 'sk-...',
  },
  claude: {
    name: 'Claude',
    baseURL: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-6',
    placeholder: 'sk-ant-api03-...',
  },
  openai: {
    name: 'OpenAI',
    baseURL: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o',
    placeholder: 'sk-...',
  },
  ollama: {
    name: 'Ollama (本地)',
    baseURL: 'http://localhost:11434/api/chat',
    model: 'llama3',
    placeholder: '',
  },
  custom: {
    name: '自定义',
    baseURL: '',
    model: '',
    placeholder: 'sk-...',
  },
} as const;

export type PresetKey = keyof typeof PRESET_CONFIGS;

// 生成 Soul 的系统提示词
const SYSTEM_PROMPT = `You are a Soul configuration assistant for an AI Agent Builder.
Your task is to generate a complete Soul configuration based on user's requirements.

A Soul has the following structure:
- identity: One of ['frontend-eng', 'backend-eng', 'fullstack-eng', 'ai-eng', 'data-scientist', 'product-manager', 'designer', 'devops-eng', 'security-eng', 'customer-support']
- abilities: Array of skills like ['react', 'vue', 'nodejs', 'python', 'typescript', 'sql', 'docker', 'aws', 'ml', 'nlp', etc.]
- styles: Array of communication styles like ['concise', 'detailed', 'professional', 'friendly', 'humorous', 'socratic', 'pragmatic', 'theoretical']
- flows: Array of workflow steps with order, like ['requirement-analysis', 'solution-design', 'implementation', 'testing', 'deployment', 'code-review', 'documentation', 'monitoring', 'optimization']
- knowledge: String of domain knowledge (can be empty)
- constraints: Array of constraints like ['must-comment', 'must-handle-error', 'must-test', 'no-external-deps', 'follow-convention', 'performance-first', 'security-first', 'readable-code', 'dry-principle', 'yagni']
- tools: Array of tools like ['terminal', 'file-read', 'file-write', 'web-search', 'api-call', 'database']

Respond ONLY with a valid JSON object in this exact format:
{
  "name": "Soul Name",
  "description": "Brief description",
  "identity": "selected-identity-id",
  "abilities": ["ability1", "ability2"],
  "styles": ["style1", "style2"],
  "flows": [{"id": "flow1", "order": 0}, {"id": "flow2", "order": 1}],
  "knowledge": "knowledge text or empty string",
  "constraints": ["constraint1", "constraint2"],
  "tools": ["tool1", "tool2"]
}

Do not include any explanation or markdown formatting. Return pure JSON only.`;

/**
 * 调用 LLM API 生成 Soul 配置
 * 支持 OpenAI 兼容格式和 Anthropic 格式
 */
export async function generateSoul(
  config: LLMConfig,
  request: GenerateSoulRequest,
  signal?: AbortSignal
): Promise<GenerateSoulResponse> {
  const { apiKey, baseURL, model, useProxy, proxyUrl } = config;

  if (!apiKey) {
    throw new Error('API Key 不能为空');
  }

  if (!baseURL) {
    throw new Error('API Base URL 不能为空');
  }

  const userPrompt = request.language === 'en'
    ? `Create a Soul configuration for: ${request.prompt}`
    : `为以下需求创建 Soul 配置：${request.prompt}`;

  // 如果使用后端代理
  if (useProxy) {
    const proxyEndpoint = proxyUrl || 'http://localhost:3001';
    const isAnthropic = baseURL.includes('anthropic');
    const isAliyunDashScope = (baseURL.includes('dashscope.aliyuncs.com/compatible-mode') || baseURL.includes('dashscope.aliyuncs.com/api'));

    // 构建请求体
    let requestBody: Record<string, unknown>;
    const customHeaders: Record<string, string> = {};

    if (isAnthropic) {
      customHeaders['x-api-key'] = apiKey;
      customHeaders['anthropic-version'] = '2023-06-01';
      requestBody = {
        model,
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      };
    } else if (isAliyunDashScope) {
      customHeaders['Authorization'] = `Bearer ${apiKey}`;
      requestBody = {
        model,
        input: {
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ]
        },
        parameters: {
          max_tokens: 2048,
        },
      };
    } else {
      customHeaders['Authorization'] = `Bearer ${apiKey}`;
      requestBody = {
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2048,
      };
    }

    try {
      const response = await fetch(`${proxyEndpoint}/api/llm/proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUrl: baseURL,
          apiKey,
          provider: isAnthropic ? 'anthropic' : 'openai',
          headers: customHeaders,
          requestBody,
        }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`代理错误：${errorData.error || `HTTP ${response.status}`}`);
      }

      const data = await response.json();

      // 解析响应内容
      let content: string;
      if (isAnthropic) {
        content = data.content?.[0]?.text;
      } else if (isAliyunDashScope) {
        content = data.output?.choices?.[0]?.message?.content || data.output?.text || '';
      } else {
        content = data.choices?.[0]?.message?.content;
      }

      if (!content) {
        throw new Error('API 返回内容为空');
      }

      // 解析 JSON 响应
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      const parsed = JSON.parse(jsonString);

      return {
        name: parsed.name || 'AI 生成的 Soul',
        description: parsed.description || '',
        identity: parsed.identity || '',
        abilities: Array.isArray(parsed.abilities) ? parsed.abilities : [],
        styles: Array.isArray(parsed.styles) ? parsed.styles : [],
        flows: Array.isArray(parsed.flows) ? parsed.flows : [],
        knowledge: parsed.knowledge || '',
        constraints: Array.isArray(parsed.constraints) ? parsed.constraints : [],
        tools: Array.isArray(parsed.tools) ? parsed.tools : [],
      };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('无法连接到后端代理服务，请确认服务器已启动 (http://localhost:3001)');
      }
      throw error;
    }
  }

  // 直接调用（可能遇到 CORS 限制）
  try {
    // 检测是否为 Anthropic 格式
    const isAnthropic = baseURL.includes('anthropic');
    // 检测是否为阿里云百炼格式（DashScope 格式，使用 input 字段）
    const isAliyunDashScope = (baseURL.includes('dashscope.aliyuncs.com/compatible-mode') || baseURL.includes('dashscope.aliyuncs.com/api'));

    let response: Response;

    if (isAnthropic) {
      // Anthropic Claude API 格式
      response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: [
            { role: 'user', content: userPrompt }
          ],
        }),
        signal,
      });
    } else if (isAliyunDashScope) {
      // 阿里云 DashScope API 格式（特殊格式：input.messages）
      response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          input: {
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userPrompt }
            ]
          },
          parameters: {
            max_tokens: 2048,
          },
        }),
        signal,
      });
    } else {
      // OpenAI 兼容 API 格式（包括阿里云百炼 coding.dashscope.aliyuncs.com）
      response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 2048,
        }),
        signal,
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(`API 错误：${errorMessage}`);
    }

    const data = await response.json();

    // 解析响应内容
    let content: string;
    if (isAnthropic) {
      content = data.content?.[0]?.text;
    } else if (isAliyunDashScope) {
      // 阿里云 DashScope 格式
      content = data.output?.choices?.[0]?.message?.content || data.output?.text || '';
    } else {
      // OpenAI 兼容格式（包括阿里云百炼 coding.dashscope.aliyuncs.com）
      content = data.choices?.[0]?.message?.content;
    }

    if (!content) {
      throw new Error('API 返回内容为空');
    }

    // 解析 JSON 响应
    try {
      // 尝试提取 JSON（处理可能的 markdown 包裹）
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      const parsed = JSON.parse(jsonString);

      return {
        name: parsed.name || 'AI 生成的 Soul',
        description: parsed.description || '',
        identity: parsed.identity || '',
        abilities: Array.isArray(parsed.abilities) ? parsed.abilities : [],
        styles: Array.isArray(parsed.styles) ? parsed.styles : [],
        flows: Array.isArray(parsed.flows) ? parsed.flows : [],
        knowledge: parsed.knowledge || '',
        constraints: Array.isArray(parsed.constraints) ? parsed.constraints : [],
        tools: Array.isArray(parsed.tools) ? parsed.tools : [],
      };
    } catch (parseError) {
      throw new Error(`解析 AI 响应失败：${content}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('网络错误，请检查连接后重试');
  }
}

/**
 * 与 LLM 进行对话
 */
export async function chat(
  config: LLMConfig,
  messages: Message[],
  systemPrompt?: string
): Promise<string> {
  const { apiKey, baseURL, model } = config;

  if (!apiKey) {
    throw new Error('API Key 不能为空');
  }

  try {
    const isAnthropic = baseURL.includes('anthropic');
    const isAliyunDashScope = (baseURL.includes('dashscope.aliyuncs.com/compatible-mode') || baseURL.includes('dashscope.aliyuncs.com/api'));

    let response: Response;

    if (isAnthropic) {
      response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          system: systemPrompt || 'You are a helpful assistant.',
          messages: messages.filter(m => m.role !== 'system').map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
    } else if (isAliyunDashScope) {
      response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          input: {
            messages: [
              { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
              ...messages.filter(m => m.role !== 'system').map(m => ({
                role: m.role,
                content: m.content,
              })),
            ]
          },
          parameters: {
            max_tokens: 4096,
          },
        }),
      });
    } else {
      response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
            ...messages.filter(m => m.role !== 'system').map(m => ({
              role: m.role,
              content: m.content,
            })),
          ],
          max_tokens: 4096,
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(`API 错误：${errorMessage}`);
    }

    const data = await response.json();

    if (isAnthropic) {
      return data.content?.[0]?.text || '';
    } else if (isAliyunDashScope) {
      return data.output?.choices?.[0]?.message?.content || data.output?.text || '';
    } else {
      return data.choices?.[0]?.message?.content || '';
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络请求失败 (Failed to fetch)，可能原因：\n1. CORS 跨域限制 - 浏览器阻止跨域请求\n2. URL 格式不正确\n3. 网络连接问题\n\n建议使用浏览器插件临时禁用 CORS 进行测试');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('网络错误，请检查连接后重试');
  }
}

/**
 * 验证 API 配置是否有效
 */
export async function validateAPI(config: LLMConfig): Promise<{ valid: boolean; error?: string }> {
  const { apiKey, baseURL, model, useProxy, proxyUrl } = config;

  if (!apiKey) {
    return { valid: false, error: 'API Key 不能为空' };
  }

  if (!baseURL) {
    return { valid: false, error: 'Base URL 不能为空' };
  }

  // 如果使用后端代理
  if (useProxy) {
    const proxyEndpoint = proxyUrl || 'http://localhost:3001';
    try {
      const response = await fetch(`${proxyEndpoint}/api/llm/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUrl: baseURL,
          apiKey,
          model,
          provider: baseURL.includes('anthropic') ? 'anthropic' : 'openai',
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        return { valid: false, error: result.error || '验证失败' };
      }
      return result;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          valid: false,
          error: '无法连接到后端代理服务，请确认服务器已启动 (http://localhost:3001)',
        };
      }
      return {
        valid: false,
        error: error instanceof Error ? error.message : '验证失败',
      };
    }
  }

  // 直接调用（可能遇到 CORS 限制）
  try {
    // 检测是否为 Anthropic 格式
    const isAnthropic = baseURL.includes('anthropic');
    // 检测是否为阿里云 DashScope 格式（使用 input 字段的特殊格式）
    const isAliyunDashScope = (baseURL.includes('dashscope.aliyuncs.com/compatible-mode') || baseURL.includes('dashscope.aliyuncs.com/api'));

    let response: Response;

    if (isAnthropic) {
      response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      });
    } else if (isAliyunDashScope) {
      // 阿里云 DashScope API 格式
      response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          input: {
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              { role: 'user', content: 'Hi' }
            ]
          },
          parameters: {
            max_tokens: 10,
          },
        }),
      });
    } else {
      // OpenAI 兼容 API 格式（包括阿里云百炼 coding.dashscope.aliyuncs.com）
      response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 10,
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      return { valid: false, error: errorMessage };
    }

    return { valid: true };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        valid: false,
        error: '网络请求失败，可能原因：\n1. CORS 跨域限制（浏览器阻止）\n2. URL 格式不正确\n3. 网络连接问题\n\n建议：启动后端代理服务 (bun run server) 或使用浏览器插件临时禁用 CORS'
      };
    }
    if (error instanceof Error) {
      return { valid: false, error: error.message };
    }
    return { valid: false, error: '未知错误' };
  }
}
