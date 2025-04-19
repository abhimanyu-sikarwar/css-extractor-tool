// src/__tests__/ClassesSection.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClassesSection from '../components/ClassesSection';
import { ExtractedClassesType } from '../types/types';

describe('ClassesSection Component', () => {
    const mockExtractCss = jest.fn();

    const sampleClasses: ExtractedClassesType = {
        'header': {},
        'container': {},
        'button': {}
    };

    const defaultProps = {
        extractedClasses: {} as ExtractedClassesType,
        onExtractCss: mockExtractCss,
        loading: false,
        cssInputEmpty: false
    };

    beforeEach(() => {
        mockExtractCss.mockClear();
    });

    test('displays the correct number of classes found', () => {
        render(<ClassesSection cssInput={''} setCssInput={function (value: React.SetStateAction<string>): void {
            throw new Error('Function not implemented.');
        } } {...defaultProps} extractedClasses={sampleClasses} />);

        // Check if the correct count is displayed
        const countText = screen.getByText('3 unique classes found');
        expect(countText).toBeInTheDocument();
    });

    test('renders all class names in the list', () => {
        render(<ClassesSection cssInput={''} setCssInput={function (value: React.SetStateAction<string>): void {
            throw new Error('Function not implemented.');
        } } {...defaultProps} extractedClasses={sampleClasses} />);

        // Check if all class names are rendered
        expect(screen.getByText('header')).toBeInTheDocument();
        expect(screen.getByText('container')).toBeInTheDocument();
        expect(screen.getByText('button')).toBeInTheDocument();
    });

    test('does not show extract button when no classes found', () => {
        render(<ClassesSection cssInput={''} setCssInput={function (value: React.SetStateAction<string>): void {
            throw new Error('Function not implemented.');
        } } {...defaultProps} extractedClasses={{}} />);

        // Check that the extract button is not rendered
        const extractButton = screen.queryByText(/Extract CSS for These Classes/i);
        expect(extractButton).not.toBeInTheDocument();
    });

    test('shows extract button when classes are found', () => {
        render(<ClassesSection cssInput={''} setCssInput={function (value: React.SetStateAction<string>): void {
            throw new Error('Function not implemented.');
        } } {...defaultProps} extractedClasses={sampleClasses} />);

        // Check that the extract button is rendered
        const extractButton = screen.getByText(/Extract CSS for These Classes/i);
        expect(extractButton).toBeInTheDocument();
    });

    test('extract button is disabled when loading', () => {
        render(<ClassesSection cssInput={''} setCssInput={function (value: React.SetStateAction<string>): void {
            throw new Error('Function not implemented.');
        } } {...defaultProps} extractedClasses={sampleClasses} loading={true} />);

        // Check if the extract button is disabled
        const extractButton = screen.getByText(/Extracting.../i);
        expect(extractButton).toBeDisabled();
    });

    test('extract button is disabled when CSS input is empty', () => {
        render(<ClassesSection cssInput={''} setCssInput={function (value: React.SetStateAction<string>): void {
            throw new Error('Function not implemented.');
        } } {...defaultProps} extractedClasses={sampleClasses} cssInputEmpty={true} />);

        // Check if the extract button is disabled
        const extractButton = screen.getByText(/Extract CSS for These Classes/i);
        expect(extractButton).toBeDisabled();
    });

    test('calls onExtractCss when extract button is clicked', () => {
        render(<ClassesSection cssInput={''} setCssInput={function (value: React.SetStateAction<string>): void {
            throw new Error('Function not implemented.');
        } } {...defaultProps} extractedClasses={sampleClasses} />);

        // Click the extract button
        const extractButton = screen.getByText(/Extract CSS for These Classes/i);
        fireEvent.click(extractButton);

        // Check if onExtractCss was called
        expect(mockExtractCss).toHaveBeenCalled();
    });

    test('displays "0 unique classes found" when classes object is empty', () => {
        render(<ClassesSection cssInput={''} setCssInput={function (value: React.SetStateAction<string>): void {
            throw new Error('Function not implemented.');
        } } {...defaultProps} extractedClasses={{}} />);

        // Check if the correct count is displayed
        const countText = screen.getByText('0 unique classes found');
        expect(countText).toBeInTheDocument();
    });

    test('renders each class with the correct class name', () => {
        render(<ClassesSection cssInput={''} setCssInput={function (value: React.SetStateAction<string>): void {
            throw new Error('Function not implemented.');
        } } {...defaultProps} extractedClasses={sampleClasses} />);

        // Check if each class item has the correct CSS class
        const classItems = screen.getAllByRole('div', { hidden: true }).filter(el =>
            el.classList.contains('class-item')
        );

        expect(classItems.length).toBe(3);
        classItems.forEach(item => {
            expect(item).toHaveClass('class-item');
        });
    });
});