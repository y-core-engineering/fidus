'use client';

interface ColorSwatchProps {
  name: string;
  variable: string;
  value: string;
  description?: string;
}

export function ColorSwatch({ name, variable, value, description }: ColorSwatchProps) {
  return (
    <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
      <div
        className="w-16 h-16 rounded-md border border-border flex-shrink-0"
        style={{ backgroundColor: `hsl(${value})` }}
      />
      <div className="flex-1">
        <div className="font-semibold text-foreground">{name}</div>
        <div className="text-sm text-muted-foreground font-mono">{variable}</div>
        <div className="text-sm text-muted-foreground">{value}</div>
        {description && (
          <div className="text-sm text-muted-foreground mt-1">{description}</div>
        )}
      </div>
    </div>
  );
}

interface TokenDisplayProps {
  name: string;
  variable: string;
  value: string;
  preview?: React.ReactNode;
  description?: string;
}

export function TokenDisplay({ name, variable, value, preview, description }: TokenDisplayProps) {
  return (
    <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
      {preview && (
        <div className="w-16 h-16 flex items-center justify-center border border-border rounded-md flex-shrink-0 bg-muted">
          {preview}
        </div>
      )}
      <div className="flex-1">
        <div className="font-semibold text-foreground">{name}</div>
        <div className="text-sm text-muted-foreground font-mono">{variable}</div>
        <div className="text-sm text-muted-foreground">{value}</div>
        {description && (
          <div className="text-sm text-muted-foreground mt-1">{description}</div>
        )}
      </div>
    </div>
  );
}
