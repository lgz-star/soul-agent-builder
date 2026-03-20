import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createEmptySoul, validateSoul } from '../soulStore.types';

// 模拟 localStorage
const mockLocalStorage = {
  data: {} as Record<string, string>,
  getItem: vi.fn((key: string): string | null => mockLocalStorage.data[key] || null),
  setItem: vi.fn((key: string, value: string): void => {
    mockLocalStorage.data[key] = value;
  }),
  removeItem: vi.fn((key: string): void => {
    delete mockLocalStorage.data[key];
  }),
  clear: vi.fn((): void => {
    mockLocalStorage.data = {};
  }),
};

vi.mock('zustand/middleware', async () => {
  const actual = await vi.importActual('zustand/middleware');
  return {
    ...(actual as object),
    createJSONStorage: () => ({
      getItem: mockLocalStorage.getItem,
      setItem: mockLocalStorage.setItem,
      removeItem: mockLocalStorage.removeItem,
    }),
  };
});

// 重新导入以使用 mock
const { useSoulStore } = await import('../soulStore');

describe('Soul Store', () => {
  beforeEach(() => {
    // 重置 store 和 localStorage
    useSoulStore.setState({
      soul: null,
      ui: {
        activePanel: 'library',
        isPreviewOpen: false,
        isSaving: false,
        lastSaved: undefined,
      },
    });
    mockLocalStorage.data = {};
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.getItem.mockClear();
  });

  describe('createEmptySoul', () => {
    it('应该创建空 Soul', () => {
      const emptySoul = createEmptySoul();
      expect(emptySoul.name).toBe('未命名的 Soul');
      expect(emptySoul.description).toBe('');
      expect(emptySoul.version).toBe('1.0.0');
      expect(emptySoul.identity).toBe('');
      expect(emptySoul.abilities).toEqual([]);
      expect(emptySoul.styles).toEqual([]);
      expect(emptySoul.flows).toEqual([]);
      expect(emptySoul.knowledge).toBe('');
      expect(emptySoul.constraints).toEqual([]);
      expect(emptySoul.tools).toEqual([]);
    });
  });

  describe('Identity Layer', () => {
    it('应该设置身份 (从 null 状态)', () => {
      const { setIdentity } = useSoulStore.getState();
      setIdentity('frontend-engineer');

      const state = useSoulStore.getState();
      expect(state.soul).toBeTruthy();
      expect(state.soul?.identity).toBe('frontend-engineer');
    });

    it('应该更新身份 (从已有状态)', () => {
      useSoulStore.getState().setIdentity('frontend-engineer');
      useSoulStore.getState().setIdentity('backend-engineer');

      const state = useSoulStore.getState();
      expect(state.soul?.identity).toBe('backend-engineer');
    });

    it('应该更新 updatedAt 时间戳', () => {
      const before = Date.now();
      useSoulStore.getState().setIdentity('frontend-engineer');
      const after = Date.now();

      const state = useSoulStore.getState();
      // 注意：由于 validateSoul 会检查 identity 是否设置，
      // 在设置 identity 后，验证会通过，updatedAt 应该存在
      expect(state.soul).toBeTruthy();
      expect(state.soul?.updatedAt).toBeTruthy();
      if (state.soul?.updatedAt) {
        const updatedAt = new Date(state.soul.updatedAt).getTime();
        expect(updatedAt).toBeGreaterThanOrEqual(before);
        expect(updatedAt).toBeLessThanOrEqual(after);
      }
    });
  });

  describe('Ability Layer', () => {
    it('应该添加能力 (多选)', () => {
      const { toggleAbility } = useSoulStore.getState();
      toggleAbility('react');
      toggleAbility('typescript');

      const state = useSoulStore.getState();
      expect(state.soul?.abilities).toEqual(['react', 'typescript']);
    });

    it('应该移除已存在的能力', () => {
      const { toggleAbility } = useSoulStore.getState();
      toggleAbility('react');
      toggleAbility('typescript');
      toggleAbility('react'); // 移除

      const state = useSoulStore.getState();
      expect(state.soul?.abilities).toEqual(['typescript']);
    });

    it('应该从 null 状态添加能力', () => {
      useSoulStore.getState().toggleAbility('react');

      const state = useSoulStore.getState();
      expect(state.soul?.abilities).toEqual(['react']);
    });
  });

  describe('Style Layer', () => {
    it('应该添加风格', () => {
      const { toggleStyle } = useSoulStore.getState();
      toggleStyle('concise');
      toggleStyle('professional');

      const state = useSoulStore.getState();
      expect(state.soul?.styles).toEqual(['concise', 'professional']);
    });

    it('应该移除风格', () => {
      const { toggleStyle } = useSoulStore.getState();
      toggleStyle('concise');
      toggleStyle('professional');
      toggleStyle('concise'); // 移除

      const state = useSoulStore.getState();
      expect(state.soul?.styles).toEqual(['professional']);
    });
  });

  describe('Flow Layer', () => {
    it('应该设置流程', () => {
      const { setFlows } = useSoulStore.getState();
      const flows = [
        { id: 'step-1', order: 0 },
        { id: 'step-2', order: 1 },
      ];
      setFlows(flows);

      const state = useSoulStore.getState();
      expect(state.soul?.flows).toEqual(flows);
    });

    it('应该重新排序流程', () => {
      const { setFlows, reorderFlows } = useSoulStore.getState();
      setFlows([
        { id: 'step-1', order: 0 },
        { id: 'step-2', order: 1 },
        { id: 'step-3', order: 2 },
      ]);

      reorderFlows(0, 2); // 将 step-1 从位置 0 移到位置 2

      const state = useSoulStore.getState();
      expect(state.soul?.flows.map(f => f.id)).toEqual(['step-2', 'step-3', 'step-1']);
      expect(state.soul?.flows.map(f => f.order)).toEqual([0, 1, 2]);
    });
  });

  describe('Knowledge Layer', () => {
    it('应该设置知识', () => {
      const { setKnowledge } = useSoulStore.getState();
      setKnowledge('这是知识内容');

      const state = useSoulStore.getState();
      expect(state.soul?.knowledge).toBe('这是知识内容');
    });

    it('应该转义 HTML 特殊字符', () => {
      const { setKnowledge } = useSoulStore.getState();
      setKnowledge('<script>alert("xss")</script>');

      const state = useSoulStore.getState();
      expect(state.soul?.knowledge).toContain('&lt;script&gt;');
      expect(state.soul?.knowledge).not.toContain('<script>');
    });

    it('应该转义引号', () => {
      const { setKnowledge } = useSoulStore.getState();
      setKnowledge('"hello" & \'world\'');

      const state = useSoulStore.getState();
      expect(state.soul?.knowledge).toContain('&quot;');
      expect(state.soul?.knowledge).toContain('&#x27;');
      expect(state.soul?.knowledge).toContain('&amp;');
    });
  });

  describe('Constraint Layer', () => {
    it('应该添加约束', () => {
      const { toggleConstraint } = useSoulStore.getState();
      toggleConstraint('must-comment');
      toggleConstraint('must-test');

      const state = useSoulStore.getState();
      expect(state.soul?.constraints).toEqual(['must-comment', 'must-test']);
    });

    it('应该移除约束', () => {
      const { toggleConstraint } = useSoulStore.getState();
      toggleConstraint('must-comment');
      toggleConstraint('must-test');
      toggleConstraint('must-comment'); // 移除

      const state = useSoulStore.getState();
      expect(state.soul?.constraints).toEqual(['must-test']);
    });
  });

  describe('Tool Layer', () => {
    it('应该添加工具', () => {
      const { toggleTool } = useSoulStore.getState();
      toggleTool('terminal');
      toggleTool('file-system');

      const state = useSoulStore.getState();
      expect(state.soul?.tools).toEqual(['terminal', 'file-system']);
    });

    it('应该移除工具', () => {
      const { toggleTool } = useSoulStore.getState();
      toggleTool('terminal');
      toggleTool('file-system');
      toggleTool('terminal'); // 移除

      const state = useSoulStore.getState();
      expect(state.soul?.tools).toEqual(['file-system']);
    });
  });

  describe('Soul Metadata', () => {
    it('应该设置 Soul 名称', () => {
      const { setSoulName } = useSoulStore.getState();
      setSoulName('测试 Soul');

      const state = useSoulStore.getState();
      expect(state.soul?.name).toBe('测试 Soul');
    });

    it('应该设置描述', () => {
      const { setSoulDescription } = useSoulStore.getState();
      setSoulDescription('这是一个测试描述');

      const state = useSoulStore.getState();
      expect(state.soul?.description).toBe('这是一个测试描述');
    });
  });

  describe('Clear Soul', () => {
    it('应该清空 Soul', () => {
      useSoulStore.getState().setIdentity('frontend-engineer');
      useSoulStore.getState().clearSoul();

      const state = useSoulStore.getState();
      expect(state.soul).toBeNull();
    });
  });

  describe('Export to JSON', () => {
    it('应该导出 Soul 为 JSON', () => {
      useSoulStore.getState().setIdentity('frontend-engineer');
      useSoulStore.getState().toggleAbility('react');

      const { exportToJson } = useSoulStore.getState();
      const json = exportToJson();
      const parsed = JSON.parse(json);

      expect(parsed.identity).toBe('frontend-engineer');
      expect(parsed.abilities).toEqual(['react']);
    });

    it('应该在 Soul 为 null 时抛出错误', () => {
      const { exportToJson } = useSoulStore.getState();
      expect(() => exportToJson()).toThrow('没有可导出的 Soul');
    });
  });

  describe('Import from JSON', () => {
    it('应该从 JSON 导入 Soul', () => {
      const json = JSON.stringify({
        name: '导入的 Soul',
        identity: 'backend-engineer',
        abilities: ['python'],
        styles: [],
        flows: [],
        constraints: [],
        tools: [],
        version: '1.0.0',
      });

      const { importFromJson } = useSoulStore.getState();
      importFromJson(json);

      const state = useSoulStore.getState();
      expect(state.soul?.name).toBe('导入的 Soul');
      expect(state.soul?.identity).toBe('backend-engineer');
    });

    it('应该在无效 JSON 时抛出错误', () => {
      const { importFromJson } = useSoulStore.getState();
      expect(() => importFromJson('not-json')).toThrow('无效的 JSON 格式');
    });

    it('应该在缺少必需字段时抛出错误', () => {
      const { importFromJson } = useSoulStore.getState();
      const invalidJson = JSON.stringify({ name: 'Missing identity' });
      expect(() => importFromJson(invalidJson)).toThrow('无效的 Soul 数据');
    });
  });

  describe('Share Link Generation', () => {
    it('应该生成分享链接', () => {
      useSoulStore.getState().setIdentity('frontend-engineer');

      const { generateShareLink } = useSoulStore.getState();
      const result = generateShareLink();

      expect(result.error).toBeFalsy();
      expect(result.url).toContain('/import?soul=');
    });

    it('应该在 Soul 为 null 时返回错误', () => {
      const { generateShareLink } = useSoulStore.getState();
      const result = generateShareLink();

      expect(result.url).toBe('');
      expect(result.error).toBe('没有可分享的 Soul');
    });

    it('应该在 URL 太长时返回错误', () => {
      // 创建一个超大的 Soul
      useSoulStore.getState().setIdentity('frontend-engineer');
      const largeKnowledge = 'a'.repeat(3000);
      useSoulStore.getState().setKnowledge(largeKnowledge);

      const { generateShareLink } = useSoulStore.getState();
      const result = generateShareLink();

      expect(result.url).toBe('');
      expect(result.error).toBe('Soul 太复杂，请简化后分享');
    });
  });

  describe('Import from Share Link', () => {
    it('应该从分享链接导入 Soul', () => {
      useSoulStore.getState().setIdentity('frontend-engineer');
      useSoulStore.getState().toggleAbility('react');

      const { generateShareLink, importFromShareLink } = useSoulStore.getState();
      const { url } = generateShareLink();

      const result = importFromShareLink(url);
      expect(result.error).toBeFalsy();
      expect(result.soul?.identity).toBe('frontend-engineer');
    });

    it('应该在无效链接时返回错误', () => {
      const { importFromShareLink } = useSoulStore.getState();
      const result = importFromShareLink('not-a-url');

      expect(result.soul).toBeFalsy();
      expect(result.error).toBeTruthy();
    });

    it('应该在损坏数据时返回错误', () => {
      const { importFromShareLink } = useSoulStore.getState();
      const result = importFromShareLink('/#/import?soul=invalid-base64!!!');

      expect(result.error).toBeTruthy();
    });
  });

  describe('UI State', () => {
    it('应该设置预览面板开关', () => {
      const { setPreviewOpen } = useSoulStore.getState();

      setPreviewOpen(true);
      expect(useSoulStore.getState().ui.isPreviewOpen).toBe(true);

      setPreviewOpen(false);
      expect(useSoulStore.getState().ui.isPreviewOpen).toBe(false);
    });
  });

  describe('Persistence', () => {
    it('应该保存到 localStorage', async () => {
      useSoulStore.getState().setIdentity('frontend-engineer');

      // 等待防抖
      await new Promise(resolve => setTimeout(resolve, 600));

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Soul Validation', () => {
    describe('validateSoul - null/empty checks', () => {
      it('应该返回错误当 Soul 为 null', () => {
        const result = validateSoul(null);
        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toBe('Soul 不存在');
      });

      it('应该返回错误当 Soul 没有 identity', () => {
        const soul = createEmptySoul();
        const result = validateSoul(soul);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.field === 'identity')).toBe(true);
      });

      it('应该返回错误当 Soul 没有 name', () => {
        const soul = { ...createEmptySoul(), identity: 'test', name: '' };
        const result = validateSoul(soul);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.field === 'name')).toBe(true);
      });
    });

    describe('validateSoul - warning checks', () => {
      it('应该返回警告当没有选择能力', () => {
        const soul = {
          ...createEmptySoul(),
          identity: 'frontend-engineer',
          name: 'Test Soul',
        };
        const result = validateSoul(soul);
        expect(result.warnings.some(w => w.field === 'abilities')).toBe(true);
      });

      it('应该返回警告当知识内容过长', () => {
        const soul = {
          ...createEmptySoul(),
          identity: 'frontend-engineer',
          name: 'Test Soul',
          knowledge: 'a'.repeat(5001),
        };
        const result = validateSoul(soul);
        expect(result.warnings.some(w => w.field === 'knowledge')).toBe(true);
      });

      it('应该返回警告当版本号格式不正确', () => {
        const soul = {
          ...createEmptySoul(),
          identity: 'frontend-engineer',
          name: 'Test Soul',
          version: 'invalid',
        };
        const result = validateSoul(soul);
        expect(result.warnings.some(w => w.field === 'version')).toBe(true);
      });
    });

    describe('validateSoul - duplicate checks', () => {
      it('应该返回错误当能力有重复项', () => {
        const soul = {
          ...createEmptySoul(),
          identity: 'frontend-engineer',
          name: 'Test Soul',
          abilities: ['react', 'react'],
        };
        const result = validateSoul(soul);
        expect(result.errors.some(e => e.field === 'abilities' && e.message.includes('重复'))).toBe(true);
      });

      it('应该返回错误当风格有重复项', () => {
        const soul = {
          ...createEmptySoul(),
          identity: 'frontend-engineer',
          name: 'Test Soul',
          styles: ['concise', 'concise'],
        };
        const result = validateSoul(soul);
        expect(result.errors.some(e => e.field === 'styles' && e.message.includes('重复'))).toBe(true);
      });

      it('应该返回错误当约束有重复项', () => {
        const soul = {
          ...createEmptySoul(),
          identity: 'frontend-engineer',
          name: 'Test Soul',
          constraints: ['must-test', 'must-test'],
        };
        const result = validateSoul(soul);
        expect(result.errors.some(e => e.field === 'constraints' && e.message.includes('重复'))).toBe(true);
      });

      it('应该返回错误当工具有重复项', () => {
        const soul = {
          ...createEmptySoul(),
          identity: 'frontend-engineer',
          name: 'Test Soul',
          tools: ['terminal', 'terminal'],
        };
        const result = validateSoul(soul);
        expect(result.errors.some(e => e.field === 'tools' && e.message.includes('重复'))).toBe(true);
      });
    });

    describe('validateSoul - flow order checks', () => {
      it('应该返回错误当流程排序不连续', () => {
        const soul = {
          ...createEmptySoul(),
          identity: 'frontend-engineer',
          name: 'Test Soul',
          flows: [
            { id: 'step-1', order: 0 },
            { id: 'step-2', order: 2 }, // 跳过 1
          ],
        };
        const result = validateSoul(soul);
        expect(result.errors.some(e => e.field === 'flows' && e.message.includes('排序'))).toBe(true);
      });

      it('应该通过验证当流程排序连续', () => {
        const soul = {
          ...createEmptySoul(),
          identity: 'frontend-engineer',
          name: 'Test Soul',
          flows: [
            { id: 'step-1', order: 0 },
            { id: 'step-2', order: 1 },
            { id: 'step-3', order: 2 },
          ],
        };
        const result = validateSoul(soul);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe('validateSoul - valid soul', () => {
      it('应该通过验证当 Soul 完整且有效', () => {
        const soul = {
          ...createEmptySoul(),
          identity: 'frontend-engineer',
          name: 'Test Soul',
          abilities: ['react', 'typescript'],
          styles: ['concise'],
          constraints: ['must-test'],
          tools: ['terminal'],
        };
        const result = validateSoul(soul);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });
});
