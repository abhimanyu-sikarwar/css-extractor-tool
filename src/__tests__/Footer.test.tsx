// src/__tests__/Footer.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../components/Footer';

describe('Footer Component', () => {
    test('renders the footer with copyright text', () => {
        render(<Footer />);

        // Check if the copyright text is rendered
        const copyrightElement = screen.getByText(/CSS Extractor Tool/i);
        expect(copyrightElement).toBeInTheDocument();
    });

    test('includes the current year in the copyright text', () => {
        render(<Footer />);

        const currentYear = new Date().getFullYear().toString();

        // Check if the current year is included in the text
        const yearElement = screen.getByText(new RegExp(currentYear, 'i'));
        expect(yearElement).toBeInTheDocument();
    });

    test('has the correct CSS class', () => {
        const { container } = render(<Footer />);

        // Check if footer has the correct CSS class
        const footerElement = container.querySelector('.app-footer');
        expect(footerElement).toBeInTheDocument();
    });
});