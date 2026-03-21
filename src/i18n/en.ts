/**
 * English Translation Pack
 */
export const en = {
  // UI Common
  ui: {
    title: 'Soul & Agent Builder',
    subtitle: 'Create your AI persona by dragging and dropping',
    library: 'Library',
    builder: 'Builder',
    preview: 'Preview',
    export: 'Export',
    share: 'Share',
    openPreview: 'Open Preview',
    close: 'Close',
    copy: 'Copy',
    copied: 'Copied',
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    language: 'en',
  },

  // Layer Titles
  layers: {
    identity: 'Identity',
    ability: 'Ability',
    style: 'Style',
    flow: 'Flow',
    knowledge: 'Knowledge',
    constraint: 'Constraint',
    tool: 'Tool',
  },

  // Status Text
  status: {
    notSelected: 'Not selected',
    startCreating: 'Start Creating',
    loading: 'Loading...',
    saving: 'Saving...',
    saved: 'Saved',
  },

  // Empty State
  empty: {
    startCreatingTitle: 'Start Creating',
    startCreatingDesc: 'Select a module from the left to start building your Soul',
    noItems: 'No items',
  },

  // Export Menu
  export: {
    json: 'Export JSON',
    markdown: 'Export Markdown',
    claude: 'Export CLAUDE.md',
    downloadName: 'soul',
  },

  // Share
  share: {
    title: 'Share Soul',
    copyLink: 'Copy Share Link',
    linkPreview: 'Link Preview:',
    tooLong: 'Soul is too complex, please simplify before sharing',
    invalid: 'Invalid share link',
    corrupted: 'Soul data is corrupted, cannot import',
  },

  // Validation Errors
  validation: {
    soulInvalid: 'Soul validation failed',
    knowledgeTooLong: 'Knowledge content is too long',
  },

  // Language
  language: {
    switcher: 'Language',
    chinese: '中文',
    english: 'English',
  },

  // Template Gallery
  templates: {
    title: 'Template Gallery',
    category: {
      frontend: 'Frontend',
      backend: 'Backend',
      ai: 'AI',
      data: 'Data',
      devops: 'DevOps',
    },
    useTemplate: 'Use This Template',
    confirmOverwrite: 'You have unsaved configuration. Loading a template will overwrite it. Continue?',
    // Frontend Templates
    'frontend-react-expert': {
      name: 'React Frontend Expert',
      description: 'Frontend development expert specializing in React ecosystem',
    },
    'frontend-vue-developer': {
      name: 'Vue Developer',
      description: 'Professional frontend developer for Vue 3 ecosystem',
    },
    'frontend-ui-specialist': {
      name: 'UI Implementation Specialist',
      description: 'Specialized in pixel-perfect UI implementation',
    },
    // Backend Templates
    'backend-nodejs-eng': {
      name: 'Node.js Backend Engineer',
      description: 'Node.js server-side development expert',
    },
    'backend-python-dev': {
      name: 'Python Backend Developer',
      description: 'Python Web backend development expert',
    },
    'backend-api-architect': {
      name: 'API Architect',
      description: 'RESTful/GraphQL API design expert',
    },
    // AI Templates
    'ai-ml-engineer': {
      name: 'Machine Learning Engineer',
      description: 'ML model development and deployment expert',
    },
    'ai-nlp-specialist': {
      name: 'NLP Specialist',
      description: 'Natural language processing and LLM application development',
    },
    'ai-agent-builder': {
      name: 'AI Agent Builder',
      description: 'Intelligent Agent and automation system design',
    },
    // Data Templates
    'data-analyst': {
      name: 'Data Analyst',
      description: 'Data exploration and visualization analysis expert',
    },
    'data-engineer': {
      name: 'Data Engineer',
      description: 'Data pipeline and ETL development',
    },
    // DevOps Templates
    'devops-sre': {
      name: 'SRE Engineer',
      description: 'Site reliability and automation operations',
    },
    'devops-cicd': {
      name: 'CI/CD Expert',
      description: 'Continuous integration and deployment pipelines',
    },
    'devops-cloud-architect': {
      name: 'Cloud Architect',
      description: 'Cloud-native architecture design and implementation',
    },
  },

  // Settings
  settings: {
    title: 'Settings',
    aiInfoTitle: 'AI One-Click Generate',
    aiInfoDescription: 'Configure LLM API to use AI features for automatic Soul generation',
    presetLabel: 'Preset Service',
    presetDescription: 'Select a preset service or customize configuration',
    presetInfo: 'Currently using',
    baseURLLabel: 'API Base URL',
    baseURLDescription: 'Full URL address of the LLM API',
    baseURLEmpty: 'Base URL is required',
    modelLabel: 'Model Name',
    modelDescription: 'e.g., claude-sonnet-4-6, gpt-4o, llama3, etc.',
    modelPlaceholder: 'Enter model name',
    modelEmpty: 'Model name is required',
    apiKeyLabel: 'API Key',
    apiKeyDescription: 'Your API Key is stored locally only and never uploaded to servers',
    apiKeyEmpty: 'API Key is required',
    configRequired: 'Please fill in the complete configuration',
    apiKeyValid: 'Configuration is valid and ready to use',
    apiKeyInvalid: 'Configuration is invalid, please check',
    apiKeyValidateError: 'Validation failed, please check your network connection',
    apiKeyConfigured: 'Configured',
    validateApiKey: 'Validate',
    clearApiKey: 'Clear',
    apiKeyStorageHint: 'API configuration is stored in browser local storage. Clearing browser data will remove it.',
  },

  // AI Generate
  ai: {
    title: 'AI Generate Soul',
    infoTitle: 'Describe Your Requirements',
    infoDescription: 'Describe the AI Agent you want in natural language, and AI will generate a complete Soul configuration',
    promptLabel: 'Requirements',
    promptPlaceholder: 'e.g., I need a React frontend AI assistant that can help me write components, optimize performance...',
    promptRequired: 'Please enter your requirements',
    configRequired: 'Please configure complete LLM information in settings first',
    generateError: 'Generation failed, please try again',
    generating: 'Generating...',
    generate: 'Generate Soul',
    showExamples: 'View Examples',
    example1: 'I need a React frontend AI assistant that can help me write components, optimize performance, and review code quality',
    example2: 'Create a Python backend development expert specializing in API design, database optimization, and Docker deployment',
    example3: 'I need a machine learning engineer assistant to help with data preprocessing, model training, and deployment',
  },

  // UI Additional
};
