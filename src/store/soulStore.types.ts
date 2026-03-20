// Soul 核心类型定义

export type LayerType =
  | 'identity'
  | 'ability'
  | 'style'
  | 'flow'
  | 'knowledge'
  | 'constraint'
  | 'tool';

export interface LibraryItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

export interface FlowStep {
  id: string;
  order: number;
}

export interface Soul {
  // 元数据
  name: string;
  description?: string;
  version: string;
  createdAt?: string;
  updatedAt?: string;

  // 必须层
  identity: string;        // 身份（单选）
  abilities: string[];     // 能力（多选）

  // 可选层
  styles: string[];        // 风格（多选）
  flows: FlowStep[];       // 流程（排序列表）
  knowledge?: string;      // 知识（纯文本）
  constraints: string[];   // 约束（多选）
  tools: string[];         // 工具（多选）
}

export interface SoulState {
  soul: Soul | null;
  libraries: {
    identities: LibraryItem[];
    abilities: LibraryItem[];
    styles: LibraryItem[];
    flows: LibraryItem[];
    constraints: LibraryItem[];
    tools: LibraryItem[];
  };
  ui: {
    activePanel: 'library' | 'builder' | 'preview';
    isPreviewOpen: boolean;
    isSaving: boolean;
    lastSaved?: string;
  };
}

export interface SoulActions {
  // 身份层
  setIdentity: (identityId: string) => void;

  // 能力层
  toggleAbility: (abilityId: string) => void;

  // 风格层
  toggleStyle: (styleId: string) => void;

  // 流程层
  setFlows: (flows: FlowStep[]) => void;
  reorderFlows: (fromIndex: number, toIndex: number) => void;

  // 知识层
  setKnowledge: (knowledge: string) => void;

  // 约束层
  toggleConstraint: (constraintId: string) => void;

  // 工具层
  toggleTool: (toolId: string) => void;

  // Soul 元数据
  setSoulName: (name: string) => void;
  setSoulDescription: (description: string) => void;

  // 存储操作
  saveToStorage: () => void;
  loadFromStorage: () => void;
  migrateLegacyData: () => boolean;
  clearSoul: () => void;

  // 导入导出
  exportToJson: () => string;
  importFromJson: (json: string) => void;
  generateShareLink: () => { url: string; error?: string };
  importFromShareLink: (url: string) => { soul: Soul; error?: string };

  // UI 操作
  setPreviewOpen: (open: boolean) => void;
}

export type SoulStore = SoulState & SoulActions;

// 创建空 Soul 的工厂函数
export function createEmptySoul(): Soul {
  return {
    name: '未命名的 Soul',
    description: '',
    version: '1.0.0',
    identity: '',
    abilities: [],
    styles: [],
    flows: [],
    knowledge: '',
    constraints: [],
    tools: [],
  };
}

// Soul 验证错误类型
export interface SoulValidationError {
  field: keyof Soul;
  message: string;
  severity: 'error' | 'warning';
}

// Soul 验证结果
export interface SoulValidationResult {
  isValid: boolean;
  errors: SoulValidationError[];
  warnings: SoulValidationError[];
}

/**
 * 验证 Soul 数据的完整性
 *
 * 检查 7 层结构的必须字段和可选字段
 * - error: 阻止导出/分享的严重问题
 * - warning: 建议修复但不阻止操作的问题
 */
export function validateSoul(soul: Soul | null): SoulValidationResult {
  const errors: SoulValidationError[] = [];
  const warnings: SoulValidationError[] = [];

  if (!soul) {
    return {
      isValid: false,
      errors: [{ field: 'name', message: 'Soul 不存在', severity: 'error' }],
      warnings: [],
    };
  }

  // 必须字段验证
  if (!soul.name || soul.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Soul 名称不能为空',
      severity: 'error',
    });
  }

  if (!soul.identity || soul.identity.trim() === '') {
    errors.push({
      field: 'identity',
      message: 'Soul 必须选择一个身份',
      severity: 'error',
    });
  }

  // 版本号格式验证
  const versionRegex = /^\d+\.\d+\.\d+$/;
  if (!soul.version || !versionRegex.test(soul.version)) {
    warnings.push({
      field: 'version',
      message: '版本号格式应为 X.Y.Z (如 1.0.0)',
      severity: 'warning',
    });
  }

  // 能力层验证 - 至少选择一个能力
  if (soul.abilities.length === 0) {
    warnings.push({
      field: 'abilities',
      message: '建议至少选择一个能力',
      severity: 'warning',
    });
  }

  // 知识层验证 - 长度检查
  if (soul.knowledge && soul.knowledge.length > 5000) {
    warnings.push({
      field: 'knowledge',
      message: '知识内容过长，可能导致分享链接失效',
      severity: 'warning',
    });
  }

  // 流程层验证 - 检查 order 连续性
  if (soul.flows.length > 0) {
    const orders = soul.flows.map(f => f.order).sort((a, b) => a - b);
    for (let i = 0; i < orders.length; i++) {
      if (orders[i] !== i) {
        errors.push({
          field: 'flows',
          message: '流程排序不连续，可能存在数据错误',
          severity: 'error',
        });
        break;
      }
    }
  }

  // 检查重复项
  const hasDuplicates = (arr: string[]) => new Set(arr).size !== arr.length;
  if (hasDuplicates(soul.abilities)) {
    errors.push({
      field: 'abilities',
      message: '能力列表存在重复项',
      severity: 'error',
    });
  }
  if (hasDuplicates(soul.styles)) {
    errors.push({
      field: 'styles',
      message: '风格列表存在重复项',
      severity: 'error',
    });
  }
  if (hasDuplicates(soul.constraints)) {
    errors.push({
      field: 'constraints',
      message: '约束列表存在重复项',
      severity: 'error',
    });
  }
  if (hasDuplicates(soul.tools)) {
    errors.push({
      field: 'tools',
      message: '工具列表存在重复项',
      severity: 'error',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
