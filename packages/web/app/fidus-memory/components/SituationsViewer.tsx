'use client';

import { useState, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { Button, Alert } from '@fidus/ui';
import { getUserId, setUserId } from '../../lib/userSession';

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
    const [filterKey, setFilterKey] = useState<string>('');
    const [filterValue, setFilterValue] = useState<string>('');

    const fetchSituations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get user_id from LocalStorage and prepare headers
        const userId = getUserId();
        const headers: Record<string, string> = {};
        if (userId) {
          headers['X-User-ID'] = userId;
        }

        const response = await fetch('/api/memory/situations', {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch situations: ${response.statusText}`);
        }

        // Extract and store X-User-ID from response
        const responseUserId = response.headers.get('X-User-ID');
        if (responseUserId) {
          setUserId(responseUserId);
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

    // Filter situations based on filter criteria
    const filteredSituations = useMemo(() => {
      if (!filterKey && !filterValue) {
        return situations;
      }

      return situations.filter((situation) => {
        if (filterKey && filterValue) {
          // Filter by specific key-value pair
          return situation.factors[filterKey]?.toLowerCase().includes(filterValue.toLowerCase());
        } else if (filterKey) {
          // Filter by key existence
          return filterKey in situation.factors;
        } else if (filterValue) {
          // Filter by value in any factor
          return Object.values(situation.factors).some((val) =>
            val.toLowerCase().includes(filterValue.toLowerCase())
          );
        }
        return true;
      });
    }, [situations, filterKey, filterValue]);

    // Calculate statistics
    const statistics = useMemo(() => {
      const factorCounts: Record<string, Record<string, number>> = {};

      situations.forEach((situation) => {
        Object.entries(situation.factors).forEach(([key, value]) => {
          if (!factorCounts[key]) {
            factorCounts[key] = {};
          }
          factorCounts[key][value] = (factorCounts[key][value] || 0) + 1;
        });
      });

      // Get top 5 most common context patterns
      const topFactors = Object.entries(factorCounts)
        .map(([key, values]) => {
          const topValue = Object.entries(values).sort((a, b) => b[1] - a[1])[0];
          return {
            key,
            value: topValue[0],
            count: topValue[1],
            percentage: Math.round((topValue[1] / situations.length) * 100),
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        total: situations.length,
        filtered: filteredSituations.length,
        topFactors,
        uniqueFactorKeys: Object.keys(factorCounts),
      };
    }, [situations, filteredSituations]);

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
        {/* Statistics Section */}
        {situations.length > 0 && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">📊 Context Statistics</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white p-2 rounded border border-gray-200">
                <div className="text-xs text-gray-500">Total Situations</div>
                <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <div className="text-xs text-gray-500">Filtered Results</div>
                <div className="text-2xl font-bold text-purple-600">{statistics.filtered}</div>
              </div>
            </div>

            {/* Top Context Patterns */}
            <div className="bg-white p-3 rounded border border-gray-200">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Most Common Patterns</h4>
              <div className="space-y-2">
                {statistics.topFactors.map((factor) => (
                  <div key={factor.key} className="flex items-center gap-2">
                    <span className="text-lg">{getFactorIcon(factor.key)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-700">
                        {getFactorDisplayName(factor.key)}: {factor.value}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${factor.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {factor.count} ({factor.percentage}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        {situations.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">🔍 Filter Situations</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Context Factor</label>
                <select
                  value={filterKey}
                  onChange={(e) => setFilterKey(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Factors</option>
                  {statistics.uniqueFactorKeys.map((key) => (
                    <option key={key} value={key}>
                      {getFactorIcon(key)} {getFactorDisplayName(key)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Value</label>
                <input
                  type="text"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Search value..."
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {(filterKey || filterValue) && (
              <button
                onClick={() => {
                  setFilterKey('');
                  setFilterValue('');
                }}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        <div className="space-y-3">
          {filteredSituations.length === 0 && situations.length > 0 && (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg mb-2">🔍 No situations match your filters</p>
              <button
                onClick={() => {
                  setFilterKey('');
                  setFilterValue('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear filters
              </button>
            </div>
          )}
          {filteredSituations.map((situation) => {
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
