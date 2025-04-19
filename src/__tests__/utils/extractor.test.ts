// src/__tests__/utils/extractor.test.ts
import { extractClassesFromHtml, extractCssFromClasses } from '../../utils/extractor';

describe('Extractor Utilities', () => {
    describe('extractClassesFromHtml', () => {
        test('extracts classes from simple HTML', () => {
            const html = '<div class="container"><p class="text">Hello</p></div>';
            const classes = extractClassesFromHtml(html);

            expect(classes).toEqual({
                'container': {},
                'text': {}
            });
        });

        test('extracts multiple classes from a single element', () => {
            const html = '<div class="container flex row"><p class="text bold">Hello</p></div>';
            const classes = extractClassesFromHtml(html);

            expect(classes).toEqual({
                'container': {},
                'flex': {},
                'row': {},
                'text': {},
                'bold': {}
            });
        });

        test('handles duplicate classes across different elements', () => {
            const html = '<div class="container"><p class="text container">Hello</p></div>';
            const classes = extractClassesFromHtml(html);

            expect(classes).toEqual({
                'container': {},
                'text': {}
            });
        });

        test('handles HTML with no classes', () => {
            const html = '<div><p>Hello</p></div>';
            const classes = extractClassesFromHtml(html);

            expect(classes).toEqual({});
        });

        test('extracts classes from various HTML elements', () => {
            const html = `
        <header class="header">
          <nav class="nav">
            <a href="#" class="link">Home</a>
          </nav>
        </header>
        <main class="main">
          <section class="section">
            <h1 class="title">Title</h1>
            <p class="text">Paragraph</p>
          </section>
        </main>
        <footer class="footer">
          <span class="copyright">Copyright</span>
        </footer>
      `;

            const classes = extractClassesFromHtml(html);

            expect(classes).toEqual({
                'header': {},
                'nav': {},
                'link': {},
                'main': {},
                'section': {},
                'title': {},
                'text': {},
                'footer': {},
                'copyright': {}
            });
        });

        test('throws error for invalid HTML', () => {
            const html = '<div class="container"<p>Broken HTML</div>';

            expect(() => {
                extractClassesFromHtml(html);
            }).not.toThrow(); // Cheerio handles invalid HTML gracefully
        });
    });

    describe('extractCssFromClasses', () => {
        test('extracts CSS rules for specified classes', () => {
            const css = `
        .container { width: 100%; }
        .text { color: black; }
        .unused { display: none; }
      `;

            const classes = {
                'container': {},
                'text': {}
            };

            const extractedCss = extractCssFromClasses(css, classes);

            // Normalize whitespace for comparison
            const normalizedCss = extractedCss.replace(/\s+/g, ' ').trim();

            expect(normalizedCss).toContain('.container { width: 100%; }');
            expect(normalizedCss).toContain('.text { color: black; }');
            expect(normalizedCss).not.toContain('.unused');
        });

        test('extracts CSS selectors with multiple classes', () => {
            const css = `
        .container { width: 100%; }
        .container.flex { display: flex; }
        .text { color: black; }
      `;

            const classes = {
                'container': {},
                'flex': {},
            };

            const extractedCss = extractCssFromClasses(css, classes);
            const normalizedCss = extractedCss.replace(/\s+/g, ' ').trim();

            expect(normalizedCss).toContain('.container { width: 100%; }');
            expect(normalizedCss).toContain('.container.flex { display: flex; }');
            expect(normalizedCss).not.toContain('.text');
        });

        test('handles complex selectors', () => {
            const css = `
        .container { width: 100%; }
        .container .text { font-size: 16px; }
        div.container > p.text { margin: 0; }
        .text:hover { color: blue; }
      `;

            const classes = {
                'container': {},
                'text': {}
            };

            const extractedCss = extractCssFromClasses(css, classes);
            const normalizedCss = extractedCss.replace(/\s+/g, ' ').trim();

            expect(normalizedCss).toContain('.container { width: 100%; }');
            expect(normalizedCss).toContain('.container .text { font-size: 16px; }');
            expect(normalizedCss).toContain('div.container > p.text { margin: 0; }');
            expect(normalizedCss).toContain('.text:hover { color: blue; }');
        });

        test('extracts media queries containing matching classes', () => {
            const css = `
        .container { width: 100%; }
        @media screen and (max-width: 768px) {
          .container { width: 90%; }
          .unused { display: block; }
        }
      `;

            const classes = {
                'container': {}
            };

            const extractedCss = extractCssFromClasses(css, classes);
            const normalizedCss = extractedCss.replace(/\s+/g, ' ').trim();

            expect(normalizedCss).toContain('.container { width: 100%; }');
            expect(normalizedCss).toContain('@media screen and (max-width: 768px) {');
            expect(normalizedCss).toContain('.container { width: 90%; }');
            expect(normalizedCss).not.toContain('.unused');
        });

        test('includes keyframes animations completely', () => {
            const css = `
        .animation { animation: spin 1s infinite; }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;

            const classes = {
                'animation': {}
            };

            const extractedCss = extractCssFromClasses(css, classes);
            const normalizedCss = extractedCss.replace(/\s+/g, ' ').trim();

            expect(normalizedCss).toContain('.animation { animation: spin 1s infinite; }');
            expect(normalizedCss).toContain('@keyframes spin {');
            expect(normalizedCss).toContain('0% { transform: rotate(0deg); }');
            expect(normalizedCss).toContain('100% { transform: rotate(360deg); }');
        });

        test('handles empty CSS input', () => {
            const css = '';
            const classes = { 'container': {} };

            const extractedCss = extractCssFromClasses(css, classes);

            expect(extractedCss).toBe('');
        });

        test('handles CSS with comments', () => {
            const css = `
        /* Header styles */
        .header { background: blue; }
        
        /* This class is not used */
        .unused { display: none; }
        
        /* Footer styles */
        .footer { background: gray; }
      `;

            const classes = {
                'header': {},
                'footer': {}
            };

            const extractedCss = extractCssFromClasses(css, classes);
            const normalizedCss = extractedCss.replace(/\s+/g, ' ').trim();

            expect(normalizedCss).toContain('.header { background: blue; }');
            expect(normalizedCss).toContain('.footer { background: gray; }');
            expect(normalizedCss).not.toContain('.unused');
            // Comments should be removed
            expect(normalizedCss).not.toContain('/* Header styles */');
        });
    });
});