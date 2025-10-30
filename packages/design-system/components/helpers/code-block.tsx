'use client';

import { useEffect, useState } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = 'typescript',
  showLineNumbers = false,
}: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let highlighter: Highlighter | null = null;

    async function highlight() {
      try {
        highlighter = await createHighlighter({
          themes: ['github-dark', 'github-light'],
          langs: ['typescript', 'tsx', 'javascript', 'jsx', 'json', 'css', 'html'],
        });

        const html = highlighter.codeToHtml(code, {
          lang: language,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        });

        setHighlightedCode(html);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        setIsLoading(false);
      }
    }

    highlight();

    return () => {
      if (highlighter) {
        highlighter.dispose();
      }
    };
  }, [code, language]);

  if (isLoading) {
    return (
      <pre className="p-4 overflow-x-auto bg-muted/50 text-sm">
        <code className="font-mono">{code}</code>
      </pre>
    );
  }

  return (
    <div
      className="shiki-wrapper overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}
