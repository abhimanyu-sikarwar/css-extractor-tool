// components/InputSection.tsx
import React from 'react';
import { InputSectionProps } from '../types/types';

const InputSection: React.FC<InputSectionProps> = ({
    inputType,
    setInputType,
    htmlInput,
    setHtmlInput,
    urlInput,
    setUrlInput,
    cssInput,
    setCssInput,
    loading,
    onExtractClasses
}) => {
    return (
        <div className="input-section">
            <div className="input-type-selector">
                <label>
                    <input
                        type="radio"
                        value="html"
                        checked={inputType === 'html'}
                        onChange={() => setInputType('html')}
                    />
                    HTML Input
                </label>
                <label>
                    <input
                        type="radio"
                        value="url"
                        checked={inputType === 'url'}
                        onChange={() => setInputType('url')}
                    />
                    URL Input
                </label>
            </div>

            {inputType === 'html' ? (
                <div className="input-container">
                    <label htmlFor="html-input">Paste your HTML:</label>
                    <textarea
                        id="html-input"
                        value={htmlInput}
                        onChange={(e) => setHtmlInput(e.target.value)}
                        placeholder="Paste your HTML here..."
                        rows={10}
                    />
                </div>
            ) : (
                <div className="input-container">
                    <label htmlFor="url-input">Enter URL:</label>
                    <input
                        id="url-input"
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com"
                    />
                </div>
            )}

            <button
                className="action-button"
                onClick={onExtractClasses}
                disabled={loading || (inputType === 'html' ? !htmlInput : !urlInput)}
            >
                {loading ? 'Extracting...' : 'Extract Classes'}
            </button>

            <div className="input-container">
                <label htmlFor="css-input">Paste your CSS:</label>
                <textarea
                    id="css-input"
                    value={cssInput}
                    onChange={(e) => setCssInput(e.target.value)}
                    placeholder="Paste your CSS here..."
                    rows={10}
                />
            </div>
        </div>
    );
};

export default InputSection;