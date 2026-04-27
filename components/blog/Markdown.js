import React from 'react';

/**
 * Basic Markdown renderer for SEO tool descriptions and outputs.
 * Handles bold-italic (***text***), bold (**text**), and italics (*text*).
 */
const Markdown = ({ text, className = "" }) => {
    if (!text) return null;

    // Process blocks (headings, lists, paragraphs)
    const lines = text.split('\n');
    const elements = [];
    let currentList = [];

    const flushList = (key) => {
        if (currentList.length > 0) {
            elements.push(<ul key={`list-${key}`} className="list-disc pl-5 mb-6 space-y-2 text-gray-700 dark:text-gray-300">{currentList}</ul>);
            currentList = [];
        }
    };

    let tableHeader = null;
    let tableBody = [];

    const flushTable = (key) => {
        if (tableHeader || tableBody.length > 0) {
            elements.push(
                <div key={`table-wrapper-${key}`} className="overflow-x-auto mb-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        {tableHeader && <thead className="bg-gray-50/50 dark:bg-gray-900/50">{tableHeader}</thead>}
                        {tableBody.length > 0 && <tbody className="divide-y divide-gray-100 dark:divide-gray-900">{tableBody}</tbody>}
                    </table>
                </div>
            );
            tableHeader = null;
            tableBody = [];
        }
    };

    let inCodeBlock = false;
    let codeContent = [];

    const flushCodeBlock = (key) => {
        if (codeContent.length > 0) {
            elements.push(
                <div key={`code-wrapper-${key}`} className="relative group mb-6">
                    <pre className="bg-slate-950 text-slate-100 p-5 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed border border-white/5 shadow-2xl">
                        <code>{codeContent.join('\n')}</code>
                    </pre>
                </div>
            );
            codeContent = [];
        }
    };

    lines.forEach((line, i) => {
        const trimmed = line.trim();

        // Code Blocks
        if (trimmed.startsWith('```')) {
            if (inCodeBlock) {
                flushCodeBlock(i);
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
            }
            return;
        }

        if (inCodeBlock) {
            codeContent.push(line);
            return;
        }

        // Tables
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            if (trimmed.includes('---')) return; // skip delimiter row
            const cells = trimmed.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
            const isHeader = !tableHeader;
            
            const row = (
                <tr key={`tr-${i}`} className="transition-colors hover:bg-gray-50/30 dark:hover:bg-white/5">
                    {cells.map((cell, j) => (
                        isHeader ?
                            <th key={j} className="px-4 py-3 text-left text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                                {renderInline(cell.trim())}
                            </th> :
                            <td key={j} className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
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

        // Lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            currentList.push(<li key={`li-${i}`} className="leading-relaxed pl-1">{renderInline(trimmed.substring(2))}</li>);
            return;
        } else {
            flushList(i);
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
            elements.push(
                <blockquote key={i} className="border-l-4 border-brand-500 bg-brand-50/30 dark:bg-brand-900/10 px-6 py-4 italic my-6 rounded-r-xl text-gray-700 dark:text-gray-300 shadow-sm">
                    {renderInline(trimmed.substring(2))}
                </blockquote>
            );
            return;
        }

        // Headings
        if (trimmed.startsWith('# ')) {
            elements.push(<h2 key={i} className="text-2xl font-black mt-10 mb-5 tracking-tight text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">{renderInline(trimmed.substring(2))}</h2>);
        } else if (trimmed.startsWith('## ')) {
            elements.push(<h3 key={i} className="text-xl font-extrabold mt-8 mb-4 tracking-tight text-gray-900 dark:text-white">{renderInline(trimmed.substring(3))}</h3>);
        } else if (trimmed.startsWith('### ')) {
            elements.push(<h4 key={i} className="text-lg font-bold mt-6 mb-3 tracking-tight text-gray-800 dark:text-gray-200">{renderInline(trimmed.substring(4))}</h4>);
        } else if (trimmed === '---') {
            elements.push(<hr key={i} className="my-10 border-gray-100 dark:border-gray-800" />);
        } else if (trimmed === '') {
            elements.push(<div key={i} className="h-4" />);
        } else {
            // Paragraph
            elements.push(<p key={i} className="mb-5 leading-relaxed text-gray-700 dark:text-gray-300 text-sm md:text-base">{renderInline(line)}</p>);
        }
    });

    flushList('end');
    flushTable('end');
    flushCodeBlock('end');

    return (
        <div className={`markdown-body selection:bg-brand-100 dark:selection:bg-brand-900/50 ${className}`}>
            {elements}
        </div>
    );
};

// Handle inline formatting (bold, italic, links)
function renderInline(text) {
    if (!text) return '';

    // Simple regex for bold, italic, and links [text](url)
    const parts = text.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);

    return parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith('***') && part.endsWith('***')) {
            return <strong key={i}><em>{part.slice(3, -3)}</em></strong>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('[') && part.includes('](')) {
            const match = part.match(/\[(.*?)\]\((.*?)\)/);
            if (match) {
                return (
                    <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        {match[1]}
                    </a>
                );
            }
        }
        return part;
    });
}

export default Markdown;
