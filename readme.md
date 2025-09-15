# Argus Pro V2.4 - The Integrated Argument Builder 🧠

Argus Pro is a powerful, interactive web application designed to help users construct, visualize, and refine complex arguments with unparalleled clarity. It transforms linear text into dynamic, navigable argument maps in real-time, making it easier to understand logical flow, identify objections, and build compelling cases.

Whether you're a student, academic, debater, researcher, or anyone who needs to structure intricate thought processes, Argus Pro provides an intuitive environment to see your ideas unfold.

## ✨ Features

Argus Pro offers a comprehensive suite of features to enhance your argument-building experience:

### 📝 Real-time Text Editor
*   **Intuitive Interface:** A `contenteditable` text editor (`#textEditor`) provides a familiar writing experience.
*   **WYSIWYG Formatting:** Basic rich text formatting including:
    *   **Bold** (`<b>`)
    *   _Italic_ (`<i>`)
    *   Headings (`<h1>`, `<h2>`, `<h3>`)
    *   Paragraphs (`<p>`)
    *   Unordered Lists (`<ul>`, `<li>`)
*   **Intelligent Indentation:**
    *   `Tab` key: Indents content (wraps in `<blockquote>`).
    *   `Shift + Tab` key: Outdents content (removes `<blockquote>`).
*   **Semantic Prefixes:** Automatically interprets the semantic role of your arguments based on prefixes:
    *   `+`: Identifies a **premise** or **response** (if indented within an objection).
    *   `-`: Identifies an **objection**. Supports `[Objection to: ...]` syntax for explicit targeting in the visualizer.
    *   `=`: Identifies a **conclusion**.
*   **Persistent Content:** Your editor content is automatically saved to `localStorage` in your browser, ensuring your work is preserved even if you close the tab.
*   **Interactive Linking:** Editor lines are assigned unique `data-argus-id` attributes, allowing the visualizer to link back to the exact text.

### 📊 Dynamic Argument Visualizer
*   **Instant Mapping:** As you type and structure your arguments in the editor, a visual map (`#visualizer`) is generated and updated in real-time.
*   **Hierarchical Structure:**
    *   `H1` elements become top-level **Argument Cards**, defining distinct argument threads.
    *   Premises, conclusions, objections, and responses are rendered as distinct blocks within these cards.
    *   `blockquote` indentation from the editor is accurately reflected as nested visual elements, creating clear objection/response threads.
*   **Semantic Styling:** Different argument types are visually distinct:
    *   **Premise:** Blue left border.
    *   **Conclusion:** Yellow left border with a yellow background tint.
    *   **Objection:** Red left border with a red background tint. Explicit objection targets are highlighted.
    *   **Response:** Green left border with a green background tint.
*   **Bidirectional Navigation:** Click any argument block in the visualizer to smoothly scroll to its corresponding line in the text editor, which will briefly highlight for easy identification.

### 🧰 Integrated Toolbox
The toolbox provides quick access to frequently used elements in logical and mathematical discourse.

#### **Definitions (Custom Variables)**
*   **Define Custom Terms:** Easily define your own variables or shorthand terms (e.g., `D: Aggregate Demand`).
*   **Quick Insertion:** Click on a defined variable's "key" to insert it into your editor as a highlighted `<span class="highlight-variable">`.
*   **Persistent Definitions:** Your custom definitions are managed in-memory (per session), ensuring easy reuse.
*   **Deletion:** Remove definitions you no longer need.

#### **Symbols (Logical & Mathematical)**
*   **Extensive Collection:** A grid of pre-defined logical, mathematical, and specialized symbols loaded from `symbols.json`.
*   **Category Filtering:** Filter symbols by main categories like "Classical Logic", "Predicate Logic", "Set Theory", "Modal Logic", "Calculus", and "Probability & Statistics".
*   **Interactive Tooltips:** Hover over any symbol card to see:
    *   The symbol itself
    *   Its full name
    *   Detailed meaning/description
    *   A practical example of its use (if available)
*   **One-Click Insertion:** Click on any symbol card to instantly insert the symbol into your editor as a highlighted `<span class="highlight-symbol">`.

### 🎛️ Resizable Panels
*   **Flexible Layout:** Easily adjust the width of the editor, visualizer, and toolbox panels using draggable resizer bars (`#resizer-left`, `#resizer-right`).
*   **Responsive Design:** Adapts to different screen sizes, providing a stacked layout on smaller screens.

### 📤 Export Functionality
*   **Image Export:** Export your entire argument map from the visualizer as a high-resolution PNG image, perfect for sharing or presentations. (Uses `html2canvas.js`).
*   **Markdown Export:** (Planned Feature) Future versions will allow exporting your structured argument content to Markdown format.

## 🚀 Getting Started

To run Argus Pro locally, you only need a web browser!

### Prerequisites
*   A modern web browser (e.g., Chrome, Firefox, Edge, Safari).

### Installation
1.  **Download:** Clone this repository or download the ZIP file.
    ```bash
    git clone https://github.com/your-username/argus-pro.git
    cd argus-pro
    ```
2.  **File Structure:** Ensure you have the following files in the same directory:
    ```
    argus-pro/
    ├── index.html
    ├── style.css
    ├── script.js
    └── symbols.json
    ```
    (Note: `html2canvas.min.js` is loaded via CDN, so no local download is required for it).

### Running the Application
1.  Navigate to the `argus-pro` directory.
2.  Open `index.html` in your web browser.

That's it! The application will load immediately, and your previous content (if any) will be restored from local storage.

## 💡 Usage Guide

### The Editor Panel (Left)
*   **Start Writing:** Begin typing your arguments.
*   **Structure with Prefixes:**
    *   For a premise or general statement: Start a new paragraph with `+` (e.g., `+ This is a strong premise.`).
    *   For a conclusion: Start a new paragraph with `=` (e.g., `= Therefore, this is the conclusion.`).
    *   For an objection: Start a new paragraph with `-` (e.g., `- [Objection to: Premise 1] This is an objection.`).
    *   For a response to an objection: Indent with `Tab` (or use `<blockquote>`) and start with `+` (e.g., `<blockquote><p>+ This is a response to the objection.</p></blockquote>`).
*   **Formatting:** Use the toolbar buttons for bold, italic, headings (H1, H2, H3, P), unordered lists, indent, and outdent.
*   **Symbol/Variable Insertion:** Place your cursor where you want to insert a symbol or variable, then use the Toolbox (right panel) to insert.

### The Visualizer Panel (Middle)
*   **Real-time Updates:** Watch your argument map grow and change as you type.
*   **Navigation:** Click on any statement, objection, or response block in the visualizer to automatically scroll to its corresponding text in the editor.
*   **Export:** Use the "Export Image" button in the export bar above the visualizer to save your map as a PNG.

### The Toolbox Panel (Right)
*   **Symbols:**
    *   Click "All" or a category button to filter symbols.
    *   Hover over a symbol for its details in the tooltip.
    *   Click a symbol to insert it into the editor at your cursor's position.
*   **Definitions:**
    *   In the input field, type `KEY: Value` (e.g., `D: Aggregate Demand`) and click "Define" or press `Enter`.
    *   Click on the `KEY` of a defined variable in the list to insert it into the editor.
    *   Click the `×` button next to a definition to remove it.

### Resizing Panels
*   **Drag & Drop:** Click and drag the vertical gray bars (`resizer-left`, `resizer-right`) to adjust the width of the panels.

## 🛠️ Customization & Development

Argus Pro is built with standard web technologies, making it easy to understand and extend.

### Project Structure
```
├── index.html # Main application layout and structure
├── style.css # Styling for the application
├── script.js # Core logic, editor functionality, visualization, toolbox interactions
└── symbols.json # Data file containing predefined logical and mathematical symbols
```

### Technologies Used
*   **HTML5:** For content structure.
*   **CSS3:** For styling and layout (including flexbox for panels and media queries for responsiveness).
*   **JavaScript (ES6+):** For all interactive logic and DOM manipulation.
*   **`html2canvas` (CDN):** A JavaScript library used to take screenshots of web pages or parts of pages, enabling the image export feature.
*   **`localStorage`:** Browser API used for client-side data persistence (editor content).

### Key JavaScript Functions (`script.js`)

*   **`initialize()`**: The main entry point, loads data, sets up all UI components.
*   **`getFallbackData()`**: Provides default symbols if `symbols.json` fails to load.
*   **`parseEditorContent()`**: Reads the `contenteditable` editor's HTML, interprets headings, prefixes (`+`, `-`, `=`), and `<blockquote>` elements to build a structured JavaScript object representing the argument. This is the core parsing logic.
*   **`renderVisualization(structuredData)`**: Takes the parsed argument data and dynamically builds the HTML for the `#visualizer` panel. It handles threading and linking.
*   **`updateVisualization()`**: Debounced function called on editor input, triggers parsing and rendering, and saves content to `localStorage`.
*   **`setupEditor()`**: Attaches event listeners for input, keydown (Tab), and toolbar buttons. Manages cursor selection (`lastSelectionRange`).
*   **`insertHtmlAtCursor(html)`**: A utility function to insert content at the user's last known cursor position in the `contenteditable` editor.
*   **`setupToolbox()`**: Initializes symbol rendering and definition management.
*   **`renderSymbols(symbols)`**: Populates the `#periodicGrid` with symbol cards, attaching hover and click events.
*   **`handleDefine()`**: Processes user input to add new custom definitions.
*   **`renderDefinitions()`**: Displays the list of defined variables, attaching insert and delete events.
*   **`showTooltip()`, `hideTooltip()`, `moveTooltip()`**: Manages the interactive symbol tooltip.
*   **`setupExports()`**: Attaches event listeners for export buttons.
*   **`setupResizers()` & `makeResizable()`**: Implements the draggable panel resizing functionality.

### Extending Symbols
*   **`symbols.json`**: You can easily add, remove, or modify symbols by editing this JSON file. Ensure each object has: `category`, `symbol`, `name`, `meaning`, and optionally `example`, `aliases`, `unicode`.
*   **`mainCategories` in `script.js`**: If you add new categories to `symbols.json`, remember to update the `mainCategories` array in `script.js` within `setupFilters()` to ensure filter buttons appear for them.

### Styling
*   **`style.css`**: All visual styles, colors, and layout are defined here. You can customize the look and feel of the application by modifying this file. Pay attention to `--bg-*`, `--accent-color`, and `--symbol-color` variables for quick theme changes, and `.category-*::before` rules for symbol card backgrounds.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/argus-pro/issues) or open a pull request.

## 🛣️ Planned Enhancements

*   **Full Markdown Export:** A robust feature to export the argument structure into standard Markdown format, making it highly portable.
*   **More Symbol Categories:** Expansion of the `symbols.json` with additional domains (e.g., Philosophy, Economics, Computer Science specific notations).
*   **Advanced Search/Filtering for Symbols:** A search bar and more granular filtering options for the symbol library.
*   **Undo/Redo Functionality:** For editor changes and possibly definition management.
*   **Dark Mode Toggle:** A user-selectable dark/light mode option.
*   **Saving/Loading Multiple Arguments:** Allow users to save and load different argument projects instead of just a single persistent draft.
*   **Collaboration Features:** (Ambitious) Real-time collaborative editing.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

*   Developed by Crist Yaghjian and AI

*   Uses [html2canvas](https://html2canvas.hertzen.com/) for image export.
