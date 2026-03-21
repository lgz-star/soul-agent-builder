/**
 * LLM API 代理服务
 * 解决浏览器 CORS 限制，转发请求到各大 LLM 提供商
 *
 * 启动方式:
 *   bun run server
 *   或 node --loader ts-node/esm server/index.ts
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// 启用 CORS（允许前端跨域调用）
app.use('*', cors());

// 日志中间件
app.use('*', async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.path}`);
  await next();
});

// 健康检查
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// LLM API 代理路由
app.post('/api/llm/proxy', async (c) => {
  try {
    const body = await c.req.json();
    const { targetUrl, apiKey, provider, headers } = body;

    if (!targetUrl) {
      return c.json({ error: 'targetUrl 必填' }, 400);
    }

    if (!apiKey) {
      return c.json({ error: 'apiKey 必填' }, 400);
    }

    // 构建请求头
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // 根据提供商添加认证头
    if (provider === 'anthropic') {
      requestHeaders['x-api-key'] = apiKey;
      requestHeaders['anthropic-version'] = '2023-06-01';
    } else {
      // OpenAI 兼容格式（包括阿里云百炼）
      requestHeaders['Authorization'] = `Bearer ${apiKey}`;
    }

    // 转发请求到 LLM API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(body.requestBody),
    });

    // 读取响应
    const responseText = await response.text();
    const statusCode = response.status;

    // 构建响应头（排除 hop-by-hop 头）
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      if (!['transfer-encoding', 'connection', 'keep-alive', 'date'].includes(key)) {
        responseHeaders[key] = value;
      }
    });

    // 返回原始响应
    return new Response(responseText, {
      status: statusCode,
      headers: {
        ...responseHeaders,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('代理请求失败:', error);
    return c.json(
      {
        error: error instanceof Error ? error.message : '代理请求失败',
      },
      500
    );
  }
});

// 验证 API 路由（用于测试连接）
app.post('/api/llm/validate', async (c) => {
  try {
    const { targetUrl, apiKey, provider, model } = await c.req.json();

    if (!targetUrl || !apiKey || !model) {
      return c.json({ error: 'targetUrl、apiKey 和 model 必填' }, 400);
    }

    // 构建验证请求体
    let validateBody: Record<string, unknown>;
    const headers: Record<string, string> = {};

    if (provider === 'anthropic') {
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      validateBody = {
        model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }],
      };
    } else {
      // OpenAI 兼容格式
      headers['Authorization'] = `Bearer ${apiKey}`;

      // 检测是否为阿里云 DashScope 特殊格式
      const isDashScope = targetUrl.includes('dashscope.aliyuncs.com/compatible-mode') ||
                          targetUrl.includes('dashscope.aliyuncs.com/api');

      if (isDashScope) {
        validateBody = {
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
        };
      } else {
        validateBody = {
          model,
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 10,
        };
      }
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(validateBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      return c.json({ valid: false, error: errorMessage }, 200);
    }

    return c.json({ valid: true });
  } catch (error) {
    console.error('验证失败:', error);
    return c.json(
      {
        valid: false,
        error: error instanceof Error ? error.message : '验证失败',
      },
      500
    );
  }
});

// 启动服务器
const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || '0.0.0.0';  // 支持局域网访问

// 获取本机 IP 地址
function getLocalIP(): string {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

console.log(`
╔════════════════════════════════════════════════════════╗
║           Soul Agent Builder - LLM Proxy Server        ║
╠════════════════════════════════════════════════════════╣
║  本地访问：http://localhost:${port}
║  局域网访问：http://${localIP}:${port}
║  健康检查：http://localhost:${port}/health
║  API 代理：POST http://localhost:${port}/api/llm/proxy
║  API 验证：POST http://localhost:${port}/api/llm/validate
╚════════════════════════════════════════════════════════╝
`);

// Bun 启动方式
if (typeof Bun !== 'undefined') {
  Bun.serve({
    port,
    hostname: host,
    fetch: app.fetch,
  });
} else {
  // Node.js 启动方式（备用）
  require('http').createServer(app.fetch).listen(port, host);
}
