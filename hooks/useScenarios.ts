import { useState, useEffect, useMemo, useCallback } from 'react';
import { Scenario } from '../types';
import { loadScenarios, saveScenarios } from '../services/localStorage';
import { logEvent } from '../services/analyticsService';
import { AGENTS } from '../data/agents';

const defaultWebSearchConfig = AGENTS.reduce((acc, agent) => {
    if (agent.webSearchConfigurable) {
        acc[agent.id] = false;
    }
    return acc;
}, {} as Record<string, boolean>);


export function useScenarios(userId: string) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setScenarios([]);
      setCurrentScenarioId(null);
      return;
    };

    const loadedScenarios = loadScenarios(userId);

    if (loadedScenarios.length > 0) {
      const migratedScenarios = loadedScenarios.map(s => ({
          ...s,
          agentWebSearchConfig: { ...defaultWebSearchConfig, ...(s.agentWebSearchConfig || {}) },
          userProfile: s.userProfile || 'ambtenaar'
      }));
      setScenarios(migratedScenarios);
      
      const currentExists = migratedScenarios.some(s => s.id === currentScenarioId);
      if (!currentExists) {
        setCurrentScenarioId(migratedScenarios[0].id);
      }
    } else {
      const newScenario: Scenario = {
        id: `scenario_${Date.now()}`,
        title: 'Scenario 1',
        chat: [],
        selectedAgentIds: ['demografie'],
        agentWebSearchConfig: { ...defaultWebSearchConfig },
        userProfile: 'ambtenaar'
      };
      setScenarios([newScenario]);
      setCurrentScenarioId(newScenario.id);
    }
  }, [userId]);

  useEffect(() => {
    if (scenarios.length > 0 && userId) {
      saveScenarios(scenarios, userId);
    }
  }, [scenarios, userId]);

  const currentScenario = useMemo(() => {
    if (!currentScenarioId) return null;
    return scenarios.find(s => s.id === currentScenarioId) ?? null;
  }, [scenarios, currentScenarioId]);

  const updateCurrentScenario = useCallback((updates: Partial<Omit<Scenario, 'id'>>) => {
    if (!currentScenarioId) return;
    setScenarios(prevScenarios =>
      prevScenarios.map(s =>
        s.id === currentScenarioId ? { ...s, ...updates } : s
      )
    );
  }, [currentScenarioId]);

  const addScenario = useCallback(() => {
    let maxScenarioNum = 0;
    scenarios.forEach(s => {
        const match = s.title.match(/^Scenario (\d+)$/);
        if (match) {
            maxScenarioNum = Math.max(maxScenarioNum, parseInt(match[1], 10));
        }
    });

    const newScenarioNumber = Math.max(scenarios.length + 1, maxScenarioNum + 1);

    const newScenario: Scenario = {
      id: `scenario_${Date.now()}`,
      title: `Scenario ${newScenarioNumber}`,
      chat: [],
      selectedAgentIds: ['demografie'],
      agentWebSearchConfig: { ...defaultWebSearchConfig },
      userProfile: currentScenario?.userProfile || 'ambtenaar',
    };
    setScenarios(prev => [...prev, newScenario]);
    setCurrentScenarioId(newScenario.id);
    logEvent('scenario_created', { userId, scenarioId: newScenario.id });
  }, [scenarios, currentScenario?.userProfile, userId]);

  const deleteScenario = useCallback((id: string) => {
    if (scenarios.length <= 1) return;
    
    const wasCurrent = currentScenarioId === id;
    const newScenarios = scenarios.filter(s => s.id !== id);

    setScenarios(newScenarios);
    logEvent('scenario_deleted', { userId, scenarioId: id });
    if (wasCurrent) {
      setCurrentScenarioId(newScenarios[0].id);
    }
  }, [scenarios, currentScenarioId, userId]);

  const renameScenario = useCallback((id: string, title: string) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, title } : s));
    logEvent('scenario_renamed', { userId, scenarioId: id, newTitle: title });
  }, [userId]);

  const selectScenario = useCallback((id: string) => {
    setCurrentScenarioId(id);
  }, []);

  return {
    scenarios,
    setScenarios,
    currentScenarioId,
    setCurrentScenarioId,
    currentScenario,
    updateCurrentScenario,
    addScenario,
    deleteScenario,
    renameScenario,
    selectScenario,
  };
}