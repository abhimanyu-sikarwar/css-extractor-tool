// src/__tests__/Header.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/Header';

describe('Header Component', () => {
    test('renders the header with correct title', () => {
        render(<Header />);

        // Check if the title is rendered
        const titleElement = screen.getByText(/CSS Extractor/i);
        expect(titleElement).toBeInTheDocument();
    });

    test('renders the description text', () => {
        render(<Header />);

        // Check if the description is rendered
        const descriptionElement = screen.getByText(/Extract only the CSS rules used/i);
        expect(descriptionElement).toBeInTheDocument();
    });

    test('has the correct CSS class', () => {
        const { container } = render(<Header />);

        // Check if header has the correct CSS class
        const headerElement = container.querySelector('.app-header');
        expect(headerElement).toBeInTheDocument();
    });
});