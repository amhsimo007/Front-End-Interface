# Front-End Interface - JavaScript APIs & Design Editor

A comprehensive front-end interface demonstrating various JavaScript browser APIs and a fully functional design editor built with pure HTML, CSS, and JavaScript.

## Features

### JavaScript APIs Section
Explore and interact with six powerful browser APIs:

- **Canvas API**: Draw random shapes and lines with customizable colors
- **Geolocation API**: Get your current location with latitude, longitude, and accuracy
- **Web Audio API**: Generate audio tones with adjustable frequency
- **LocalStorage API**: Save, load, and clear key-value pairs in browser storage
- **Fetch API**: Fetch and display JSON data from any URL
- **Web Speech API**: Real-time speech recognition with continuous listening

### Design Editor Section
A complete vector graphics editor with the following capabilities:

**Tools:**
- Select tool for selecting and modifying shapes
- Rectangle tool for drawing rectangles
- Circle tool for drawing circles
- Text tool for adding text elements
- Line tool for drawing lines

**Properties Panel:**
- Fill color customization
- Stroke color customization
- Stroke width adjustment (1-20px)
- Font size adjustment (12-72px)
- Opacity control (0-100%)

**Layer Management:**
- Visual layer list showing all shapes
- Click to select shapes from the layer list
- Bring to front / Send to back functionality

**Actions:**
- Delete selected shapes
- Duplicate shapes
- Export canvas as PNG image

## File Structure

```
frontend-interface/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── apis.js         # JavaScript API implementations
├── editor.js       # Design editor functionality
└── README.md       # This file
```

## How to Use

### Running the Project
1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required - it's pure HTML/CSS/JavaScript!

### JavaScript APIs Tab
- Navigate between tabs using the buttons in the header
- Each API card has interactive controls
- Click buttons to trigger API functions
- Adjust sliders and inputs to customize behavior

### Design Editor Tab
1. **Select a tool** from the Tools panel (Rectangle, Circle, Text, Line, or Select)
2. **Draw shapes** by clicking and dragging on the canvas
3. **Customize properties** using the Properties panel (colors, stroke width, opacity, etc.)
4. **Manage layers** using the Layers list to select and organize shapes
5. **Use action buttons** to delete, duplicate, reorder, or export your design

## Technologies Used

- **HTML5**: Semantic markup and canvas elements
- **CSS3**: Modern styling with gradients, flexbox, grid, and transitions
- **Vanilla JavaScript**: ES6+ features, no frameworks or libraries

## Browser Compatibility

### Required APIs
- Canvas API: Supported in all modern browsers
- Geolocation API: Supported in all modern browsers (requires HTTPS)
- Web Audio API: Supported in all modern browsers
- LocalStorage API: Supported in all modern browsers
- Fetch API: Supported in all modern browsers
- Web Speech API: Supported in Chrome, Edge, and Safari (limited support in Firefox)

### Recommended Browsers
- Google Chrome (recommended)
- Microsoft Edge
- Mozilla Firefox
- Safari

## Notes

- **Geolocation**: Requires HTTPS or localhost to work properly
- **Web Speech API**: Best experience in Chrome/Edge; may not work in all browsers
- **Design Editor**: All shapes are drawn on HTML5 Canvas; export functionality downloads as PNG
- **LocalStorage**: Data persists in the browser until cleared

## License

This project is open source and available for educational purposes.

## Author

Created as a demonstration of modern JavaScript APIs and front-end development capabilities.
