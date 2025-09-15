import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Agent, ChatMessage, ResponseMode, UserProfile } from './types';
import { AGENTS } from './data/agents';
import { useScenarios } from './hooks/useScenarios';
import { useImageAttachment } from './hooks/useImageAttachment';
import { useChatHandler } from './hooks/useChatHandler';
import { useAuth } from './contexts/AuthContext';
import { logEvent } from './services/analyticsService';
import { checkBackendStatus } from './services/geminiService';


import { AgentList } from './components/AgentList';
import { DataSourceStatus } from './components/DataSourceStatus';
import { ScenarioManager } from './components/ScenarioManager';
import { MainHeader } from './components/MainHeader';
import { ChatArea } from './components/ChatArea';
import { ChatInputArea } from './components/ChatInputArea';

import { ScaleIcon } from './components/icons/ScaleIcon';

const MIN_ZOOM = -2;
const MAX_ZOOM = 2;

type Props = {
    onShowFaq: () => void;
}

export function MainPage({ onShowFaq }: Props) {
  const { user } = useAuth();
  const {
    scenarios,
    setScenarios,
    currentScenario,
    currentScenarioId,
    addScenario,
    deleteScenario,
    renameScenario,
    selectScenario,
    updateCurrentScenario,
  } = useScenarios(user!.sub); // Use the unique user ID from the auth context

  const {
    imageFile,
    imagePreviewUrl,
    handleImageSelect,
    handleRemoveImage,
    resetImage,
  } = useImageAttachment();

  const [inputValue, setInputValue] = useState('');
  const [responseMode, setResponseMode] = useState<ResponseMode>('verified');
  const [zoomLevel, setZoomLevel] = useState(0);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const checkStatus = async () => {
          const status = await checkBackendStatus();
          setIsBackendOnline(status);
      };

      checkStatus(); // Initial check
      const intervalId = setInterval(checkStatus, 30000); // Check every 30 seconds

      return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const selectedAgentIds = currentScenario?.selectedAgentIds ?? [];
  const activeAgents = useMemo(() => AGENTS.filter(a => selectedAgentIds.includes(a.id)), [selectedAgentIds]);

  const { handleSend, handleSummarize, loading, isSummarizing } = useChatHandler({
    userId: user!.sub,
    activeAgents,
    currentScenario,
    updateCurrentScenario,
    setScenarios,
    responseMode,
    userProfile: currentScenario?.userProfile ?? 'ambtenaar',
    imageFile,
    resetImage,
    agentWebSearchConfig: currentScenario?.agentWebSearchConfig,
  });

  const handleToggleAgent = useCallback((agentId: string) => {
    if (!currentScenario || !user) return;

    const currentIds = new Set(currentScenario.selectedAgentIds);
    let newIdsList: string[];

    const isCurrentlySelected = currentIds.has(agentId);
    if (isCurrentlySelected) {
        newIdsList = currentScenario.selectedAgentIds.filter(id => id !== agentId);
    } else {
        newIdsList = [...currentScenario.selectedAgentIds, agentId];
    }
    
    const hasStartedChat = currentScenario.chat.some(msg => msg.role === 'user');
    
    let systemMessage: ChatMessage | undefined;
    if (hasStartedChat) {
      const newActiveAgents = AGENTS.filter(a => newIdsList.includes(a.id));
      const systemMessageContent = newActiveAgents.length === 0
        ? `Geen experts geselecteerd.`
        : `Experts bijgewerkt. Actief: ${newActiveAgents.map(a => a.name).join(', ')}.`;
  
      systemMessage = {
        id: `msg_${Date.now()}_system`,
        role: 'system',
        content: systemMessageContent,
      };
    }

    updateCurrentScenario({
      selectedAgentIds: newIdsList,
      ...(systemMessage && { chat: [...currentScenario.chat, systemMessage] }),
    });
    
    logEvent('expert_toggled', {
      userId: user.sub,
      scenarioId: currentScenario.id,
      agentId: agentId,
      selected: !currentIds.has(agentId)
    });

  }, [currentScenario, updateCurrentScenario, user]);

  const handleToggleAgentWebSearch = useCallback((agentId: string, isEnabled: boolean) => {
    if (!currentScenario || !user) return;

    const newConfig = {
      ...currentScenario.agentWebSearchConfig,
      [agentId]: isEnabled,
    };

    updateCurrentScenario({ agentWebSearchConfig: newConfig });
    
    logEvent('web_search_toggled', {
        userId: user.sub,
        scenarioId: currentScenario.id,
        agentId: agentId,
        enabled: isEnabled,
    });
  }, [currentScenario, updateCurrentScenario, user]);
  
  const handleSetProfile = useCallback((profile: UserProfile) => {
    if (!currentScenario || !user) return;
    updateCurrentScenario({ userProfile: profile });
    logEvent('profile_changed', {
        userId: user.sub,
        scenarioId: currentScenario.id,
        newProfile: profile,
    });
  }, [currentScenario, updateCurrentScenario, user]);

  const handleResponseModeChange = useCallback((mode: ResponseMode) => {
      setResponseMode(mode);
      if (currentScenario && user) {
          logEvent('response_mode_changed', {
              userId: user.sub,
              scenarioId: currentScenario.id,
              newMode: mode,
          });
      }
  }, [currentScenario, user]);

  const canSummarize = (currentScenario?.chat.length ?? 0) > 1 && !loading && !isSummarizing;
  
  const handleLocalSend = useCallback(() => {
    handleSend(inputValue);
    setInputValue('');
  }, [handleSend, inputValue]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, MAX_ZOOM));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, MIN_ZOOM));
  
  const handleDownloadPdf = useCallback(async () => {
    const chatElement = chatAreaRef.current;
    if (!chatElement || !currentScenario || !user) return;

    setIsDownloadingPdf(true);
    logEvent('pdf_download_started', {
        userId: user.sub,
        scenarioId: currentScenario.id,
    });

    try {
        const printContainer = document.createElement('div');
        printContainer.style.position = 'absolute';
        printContainer.style.left = '-9999px';
        printContainer.style.width = `${chatElement.scrollWidth}px`;
        printContainer.style.backgroundColor = '#f1f5f9';
        printContainer.style.fontFamily = 'sans-serif';
        printContainer.style.padding = '40px';
        printContainer.style.boxSizing = 'border-box';

        const header = document.createElement('header');
        header.style.textAlign = 'center';
        header.style.marginBottom = '30px';
        header.style.borderBottom = '1px solid #e2e8f0';
        header.style.paddingBottom = '20px';
        header.innerHTML = `
            <h1 style="font-size: 24px; font-weight: bold; color: #1e293b; margin: 0;">AIAgentGov</h1>
            <p style="font-size: 14px; color: #64748b; margin: 4px 0 0 0;">Zeeland AI Platform Experiment - Provincie Zeeland</p>
        `;
        printContainer.appendChild(header);

        const now = new Date();
        const agentNames = activeAgents.length > 0 ? activeAgents.map(a => a.name).join(', ') : 'Geen';
        const meta = document.createElement('div');
        meta.style.marginBottom = '30px';
        meta.style.fontSize = '12px';
        meta.style.color = '#475569';
        meta.innerHTML = `
            <p style="margin: 0 0 10px 0;">
                <strong>Datum:</strong> ${now.toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })}<br>
                <strong>Tijdstip:</strong> ${now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p style="margin: 0;"><strong>Actieve AI Experts:</strong> ${agentNames}</p>
        `;
        printContainer.appendChild(meta);
        
        const chatContent = chatElement.cloneNode(true) as HTMLElement;
        chatContent.style.overflow = 'visible';
        chatContent.scrollTop = 0;
        printContainer.appendChild(chatContent);
        
        const footer = document.createElement('footer');
        footer.style.textAlign = 'center';
        footer.style.marginTop = '30px';
        footer.style.paddingTop = '20px';
        footer.style.borderTop = '1px solid #e2e8f0';
        footer.style.fontSize = '12px';
        footer.innerHTML = `<a href="https://www.somc.ai" target="_blank" rel="noopener noreferrer" style="color: #4f46e5; text-decoration: none;">Powered by SoMC.AI</a>`;
        printContainer.appendChild(footer);

        document.body.appendChild(printContainer);

        const canvas = await html2canvas(printContainer, {
            scale: 2,
            useCORS: true,
            windowWidth: printContainer.scrollWidth,
            windowHeight: printContainer.scrollHeight,
        });

        document.body.removeChild(printContainer);
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        const safeTitle = currentScenario.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        pdf.save(`AIAgentsGov_${safeTitle}_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
        console.error("Failed to generate PDF:", error);
    } finally {
        setIsDownloadingPdf(false);
    }
  }, [currentScenario, user, activeAgents]);

  if (!currentScenario) {
      return <div className="flex h-screen w-full items-center justify-center bg-slate-100">Laden...</div>
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <aside className="w-[380px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ScaleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-800">AIAgentGov</h1>
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-200">BETA</span>
              </div>
              <p className="text-sm text-slate-500">Zeeland AI Platform - Provincie Zeeland</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          <ScenarioManager
            scenarios={scenarios}
            currentId={currentScenarioId ?? ''}
            onSelect={selectScenario}
            onAdd={addScenario}
            onDelete={deleteScenario}
            onRename={renameScenario}
          />
          <div>
            <h3 className="px-3 mb-2 text-sm font-semibold text-slate-600">Experts</h3>
            <AgentList 
              agents={AGENTS} 
              selectedIds={selectedAgentIds} 
              onToggle={handleToggleAgent} 
              agentWebSearchConfig={currentScenario.agentWebSearchConfig ?? {}}
              onToggleWebSearch={handleToggleAgentWebSearch}
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <DataSourceStatus />
          <p className="text-center text-xs text-slate-400 mt-4">Powered by SoMC.AI</p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
        <MainHeader
            scenarioTitle={currentScenario.title}
            chatLength={currentScenario.chat.length}
            canSummarize={canSummarize}
            onSummarize={handleSummarize}
            zoomLevel={zoomLevel}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            userProfile={currentScenario.userProfile ?? 'ambtenaar'}
            onSetProfile={handleSetProfile}
            onDownloadPdf={handleDownloadPdf}
            isDownloadingPdf={isDownloadingPdf}
            onShowFaq={onShowFaq}
            isBackendOnline={isBackendOnline}
        />

        <div className="flex-1 flex flex-col relative overflow-hidden">
            <ChatArea 
                ref={chatAreaRef}
                chat={currentScenario.chat}
                zoomLevel={zoomLevel}
                onSelectSuggestion={setInputValue}
                activeAgents={activeAgents}
            />
            <ChatInputArea
                responseMode={responseMode}
                onSetResponseMode={handleResponseModeChange}
                onSend={handleLocalSend}
                loading={loading || isSummarizing}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onImageSelect={handleImageSelect}
                onRemoveImage={handleRemoveImage}
                imagePreviewUrl={imagePreviewUrl}
            />
        </div>
      </main>
    </div>
  );
}