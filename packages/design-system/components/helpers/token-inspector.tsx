'use client';

import { useState } from 'react';
import { Button, Stack } from '@fidus/ui';

interface TokenInspectorProps {
  tokens: Array<{
    name: string;
    value: string;
    variable: string;
  }>;
  type: 'color' | 'typography' | 'spacing' | 'shadow' | 'motion';
}

export function TokenInspector({ tokens, type }: TokenInspectorProps) {
  const [format, setFormat] = useState<'json' | 'css'>('json');

  const exportData = () => {
    let output = '';

    if (format === 'json') {
      const jsonData = tokens.reduce((acc, token) => {
        acc[token.name] = token.value;
        return acc;
      }, {} as Record<string, string>);
      output = JSON.stringify(jsonData, null, 2);
    } else {
      output = `:root {\n${tokens.map(t => `  ${t.variable}: ${t.value};`).join('\n')}\n}`;
    }

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fidus-${type}-tokens.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    let output = '';

    if (format === 'json') {
      const jsonData = tokens.reduce((acc, token) => {
        acc[token.name] = token.value;
        return acc;
      }, {} as Record<string, string>);
      output = JSON.stringify(jsonData, null, 2);
    } else {
      output = `:root {\n${tokens.map(t => `  ${t.variable}: ${t.value};`).join('\n')}\n}`;
    }

    await navigator.clipboard.writeText(output);
    alert('Copied to clipboard!');
  };

  return (
    <div className="not-prose my-lg p-md bg-muted rounded-md border border-border">
      <h3 className="text-lg font-semibold mb-md">Token Inspector</h3>

      <Stack direction="horizontal" spacing="sm" className="mb-md">
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
      </Stack>

      <pre className="bg-background p-sm rounded-sm text-xs overflow-x-auto mb-md max-h-64 overflow-y-auto">
        <code>
          {format === 'json'
            ? JSON.stringify(
                tokens.reduce((acc, token) => {
                  acc[token.name] = token.value;
                  return acc;
                }, {} as Record<string, string>),
                null,
                2
              )
            : `:root {\n${tokens.map(t => `  ${t.variable}: ${t.value};`).join('\n')}\n}`}
        </code>
      </pre>

      <Stack direction="horizontal" spacing="sm">
        <Button size="sm" onClick={copyToClipboard}>
          Copy to Clipboard
        </Button>
        <Button variant="secondary" size="sm" onClick={exportData}>
          Export to File
        </Button>
      </Stack>
    </div>
  );
}
