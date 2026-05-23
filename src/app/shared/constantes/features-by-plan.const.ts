import { FeatureInterface } from '../interface/feature.interface';

export const FEATURES_BY_PLAN: Record<
  'basic' | 'pro' | 'premium',
  FeatureInterface[]
> = {
  basic: [
    {
      id: 'f1',
      title: {
        pt: 'Respostas rápidas',
        en: 'Quick replies',
      },
      description: {
        pt: 'Conversas simples e diretas no dia a dia',
        en: 'Simple and direct conversations day to day',
      },
      icon: 'smart_toy',
      highlight: true,
    },
    {
      id: 'f2',
      title: {
        pt: 'Conversas leves',
        en: 'Light chats',
      },
      description: {
        pt: 'Interações naturais do dia a dia',
        en: 'Natural daily interactions',
      },
      icon: 'chat',
    },
    {
      id: 'f3',
      title: {
        pt: 'Fluxo natural',
        en: 'Natural flow',
      },
      description: {
        pt: 'Conversas fluem de forma simples e contínua',
        en: 'Conversations flow naturally and smoothly',
      },
      icon: 'forum',
    },
    {
      id: 'f4',
      title: {
        pt: 'Conversas ativas',
        en: 'Active chats',
      },
      description: {
        pt: 'Mantenha a conversa acontecendo',
        en: 'Keep conversations going',
      },
      icon: 'chat',
    },
  ],
  pro: [
    {
      id: 'f1',
      title: {
        pt: 'Respostas completas',
        en: 'Complete replies',
      },
      description: {
        pt: 'Mensagens mais elaboradas e envolventes',
        en: 'More detailed and engaging replies',
      },
      icon: 'smart_toy',
      highlight: true,
    },
    {
      id: 'f2',
      title: {
        pt: 'Ideias inteligentes',
        en: 'Smart ideas',
      },
      description: {
        pt: 'Sugestões mais relevantes para a conversa',
        en: 'More relevant suggestions for your conversations',
      },
      icon: 'psychology',
    },
    {
      id: 'f3',
      title: {
        pt: 'Fluxo avançado',
        en: 'Advanced flow',
      },
      description: {
        pt: 'Conversas mais naturais e contínuas',
        en: 'More natural and continuous conversations',
      },
      icon: 'forum',
    },
    {
      id: 'f4',
      title: {
        pt: 'Conversas envolventes',
        en: 'Engaging chats',
      },
      description: {
        pt: 'Respostas que mantêm o interesse',
        en: 'Replies that keep the conversation engaging',
      },
      icon: 'chat',
    },
  ],
  premium: [
    {
      id: 'f1',
      title: {
        pt: 'Respostas envolventes',
        en: 'Engaging replies',
      },
      description: {
        pt: 'Conversas mais profundas que realmente conectam',
        en: 'Deeper conversations that truly connect',
      },
      icon: 'smart_toy',
      highlight: true,
    },
    {
      id: 'f2',
      title: {
        pt: 'Fluxo inteligente',
        en: 'Smart flow',
      },
      description: {
        pt: 'Conversas fluem com mais naturalidade',
        en: 'Conversations flow more intelligently',
      },
      icon: 'forum',
    },
    {
      id: 'f3',
      title: {
        pt: 'Conversas profundas',
        en: 'Deep chats',
      },
      description: {
        pt: 'Conversas mais interessantes',
        en: 'More meaningful conversations',
      },
      icon: 'chat',
    },
    {
      id: 'f4',
      title: {
        pt: 'Conversas ricas',
        en: 'Rich conversations',
      },
      description: {
        pt: 'Conversas mais completas e envolventes',
        en: 'More complete and engaging conversations',
      },
      icon: 'chat',
    },
  ],
};
