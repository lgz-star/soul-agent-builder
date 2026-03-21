import React, { useState, useRef } from 'react';
import {
  Modal,
  Button,
  Textarea,
  Group,
  Alert,
  Stack,
  Text,
  ThemeIcon,
  Box,
  Collapse,
  Progress,
  Stepper,
} from '@mantine/core';
import {
  IconRobot,
  IconSparkles,
  IconAlertCircle,
  IconChevronDown,
  IconBrain,
  IconLayersOff,
  IconCheck,
} from '@tabler/icons-react';
import { useSoulStore } from '../store/soulStore';
import { generateSoul } from '../services/llmService';
import { useTranslation } from '../i18n';

interface AIGenerateModalProps {
  opened: boolean;
  onClose: () => void;
}

type GenerateStep = 'idle' | 'analyzing' | 'generating' | 'finalizing' | 'complete' | 'error';

export const AIGenerateModal: React.FC<AIGenerateModalProps> = ({ opened, onClose }) => {
  const { t, language } = useTranslation();
  const { loadTemplate, getLLMConfig } = useSoulStore();

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);
  const [currentStep, setCurrentStep] = useState<GenerateStep>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);

  const examples = [
    t('ai.example1'),
    t('ai.example2'),
    t('ai.example3'),
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(t('ai.promptRequired') || '请输入需求描述');
      return;
    }

    const config = getLLMConfig();
    if (!config || !config.apiKey || !config.baseURL || !config.model) {
      setError(t('ai.configRequired') || '请先在设置中配置完整的 LLM 信息');
      return;
    }

    // 创建 AbortController 用于取消请求
    abortControllerRef.current = new AbortController();

    setIsGenerating(true);
    setError(null);
    setCurrentStep('analyzing');

    // 使用实际 API 调用进度而非固定超时
    const progressTimer = setTimeout(() => setCurrentStep('generating'), 2000);
    let finalizeTimer: ReturnType<typeof setTimeout> | null = null;

    try {
      const response = await generateSoul(
        config,
        { prompt: prompt.trim(), language: language as 'zh' | 'en' },
        abortControllerRef.current.signal
      );

      clearTimeout(progressTimer);
      setCurrentStep('finalizing');

      // 短暂延迟展示完成状态
      finalizeTimer = setTimeout(() => {
        setCurrentStep('complete');

        // 加载生成的 Soul
        loadTemplate({
          id: 'ai-generated',
          name: response.name,
          description: response.description,
          category: 'ai',
          soul: {
            description: response.description,
            identity: response.identity,
            abilities: response.abilities,
            styles: response.styles,
            flows: response.flows,
            knowledge: response.knowledge,
            constraints: response.constraints,
            tools: response.tools,
          },
        });

        // 延迟关闭，让用户看到完成状态
        setTimeout(() => {
          onClose();
          setPrompt('');
          setCurrentStep('idle');
          setIsGenerating(false);
        }, 500);
      }, 300);
    } catch (err) {
      clearTimeout(progressTimer);
      clearTimeout(finalizeTimer ?? undefined);

      // 检查是否是用户取消
      if (err instanceof Error && err.name === 'AbortError') {
        // 用户取消，不显示错误
        setIsGenerating(false);
        return;
      }

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('ai.generateError') || '生成失败，请重试');
      }
      setCurrentStep('error');
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setShowExample(false);
  };

  const handleCancel = () => {
    // 取消正在进行的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
    setCurrentStep('idle');
    setError(language === 'zh' ? '已取消生成' : 'Generation cancelled');
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        // 关闭时取消请求
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        onClose();
        setPrompt('');
        setError(null);
        setCurrentStep('idle');
        setIsGenerating(false);
      }}
      title={
        <Group gap="xs">
          <ThemeIcon color="violet" variant="light" size="md">
            <IconSparkles size={20} />
          </ThemeIcon>
          <Text fw={600}>{t('ai.title')}</Text>
        </Group>
      }
      centered
      size="lg"
      closeOnClickOutside={false}
    >
      <Stack gap="md">
        <Alert
          icon={<IconRobot size={18} />}
          title={t('ai.infoTitle')}
          color="violet"
          variant="light"
        >
          {t('ai.infoDescription')}
        </Alert>

        {error && (
          <Alert icon={<IconAlertCircle size={18} />} color="red" variant="light">
            {error}
          </Alert>
        )}

        <div>
          <Text fw={500} mb="xs">
            {t('ai.promptLabel')}
          </Text>
          <Textarea
            placeholder={t('ai.promptPlaceholder')}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setError(null);
            }}
            minRows={4}
            maxRows={8}
            autosize
            disabled={isGenerating}
          />
        </div>

        {/* 进度指示器 */}
        {isGenerating && (
          <Box>
            <Progress
              value={
                currentStep === 'analyzing' ? 25 :
                currentStep === 'generating' ? 50 :
                currentStep === 'finalizing' ? 75 :
                currentStep === 'complete' ? 100 : 0
              }
              size="lg"
              radius="md"
              striped
              animated
              color="violet"
            />
            <Stack gap="xs" mt="sm">
              <Stepper
                active={
                  currentStep === 'analyzing' ? 0 :
                  currentStep === 'generating' ? 1 :
                  currentStep === 'finalizing' ? 2 :
                  currentStep === 'complete' || currentStep === 'error' ? 3 : -1
                }
                orientation="vertical"
                allowNextStepsSelect={false}
                size="sm"
              >
                <Stepper.Step
                  label={language === 'zh' ? '分析需求' : 'Analyzing'}
                  description={language === 'zh' ? '理解你的需求描述' : 'Understanding your requirements'}
                >
                  <Group gap="xs">
                    <IconBrain size={16} />
                    <Text size="xs" c="dimmed">{language === 'zh' ? '正在分析你的需求...' : 'Analyzing your requirements...'}</Text>
                  </Group>
                </Stepper.Step>
                <Stepper.Step
                  label={language === 'zh' ? '生成配置' : 'Generating'}
                  description={language === 'zh' ? '创建身份、能力、流程等配置' : 'Creating identity, abilities, flows...'}
                >
                  <Group gap="xs">
                    <IconLayersOff size={16} />
                    <Text size="xs" c="dimmed">{language === 'zh' ? '正在生成各层配置...' : 'Generating layer configurations...'}</Text>
                  </Group>
                </Stepper.Step>
                <Stepper.Step
                  label={language === 'zh' ? '完成' : 'Finalizing'}
                  description={language === 'zh' ? '整理并应用配置' : 'Finalizing and applying configuration'}
                >
                  <Group gap="xs">
                    <IconCheck size={16} />
                    <Text size="xs" c="dimmed">{language === 'zh' ? '正在应用配置...' : 'Applying configuration...'}</Text>
                  </Group>
                </Stepper.Step>
              </Stepper>
            </Stack>
            <Text size="xs" c="dimmed" ta="center" mt="sm">
              {language === 'zh' ? '预计需要 5-15 秒，请耐心等待...' : 'Estimated 5-15 seconds, please wait...'}
            </Text>
          </Box>
        )}

        <Box>
          <Button
            variant="subtle"
            size="xs"
            color="gray"
            rightSection={<IconChevronDown size={14} />}
            onClick={() => setShowExample(!showExample)}
            disabled={isGenerating}
          >
            {t('ai.showExamples')}
          </Button>
          <Collapse in={showExample}>
            <Stack gap="xs" mt="sm">
              {examples.map((example, index) => (
                <Text
                  key={index}
                  size="sm"
                  c="blue"
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => handleExampleClick(example)}
                >
                  • {example}
                </Text>
              ))}
            </Stack>
          </Collapse>
        </Box>

        <Group justify="flex-end" mt="md">
          {isGenerating ? (
            <Button
              variant="outline"
              onClick={handleCancel}
              color="red"
            >
              {language === 'zh' ? '取消生成' : 'Cancel'}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                setPrompt('');
                setError(null);
                setCurrentStep('idle');
              }}
            >
              {t('ui.cancel')}
            </Button>
          )}
          {isGenerating ? (
            <Button
              color="violet"
              disabled
              loading={true}
            >
              {t('ai.generating')}
            </Button>
          ) : (
            <Button
              color="violet"
              onClick={handleGenerate}
              leftSection={<IconSparkles size={18} />}
            >
              {t('ai.generate')}
            </Button>
          )}
        </Group>
      </Stack>
    </Modal>
  );
};
