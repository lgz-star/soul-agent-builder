/**
 * 中文翻译包
 */
export const zh = {
  // UI 通用
  ui: {
    title: 'Soul & Agent 构建器',
    subtitle: '通过拖拽创建你的 AI 人格',
    library: '模块库',
    builder: '构建区',
    preview: '预览',
    export: '导出',
    share: '分享',
    openPreview: '打开预览',
    close: '关闭',
    copy: '复制',
    copied: '已复制',
    cancel: '取消',
    save: '保存',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    language: 'zh',
  },

  // 层标题
  layers: {
    identity: '身份',
    ability: '能力',
    style: '风格',
    flow: '流程',
    knowledge: '知识',
    constraint: '约束',
    tool: '工具',
  },

  // 状态文本
  status: {
    notSelected: '未选择',
    startCreating: '开始创建',
    loading: '加载中...',
    saving: '保存中...',
    saved: '已保存',
  },

  // 空状态
  empty: {
    startCreatingTitle: '开始创建',
    startCreatingDesc: '从左侧选择模块开始创建你的 Soul',
    noItems: '暂无内容',
  },

  // 导出菜单
  export: {
    json: '导出 JSON',
    markdown: '导出 Markdown',
    claude: '导出 CLAUDE.md',
    downloadName: 'soul',
  },

  // 分享
  share: {
    title: '分享 Soul',
    copyLink: '复制分享链接',
    linkPreview: '链接预览：',
    tooLong: 'Soul 太复杂，请简化后分享',
    invalid: '分享链接无效',
    corrupted: 'Soul 数据已损坏，无法导入',
  },

  // 验证错误
  validation: {
    soulInvalid: 'Soul 验证失败',
    knowledgeTooLong: '知识内容过长',
  },

  // 语言
  language: {
    switcher: '语言',
    chinese: '中文',
    english: 'English',
  },

  // 模板画廊
  templates: {
    title: '模板画廊',
    category: {
      frontend: '前端',
      backend: '后端',
      ai: 'AI',
      data: '数据',
      devops: 'DevOps',
    },
    useTemplate: '使用此模板',
    confirmOverwrite: '当前已有未保存的配置，加载模板将覆盖现有配置。是否继续？',
    // 前端模板
    'frontend-react-expert': {
      name: 'React 前端专家',
      description: '专注于 React 生态的前端开发专家',
    },
    'frontend-vue-developer': {
      name: 'Vue 开发工程师',
      description: 'Vue 3 生态系统的专业前端开发者',
    },
    'frontend-ui-specialist': {
      name: 'UI 实现专家',
      description: '专注于像素级完美 UI 实现',
    },
    // 后端模板
    'backend-nodejs-eng': {
      name: 'Node.js 后端工程师',
      description: 'Node.js 服务器端开发专家',
    },
    'backend-python-dev': {
      name: 'Python 后端开发者',
      description: 'Python Web 后端开发专家',
    },
    'backend-api-architect': {
      name: 'API 架构师',
      description: 'RESTful/GraphQL API 设计专家',
    },
    // AI 模板
    'ai-ml-engineer': {
      name: '机器学习工程师',
      description: 'ML 模型开发和部署专家',
    },
    'ai-nlp-specialist': {
      name: 'NLP 专家',
      description: '自然语言处理和 LLM 应用开发',
    },
    'ai-agent-builder': {
      name: 'AI Agent 构建师',
      description: '智能 Agent 和自动化系统设计',
    },
    // 数据模板
    'data-analyst': {
      name: '数据分析师',
      description: '数据探索和可视化分析专家',
    },
    'data-engineer': {
      name: '数据工程师',
      description: '数据管道和 ETL 开发',
    },
    // DevOps 模板
    'devops-sre': {
      name: 'SRE 工程师',
      description: '站点可靠性和自动化运维',
    },
    'devops-cicd': {
      name: 'CI/CD 专家',
      description: '持续集成和部署流水线',
    },
    'devops-cloud-architect': {
      name: '云架构师',
      description: '云原生架构设计和实施',
    },
  },

  // 设置面板
  settings: {
    title: '设置',
    aiInfoTitle: 'AI 一键生成 Soul',
    aiInfoDescription: '配置 LLM API 后，你可以使用 AI 功能自动生成 Soul 配置',
    presetLabel: '预设服务',
    presetDescription: '选择预设服务或自定义配置',
    presetInfo: '当前使用',
    baseURLLabel: 'API Base URL',
    baseURLDescription: 'LLM API 的完整 URL 地址',
    baseURLEmpty: 'Base URL 不能为空',
    modelLabel: '模型名称',
    modelDescription: '如 claude-sonnet-4-6, gpt-4o, llama3 等',
    modelPlaceholder: '输入模型名称',
    modelEmpty: '模型名称不能为空',
    apiKeyLabel: 'API Key',
    apiKeyDescription: '你的 API Key 仅存储在本地，不会上传到服务器',
    apiKeyEmpty: 'API Key 不能为空',
    configRequired: '请填写完整配置',
    apiKeyValid: '配置有效，可以正常使用',
    apiKeyInvalid: '配置无效，请检查',
    apiKeyValidateError: '验证失败，请检查网络连接',
    apiKeyConfigured: '已配置',
    validateApiKey: '验证',
    clearApiKey: '清除',
    apiKeyStorageHint: 'API 配置存储在浏览器本地存储中，清除浏览器数据会被删除',
  },

  // AI 生成
  ai: {
    title: 'AI 一键生成 Soul',
    infoTitle: '描述你的需求',
    infoDescription: '用自然语言描述你想要的 AI Agent 功能，AI 会自动生成完整的 Soul 配置',
    promptLabel: '需求描述',
    promptPlaceholder: '例如：我需要一个专注于 React 前端开发的 AI 助手，能够帮助我编写组件、优化性能...',
    promptRequired: '请输入需求描述',
    configRequired: '请先在设置中配置完整的 LLM 信息',
    generateError: '生成失败，请重试',
    generating: '正在生成...',
    generate: '生成 Soul',
    showExamples: '查看示例',
    example1: '我需要一个专注于 React 前端开发的 AI 助手，能够帮助我编写组件、优化性能、审查代码质量',
    example2: '创建一个 Python 后端开发专家，擅长 API 设计、数据库优化和 Docker 部署',
    example3: '我需要一个机器学习工程师助手，帮助我进行数据预处理、模型训练和部署',
  },
};
