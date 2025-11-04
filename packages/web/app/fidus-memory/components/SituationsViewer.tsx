'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button, Alert } from '@fidus/ui';

interface ContextFactor {
  key: string;
  value: string;
}

interface Situation {
  id: string;
  tenant_id: string;
  user_id: string;
  factors: Record<string, string>;
  preference_ids: string[];
  created_at: string;
  updated_at: string;
}

interface SituationsViewerProps {
  className?: string;
}

export interface SituationsViewerRef {
  refresh: () => Promise<void>;
}

export const SituationsViewer = forwardRef<SituationsViewerRef, SituationsViewerProps>(
  function SituationsViewer({ className = '' }, ref) {
    const [situations, setSituations] = useState<Situation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedSituation, setExpandedSituation] = useState<string | null>(null);

    const fetchSituations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/memory/situations');
        if (!response.ok) {
          throw new Error(`Failed to fetch situations: ${response.statusText}`);
        }

        const data = await response.json();
        setSituations(data.situations || []);
      } catch (err) {
        console.error('Error fetching situations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
      refresh: fetchSituations,
    }));

    // Load situations on mount
    useEffect(() => {
      fetchSituations();
    }, []);

    const formatTimestamp = (timestamp: string) => {
      try {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return timestamp;
      }
    };

    const getFactorIcon = (key: string): string => {
      const iconMap: Record<string, string> = {
        time_of_day: '🕐',
        day_of_week: '📅',
        season: '🍂',
        weather: '☁️',
        temperature: '🌡️',
        mood: '😊',
        activity: '🏃',
        location: '📍',
        is_weekend: '🎉',
        is_work_hours: '💼',
        meal_preference: '🍽️',
        food_type: '🍕',
        drink_type: '☕',
        music_genre: '🎵',
        artist: '🎤',
      };
      return iconMap[key] || '🔹';
    };

    const getFactorDisplayName = (key: string): string => {
      return key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    if (isLoading && situations.length === 0) {
      return (
        <div className={`p-4 ${className}`}>
          <div className="text-center text-gray-500">Loading situations...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`p-4 ${className}`}>
          <Alert variant="error">
            <p>Error: {error}</p>
            <Button onClick={fetchSituations} variant="secondary" size="sm" className="mt-2">
              Retry
            </Button>
          </Alert>
        </div>
      );
    }

    if (situations.length === 0) {
      return (
        <div className={`p-4 ${className}`}>
          <div className="text-center text-gray-500">
            <p className="mb-2">No situations recorded yet</p>
            <p className="text-sm">
              Situations are automatically created when you express preferences with context.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={`${className}`}>
        <div className="space-y-3">
          {situations.map((situation) => {
            const isExpanded = expandedSituation === situation.id;
            const factorCount = Object.keys(situation.factors).length;

            return (
              <div
                key={situation.id}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div
                  className="p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedSituation(isExpanded ? null : situation.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <div className="font-medium text-sm">
                          Situation {situation.id.slice(0, 8)}...
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTimestamp(situation.created_at)} • {factorCount} factors •{' '}
                          {situation.preference_ids.length} preference(s)
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
                  </div>

                  {/* Preview of top factors (when collapsed) */}
                  {!isExpanded && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {Object.entries(situation.factors)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <span
                            key={key}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                          >
                            <span>{getFactorIcon(key)}</span>
                            <span className="font-medium">{getFactorDisplayName(key)}:</span>
                            <span>{value}</span>
                          </span>
                        ))}
                      {factorCount > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{factorCount - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-3 bg-gray-50">
                    {/* Context Factors */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Context Factors
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(situation.factors).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-start gap-2 p-2 bg-white rounded border border-gray-200"
                          >
                            <span className="text-lg">{getFactorIcon(key)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-600">
                                {getFactorDisplayName(key)}
                              </div>
                              <div className="text-sm text-gray-900 break-words">{value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Linked Preferences */}
                    {situation.preference_ids.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                          Linked Preferences
                        </h4>
                        <div className="space-y-1">
                          {situation.preference_ids.map((prefId) => (
                            <div
                              key={prefId}
                              className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-200"
                            >
                              {prefId.slice(0, 8)}...
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">User:</span> {situation.user_id}
                        </div>
                        <div>
                          <span className="font-medium">Tenant:</span> {situation.tenant_id}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>{' '}
                          {formatTimestamp(situation.created_at)}
                        </div>
                        <div>
                          <span className="font-medium">Updated:</span>{' '}
                          {formatTimestamp(situation.updated_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Refresh button */}
        <div className="mt-4 text-center">
          <Button
            onClick={fetchSituations}
            variant="secondary"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>
    );
  }
);
