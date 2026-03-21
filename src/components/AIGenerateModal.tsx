import React, { useState } from 'react';
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
} from '@mantine/core';
import {
  IconRobot,
  IconSparkles,
  IconAlertCircle,
  IconChevronDown,
} from '@tabler/icons-react';
import { useSoulStore } from '../store/soulStore';
import { generateSoul } from '../services/llmService';
import { useTranslation } from '../i18n';

interface AIGenerateModalProps {
  opened: boolean;
  onClose: () => void;
}

export const AIGenerateModal: React.FC<AIGenerateModalProps> = ({ opened, onClose }) => {
  const { t, language } = useTranslation();
  const { loadTemplate, getLLMConfig } = useSoulStore();

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);

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

    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateSoul(
        config,
        { prompt: prompt.trim(), language: language as 'zh' | 'en' }
      );

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

      onClose();
      setPrompt('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('ai.generateError') || '生成失败，请重试');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setShowExample(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        onClose();
        setPrompt('');
        setError(null);
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
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setPrompt('');
              setError(null);
            }}
            disabled={isGenerating}
          >
            {t('ui.cancel')}
          </Button>
          <Button
            color="violet"
            onClick={handleGenerate}
            loading={isGenerating}
            leftSection={!isGenerating && <IconSparkles size={18} />}
          >
            {isGenerating ? t('ai.generating') : t('ai.generate')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
