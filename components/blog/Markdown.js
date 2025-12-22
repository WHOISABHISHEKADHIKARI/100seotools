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
            elements.push(<ul key={`list-${key}`} className="list-disc pl-5 mb-4 space-y-1">{currentList}</ul>);
            currentList = [];
        }
    };

    let currentTable = [];

    const flushTable = (key) => {
        if (currentTable.length > 0) {
            elements.push(
                <div key={`table-wrapper-${key}`} className="overflow-x-auto mb-6">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 border dark:border-gray-800">
                        {currentTable}
                    </table>
                </div>
            );
            currentTable = [];
        }
    };

    lines.forEach((line, i) => {
        const trimmed = line.trim();

        // Tables
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            if (trimmed.includes('---')) return; // skip delimiter row
            const cells = trimmed.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
            const isHeader = currentTable.length === 0;
            currentTable.push(
                <tr key={`tr-${i}`} className={isHeader ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-950"}>
                    {cells.map((cell, j) => (
                        isHeader ?
                            <th key={j} className="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border dark:border-gray-800">
                                {renderInline(cell.trim())}
                            </th> :
                            <td key={j} className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 border dark:border-gray-800">
                                {renderInline(cell.trim())}
                            </td>
                    ))}
                </tr>
            );
            return;
        } else {
            flushTable(i);
        }

        // Lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            currentList.push(<li key={`li-${i}`} className="leading-relaxed">{renderInline(trimmed.substring(2))}</li>);
            return;
        } else {
            flushList(i);
        }

        // Headings
        if (trimmed.startsWith('# ')) {
            elements.push(<h2 key={i} className="text-xl font-bold mt-6 mb-3 border-b pb-1 border-gray-200 dark:border-gray-700">{renderInline(trimmed.substring(2))}</h2>);
        } else if (trimmed.startsWith('## ')) {
            elements.push(<h3 key={i} className="text-lg font-bold mt-5 mb-2">{renderInline(trimmed.substring(3))}</h3>);
        } else if (trimmed.startsWith('### ')) {
            elements.push(<h4 key={i} className="text-base font-bold mt-4 mb-2">{renderInline(trimmed.substring(4))}</h4>);
        } else if (trimmed === '---') {
            elements.push(<hr key={i} className="my-6 border-gray-200 dark:border-gray-700" />);
        } else if (trimmed === '') {
            elements.push(<div key={i} className="h-2" />);
        } else {
            // Paragraph
            elements.push(<p key={i} className="mb-3 leading-relaxed">{renderInline(line)}</p>);
        }
    });

    flushList('end');

    return (
        <div className={`markdown-body text-sm ${className}`}>
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
