export default function TypographyPage() {
  const TypeScale = ({
    level,
    variable,
    example,
  }: {
    level: string;
    variable: string;
    example: string;
  }) => (
    <div className="border border-border rounded-lg p-6 space-y-2">
      <div className="text-sm text-muted-foreground font-mono">{variable}</div>
      <div style={{ fontSize: `var(${variable})` }} className="font-sans">
        {example}
      </div>
      <div className="text-xs text-muted-foreground">{level}</div>
    </div>
  );

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Typography</h1>
      <p className="lead">
        Typography establishes hierarchy and improves readability across the Fidus
        interface. Our type system uses Inter as the primary typeface for its
        excellent legibility and modern aesthetic.
      </p>

      <h2>Typeface</h2>
      <p>
        We use <strong>Inter</strong> for all interface text. Inter is a carefully crafted
        typeface designed for computer screens, featuring excellent legibility at small
        sizes and a modern, neutral appearance.
      </p>

      <div className="not-prose border border-border rounded-lg p-6 my-6">
        <div className="text-4xl font-sans mb-2">Inter</div>
        <div className="text-muted-foreground">
          ABCDEFGHIJKLMNOPQRSTUVWXYZ
          <br />
          abcdefghijklmnopqrstuvwxyz
          <br />
          0123456789 !@#$%^&*()
        </div>
      </div>

      <h2>Type Scale</h2>
      <p>
        Our type scale provides a consistent range of font sizes for different levels
        of hierarchy in the interface.
      </p>

      <div className="not-prose space-y-4 my-6">
        <TypeScale
          level="5XL"
          variable="--font-size-5xl"
          example="The quick brown fox"
        />
        <TypeScale
          level="4XL"
          variable="--font-size-4xl"
          example="The quick brown fox"
        />
        <TypeScale
          level="3XL"
          variable="--font-size-3xl"
          example="The quick brown fox jumps"
        />
        <TypeScale
          level="2XL"
          variable="--font-size-2xl"
          example="The quick brown fox jumps over"
        />
        <TypeScale
          level="XL"
          variable="--font-size-xl"
          example="The quick brown fox jumps over the lazy dog"
        />
        <TypeScale
          level="LG"
          variable="--font-size-lg"
          example="The quick brown fox jumps over the lazy dog"
        />
        <TypeScale
          level="MD (Base)"
          variable="--font-size-md"
          example="The quick brown fox jumps over the lazy dog. This is the base font size used for body text."
        />
        <TypeScale
          level="SM"
          variable="--font-size-sm"
          example="The quick brown fox jumps over the lazy dog. This size is used for secondary text and captions."
        />
        <TypeScale
          level="XS"
          variable="--font-size-xs"
          example="The quick brown fox jumps over the lazy dog. This size is used for helper text and footnotes."
        />
      </div>

      <h2>Font Weights</h2>
      <p>
        Inter supports a range of weights. We primarily use three weights in our interface:
      </p>

      <div className="not-prose border border-border rounded-lg divide-y divide-border my-6">
        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-2">
            Regular (400) - var(--font-weight-normal)
          </div>
          <div className="text-lg" style={{ fontWeight: 'var(--font-weight-normal)' }}>
            Used for body text and most interface elements
          </div>
        </div>
        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-2">
            Medium (500) - var(--font-weight-medium)
          </div>
          <div className="text-lg" style={{ fontWeight: 'var(--font-weight-medium)' }}>
            Used for emphasized text and active states
          </div>
        </div>
        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-2">
            Bold (700) - var(--font-weight-bold)
          </div>
          <div className="text-lg" style={{ fontWeight: 'var(--font-weight-bold)' }}>
            Used for headings and strong emphasis
          </div>
        </div>
      </div>

      <h2>Line Height</h2>
      <p>
        Line height affects readability and vertical rhythm. We use three line heights
        optimized for different use cases:
      </p>

      <div className="not-prose space-y-4 my-6">
        <div className="border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-2">
            Tight (1.25) - var(--line-height-tight)
          </div>
          <div style={{ lineHeight: 'var(--line-height-tight)' }}>
            Used for headings and display text where space is limited. The quick brown
            fox jumps over the lazy dog.
          </div>
        </div>
        <div className="border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-2">
            Normal (1.5) - var(--line-height-normal)
          </div>
          <div style={{ lineHeight: 'var(--line-height-normal)' }}>
            Used for body text and most interface elements. Provides comfortable
            reading. The quick brown fox jumps over the lazy dog.
          </div>
        </div>
        <div className="border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-2">
            Relaxed (1.75) - var(--line-height-relaxed)
          </div>
          <div style={{ lineHeight: 'var(--line-height-relaxed)' }}>
            Used for long-form content where maximum readability is needed. The quick
            brown fox jumps over the lazy dog.
          </div>
        </div>
      </div>

      <h2>Usage Guidelines</h2>
      <h3>Hierarchy</h3>
      <ul>
        <li>Use larger sizes (2XL-5XL) for page titles and major headings</li>
        <li>Use XL-LG for section headings</li>
        <li>Use MD (base) for body text</li>
        <li>Use SM-XS for secondary information and captions</li>
      </ul>

      <h3>Readability</h3>
      <ul>
        <li>Keep line length between 45-75 characters for optimal readability</li>
        <li>Use normal or relaxed line height for body text</li>
        <li>Ensure sufficient contrast between text and background (4.5:1 minimum)</li>
        <li>Avoid using all caps for long passages</li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>Body text should be at least 16px (1rem) for comfortable reading</li>
        <li>Use font weight to establish hierarchy, not just size</li>
        <li>Ensure text can be resized up to 200% without loss of functionality</li>
        <li>Avoid using italics for long passages as they reduce readability</li>
      </ul>
    </div>
  );
}
