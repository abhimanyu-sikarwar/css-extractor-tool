// src/__tests__/App.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import * as extractor from '../utils/extractor';

// Mock the extractor utility functions
jest.mock('../utils/extractor', () => ({
    extractClassesFromHtml: jest.fn(),
    extractCssFromClasses: jest.fn()
}));

describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mock implementations
        (extractor.extractClassesFromHtml as jest.Mock).mockReturnValue({
            'header': {},
            'container': {},
            'button': {}
        });

        (extractor.extractCssFromClasses as jest.Mock).mockReturnValue(
            `.header { color: red; }\n.container { width: 100%; }\n.button { padding: 10px; }`
        );

        // Mock fetch API
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                text: () => Promise.resolve('<div class="test">Hello</div>')
            })
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders the header component', () => {
        render(<App />);

        // Check if the header is rendered by its h1 tag
        const headerElement = screen.getByRole('heading', { level: 1, name: /CSS Extractor/i });
        expect(headerElement).toBeInTheDocument();
    });

    test('initially renders the input section', () => {
        render(<App />);

        // Check if the input section is rendered
        const htmlLabel = screen.getByText(/Paste your HTML:/i);
        expect(htmlLabel).toBeInTheDocument();
    });

    test('processes HTML input and extracts classes', async () => {
        render(<App />);

        // Enter HTML input
        const htmlTextarea = screen.getByLabelText(/Paste your HTML:/i);
        fireEvent.change(htmlTextarea, { target: { value: '<div class="test">Hello</div>' } });

        // Click the extract button
        const extractButton = screen.getByText(/Extract Classes/i);
        fireEvent.click(extractButton);

        // Check if the extractor function was called with the correct input
        expect(extractor.extractClassesFromHtml).toHaveBeenCalledWith('<div class="test">Hello</div>');

        // Wait for navigation to classes tab
        await waitFor(() => {
            expect(screen.getByText(/unique classes found/i)).toBeInTheDocument();
        });
    });

    test('fetches URL content when URL input is used', async () => {
        render(<App />);

        // Switch to URL input
        const urlRadio = screen.getByLabelText(/URL Input/i);
        fireEvent.click(urlRadio);

        // Enter URL
        const urlInput = screen.getByLabelText(/Enter URL:/i);
        fireEvent.change(urlInput, { target: { value: 'https://example.com' } });

        // Click the extract button
        const extractButton = screen.getByText(/Extract Classes/i);
        fireEvent.click(extractButton);

        // Check if fetch was called with the correct URL
        expect(global.fetch).toHaveBeenCalledWith('/api/fetch-url?url=https%3A%2F%2Fexample.com');

        // Wait for navigation to classes tab
        await waitFor(() => {
            expect(screen.getByText(/unique classes found/i)).toBeInTheDocument();
        });
    });

    test('extracts CSS based on classes', async () => {
        render(<App />);

        // Enter HTML and CSS input
        const htmlTextarea = screen.getByLabelText(/Paste your HTML:/i);
        fireEvent.change(htmlTextarea, { target: { value: '<div class="test">Hello</div>' } });

        const cssTextarea = screen.getByLabelText(/Paste your CSS:/i);
        fireEvent.change(cssTextarea, { target: { value: '.test { color: red; }' } });

        // Click the extract classes button
        const extractClassesButton = screen.getByText(/Extract Classes/i);
        fireEvent.click(extractClassesButton);

        // Wait for navigation to classes tab
        await waitFor(() => {
            expect(screen.getByText(/unique classes found/i)).toBeInTheDocument();
        });

        // Click the extract CSS button
        const extractCssButton = screen.getByText(/Extract CSS for These Classes/i);
        fireEvent.click(extractCssButton);

        // Check if the CSS extractor function was called
        expect(extractor.extractCssFromClasses).toHaveBeenCalled();

        // Wait for navigation to output tab
        await waitFor(() => {
            expect(screen.getByText(/Extracted CSS/i)).toBeInTheDocument();
        });
    });

    test('displays error message when extraction fails', async () => {
        // Mock the extractor to throw an error
        (extractor.extractClassesFromHtml as jest.Mock).mockImplementation(() => {
            throw new Error('Test error');
        });

        render(<App />);

        // Enter HTML input
        const htmlTextarea = screen.getByLabelText(/Paste your HTML:/i);
        fireEvent.change(htmlTextarea, { target: { value: '<div class="test">Hello</div>' } });

        // Click the extract button
        const extractButton = screen.getByText(/Extract Classes/i);
        fireEvent.click(extractButton);

        // Check if error message is displayed
        await waitFor(() => {
            expect(screen.getByText(/Test error/i)).toBeInTheDocument();
        });
    });

    test('navigates between tabs', () => {
        render(<App />);

        // Initially on input tab
        expect(screen.getByLabelText(/Paste your HTML:/i)).toBeInTheDocument();

        // Mock classes and CSS data
        (extractor.extractClassesFromHtml as jest.Mock).mockReturnValue({ 'test': {} });
        (extractor.extractCssFromClasses as jest.Mock).mockReturnValue('.test { color: red; }');

        // Extract classes
        const htmlTextarea = screen.getByLabelText(/Paste your HTML:/i);
        fireEvent.change(htmlTextarea, { target: { value: '<div class="test">Hello</div>' } });

        const cssTextarea = screen.getByLabelText(/Paste your CSS:/i);
        fireEvent.change(cssTextarea, { target: { value: '.test { color: red; }' } });

        const extractClassesButton = screen.getByText(/Extract Classes/i);
        fireEvent.click(extractClassesButton);

        // Should be on classes tab now
        expect(screen.getByText(/unique classes found/i)).toBeInTheDocument();

        // Extract CSS
        const extractCssButton = screen.getByText(/Extract CSS for These Classes/i);
        fireEvent.click(extractCssButton);

        // Should be on output tab now
        expect(screen.getByText(/Extracted CSS/i)).toBeInTheDocument();

        // Go back to input tab
        const inputTab = screen.getAllByText(/Input/i)[0];
        fireEvent.click(inputTab);

        // Should be on input tab again
        expect(screen.getByLabelText(/Paste your HTML:/i)).toBeInTheDocument();
    });
});