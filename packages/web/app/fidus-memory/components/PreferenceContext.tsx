'use client';

import { useState } from 'react';
import { ContextBadges } from './ContextBadges';
import { getUserId } from '../../lib/userSession';

interface Situation {
  id: string;
  tenant_id: string;
  user_id: string;
  factors: Record<string, string>;
  preference_ids: string[];
  created_at: string;
  updated_at: string;
}

interface PreferenceContextProps {
  preferenceId: string;
}

export function PreferenceContext({ preferenceId }: PreferenceContextProps) {
  const [situations, setSituations] = useState<Situation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const fetchContext = async () => {
    if (situations) {
      // Toggle if already loaded
      setExpanded(!expanded);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get user_id from LocalStorage and prepare headers
      const userId = getUserId();
      const headers: Record<string, string> = {};
      if (userId) {
        headers['X-User-ID'] = userId;
      }

      const response = await fetch(`/api/memory/preferences/${preferenceId}/context`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch context');
      }

      const data = await response.json();
      setSituations(data.situations || []);
      setExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={fetchContext}
        className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
        disabled={loading}
      >
        {loading ? '⏳ Loading...' : expanded ? '▼ Hide Context' : '▶ Show Context'}
        {situations && situations.length > 0 && ` (${situations.length})`}
      </button>

      {error && (
        <div className="mt-1 text-xs text-red-600">Error: {error}</div>
      )}

      {expanded && situations && situations.length > 0 && (
        <div className="mt-2 space-y-2">
          {situations.map((situation) => (
            <div
              key={situation.id}
              className="p-2 bg-blue-50 rounded border border-blue-200"
            >
              <div className="text-xs text-gray-500 mb-1">
                {new Date(situation.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <ContextBadges factors={situation.factors} maxDisplay={5} />
            </div>
          ))}
        </div>
      )}

      {expanded && situations && situations.length === 0 && (
        <div className="mt-2 text-xs text-gray-500 italic">
          No context recorded for this preference yet
        </div>
      )}
    </div>
  );
}
