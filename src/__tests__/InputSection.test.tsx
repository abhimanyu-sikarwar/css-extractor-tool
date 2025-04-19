// src/__tests__/InputSection.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputSection from '../components/InputSection';

describe('InputSection Component', () => {
    const mockExtractClasses = jest.fn();
    const defaultProps = {
        inputType: 'html' as const,
        setInputType: jest.fn(),
        htmlInput: '',
        setHtmlInput: jest.fn(),
        urlInput: '',
        setUrlInput: jest.fn(),
        cssInput: '',
        setCssInput: jest.fn(),
        loading: false,
        onExtractClasses: mockExtractClasses
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders HTML input when input type is html', () => {
        render(<InputSection {...defaultProps} />);

        // Check if HTML textarea is rendered
        const htmlTextarea = screen.getByLabelText(/Paste your HTML:/i);
        expect(htmlTextarea).toBeInTheDocument();

        // Check if URL input is not rendered
        const urlInput = screen.queryByLabelText(/Enter URL:/i);
        expect(urlInput).not.toBeInTheDocument();
    });

    test('renders URL input when input type is url', () => {
        render(<InputSection {...defaultProps} inputType="url" />);

        // Check if URL input is rendered
        const urlInput = screen.getByLabelText(/Enter URL:/i);
        expect(urlInput).toBeInTheDocument();

        // Check if HTML textarea is not rendered
        const htmlTextarea = screen.queryByLabelText(/Paste your HTML:/i);
        expect(htmlTextarea).not.toBeInTheDocument();
    });

    test('changes input type when radio buttons are clicked', () => {
        const setInputTypeMock = jest.fn();
        render(<InputSection {...defaultProps} setInputType={setInputTypeMock} />);

        // Click the URL radio button
        const urlRadio = screen.getByLabelText(/URL Input/i);
        fireEvent.click(urlRadio);

        // Check if setInputType was called with the correct value
        expect(setInputTypeMock).toHaveBeenCalledWith('url');
    });

    test('calls setHtmlInput when HTML textarea changes', () => {
        const setHtmlInputMock = jest.fn();
        render(<InputSection {...defaultProps} setHtmlInput={setHtmlInputMock} />);

        // Change the HTML textarea value
        const htmlTextarea = screen.getByLabelText(/Paste your HTML:/i);
        fireEvent.change(htmlTextarea, { target: { value: '<div>Test</div>' } });

        // Check if setHtmlInput was called with the correct value
        expect(setHtmlInputMock).toHaveBeenCalledWith('<div>Test</div>');
    });

    test('calls setUrlInput when URL input changes', () => {
        const setUrlInputMock = jest.fn();
        render(<InputSection {...defaultProps} inputType="url" setUrlInput={setUrlInputMock} />);

        // Change the URL input value
        const urlInput = screen.getByLabelText(/Enter URL:/i);
        fireEvent.change(urlInput, { target: { value: 'https://example.com' } });

        // Check if setUrlInput was called with the correct value
        expect(setUrlInputMock).toHaveBeenCalledWith('https://example.com');
    });

    test('calls setCssInput when CSS textarea changes', () => {
        const setCssInputMock = jest.fn();
        render(<InputSection {...defaultProps} setCssInput={setCssInputMock} />);

        // Change the CSS textarea value
        const cssTextarea = screen.getByLabelText(/Paste your CSS:/i);
        fireEvent.change(cssTextarea, { target: { value: 'body { color: red; }' } });

        // Check if setCssInput was called with the correct value
        expect(setCssInputMock).toHaveBeenCalledWith('body { color: red; }');
    });

    test('extract button is disabled when HTML input is empty', () => {
        render(<InputSection {...defaultProps} htmlInput="" />);

        // Check if the extract button is disabled
        const extractButton = screen.getByText(/Extract Classes/i);
        expect(extractButton).toBeDisabled();
    });

    test('extract button is enabled when HTML input is not empty', () => {
        render(<InputSection {...defaultProps} htmlInput="<div>Test</div>" />);

        // Check if the extract button is enabled
        const extractButton = screen.getByText(/Extract Classes/i);
        expect(extractButton).not.toBeDisabled();
    });

    test('extract button is disabled when URL input is empty', () => {
        render(<InputSection {...defaultProps} inputType="url" urlInput="" />);

        // Check if the extract button is disabled
        const extractButton = screen.getByText(/Extract Classes/i);
        expect(extractButton).toBeDisabled();
    });

    test('extract button shows loading text when loading', () => {
        render(<InputSection {...defaultProps} loading={true} htmlInput="<div>Test</div>" />);

        // Check if the extract button shows loading text
        const extractButton = screen.getByText(/Extracting.../i);
        expect(extractButton).toBeInTheDocument();
    });

    test('calls onExtractClasses when extract button is clicked', () => {
        render(<InputSection {...defaultProps} htmlInput="<div>Test</div>" />);

        // Click the extract button
        const extractButton = screen.getByText(/Extract Classes/i);
        fireEvent.click(extractButton);

        // Check if onExtractClasses was called
        expect(mockExtractClasses).toHaveBeenCalled();
    });
});