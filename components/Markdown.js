import React from 'react';

/**
 * Basic Markdown renderer for SEO tool descriptions and outputs.
 * Handles bold-italic (***text***), bold (**text**), and italics (*text*).
 */
const Markdown = ({ text, className = "" }) => {
    if (!text) return null;

    // Split by bold-italic, bold, and italic markers
    // Important: longest markers first in the regex
    const parts = text.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g);

    return (
        <span className={className}>
            {parts.map((part, i) => {
                if (part.startsWith('***') && part.endsWith('***')) {
                    return <strong key={i}><em>{part.slice(3, -3)}</em></strong>;
                }
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={i}>{part.slice(1, -1)}</em>;
                }
                return part;
            })}
        </span>
    );
};

export default Markdown;
