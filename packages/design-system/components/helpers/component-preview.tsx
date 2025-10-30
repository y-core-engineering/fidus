'use client';

import { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { IconButton } from '@fidus/ui';
import { CodeBlock } from './code-block';

interface ComponentPreviewProps {
  children: React.ReactNode;
  code?: string;
  showCode?: boolean;
  language?: string;
}

export function ComponentPreview({
  children,
  code,
  showCode = false,
  language = 'tsx',
}: ComponentPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [isCodeVisible, setIsCodeVisible] = useState(showCode);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="not-prose border border-border rounded-lg overflow-hidden my-6">
      {/* Preview Area */}
      <div className="bg-muted/30 p-8 flex items-center justify-center min-h-[200px]">
        {children}
      </div>

      {/* Controls */}
      {code && (
        <div className="bg-background border-t border-border">
          <div className="flex items-center justify-between px-4 py-2">
            <button
              onClick={() => setIsCodeVisible(!isCodeVisible)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Code2 className="h-4 w-4" />
              {isCodeVisible ? 'Hide' : 'Show'} Code
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Code Block */}
          {isCodeVisible && code && (
            <div className="border-t border-border bg-muted/50">
              <CodeBlock code={code} language={language} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
