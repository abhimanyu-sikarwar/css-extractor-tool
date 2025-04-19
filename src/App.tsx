// App.tsx
import React, { useState } from 'react';
import './App.css';
import InputSection from './components/InputSection';
import ClassesSection from './components/ClassesSection';
import OutputSection from './components/OutputSection';
import Header from './components/Header';
import Footer from './components/Footer';
import TabNavigation from './components/TabNavigation';
import { ExtractedClassesType } from './types/types';
import { extractClassesFromHtml, extractCssFromClasses } from './utils/extractor';

const App: React.FC = () => {
  const [inputType, setInputType] = useState<'html' | 'url'>('html');
  const [htmlInput, setHtmlInput] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [cssInput, setCssInput] = useState<string>('');
  const [extractedClasses, setExtractedClasses] = useState<ExtractedClassesType>({});
  const [extractedCss, setExtractedCss] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'input' | 'classes' | 'output'>('input');

  const handleExtractClasses = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      let html = '';

      if (inputType === 'html') {
        html = htmlInput;
      } else {
        // In a real app, this would be a server-side call
        const response = await fetch(`/api/fetch-url?url=${encodeURIComponent(urlInput)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch URL content');
        }
        html = await response.text();
      }

      const classes = extractClassesFromHtml(html);
      setExtractedClasses(classes);
      setActiveTab('classes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExtractCss = (): void => {
    setLoading(true);
    setError('');
    try {
      if (!cssInput.trim()) {
        throw new Error('Please enter CSS content');
      }

      if (Object.keys(extractedClasses).length === 0) {
        throw new Error('Please extract classes first');
      }

      const css = extractCssFromClasses(cssInput, extractedClasses);
      setExtractedCss(css);
      setActiveTab('output');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />

      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasClasses={Object.keys(extractedClasses).length > 0}
        hasCss={extractedCss.length > 0}
      />

      {activeTab === 'input' && (
        <InputSection
          inputType={inputType}
          setInputType={setInputType}
          htmlInput={htmlInput}
          setHtmlInput={setHtmlInput}
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          cssInput={cssInput}
          setCssInput={setCssInput}
          loading={loading}
          onExtractClasses={handleExtractClasses}
        />
      )}

      {activeTab === 'classes' && (
        <ClassesSection
          extractedClasses={extractedClasses}
          onExtractCss={handleExtractCss}
          loading={loading}
          cssInput={cssInput}
          setCssInput={setCssInput}
          cssInputEmpty={!cssInput.trim()}
        />
      )}

      {activeTab === 'output' && (
        <OutputSection
          extractedCss={extractedCss}
        />
      )}

      {error && <div className="error-message">{error}</div>}

      <Footer />
    </div>
  );
};

export default App;