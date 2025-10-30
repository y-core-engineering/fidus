'use client';

import { useState, useMemo } from 'react';
import { Button, Stack, TextInput } from '@fidus/ui';
import { Search, Check, Copy } from 'lucide-react';
import { CodeBlock } from './code-block';

interface TokenInspectorProps {
  tokens: Array<{
    name: string;
    value: string;
    variable: string;
    description?: string;
  }>;
  type: 'color' | 'typography' | 'spacing' | 'shadow' | 'motion';
}

export function TokenInspector({ tokens, type }: TokenInspectorProps) {
  const [format, setFormat] = useState<'json' | 'css'>('json');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'code' | 'grid'>('code');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!searchQuery) return tokens;
    const query = searchQuery.toLowerCase();
    return tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(query) ||
        token.variable.toLowerCase().includes(query) ||
        token.description?.toLowerCase().includes(query)
    );
  }, [tokens, searchQuery]);

  const exportData = () => {
    let output = '';

    if (format === 'json') {
      const jsonData = filteredTokens.reduce((acc, token) => {
        acc[token.name] = token.value;
        return acc;
      }, {} as Record<string, string>);
      output = JSON.stringify(jsonData, null, 2);
    } else {
      output = `:root {\n${filteredTokens.map(t => `  ${t.variable}: ${t.value};`).join('\n')}\n}`;
    }

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fidus-${type}-tokens${searchQuery ? '-filtered' : ''}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    let output = '';

    if (format === 'json') {
      const jsonData = filteredTokens.reduce((acc, token) => {
        acc[token.name] = token.value;
        return acc;
      }, {} as Record<string, string>);
      output = JSON.stringify(jsonData, null, 2);
    } else {
      output = `:root {\n${filteredTokens.map(t => `  ${t.variable}: ${t.value};`).join('\n')}\n}`;
    }

    await navigator.clipboard.writeText(output);
    alert('Copied to clipboard!');
  };

  const copyTokenValue = async (token: { name: string; value: string; variable: string }) => {
    const copyText = format === 'json' ? token.value : `${token.variable}: ${token.value};`;
    await navigator.clipboard.writeText(copyText);
    setCopiedToken(token.variable);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const renderVisualPreview = (token: { name: string; value: string; variable: string }) => {
    switch (type) {
      case 'color':
        return (
          <div
            className="w-full h-16 rounded-md border border-border"
            style={{ backgroundColor: `hsl(${token.value})` }}
          />
        );
      case 'spacing':
        return (
          <div className="flex items-center gap-sm">
            <div className="flex-1 bg-primary/20 rounded-sm" style={{ height: token.value }} />
            <span className="text-xs text-muted-foreground">{token.value}</span>
          </div>
        );
      case 'shadow':
        return (
          <div
            className="w-full h-16 rounded-md bg-background border border-border"
            style={{ boxShadow: token.value }}
          />
        );
      case 'typography':
        return (
          <p
            className="text-foreground"
            style={{
              fontSize: token.value.includes('px') ? token.value : undefined,
              fontWeight: token.value.match(/^\d+$/) ? token.value : undefined,
              lineHeight: token.value.match(/^[\d.]+$/) ? token.value : undefined,
            }}
          >
            Aa
          </p>
        );
      case 'motion':
        return (
          <div className="text-xs text-muted-foreground font-mono">
            {token.value}
          </div>
        );
    }
  };

  return (
    <div className="not-prose my-lg p-lg bg-muted rounded-lg border border-border">
      <div className="flex items-center justify-between mb-md">
        <h3 className="text-lg font-semibold">Token Inspector</h3>
        <span className="text-sm text-muted-foreground">
          {filteredTokens.length} {filteredTokens.length === 1 ? 'token' : 'tokens'}
        </span>
      </div>

      {/* Search Input */}
      <div className="mb-md">
        <TextInput
          label="Search Tokens"
          placeholder="Search by name, variable, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leadingIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* View Toggle and Format Buttons */}
      <Stack direction="horizontal" spacing="sm" className="mb-md flex-wrap">
        <div className="flex gap-sm">
          <Button
            variant={view === 'code' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setView('code')}
          >
            Code View
          </Button>
          <Button
            variant={view === 'grid' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setView('grid')}
          >
            Grid View
          </Button>
        </div>
        <div className="flex gap-sm">
          <Button
            variant={format === 'json' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFormat('json')}
          >
            JSON
          </Button>
          <Button
            variant={format === 'css' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFormat('css')}
          >
            CSS
          </Button>
        </div>
      </Stack>

      {/* Grid View - Interactive Token Cards */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mb-md max-h-96 overflow-y-auto">
          {filteredTokens.map((token) => (
            <div
              key={token.variable}
              className="bg-background p-md rounded-md border border-border hover:border-primary transition-colors duration-normal"
            >
              <div className="mb-sm">{renderVisualPreview(token)}</div>
              <div className="space-y-xs">
                <p className="text-sm font-semibold">{token.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{token.variable}</p>
                <p className="text-xs text-muted-foreground">{token.value}</p>
                {token.description && (
                  <p className="text-xs text-muted-foreground mt-xs">{token.description}</p>
                )}
              </div>
              <Button
                size="sm"
                variant="tertiary"
                className="mt-sm w-full"
                onClick={() => copyTokenValue(token)}
              >
                {copiedToken === token.variable ? (
                  <>
                    <Check className="h-3 w-3 mr-xs" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-xs" />
                    Copy Value
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Code View - Syntax Highlighted */}
      {view === 'code' && (
        <div className="mb-md max-h-96 overflow-y-auto">
          <CodeBlock
            language={format === 'json' ? 'json' : 'css'}
            code={
              format === 'json'
                ? JSON.stringify(
                    filteredTokens.reduce((acc, token) => {
                      acc[token.name] = token.value;
                      return acc;
                    }, {} as Record<string, string>),
                    null,
                    2
                  )
                : `:root {\n${filteredTokens.map(t => `  ${t.variable}: ${t.value};`).join('\n')}\n}`
            }
          />
        </div>
      )}

      {/* Action Buttons */}
      <Stack direction="horizontal" spacing="sm" className="flex-wrap">
        <Button size="sm" onClick={copyToClipboard}>
          Copy to Clipboard
        </Button>
        <Button variant="secondary" size="sm" onClick={exportData}>
          Export to File
        </Button>
      </Stack>

      {searchQuery && filteredTokens.length === 0 && (
        <div className="mt-md p-md bg-background rounded-md border border-border text-center">
          <p className="text-sm text-muted-foreground">
            No tokens found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
