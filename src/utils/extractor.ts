// utils/extractor.ts
import * as cheerio from 'cheerio';
import { ExtractedClassesType } from '../types/types';

/**
 * Extract classes from HTML string
 * @param html - HTML content
 * @returns Object with class names as keys
 */
export function extractClassesFromHtml(html: string): ExtractedClassesType {
    try {
        const $ = cheerio.load(html);
        const classes: ExtractedClassesType = {};

        // Find all elements with classes
        $('[class]').each((index, element) => {
            const classNames = $(element).attr('class')?.split(/\s+/).filter(Boolean) || [];

            for (const className of classNames) {
                if (!classes[className]) {
                    classes[className] = {};
                }
            }
        });

        return classes;
    } catch (error) {
        console.error('Error extracting classes:', error);
        throw new Error('Failed to parse HTML and extract classes');
    }
}

/**
 * Extract CSS rules for specified classes
 * @param cssContent - CSS content
 * @param classNames - Object with class names as keys
 * @returns Extracted CSS
 */
export function extractCssFromClasses(cssContent: string, classNames: ExtractedClassesType): string {
    try {
        let extractedRules = '';
        let inComment = false;
        let currentRule = '';
        let braceCount = 0;
        let inMediaQuery = false;
        let mediaQueryText = '';
        let mediaQueryBraceCount = 0;

        // Split CSS content by lines for easier processing
        const lines = cssContent.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Handle comments
            if (line.includes('/*') && !line.includes('*/')) {
                inComment = true;
                continue;
            }
            if (inComment) {
                if (line.includes('*/')) inComment = false;
                continue;
            }

            // Handle empty lines
            if (!line.trim()) continue;

            // Track braces for both regular rules and media queries
            const openBraces = (line.match(/{/g) || []).length;
            const closeBraces = (line.match(/}/g) || []).length;

            // Handle media queries and keyframes
            if ((line.trim().startsWith('@media') || line.trim().startsWith('@keyframes')) && !inMediaQuery) {
                inMediaQuery = true;
                mediaQueryText = line;
                mediaQueryBraceCount = openBraces;
                continue;
            }

            if (inMediaQuery) {
                mediaQueryText += '\n' + line;
                mediaQueryBraceCount += openBraces - closeBraces;

                // If media query or keyframes is complete
                if (mediaQueryBraceCount === 0) {
                    // Process the media query content to extract matching rules
                    const mediaQueryContent = extractMediaQueryRules(mediaQueryText, classNames);
                    if (mediaQueryContent) {
                        extractedRules += mediaQueryContent + '\n\n';
                    }
                    inMediaQuery = false;
                    mediaQueryText = '';
                }
                continue;
            }

            // Regular CSS rule processing
            if (braceCount === 0 && !line.includes('{')) {
                // Start of a new rule
                currentRule = line;
            } else if (braceCount === 0 && line.includes('{')) {
                // Rule starts and has opening brace
                currentRule = line;
                braceCount += openBraces - closeBraces;
            } else if (braceCount > 0) {
                // Already inside a rule
                currentRule += '\n' + line;
                braceCount += openBraces - closeBraces;

                // If rule is complete
                if (braceCount === 0) {
                    // Check if the rule contains any of our class names
                    if (shouldIncludeRule(currentRule, classNames)) {
                        extractedRules += currentRule + '\n\n';
                    }
                    currentRule = '';
                }
            }
        }

        return extractedRules.trim();
    } catch (error) {
        console.error('Error extracting CSS:', error);
        throw new Error('Failed to extract CSS rules');
    }
}

/**
 * Extract rules from a media query that match our class names
 * @param mediaQueryText - Complete media query text
 * @param classNames - Object with class names as keys
 * @return Extracted media query with matching rules only
 */
function extractMediaQueryRules(mediaQueryText: string, classNames: ExtractedClassesType): string | null {
    // Check if it's a keyframes animation (which we should include completely)
    if (mediaQueryText.trim().startsWith('@keyframes')) {
        return mediaQueryText;
    }

    // Extract the media query condition (e.g., "@media screen and (max-width: 768px)")
    const mediaQueryCondition = mediaQueryText.substring(0, mediaQueryText.indexOf('{')).trim();

    // Extract the content inside the media query (between the outer braces)
    const contentStartIndex = mediaQueryText.indexOf('{') + 1;
    const contentEndIndex = mediaQueryText.lastIndexOf('}');

    if (contentStartIndex >= contentEndIndex) return null;

    const mediaQueryContent = mediaQueryText.substring(contentStartIndex, contentEndIndex).trim();

    if (!mediaQueryContent) return null;

    // Split the media query content into individual rules
    let rules: string[] = [];
    let currentRule = '';
    let braceCount = 0;

    // Process the media query content line by line
    const lines = mediaQueryContent.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;

        if (braceCount === 0 && !line.includes('{')) {
            currentRule = line;
        } else if (braceCount === 0 && line.includes('{')) {
            currentRule = line;
            braceCount += openBraces - closeBraces;
        } else {
            currentRule += '\n    ' + line; // Add extra indentation for nested rules
            braceCount += openBraces - closeBraces;

            if (braceCount === 0) {
                // Complete rule found
                if (shouldIncludeRule(currentRule, classNames)) {
                    rules.push(currentRule);
                }
                currentRule = '';
            }
        }
    }

    // If we found matching rules, reconstruct the media query
    if (rules.length > 0) {
        return `${mediaQueryCondition} {\n    ${rules.join('\n\n    ')}\n}`;
    }

    return null;
}

/**
 * Check if a CSS rule should be included based on class names
 * @param rule - CSS rule text
 * @param classNames - Object with class names as keys
 * @return Whether to include the rule
 */
function shouldIncludeRule(rule: string, classNames: ExtractedClassesType): boolean {
    // Always include keyframes and font declarations
    if (rule.includes('@keyframes') || rule.includes('@font-face')) {
        return true;
    }

    // Extract the selector part (before the first '{')
    const selectorPart = rule.substring(0, rule.indexOf('{')).trim();

    // Skip rules with no selector
    if (!selectorPart) return false;

    // Split into individual selectors (comma-separated)
    const selectors = selectorPart.split(',').map(s => s.trim());

    // Check each selector
    for (const selector of selectors) {
        // Extract class names from the selector
        const selectorClassNames = extractClassNamesFromSelector(selector);

        // If any class in the selector is in our target classes, include the rule
        for (const className of selectorClassNames) {
            if (className in classNames) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Extract class names from a CSS selector
 * @param selector - CSS selector
 * @return Array of class names found in the selector
 */
function extractClassNamesFromSelector(selector: string): string[] {
    const classNames: string[] = [];
    const classRegex = /\.([\w-]+)/g;
    let match;

    while ((match = classRegex.exec(selector)) !== null) {
        classNames.push(match[1]);
    }

    return classNames;
}