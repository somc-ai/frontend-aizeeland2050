import React from 'react';

export type ContextDataSource = {
  label: string;
  url: string;
}

export type Agent = {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  icon: React.FC<{ className?: string }>;
  contextData?: string;
  contextDataSource?: ContextDataSource;
  exampleQuestions: string[];
  type: 'search' | 'creative';
  webSearchConfigurable?: boolean;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  rawContent?: string;
  sources?: { label: string; url: string }[];
  isSummary?: boolean;
  imageUrl?: string;
};

export type Scenario = {
  id: string;
  title: string;
  chat: ChatMessage[];
  selectedAgentIds: string[];
  agentWebSearchConfig: Record<string, boolean>;
  userProfile: UserProfile;
};

export type ResponseMode = 'verified' | 'direct' | 'deep_research';

export type UserProfile = 'ambtenaar' | 'beleidsmedewerker' | 'bestuurder';