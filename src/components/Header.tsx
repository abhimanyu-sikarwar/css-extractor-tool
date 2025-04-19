// components/Header.tsx
import React from 'react';
import { HeaderProps } from '../types/types';

const Header: React.FC<HeaderProps> = () => {
    return (
        <header className="app-header">
            <h1>CSS Extractor</h1>
            <p>Extract only the CSS rules used in your HTML content to optimize page performance and reduce file size</p>
        </header>
    );
};

export default Header;