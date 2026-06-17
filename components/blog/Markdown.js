const Markdown = ({ text, className = "" }) => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];
    let currentList = [];

    const flushList = (key) => {
        if (currentList.length > 0) {
            elements.push(<ul key={`list-${key}`} className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">{currentList}</ul>);
            currentList = [];
        }
    };

    let tableHeader = null;
    let tableBody = [];

    const flushTable = (key) => {
        if (tableHeader || tableBody.length > 0) {
            elements.push(
                <div key={`table-wrapper-${key}`} className="overflow-x-auto mb-8 rounded-xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200/80 dark:divide-white/[0.06]">
                        {tableHeader && <thead className="bg-gradient-to-r from-violet-50/50 to-blue-50/50 dark:from-violet-950/20 dark:to-blue-950/20">{tableHeader}</thead>}
                        {tableBody.length > 0 && <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">{tableBody}</tbody>}
                    </table>
                </div>
            );
            tableHeader = null;
            tableBody = [];
        }
    };

    let inCodeBlock = false;
    let codeContent = [];
    let codeLang = '';

    const flushCodeBlock = (key) => {
        if (codeContent.length > 0) {
            elements.push(
                <div key={`code-wrapper-${key}`} className="relative group mb-6">
                    {codeLang && (
                        <div className="absolute -top-2.5 left-4 z-10 inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-slate-950 px-2.5 py-1 shadow-lg">
                            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{codeLang}</span>
                        </div>
                    )}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <pre className="relative bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 text-slate-100 p-5 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed border border-white/[0.06] shadow-2xl shadow-slate-950/50">
                        <code>{codeContent.join('\n')}</code>
                    </pre>
                </div>
            );
            codeContent = [];
            codeLang = '';
        }
    };

    lines.forEach((line, i) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('```')) {
            if (inCodeBlock) {
                flushCodeBlock(i);
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
                codeLang = trimmed.slice(3).trim();
            }
            return;
        }

        if (inCodeBlock) {
            codeContent.push(line);
            return;
        }

        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            if (trimmed.includes('---')) return;
            const cells = trimmed.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
            const isHeader = !tableHeader;

            const row = (
                <tr key={`tr-${i}`} className="transition-colors hover:bg-violet-50/30 dark:hover:bg-violet-950/10">
                    {cells.map((cell, j) => (
                        isHeader ?
                            <th key={j} className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                                {renderInline(cell.trim())}
                            </th> :
                            <td key={j} className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                {renderInline(cell.trim())}
                            </td>
                    ))}
                </tr>
            );

            if (isHeader) {
                tableHeader = row;
            } else {
                tableBody.push(row);
            }
            return;
        } else {
            flushTable(i);
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            currentList.push(
                <li key={`li-${i}`} className="leading-relaxed pl-1 text-slate-700 dark:text-slate-300">
                    <span className="mr-2 text-violet-500 font-bold">◆</span>
                    {renderInline(trimmed.substring(2))}
                </li>
            );
            return;
        } else {
            flushList(i);
        }

        if (trimmed.startsWith('> ')) {
            elements.push(
                <blockquote key={i} className="relative overflow-hidden border-l-[3px] border-violet-500 bg-gradient-to-r from-violet-50/80 to-transparent px-5 py-4 italic my-6 rounded-r-xl text-slate-700 dark:text-slate-300 shadow-sm dark:from-violet-950/20 dark:to-transparent">
                    <div className="absolute left-3 top-3 text-violet-300 dark:text-violet-600 text-lg leading-none">"</div>
                    <div className="relative pl-2">{renderInline(trimmed.substring(2))}</div>
                </blockquote>
            );
            return;
        }

        if (trimmed.startsWith('# ')) {
            elements.push(
                <h2 key={i} className="relative text-2xl font-black mt-10 mb-5 tracking-tight text-slate-950 dark:text-white">
                    <span className="absolute -left-0.5 top-0 h-full w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
                    <span className="pl-4">{renderInline(trimmed.substring(2))}</span>
                </h2>
            );
        } else if (trimmed.startsWith('## ')) {
            elements.push(
                <h3 key={i} className="text-xl font-extrabold mt-8 mb-4 tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="inline-block h-4 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
                    {renderInline(trimmed.substring(3))}
                </h3>
            );
        } else if (trimmed.startsWith('### ')) {
            elements.push(
                <h4 key={i} className="text-lg font-bold mt-6 mb-3 tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="inline-block h-3 w-1 rounded-full bg-violet-400/60" />
                    {renderInline(trimmed.substring(4))}
                </h4>
            );
        } else if (trimmed === '---') {
            elements.push(<hr key={i} className="my-10 border-slate-200/60 dark:border-white/[0.06]" />);
        } else if (trimmed === '') {
            elements.push(<div key={i} className="h-3" />);
        } else {
            elements.push(
                <p key={i} className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300 text-sm md:text-base">
                    {renderInline(line)}
                </p>
            );
        }
    });

    flushList('end');
    flushTable('end');
    flushCodeBlock('end');

    return (
        <div className={`markdown-body selection:bg-violet-100 dark:selection:bg-violet-900/40 ${className}`}>
            {elements}
        </div>
    );
};

function renderInline(text) {
    if (!text) return '';

    const parts = text.split(/(`[^`]+`|\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);

    return parts.map((part, i) => {
        if (!part) return null;

        if (part.startsWith('`') && part.endsWith('`')) {
            return (
                <code key={i} className="inline rounded-md bg-violet-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-violet-700 ring-1 ring-violet-200/50 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-800/30">
                    {part.slice(1, -1)}
                </code>
            );
        }

        if (part.startsWith('***') && part.endsWith('***')) {
            return <strong key={i} className="font-black text-violet-700 dark:text-violet-300"><em>{part.slice(3, -3)}</em></strong>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-black text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i} className="text-violet-600 dark:text-violet-400">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('[') && part.includes('](')) {
            const match = part.match(/\[(.*?)\]\((.*?)\)/);
            if (match) {
                return (
                    <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 underline decoration-blue-300/50 underline-offset-2 transition-colors hover:decoration-blue-600 dark:text-blue-400 dark:decoration-blue-500/30 dark:hover:decoration-blue-400">
                        {match[1]}
                    </a>
                );
            }
        }
        return part;
    });
}

export default Markdown;
