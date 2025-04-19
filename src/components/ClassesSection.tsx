// components/ClassesSection.tsx
import React from 'react';
import { ClassesSectionProps } from '../types/types';

const ClassesSection: React.FC<ClassesSectionProps> = ({
    extractedClasses,
    onExtractCss,
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
        </div>
    );
};

export default ClassesSection;