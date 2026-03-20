import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { debounce } from '../utils/debounce';
import { escapeHtml } from '../utils/xss';
import { toBase64, fromBase64 } from '../utils/base64';
import type { Soul, FlowStep, SoulStore } from './soulStore.types';
import { createEmptySoul, validateSoul } from './soulStore.types';

// 词库数据
import {
  identityLibrary,
  abilityLibrary,
  styleLibrary,
  flowLibrary,
  constraintLibrary,
  toolLibrary,
} from '../data/libraries';

const STORAGE_KEY = 'soul-builder-data';
const DEBOUNCE_MS = 500;

export const useSoulStore = create<SoulStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      soul: null,
      libraries: {
        identities: identityLibrary,
        abilities: abilityLibrary,
        styles: styleLibrary,
        flows: flowLibrary,
        constraints: constraintLibrary,
        tools: toolLibrary,
      },
      ui: {
        activePanel: 'library',
        isPreviewOpen: false,
        isSaving: false,
        lastSaved: undefined,
      },

      // 身份层操作
      setIdentity: (identityId: string) => {
        set((state) => {
          const newSoul = state.soul
            ? { ...state.soul, identity: identityId, updatedAt: new Date().toISOString() }
            : { ...createEmptySoul(), identity: identityId, updatedAt: new Date().toISOString() };

          // 验证 Soul 完整性
          const validation = validateSoul(newSoul);
          if (!validation.isValid) {
            console.warn('Soul 验证失败:', validation.errors);
            // 仍然允许设置，但记录错误
          }

          return { soul: newSoul };
        });
        get().saveToStorage();
      },

      // 能力层操作
      toggleAbility: (abilityId: string) => {
        set((state) => {
          if (!state.soul) return { soul: { ...createEmptySoul(), abilities: [abilityId] } };
          const exists = state.soul.abilities.includes(abilityId);
          const newSoul = {
            ...state.soul,
            abilities: exists
              ? state.soul.abilities.filter((id) => id !== abilityId)
              : [...state.soul.abilities, abilityId],
            updatedAt: new Date().toISOString(),
          };

          // 验证 Soul 完整性
          const validation = validateSoul(newSoul);
          if (!validation.isValid) {
            console.warn('Soul 验证失败:', validation.errors);
          }

          return { soul: newSoul };
        });
        get().saveToStorage();
      },

      // 风格层操作
      toggleStyle: (styleId: string) => {
        set((state) => {
          if (!state.soul) return { soul: { ...createEmptySoul(), styles: [styleId] } };
          const exists = state.soul.styles.includes(styleId);
          const newSoul = {
            ...state.soul,
            styles: exists
              ? state.soul.styles.filter((id) => id !== styleId)
              : [...state.soul.styles, styleId],
            updatedAt: new Date().toISOString(),
          };

          // 验证 Soul 完整性
          const validation = validateSoul(newSoul);
          if (!validation.isValid) {
            console.warn('Soul 验证失败:', validation.errors);
          }

          return { soul: newSoul };
        });
        get().saveToStorage();
      },

      // 流程层操作
      setFlows: (flows: FlowStep[]) => {
        set((state) => {
          const newSoul = state.soul
            ? { ...state.soul, flows, updatedAt: new Date().toISOString() }
            : { ...createEmptySoul(), flows };

          // 验证 Soul 完整性
          const validation = validateSoul(newSoul);
          if (!validation.isValid) {
            console.warn('Soul 验证失败:', validation.errors);
          }

          return { soul: newSoul };
        });
        get().saveToStorage();
      },

      toggleFlow: (flowId: string) => {
        set((state) => {
          if (!state.soul) return { soul: { ...createEmptySoul(), flows: [{ id: flowId, order: 0 }] } };
          const exists = state.soul.flows.find((f) => f.id === flowId);
          let newFlows;
          if (exists) {
            // 移除
            newFlows = state.soul.flows.filter((f) => f.id !== flowId);
          } else {
            // 添加
            const maxOrder = state.soul.flows.reduce((max, f) => Math.max(max, f.order), -1);
            newFlows = [...state.soul.flows, { id: flowId, order: maxOrder + 1 }];
          }

          const newSoul = {
            ...state.soul,
            flows: newFlows,
            updatedAt: new Date().toISOString(),
          };

          // 验证 Soul 完整性
          const validation = validateSoul(newSoul);
          if (!validation.isValid) {
            console.warn('Soul 验证失败:', validation.errors);
          }

          return { soul: newSoul };
        });
        get().saveToStorage();
      },

      reorderFlows: (fromIndex: number, toIndex: number) => {
        const flows = get().soul?.flows || [];
        if (flows.length === 0) return;

        const newFlows = [...flows];
        const [removed] = newFlows.splice(fromIndex, 1);
        newFlows.splice(toIndex, 0, removed);

        // 重新排序
        const reorderedFlows = newFlows.map((flow, index) => ({ ...flow, order: index }));
        get().setFlows(reorderedFlows);
      },

      // 知识层操作
      setKnowledge: (knowledge: string) => {
        // XSS 防护：输入时转义
        const sanitizedKnowledge = escapeHtml(knowledge);
        set((state) => {
          const newSoul = state.soul
            ? { ...state.soul, knowledge: sanitizedKnowledge, updatedAt: new Date().toISOString() }
            : { ...createEmptySoul(), knowledge: sanitizedKnowledge };

          // 验证 Soul 完整性
          const validation = validateSoul(newSoul);
          if (!validation.isValid) {
            console.warn('Soul 验证失败:', validation.errors);
          }

          return { soul: newSoul };
        });
        get().saveToStorage();
      },

      // 约束层操作
      toggleConstraint: (constraintId: string) => {
        set((state) => {
          if (!state.soul) return { soul: { ...createEmptySoul(), constraints: [constraintId] } };
          const exists = state.soul.constraints.includes(constraintId);
          const newSoul = {
            ...state.soul,
            constraints: exists
              ? state.soul.constraints.filter((id) => id !== constraintId)
              : [...state.soul.constraints, constraintId],
            updatedAt: new Date().toISOString(),
          };

          // 验证 Soul 完整性
          const validation = validateSoul(newSoul);
          if (!validation.isValid) {
            console.warn('Soul 验证失败:', validation.errors);
          }

          return { soul: newSoul };
        });
        get().saveToStorage();
      },

      // 工具层操作
      toggleTool: (toolId: string) => {
        set((state) => {
          if (!state.soul) return { soul: { ...createEmptySoul(), tools: [toolId] } };
          const exists = state.soul.tools.includes(toolId);
          const newSoul = {
            ...state.soul,
            tools: exists
              ? state.soul.tools.filter((id) => id !== toolId)
              : [...state.soul.tools, toolId],
            updatedAt: new Date().toISOString(),
          };

          // 验证 Soul 完整性
          const validation = validateSoul(newSoul);
          if (!validation.isValid) {
            console.warn('Soul 验证失败:', validation.errors);
          }

          return { soul: newSoul };
        });
        get().saveToStorage();
      },

      // Soul 元数据操作
      setSoulName: (name: string) => {
        set((state) => {
          const newSoul = state.soul
            ? { ...state.soul, name, updatedAt: new Date().toISOString() }
            : { ...createEmptySoul(), name };

          // 验证 Soul 完整性
          const validation = validateSoul(newSoul);
          if (!validation.isValid) {
            console.warn('Soul 验证失败:', validation.errors);
          }

          return { soul: newSoul };
        });
        get().saveToStorage();
      },

      setSoulDescription: (description: string) => {
        set((state) => {
          const newSoul = state.soul
            ? { ...state.soul, description, updatedAt: new Date().toISOString() }
            : { ...createEmptySoul(), description };

          // 验证 Soul 完整性
          const validation = validateSoul(newSoul);
          if (!validation.isValid) {
            console.warn('Soul 验证失败:', validation.errors);
          }

          return { soul: newSoul };
        });
        get().saveToStorage();
      },

      // 存储操作（带防抖）
      saveToStorage: debounce(function () {
        try {
          // 数据已经在 persist middleware 中自动保存
          set((s) => ({
            ui: { ...s.ui, isSaving: false, lastSaved: new Date().toISOString() },
          }));
        } catch (error) {
          if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            alert('本地空间已满，请清理后重试');
          } else if (error instanceof DOMException && error.name === 'SecurityError') {
            alert('无法使用本地存储，数据将在关闭后丢失');
          }
          set((s) => ({ ui: { ...s.ui, isSaving: false } }));
        }
      }, DEBOUNCE_MS),

      loadFromStorage: () => {
        // persist middleware 会自动加载
        // 这里可以添加自定义加载逻辑
      },

      clearSoul: () => {
        set({ soul: null });
        get().saveToStorage();
      },

      // 导出为 JSON
      exportToJson: () => {
        const soul = get().soul;
        if (!soul) {
          throw new Error('没有可导出的 Soul');
        }
        try {
          return JSON.stringify(soul, null, 2);
        } catch (error) {
          if (error instanceof TypeError) {
            throw new Error('Soul 数据包含循环引用，请检查');
          }
          throw error;
        }
      },

      // 从 JSON 导入
      importFromJson: (json: string) => {
        try {
          const soul: Soul = JSON.parse(json);
          // 基本验证
          if (!soul.identity || !soul.name) {
            throw new Error('无效的 Soul 数据');
          }
          set({ soul });
          get().saveToStorage();
        } catch (error) {
          if (error instanceof SyntaxError) {
            throw new Error('无效的 JSON 格式');
          }
          throw error;
        }
      },

      // 生成分享链接
      generateShareLink: () => {
        const soul = get().soul;
        if (!soul) {
          return { url: '', error: '没有可分享的 Soul' };
        }

        try {
          const json = JSON.stringify(soul);
          const base64 = toBase64(json);

          // 检查 URL 长度（浏览器限制约 2KB）
          const baseUrl = typeof window !== 'undefined'
            ? window.location.origin + window.location.pathname
            : 'https://example.com';
          const fullUrl = `${baseUrl}#/import?soul=${base64}`;

          if (fullUrl.length > 2000) {
            return { url: '', error: 'Soul 太复杂，请简化后分享' };
          }

          return { url: fullUrl };
        } catch (error) {
          return { url: '', error: '生成分享链接失败' };
        }
      },

      // 从分享链接导入
      importFromShareLink: (url: string) => {
        try {
          const urlObj = new URL(url);
          const soulParam = urlObj.hash.includes('soul=')
            ? urlObj.hash.split('soul=')[1]
            : urlObj.searchParams.get('soul');

          if (!soulParam) {
            return { soul: null as unknown as Soul, error: '分享链接无效' };
          }

          const json = fromBase64(soulParam);
          const soul: Soul = JSON.parse(json);

          return { soul };
        } catch (error) {
          if (error instanceof DOMException) {
            return { soul: null as unknown as Soul, error: '分享链接无效，请检查' };
          }
          if (error instanceof SyntaxError) {
            return { soul: null as unknown as Soul, error: 'Soul 数据已损坏，无法导入' };
          }
          return { soul: null as unknown as Soul, error: '导入失败' };
        }
      },

      // UI 操作
      setPreviewOpen: (open: boolean) => {
        set((state) => ({
          ui: { ...state.ui, isPreviewOpen: open },
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ soul: state.soul }),
    }
  )
);
