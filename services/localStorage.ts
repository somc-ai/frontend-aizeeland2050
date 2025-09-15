import { Scenario } from '../types';

const STORAGE_KEY_PREFIX = 'ai-agents-zeeland-scenarios-v2';

export function loadScenarios(userId: string): Scenario[] {
  if (!userId) return [];
  const key = `${STORAGE_KEY_PREFIX}-${userId}`;
  try {
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveScenarios(scenarios: Scenario[], userId: string): void {
  if (!userId) return;
  const key = `${STORAGE_KEY_PREFIX}-${userId}`;
  try {
    localStorage.setItem(key, JSON.stringify(scenarios));
  } catch (error) {
    console.error("Failed to save scenarios to localStorage:", error);
  }
}