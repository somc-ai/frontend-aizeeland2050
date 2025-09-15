import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types';
import { UserProfileSwitcher } from './UserProfileSwitcher';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';

type Props = {
  profile: UserProfile;
  onSetProfile: (profile: UserProfile) => void;
};

export const UserMenu: React.FC<Props> = ({ profile, onSetProfile }) => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  if (!user) return null;

  return (
    <div ref={wrapperRef} className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-sm text-slate-600 font-medium pl-3 border-l border-slate-200 hover:bg-slate-100 rounded-md p-1 transition-colors">
        <UserCircleIcon className="w-8 h-8 text-slate-500" />
        <span className="font-semibold text-slate-800 hidden md:inline">{user.name}</span>
        <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-xl z-30 overflow-hidden p-2">
            <div className="px-3 py-2 border-b border-slate-200 mb-2">
                <p className="font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">Anonieme sessie</p>
            </div>
            <div className="px-3 py-2">
                <p className="text-xs font-semibold text-slate-600 mb-1">Selecteer uw rol</p>
                <UserProfileSwitcher profile={profile} onSetProfile={onSetProfile} />
            </div>
            <div className="border-t border-slate-200 mt-2 pt-2">
                <button 
                    onClick={signOut} 
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                >
                    <LogoutIcon className="w-5 h-5 text-slate-500" />
                    <span>Uitloggen</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};