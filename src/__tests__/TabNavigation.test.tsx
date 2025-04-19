// src/__tests__/TabNavigation.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabNavigation from '../components/TabNavigation';

describe('TabNavigation Component', () => {
    const mockSetActiveTab = jest.fn();

    beforeEach(() => {
        mockSetActiveTab.mockClear();
    });

    test('renders all three tabs', () => {
        render(
            <TabNavigation
                activeTab="input"
                setActiveTab={mockSetActiveTab}
                hasClasses={true}
                hasCss={true}
            />
        );

        // Check if all tabs are rendered
        expect(screen.getByText(/Input/i)).toBeInTheDocument();
        expect(screen.getByText(/Classes/i)).toBeInTheDocument();
        expect(screen.getByText(/Output/i)).toBeInTheDocument();
    });

    test('applies active class to current tab', () => {
        render(
            <TabNavigation
                activeTab="classes"
                setActiveTab={mockSetActiveTab}
                hasClasses={true}
                hasCss={true}
            />
        );

        // Check if the active class is applied to the classes tab
        const classesTab = screen.getByText(/Classes/i);
        expect(classesTab.closest('button')).toHaveClass('active');

        // Check that other tabs don't have active class
        const inputTab = screen.getByText(/Input/i);
        const outputTab = screen.getByText(/Output/i);
        expect(inputTab.closest('button')).not.toHaveClass('active');
        expect(outputTab.closest('button')).not.toHaveClass('active');
    });

    test('calls setActiveTab when clicking a tab', () => {
        render(
            <TabNavigation
                activeTab="input"
                setActiveTab={mockSetActiveTab}
                hasClasses={true}
                hasCss={true}
            />
        );

        // Click the classes tab
        const classesTab = screen.getByText(/Classes/i);
        fireEvent.click(classesTab);

        // Check if setActiveTab was called with the correct parameter
        expect(mockSetActiveTab).toHaveBeenCalledWith('classes');
    });

    test('disables tabs when required content is not available', () => {
        render(
            <TabNavigation
                activeTab="input"
                setActiveTab={mockSetActiveTab}
                hasClasses={false}
                hasCss={false}
            />
        );

        // Check if the classes and output tabs are disabled
        const classesTab = screen.getByText(/Classes/i);
        const outputTab = screen.getByText(/Output/i);

        expect(classesTab.closest('button')).toBeDisabled();
        expect(outputTab.closest('button')).toBeDisabled();

        // Input tab should be enabled
        const inputTab = screen.getByText(/Input/i);
        expect(inputTab.closest('button')).not.toBeDisabled();
    });

    test('allows navigation to classes tab when classes are available', () => {
        render(
            <TabNavigation
                activeTab="input"
                setActiveTab={mockSetActiveTab}
                hasClasses={true}
                hasCss={false}
            />
        );

        // Classes tab should be enabled
        const classesTab = screen.getByText(/Classes/i);
        expect(classesTab.closest('button')).not.toBeDisabled();

        // Output tab should be disabled
        const outputTab = screen.getByText(/Output/i);
        expect(outputTab.closest('button')).toBeDisabled();
    });
});