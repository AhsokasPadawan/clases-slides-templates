import { useEffect, useState, ReactNode } from 'react';
import { ExamExerciseVisualResource } from '../../core/domain/coreTypes';
import { MathFormula } from '../../core/ui/MathFormula';

interface ExerciseVisualResourceProps {
  resource?: ExamExerciseVisualResource | null;
  exerciseId: string;
}

function parseMarkdownTable(markdown: string): { headers: string[]; rows: string[][] } {
  const lines = markdown
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && line.endsWith('|'));

  if (lines.length < 2) {
    return { headers: [], rows: [] };
  }

  const parseRow = (line: string) =>
    line
      .slice(1, -1)
      .split('|')
      .map((cell) => cell.trim());

  const headers = parseRow(lines[0]);
  const dataLines = lines.slice(2);
  const rows = dataLines.map(parseRow);

  return { headers, rows };
}

function MermaidViewer({ code, id }: { code: string; id: string }) {
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    import('mermaid')
      .then((mermaidModule) => {
        const mermaid = mermaidModule.default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          themeVariables: {
            darkMode: true,
            background: '#09090b',
            primaryColor: '#86198f',
            primaryTextColor: '#fdf4ff',
            primaryBorderColor: '#e879f9',
            lineColor: '#e879f9',
            secondaryColor: '#701a75',
            tertiaryColor: '#18181b',
          },
        });

        const safeId = `mermaid_${id.replace(/[^a-zA-Z0-9]/g, '_')}_${Math.random().toString(36).slice(2, 7)}`;
        return mermaid.render(safeId, code);
      })
      .then(({ svg }) => {
        if (isMounted) {
          setSvgHtml(svg);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [code, id]);

  if (hasError) {
    return (
      <pre className="p-3 bg-zinc-950 font-mono text-xs text-amber-300 rounded-xl overflow-x-auto border border-zinc-800">
        {code}
      </pre>
    );
  }

  if (!svgHtml) {
    return (
      <div className="flex items-center justify-center p-6 text-zinc-500 font-mono text-xs">
        Renderizando diagrama de grafo...
      </div>
    );
  }

  return (
    <div
      className="flex justify-center overflow-x-auto p-2 [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}

const RENDERERS_LOOKUP: Record<
  string,
  (resource: ExamExerciseVisualResource, exerciseId: string) => ReactNode
> = {
  latex: (resource) => (
    <div className="rounded-xl border border-fuchsia-300 bg-white p-4 text-fuchsia-950 overflow-x-auto text-center shadow-xs dark:border-fuchsia-800/40 dark:bg-zinc-950 dark:text-fuchsia-100">
      <MathFormula
        expression={resource.codigo}
        displayMode
        className="text-fuchsia-950 dark:text-fuchsia-100 font-semibold"
      />
    </div>
  ),
  svg: (resource) => (
    <div
      className="rounded-xl border border-fuchsia-200 bg-white p-4 flex justify-center overflow-x-auto shadow-xs dark:border-zinc-800 dark:bg-zinc-950 [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: resource.codigo }}
    />
  ),
  markdown_tabla: (resource) => {
    const { headers, rows } = parseMarkdownTable(resource.codigo);
    return (
      <div className="rounded-xl border border-fuchsia-200 bg-white p-3 overflow-x-auto shadow-xs dark:border-zinc-800 dark:bg-zinc-950">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-fuchsia-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/80">
              {headers.map((headerText, colIndex) => (
                <th key={colIndex} className="px-3 py-2 font-mono font-bold text-fuchsia-900 dark:text-fuchsia-400">
                  {headerText}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-zinc-200/60 hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-zinc-900/40">
                {row.map((cellText, colIndex) => (
                  <td key={colIndex} className="px-3 py-1.5 font-mono text-zinc-800 dark:text-zinc-300">
                    {cellText}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
  mermaid: (resource, exerciseId) => (
    <div className="rounded-xl border border-fuchsia-200 bg-white p-3 overflow-x-auto shadow-xs dark:border-zinc-800 dark:bg-zinc-950">
      <MermaidViewer code={resource.codigo} id={exerciseId} />
    </div>
  ),
};

export function ExerciseVisualResource({
  resource,
  exerciseId,
}: ExerciseVisualResourceProps) {
  if (!resource) {
    return null;
  }

  const renderContent = RENDERERS_LOOKUP[resource.tipo];
  if (!renderContent) {
    return null;
  }

  return <div className="my-2.5">{renderContent(resource, exerciseId)}</div>;
}
