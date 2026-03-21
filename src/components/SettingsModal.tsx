import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  TextInput,
  Group,
  Text,
  Alert,
  Stack,
  Badge,
  Select,
  Box,
  Collapse,
} from '@mantine/core';
import { IconKey, IconCheck, IconX, IconRobot, IconAlertCircle, IconWorld } from '@tabler/icons-react';
import { useSoulStore } from '../store/soulStore';
import { validateAPI, PRESET_CONFIGS, type PresetKey } from '../services/llmService';
import { useTranslation } from '../i18n';

interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ opened, onClose }) => {
  const { t, language } = useTranslation();
  const { llmConfig, setLLMConfig, clearLLMConfig } = useSoulStore((state) => ({
    llmConfig: state.llm?.config || state.getLLMConfig(),
    setLLMConfig: state.setLLMConfig,
    clearLLMConfig: state.clearLLMConfig,
  }));

  const [preset, setPreset] = useState<PresetKey>('custom');
  const [apiKey, setApiKey] = useState(llmConfig?.apiKey || '');
  const [baseURL, setBaseURL] = useState(llmConfig?.baseURL || '');
  const [model, setModel] = useState(llmConfig?.model || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; error?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(!llmConfig || !preset || preset === 'custom');

  // 当预设改变时，更新表单值
  useEffect(() => {
    if (preset && preset !== 'custom') {
      const presetConfig = PRESET_CONFIGS[preset];
      setBaseURL(presetConfig.baseURL);
      setModel(presetConfig.model);
    }
  }, [preset]);

  // 当有现有配置时，尝试匹配预设
  useEffect(() => {
    if (llmConfig) {
      const matched = Object.entries(PRESET_CONFIGS).find(
        ([, config]) => config.baseURL === llmConfig.baseURL && config.model === llmConfig.model
      );
      if (matched) {
        setPreset(matched[0] as PresetKey);
      } else {
        setPreset('custom');
      }
    }
  }, [llmConfig]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError(t('settings.apiKeyEmpty') || 'API Key 不能为空');
      return;
    }
    if (!baseURL.trim()) {
      setError(t('settings.baseURLEmpty') || 'Base URL 不能为空');
      return;
    }
    if (!model.trim()) {
      setError(t('settings.modelEmpty') || '模型名称不能为空');
      return;
    }

    setLLMConfig({
      apiKey: apiKey.trim(),
      baseURL: baseURL.trim(),
      model: model.trim(),
    });
    setError(null);
    onClose();
  };

  const handleValidate = async () => {
    if (!apiKey.trim() || !baseURL.trim() || !model.trim()) {
      setError(t('settings.configRequired') || '请填写完整配置');
      return;
    }

    setIsValidating(true);
    setValidationResult(null);
    setError(null);

    try {
      const result = await validateAPI({
        apiKey: apiKey.trim(),
        baseURL: baseURL.trim(),
        model: model.trim(),
      });
      setValidationResult(result);
      if (!result.valid) {
        setError(result.error || t('settings.apiKeyInvalid'));
      }
    } catch (err) {
      setValidationResult({ valid: false, error: t('settings.apiKeyValidateError') });
      setError(t('settings.apiKeyValidateError') || '验证失败，请检查网络连接');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setBaseURL('');
    setModel('');
    clearLLMConfig();
    setValidationResult(null);
    setError(null);
    setPreset('custom');
  };

  const handlePresetChange = (value: string | null) => {
    if (value) {
      setPreset(value as PresetKey);
      if (value === 'custom') {
        setShowCustom(true);
        setApiKey('');
        setBaseURL('');
        setModel('');
      } else {
        setShowCustom(false);
      }
    }
  };

  const presetOptions = Object.entries(PRESET_CONFIGS).map(([key, config]) => ({
    value: key,
    label: language === 'zh' ? config.name : config.name,
  }));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('settings.title')}
      centered
      size="md"
    >
      <Stack gap="md">
        <Alert
          icon={<IconRobot size={18} />}
          title={t('settings.aiInfoTitle')}
          color="blue"
          variant="light"
        >
          {t('settings.aiInfoDescription')}
        </Alert>

        <Alert
          icon={<IconAlertCircle size={18} />}
          title="关于 CORS 错误"
          color="orange"
          variant="light"
        >
          <Text size="sm">
            如果点击验证提示 "Failed to fetch"，通常是浏览器 CORS 跨域限制导致。
            <br />
            <br />
            解决方案：
            <br />
            1. <strong>推荐方案：</strong>启动后端代理服务（运行 <code>bun run server</code>），然后勾选下方"使用后端代理"选项
            <br />
            2. <strong>临时方案（开发）：</strong>安装浏览器插件临时禁用 CORS（如 "Allow CORS" 扩展）
            <br />
            3. <strong>本地测试：</strong>使用 Ollama 等本地部署的 LLM 服务
          </Text>
        </Alert>

        <Select
          label={t('settings.presetLabel')}
          description={t('settings.presetDescription')}
          data={presetOptions}
          value={preset}
          onChange={handlePresetChange}
          allowDeselect={false}
        />

        <Collapse in={showCustom || preset === 'custom'}>
          <Stack gap="md">
            <TextInput
              label={t('settings.baseURLLabel')}
              description={t('settings.baseURLDescription')}
              placeholder="https://api.example.com/v1/chat/completions"
              value={baseURL}
              onChange={(e) => {
                setBaseURL(e.target.value);
                setError(null);
              }}
              leftSection={<IconWorld size={18} />}
              autoComplete="off"
            />

            <TextInput
              label={t('settings.modelLabel')}
              description={t('settings.modelDescription')}
              placeholder={t('settings.modelPlaceholder')}
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                setError(null);
              }}
              autoComplete="off"
            />

            <TextInput
              label={t('settings.apiKeyLabel')}
              description={t('settings.apiKeyDescription')}
              placeholder={PRESET_CONFIGS[preset]?.placeholder || 'sk-...'}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError(null);
              }}
              leftSection={<IconKey size={18} />}
              type="password"
              autoComplete="off"
            />
          </Stack>
        </Collapse>

        {!showCustom && preset !== 'custom' && (
          <Box>
            <TextInput
              label={t('settings.apiKeyLabel')}
              description={t('settings.apiKeyDescription')}
              placeholder={PRESET_CONFIGS[preset]?.placeholder || 'sk-...'}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError(null);
              }}
              leftSection={<IconKey size={18} />}
              type="password"
              autoComplete="off"
            />
            <Text size="xs" c="dimmed" mt="xs">
              {t('settings.presetInfo')} {PRESET_CONFIGS[preset]?.name}: {baseURL}
            </Text>
          </Box>
        )}

        {error && (
          <Alert icon={<IconAlertCircle size={18} />} color="red" variant="light">
            {error}
          </Alert>
        )}

        {validationResult?.valid === true && (
          <Alert icon={<IconCheck size={18} />} color="green" variant="light">
            {t('settings.apiKeyValid')}
          </Alert>
        )}

        {validationResult?.valid === false && !error && (
          <Alert icon={<IconX size={18} />} color="red" variant="light">
            {validationResult.error || t('settings.apiKeyInvalid')}
          </Alert>
        )}

        <Group justify="space-between">
          <Group gap="xs">
            {llmConfig && !apiKey && (
              <Badge color="green" variant="light">
                {t('settings.apiKeyConfigured')}
              </Badge>
            )}
          </Group>
          <Group gap="xs">
            <Button
              variant="outline"
              color="gray"
              onClick={handleValidate}
              loading={isValidating}
              disabled={!apiKey.trim() || !baseURL.trim() || !model.trim()}
            >
              {t('settings.validateApiKey')}
            </Button>
            {llmConfig && (
              <Button
                variant="outline"
                color="red"
                onClick={handleClear}
                disabled={isValidating}
              >
                {t('settings.clearApiKey')}
              </Button>
            )}
          </Group>
        </Group>

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>
            {t('ui.cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('ui.save')}
          </Button>
        </Group>

        <Text size="xs" c="dimmed" ta="center">
          {t('settings.apiKeyStorageHint')}
        </Text>
      </Stack>
    </Modal>
  );
};
