'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Alert, Badge, Spinner, Stack } from '@fidus/ui';
import { getUserId } from '../../lib/userSession';

interface SystemStatus {
  neo4j_configured: boolean;
  qdrant_configured: boolean;
  storage_pattern: string;
  architecture_version: string;
}

interface StorageStats {
  neo4j: {
    situation_nodes: number;
    total_preferences: number;
    preferences_with_situation_id: number;
  };
  storage_pattern: string;
  query_pattern: string;
}

interface MigrationStatusProps {
  className?: string;
}

export function MigrationStatus({ className = '' }: MigrationStatusProps) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback((): Record<string, string> => {
    const userId = getUserId();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (userId) {
      headers['X-User-ID'] = userId;
    }
    return headers;
  }, []);

  const fetchSystemStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/memory/admin/system-status', {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch system status');
      const data = await response.json();
      setSystemStatus(data);
    } catch (err) {
      console.error('Error fetching system status:', err);
    }
  }, [getHeaders]);

  const fetchStorageStats = useCallback(async () => {
    try {
      const response = await fetch('/api/memory/admin/storage-stats', {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch storage stats');
      const data = await response.json();
      setStorageStats(data);
    } catch (err) {
      console.error('Error fetching storage stats:', err);
    }
  }, [getHeaders]);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchSystemStatus(), fetchStorageStats()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchSystemStatus, fetchStorageStats]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (isLoading) {
    return (
      <div className={`p-4 flex items-center justify-center ${className}`}>
        <Spinner size="md" />
        <span className="ml-2 text-gray-500">Loading system status...</span>
      </div>
    );
  }

  return (
    <Stack spacing="md" className={className}>
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Qdrant-First Architecture (v3.0)
        </h3>
        <p className="text-sm text-gray-600">
          Context stored in Qdrant (PRIMARY), Neo4j has situation_id references (SECONDARY).
          1-Hop queries enabled for optimal performance.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" dismissible onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* System Status */}
      {systemStatus && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">System Status</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Neo4j</div>
              <Badge variant={systemStatus.neo4j_configured ? 'success' : 'low'}>
                {systemStatus.neo4j_configured ? 'Connected' : 'Not configured'}
              </Badge>
            </div>
            <div className="p-2 rounded border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Qdrant</div>
              <Badge variant={systemStatus.qdrant_configured ? 'success' : 'low'}>
                {systemStatus.qdrant_configured ? 'Connected' : 'Not configured'}
              </Badge>
            </div>
            <div className="p-2 rounded border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Storage Pattern</div>
              <Badge variant="success">{systemStatus.storage_pattern}</Badge>
            </div>
            <div className="p-2 rounded border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Architecture</div>
              <Badge variant="info">{systemStatus.architecture_version}</Badge>
            </div>
          </div>
        </div>
      )}

      {/* Storage Stats */}
      {storageStats && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Storage Statistics</h4>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="p-3 rounded bg-blue-50 border border-blue-200 text-center">
              <div className="text-xs text-blue-600 font-medium">Total Preferences</div>
              <div className="text-2xl font-bold text-blue-700">
                {storageStats.neo4j.total_preferences}
              </div>
            </div>
            <div className="p-3 rounded bg-green-50 border border-green-200 text-center">
              <div className="text-xs text-green-600 font-medium">With Context</div>
              <div className="text-2xl font-bold text-green-700">
                {storageStats.neo4j.preferences_with_situation_id}
              </div>
              <div className="text-xs text-green-500">situation_id set</div>
            </div>
            <div className="p-3 rounded bg-gray-50 border border-gray-200 text-center">
              <div className="text-xs text-gray-600 font-medium">Situation Nodes</div>
              <div className="text-2xl font-bold text-gray-700">
                {storageStats.neo4j.situation_nodes}
              </div>
              <div className="text-xs text-gray-500">Legacy (Neo4j)</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="success" className="justify-center">
              Pattern: {storageStats.storage_pattern}
            </Badge>
            <Badge variant="info" className="justify-center">
              Query: {storageStats.query_pattern}
            </Badge>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button onClick={fetchAll} variant="secondary" disabled={isLoading}>
          Refresh Status
        </Button>
      </div>

      {/* Info Section */}
      <Alert variant="info" title="ADR-0001: Qdrant-First Pattern">
        <ul className="text-xs space-y-1 mt-2">
          <li>
            <strong>PRIMARY (Qdrant):</strong> Full context payload with embeddings for similarity search
          </li>
          <li>
            <strong>SECONDARY (Neo4j):</strong> Only situation_id on Preference nodes for 1-Hop queries
          </li>
          <li>
            <strong>No Situation Nodes:</strong> Context lives entirely in Qdrant
          </li>
          <li>
            <strong>1-Hop Query:</strong> MATCH (p:Preference &#123;situation_id: $sid&#125;)
          </li>
        </ul>
      </Alert>
    </Stack>
  );
}
