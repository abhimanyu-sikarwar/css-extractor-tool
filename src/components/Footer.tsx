// components/Footer.tsx
import React from 'react';
import { FooterProps } from '../types/types';

const Footer: React.FC<FooterProps> = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <p>CSS Extractor Tool &copy; {currentYear}</p>
        </footer>
    );
};

export default Footer;