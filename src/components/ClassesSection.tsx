// components/ClassesSection.tsx
import React from 'react';
import { ClassesSectionProps } from '../types/types';

const ClassesSection: React.FC<ClassesSectionProps> = ({
    extractedClasses,
    onExtractCss,
    cssInput,
    setCssInput,
    loading,
    cssInputEmpty
}) => {
    const classCount = Object.keys(extractedClasses).length;

    return (
        <div className="classes-section">
            <h2>Extracted Classes</h2>
            <p>{classCount} unique classes found</p>

            <div className="classes-list">
                {Object.keys(extractedClasses).map(className => (
                    <div key={className} className="class-item">
                        {className}
                    </div>
                ))}
            </div>

            {classCount > 0 && (
                <button
                    className="action-button"
                    onClick={onExtractCss}
                    disabled={loading || cssInputEmpty}
                >
                    {loading ? 'Extracting...' : 'Extract CSS for These Classes'}
                </button>
            )}
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

export default ClassesSection;