// components/TabNavigation.tsx
import React from 'react';
import { TabNavigationProps } from '../types/types';

const TabNavigation: React.FC<TabNavigationProps> = ({
    activeTab,
    setActiveTab,
    hasClasses,
    hasCss
}) => {
    return (
        <div className="tab-navigation">
            <button
                className={activeTab === 'input' ? 'active' : ''}
                onClick={() => setActiveTab('input')}
            >
                Input
            </button>
            <button
                className={activeTab === 'classes' ? 'active' : ''}
                onClick={() => setActiveTab('classes')}
                disabled={!hasClasses}
            >
                Classes
            </button>
            <button
                className={activeTab === 'output' ? 'active' : ''}
                onClick={() => setActiveTab('output')}
                disabled={!hasCss}
            >
                Output
            </button>
        </div>
    );
};

export default TabNavigation;