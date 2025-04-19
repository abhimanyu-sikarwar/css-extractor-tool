// src/__tests__/OutputSection.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OutputSection from '../components/OutputSection';

describe('OutputSection Component', () => {
    const sampleCss = `.header { color: red; }\n.container { width: 100%; }\n.button { padding: 10px; }`;

    // Mock clipboard API
    let clipboardWriteTextMock: jest.Mock;

    beforeEach(() => {
        clipboardWriteTextMock = jest.fn().mockImplementation(() => Promise.resolve());
        jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(clipboardWriteTextMock);

        // Mock window.URL.createObjectURL and window.URL.revokeObjectURL
        global.URL.createObjectURL = jest.fn(() => 'blob-url');
        global.URL.revokeObjectURL = jest.fn();

        // Mock document.createElement and related methods
        const originalCreateElement = document.createElement.bind(document);
        document.createElement = jest.fn().mockImplementation((tagName) => {
            const element = originalCreateElement(tagName);
            if (tagName === 'a') {
                element.click = jest.fn();
            }
            return element;
        });

        // Mock document.body.appendChild and removeChild
        document.body.appendChild = jest.fn();
        document.body.removeChild = jest.fn();

        // Mock window.alert
        global.alert = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();

        test('renders the extracted CSS content', () => {
            render(<OutputSection extractedCss={sampleCss} />);

            // Check if the CSS content is rendered
            const cssContent = screen.getByText(sampleCss);
            expect(cssContent).toBeInTheDocument();
        });

        test('renders the copy button', () => {
            render(<OutputSection extractedCss={sampleCss} />);

            // Check if the copy button is rendered
            const copyButton = screen.getByText(/Copy to Clipboard/i);
            expect(copyButton).toBeInTheDocument();
        });

        test('renders the download button', () => {
            render(<OutputSection extractedCss={sampleCss} />);

            // Check if the download button is rendered
            const downloadButton = screen.getByText(/Download CSS/i);
            expect(downloadButton).toBeInTheDocument();
        });

        test('calls clipboard API when copy button is clicked', () => {
            render(<OutputSection extractedCss={sampleCss} />);

            // Click the copy button
            const copyButton = screen.getByText(/Copy to Clipboard/i);
            fireEvent.click(copyButton);

            // Check if clipboard.writeText was called with the correct CSS
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(sampleCss);

            // Check if alert was shown
            expect(global.alert).toHaveBeenCalledWith('Copied to clipboard!');
        });

        test('creates a download when download button is clicked', () => {
            render(<OutputSection extractedCss={sampleCss} />);

            // Click the download button
            const downloadButton = screen.getByText(/Download CSS/i);
            fireEvent.click(downloadButton);

            // Check if Blob was created with the correct CSS
            expect(global.URL.createObjectURL).toHaveBeenCalled();

            // Check if a link was created and clicked
            expect(document.createElement).toHaveBeenCalledWith('a');
            const mockAnchor = document.createElement('a');
            expect(mockAnchor.download).toBe('extracted.css');
            expect(mockAnchor.href).toBe('blob-url');
            expect(mockAnchor.click).toHaveBeenCalled();

            // Check if the blob URL was revoked
            expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob-url');
        });

        test('handles empty CSS content', () => {
            render(<OutputSection extractedCss="" />);

            // Check if the pre element exists but is empty
            const preElement = screen.getByRole('presentation');
            expect(preElement).toBeInTheDocument();
            expect(preElement.textContent).toBe('');
        });
    })
})
