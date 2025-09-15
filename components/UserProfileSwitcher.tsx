import React from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { UserProfile } from '../types';

const profileDetails: Record<UserProfile, { name: string; description: string }> = {
  ambtenaar: { name: 'Ambtenaar', description: 'Praktisch & operationeel' },
  beleidsmedewerker: { name: 'Beleidsmedewerker', description: 'Analyserend & inhoudelijk' },
  bestuurder: { name: 'Bestuurder', description: 'Strategisch & besluitvormend' },
};

type Props = {
  profile: UserProfile;
  onSetProfile: (profile: UserProfile) => void;
};

export const UserProfileSwitcher: React.FC<Props> = ({ profile, onSetProfile }) => {
  return (
    <ul>
      {(Object.keys(profileDetails) as UserProfile[]).map((key) => {
        const item = profileDetails[key];
        const isSelected = profile === key;
        return (
          <li key={key}>
            <button onClick={() => onSetProfile(key)} className={`w-full text-left px-3 py-2 hover:bg-slate-100 rounded-md ${isSelected ? 'bg-indigo-50 hover:bg-indigo-100' : ''}`}>
              <div className="flex items-center justify-between">
                  <div>
                      <p className={`font-semibold text-sm ${isSelected ? 'text-indigo-800' : 'text-slate-800'}`}>{item.name}</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                  {isSelected && <CheckIcon className="w-5 h-5 text-indigo-600" />}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};