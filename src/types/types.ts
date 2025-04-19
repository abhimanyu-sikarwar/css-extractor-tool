// types/types.ts

// Type for the extracted classes object
export interface ExtractedClassesType {
    [className: string]: Record<string, unknown>;
}

// Input section props
export interface InputSectionProps {
    inputType: 'html' | 'url';
    setInputType: React.Dispatch<React.SetStateAction<'html' | 'url'>>;
    htmlInput: string;
    setHtmlInput: React.Dispatch<React.SetStateAction<string>>;
    urlInput: string;
    setUrlInput: React.Dispatch<React.SetStateAction<string>>;
    cssInput: string;
    setCssInput: React.Dispatch<React.SetStateAction<string>>;
    loading: boolean;
    onExtractClasses: () => Promise<void>;
}

// Classes section props
export interface ClassesSectionProps {
    extractedClasses: ExtractedClassesType;
    onExtractCss: () => void;
    loading: boolean;
    cssInputEmpty: boolean;
}

// Output section props
export interface OutputSectionProps {
    extractedCss: string;
}

// Tab navigation props
export interface TabNavigationProps {
    activeTab: 'input' | 'classes' | 'output';
    setActiveTab: React.Dispatch<React.SetStateAction<'input' | 'classes' | 'output'>>;
    hasClasses: boolean;
    hasCss: boolean;
}

// Header props
export interface HeaderProps {
    // Optional future props like title or subtitle customization
}

// Footer props
export interface FooterProps {
    // Optional future props like copyright year or company name
}