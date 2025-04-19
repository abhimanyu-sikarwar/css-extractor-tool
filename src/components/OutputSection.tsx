// components/OutputSection.tsx
import React from 'react';
import { OutputSectionProps } from '../types/types';

const OutputSection: React.FC<OutputSectionProps> = ({
    extractedCss
}) => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    const downloadCss = (cssContent: string) => {
        const blob = new Blob([cssContent], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted.css';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="output-section">
            <h2>Extracted CSS</h2>

            <div className="output-actions">
                <button
                    className="action-button"
                    onClick={() => copyToClipboard(extractedCss)}
                >
                    Copy to Clipboard
                </button>
                <button
                    className="action-button"
                    onClick={() => downloadCss(extractedCss)}
                >
                    Download CSS
                </button>
            </div>

            <div className="css-output">
                <pre>{extractedCss}</pre>
            </div>
        </div>
    );
};

export default OutputSection;