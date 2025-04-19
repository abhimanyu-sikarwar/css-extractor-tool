# CSS Extractor Tool

A React application that helps developers extract only the CSS they need from HTML content. This tool analyzes HTML (either pasted directly or fetched from a URL) and extracts class names, then filters CSS to include only styles for those classes.

## Features

- Extract class names from HTML content
- Process HTML from direct input or URL
- Filter CSS to include only styles for the extracted classes
- Support for media queries and keyframes
- Copy extracted CSS to clipboard or download as a file

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abhimanyu-sikarwar/css-extractor-tool.git
   cd css-extractor-tool
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run start
   # or
   yarn start
   ```

This will start both the React frontend (default: port 3000).

## How to Use

1. Enter your HTML content or URL in the "Input" tab
2. Paste your CSS in the CSS input area
3. Click "Extract Classes" to analyze the HTML
4. Review the extracted classes in the "Classes" tab
5. Click "Extract CSS for These Classes" to generate filtered CSS
6. Copy or download the extracted CSS from the "Output" tab

## How It Works

1. **HTML Processing**: The tool uses Cheerio (a server-side version of jQuery) to parse HTML and extract all class names from elements
2. **CSS Filtering**: It parses CSS content and keeps only rules that target the extracted classes
3. **Media Query Support**: Media queries are handled specially to ensure responsive styles are preserved
4. **Animation Support**: Keyframe animations are included automatically

## Deployment

To deploy the application:

1. Build the React app:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. The Express server is configured to serve the built React app in production.
   Start the server:
   ```bash
   npm run server
   # or
   yarn server
   ```

3. The app will be available at the configured port (default: 5000)

## Technologies Used

- React.js for the frontend UI
- Express.js for the backend server
- Cheerio for HTML parsing
- Axios for HTTP requests

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
