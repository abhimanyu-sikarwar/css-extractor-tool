// App.js
import React, { useState } from 'react';
import './App.css';
import { extractClassesFromHtml, extractCssFromClasses } from './utils/extractor';

function App() {
  const [inputType, setInputType] = useState('html');
  const [htmlInput, setHtmlInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [cssInput, setCssInput] = useState('');
  const [extractedClasses, setExtractedClasses] = useState({});
  const [extractedCss, setExtractedCss] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('input');

  const handleExtractClasses = async () => {
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
      setError(err.message || 'Failed to extract classes');
    } finally {
      setLoading(false);
    }
  };

  const handleExtractCss = () => {
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
      setError(err.message || 'Failed to extract CSS');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>CSS Extractor</h1>
        <p>Extract only the CSS rules used in your HTML content to optimize page performance and reduce file size</p>
      </header>

      <div className="tab-navigation">
        <button
          className={activeTab === 'input' ? 'active' : ''}
          onClick={() => setActiveTab('input')}
        >
          Input
        </button>
        <button
          className={activeTab === 'classes' ? 'active' : ''}
          onClick={() => setActiveTab('classes')}
          disabled={Object.keys(extractedClasses).length === 0}
        >
          Classes
        </button>
        <button
          className={activeTab === 'output' ? 'active' : ''}
          onClick={() => setActiveTab('output')}
          disabled={!extractedCss}
        >
          Output
        </button>
      </div>

      {activeTab === 'input' && (
        <div className="input-section">
          {/* <div className="input-type-selector">
            <label>
              <input
                type="radio"
                value="html"
                checked={inputType === 'html'}
                onChange={() => setInputType('html')}
              />
              HTML Input
            </label>
            <label>
              <input
                type="radio"
                value="url"
                checked={inputType === 'url'}
                onChange={() => setInputType('url')}
              />
              URL Input
            </label>
          </div> */}

          {inputType === 'html' ? (
            <div className="input-container">
              <label htmlFor="html-input">Paste your HTML:</label>
              <textarea
                id="html-input"
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="Paste your HTML here..."
                rows={10}
              />
            </div>
          ) : (
            <div className="input-container">
              <label htmlFor="url-input">Enter URL:</label>
              <input
                id="url-input"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          )}

          <button
            className="action-button"
            onClick={handleExtractClasses}
            disabled={loading || (inputType === 'html' ? !htmlInput : !urlInput)}
          >
            {loading ? 'Extracting...' : 'Extract Classes'}
          </button>

          <div className="input-container">
            <label htmlFor="css-input">Paste your CSS:</label>
            <textarea
              id="css-input"
              value={cssInput}
              onChange={(e) => setCssInput(e.target.value)}
              placeholder="Paste your CSS here..."
              rows={10}
            />
          </div>
        </div>
      )}

      {activeTab === 'classes' && (
        <div className="classes-section">
          <h2>Extracted Classes</h2>
          <p>{Object.keys(extractedClasses).length} unique classes found</p>

          <div className="classes-list">
            {Object.keys(extractedClasses).map(className => (
              <div key={className} className="class-item">
                {className}
              </div>
            ))}
          </div>

          {Object.keys(extractedClasses).length > 0 && (
            <button
              className="action-button"
              onClick={handleExtractCss}
              disabled={loading || !cssInput}
            >
              {loading ? 'Extracting...' : 'Extract CSS for These Classes'}
            </button>
          )}
          <div className="input-container">
            <label htmlFor="css-input">Paste your CSS:</label>
            <textarea
              id="css-input"
              value={cssInput}
              onChange={(e) => setCssInput(e.target.value)}
              placeholder="Paste your CSS here..."
              rows={10}
            />
          </div>
        </div>
      )}

      {activeTab === 'output' && (
        <div className="output-section">
          <h2>Extracted CSS</h2>

          <div className="output-actions">
            <button
              className="action-button"
              onClick={() => copyToClipboard(extractedCss)}
            >
              Copy to Clipboard
            </button>
            <button
              className="action-button"
              onClick={() => {
                const blob = new Blob([extractedCss], { type: 'text/css' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'extracted.css';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              Download CSS
            </button>
          </div>

          <div className="css-output">
            <pre>{extractedCss}</pre>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <footer className="app-footer">
        <p>CSS Extractor Tool &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;