interface Prop {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface PropsTableProps {
  props: Prop[];
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Default</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b border-border last:border-0">
              <td className="px-4 py-3 align-top">
                <code className="text-sm font-mono text-foreground font-semibold">
                  {prop.name}
                  {prop.required && <span className="text-error ml-1">*</span>}
                </code>
              </td>
              <td className="px-4 py-3 align-top">
                <code className="text-sm font-mono text-muted-foreground">
                  {prop.type}
                </code>
              </td>
              <td className="px-4 py-3 align-top">
                {prop.default ? (
                  <code className="text-sm font-mono text-muted-foreground">
                    {prop.default}
                  </code>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-4 py-3 align-top text-sm text-muted-foreground">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
