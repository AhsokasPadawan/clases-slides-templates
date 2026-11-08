import katex from 'katex';

export interface MathFormulaProps {
  expression?: string;
  formula?: string;
  displayMode?: boolean;
  className?: string;
}

export function MathFormula({
  expression,
  formula,
  displayMode = false,
  className = '',
}: MathFormulaProps) {
  let latexSource = expression ?? formula ?? '';
  latexSource = latexSource.replace(/\\\\([a-zA-Z,])/g, '\\$1');
  const renderedHtml = katex.renderToString(latexSource, {
    throwOnError: false,
    displayMode,
    strict: 'ignore',
  });

  if (displayMode) {
    return (
      <div
        className={`my-2 overflow-x-auto py-1 ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return (
    <span
      className={`inline-block align-middle ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
