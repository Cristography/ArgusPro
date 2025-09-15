document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL STATE & ELEMENTS ---
    const editor = document.getElementById('textEditor');
    const visualizer = document.getElementById('visualizer');
    const periodicGrid = document.getElementById('periodicGrid');
    const symbolFilters = document.getElementById('symbolFilters');
    const tooltip = document.getElementById('tooltip');

    let symbolsData = [];
    const definitions = new Map();
    let lastSelectionRange = null;

    // --- INITIALIZATION ---
    const initialize = async () => {
        try {
            const response = await fetch('symbols.json');
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            symbolsData = await response.json();
        } catch (error) {
            console.error('Failed to load symbols.json, using fallback data:', error);
            symbolsData = getFallbackData();
        }

        setupFilters();
        loadContent();
        setupEditor();
        setupToolbox();
        setupResizers();
        setupExports();
        updateVisualization();
    };

    function getFallbackData() {
        return [{
            category: "Classical Logic",
            symbol: "¬",
            name: "Negation, Not",
            meaning: "The logical opposite of a statement. If P is true, ¬P is false.",
            example: "It is not raining outside."
        },
        {
            category: "Classical Logic",
            symbol: "∧",
            name: "Conjunction, And",
            meaning: "True only if both connected statements are true.",
            example: "The sun is shining and the birds are singing."
        },
        {
            category: "Modal Logic",
            symbol: "◇",
            name: "Possibility, Possibly",
            meaning: "Asserts that a statement is possibly true in some accessible world.",
            example: "It is possible that it will rain tomorrow."
        },
        {
            category: "Set Theory",
            symbol: "∈",
            name: "Element of, In",
            meaning: "An object is a member of a set.",
            example: "Canada is an element of the set of North American countries."
        }
        ];
    }

    const setupFilters = () => {
        const mainCategories = ["Classical Logic", "Predicate Logic", "Set Theory", "Modal Logic", "Calculus", "Probability & Statistics"];
        symbolFilters.innerHTML = `<button class="filter-btn active" data-category="all">All</button>`;
        mainCategories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.category = cat;
            btn.textContent = cat.replace(" & Statistics", "").replace("Classical ", "");
            symbolFilters.appendChild(btn);
        });
    };

    const loadContent = () => {
        const savedContent = typeof (Storage) !== "undefined" ? localStorage.getItem('argusProContent') : null;
        if (savedContent) {
            editor.innerHTML = savedContent;
        } else {
            editor.innerHTML = `<h1>Argument for Universal Basic Income (UBI)</h1>
<p>+ UBI provides a financial floor, reducing poverty (<span class="highlight-symbol">∴</span> improving health outcomes).</p>
<p>+ It stimulates the economy by increasing aggregate demand (<span class="highlight-variable">D</span>).</p>
<p>+ Prepares society for automation-driven job displacement for <span class="highlight-symbol">∀</span> workers.</p>
<p>= Therefore, implementing a UBI is a necessary and beneficial policy for modern economies.</p>
<blockquote><p>- [Objection to: Premise 2] UBI is too expensive and would cause massive inflation.</p></blockquote>
<blockquote><blockquote><p>+ The cost can be offset by streamlining existing welfare programs and tax reforms.</p></blockquote></blockquote>`;
        }
    };

    // --- CORE LOGIC: EDITOR PARSING & VISUALIZATION ---
    const parseEditorContent = () => {
        const argumentsList = [];
        let currentArgument = null;
        let lineCounter = 0;

        const processNode = (node) => {
            if (node.nodeType !== Node.ELEMENT_NODE || !node.textContent.trim()) return;

            node.dataset.argusId = `editor-line-${lineCounter++}`;

            if (node.tagName === 'H1') {
                if (currentArgument) argumentsList.push(currentArgument);
                currentArgument = { title: node.textContent.trim(), lines: [] };
                return;
            }

            if (!currentArgument) {
                currentArgument = { title: 'Untitled Argument', lines: [] };
            }

            const getIndentLevel = (el) => {
                let level = 0;
                let parent = el.parentElement;
                while (parent && parent !== editor) {
                    if (parent.tagName === 'BLOCKQUOTE') level++;
                    parent = parent.parentElement;
                }
                return level;
            };

            const textContent = node.textContent.trim();
            let type = 'premise';
            if (textContent.startsWith('=')) type = 'conclusion';
            else if (textContent.startsWith('-')) type = 'objection';
            else if (textContent.startsWith('+')) {
                type = getIndentLevel(node) > 0 ? 'response' : 'premise';
            }

            const contentHTML = node.innerHTML.trim().replace(/^[\+\-\=]\s*/, '');
            currentArgument.lines.push({
                indentLevel: getIndentLevel(node),
                type,
                contentHTML,
                editorId: node.dataset.argusId
            });
        };

        const processAllNodes = (container) => {
            Array.from(container.children).forEach(node => {
                if (node.tagName === 'BLOCKQUOTE') {
                    processAllNodes(node);
                } else if (['P', 'DIV', 'LI', 'H1', 'H2', 'H3'].includes(node.tagName)) {
                    processNode(node);
                }
            });
        };

        processAllNodes(editor);

        if (currentArgument) argumentsList.push(currentArgument);
        return argumentsList;
    };

    const renderVisualization = (structuredData) => {
        visualizer.innerHTML = '';
        if (!structuredData.length || (structuredData.length === 1 && !structuredData[0].lines.length)) {
            visualizer.innerHTML = `<div class="placeholder">Start writing in the editor to see your argument map.</div>`;
            return;
        }

        structuredData.forEach(argumentData => {
            const argumentCard = document.createElement('div');
            argumentCard.className = 'argument-card';
            argumentCard.innerHTML = `<h2 class="argument-title">${argumentData.title}</h2>`;
            visualizer.appendChild(argumentCard);

            const parentStack = [argumentCard];
            argumentData.lines.forEach(line => {
                while (line.indentLevel <= parentStack.length - 1 && parentStack.length > 1) {
                    parentStack.pop();
                }
                const parent = parentStack[parentStack.length - 1];
                let el;

                if (line.type === 'objection') {
                    const threadContainer = document.createElement('div');
                    threadContainer.className = 'thread-container';
                    el = document.createElement('div');
                    el.className = 'objection-item';
                    const objectionMatch = line.contentHTML.match(/\[Objection to:\s*(.*?)\]\s*(.*)/s);
                    if (objectionMatch) {
                        el.innerHTML = `<span class="objection-target">Objection to ${objectionMatch[1]}:</span> ${objectionMatch[2]}`;
                    } else {
                        el.innerHTML = line.contentHTML;
                    }
                    threadContainer.appendChild(el);
                    parent.appendChild(threadContainer);
                    parentStack.push(threadContainer);
                } else {
                    el = document.createElement('div');
                    const classMap = { premise: 'statement premise', conclusion: 'statement conclusion', response: 'response-item' };
                    el.className = classMap[line.type];
                    el.innerHTML = line.contentHTML;
                    parent.appendChild(el);
                }

                if (el) {
                    el.dataset.editorId = line.editorId;
                    el.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const targetEl = document.querySelector(`[data-argus-id="${line.editorId}"]`);
                        if (targetEl) {
                            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            targetEl.style.transition = 'background-color 0.3s ease';
                            targetEl.style.backgroundColor = 'rgba(88, 166, 255, 0.1)';
                            setTimeout(() => targetEl.style.backgroundColor = '', 1000);
                        }
                    });
                }
            });
        });
    };

    const updateVisualization = () => {
        const structuredData = parseEditorContent();
        renderVisualization(structuredData);
        if (typeof (Storage) !== "undefined") {
            try {
                localStorage.setItem('argusProContent', editor.innerHTML);
            } catch (e) {
                console.warn('Failed to save to localStorage:', e);
            }
        }
    };

    // --- SETUP FUNCTIONS ---
    const setupEditor = () => {
        let debounceTimer;
        editor.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(updateVisualization, 300);
        });

        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                document.execCommand(e.shiftKey ? 'outdent' : 'indent', false, null);
            }
        });

        document.querySelectorAll('.editor-toolbar .format-btn').forEach(button => {
            button.addEventListener('mousedown', e => {
                e.preventDefault();
                const command = button.dataset.command;
                const value = button.dataset.value || null;
                document.execCommand(command, false, value);
                editor.focus();
            });
        });

        const saveSelection = () => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (editor.contains(range.commonAncestorContainer)) {
                    lastSelectionRange = range.cloneRange();
                }
            }
        };

        editor.addEventListener('keyup', saveSelection);
        editor.addEventListener('mouseup', saveSelection);
        editor.addEventListener('focus', saveSelection);
    };

    const insertHtmlAtCursor = (html) => {
        if (!editor) return;
        editor.focus();
        let selection = window.getSelection();

        if (lastSelectionRange) {
            try {
                selection.removeAllRanges();
                selection.addRange(lastSelectionRange);
            } catch (e) {
                console.warn('Could not restore selection:', e);
            }
        }

        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const fragment = range.createContextualFragment(html);
            const spaceNode = document.createTextNode('\u00A0'); // Non-breaking space
            fragment.appendChild(spaceNode);
            range.insertNode(fragment);

            if (spaceNode) {
                range.setStartAfter(spaceNode);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }

        lastSelectionRange = window.getSelection().getRangeAt(0).cloneRange();
        updateVisualization();
    };

    const setupToolbox = () => {
        renderSymbols();

        if (symbolFilters) {
            symbolFilters.addEventListener('click', e => {
                if (e.target.classList.contains('filter-btn')) {
                    document.querySelector('.filter-btn.active')?.classList.remove('active');
                    e.target.classList.add('active');
                    const category = e.target.dataset.category;
                    const filteredSymbols = category === 'all' ? symbolsData : symbolsData.filter(s => s.category === category);
                    renderSymbols(filteredSymbols);
                }
            });
        }

        const defineBtn = document.getElementById('defineBtn');
        const definitionInput = document.getElementById('definitionInput');
        if (defineBtn) defineBtn.addEventListener('click', handleDefine);
        if (definitionInput) {
            definitionInput.addEventListener('keydown', e => {
                if (e.key === 'Enter') handleDefine();
            });
        }
        renderDefinitions();
    };

    const renderSymbols = (symbols = symbolsData) => {
        if (!periodicGrid) return;
        periodicGrid.innerHTML = '';
        const symbolsToRender = symbols.length > 0 ? symbols : symbolsData;

        symbolsToRender.forEach(symbol => {
            const card = document.createElement('div');
            const categoryClass = 'category-' + (symbol.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'default');
            card.className = `element-card ${categoryClass}`;
            card.innerHTML = `<div class="element-content"><div class="symbol">${symbol.symbol}</div><div class="name">${symbol.name.split(',')[0]}</div></div>`;

            card.addEventListener('mouseenter', e => showTooltip(e, symbol));
            card.addEventListener('mouseleave', hideTooltip);
            card.addEventListener('mousemove', moveTooltip);
            card.addEventListener('mousedown', e => {
                e.preventDefault();
                insertHtmlAtCursor(`<span class="highlight-symbol">${symbol.symbol}</span>`);
            });
            periodicGrid.appendChild(card);
        });
    };

    const handleDefine = () => {
        const input = document.getElementById('definitionInput');
        if (!input || !input.value.trim()) return;
        const parts = input.value.split(':');
        if (parts.length < 2) return;
        const key = parts[0].trim();
        const value = parts.slice(1).join(':').trim();
        if (key && value) {
            definitions.set(key, value);
            input.value = '';
            renderDefinitions();
        }
    };

    const renderDefinitions = () => {
        const list = document.getElementById('variableList');
        if (!list) return;
        list.innerHTML = '';
        if (!definitions.size) {
            list.innerHTML = `<p class="placeholder-text">Defined variables appear here.</p>`;
            return;
        }
        definitions.forEach((value, key) => {
            const item = document.createElement('div');
            item.className = 'variable-item';
            item.innerHTML = `
                <span class="variable-key" title="Click to insert">${key}</span>
                <span class="variable-value" title="${value}">${value}</span>
                <button class="delete-btn" data-key="${key}">&times;</button>`;
            item.querySelector('.variable-key').addEventListener('mousedown', e => {
                e.preventDefault();
                insertHtmlAtCursor(`<span class="highlight-variable">${key}</span>`);
            });
            item.querySelector('.delete-btn').addEventListener('click', () => {
                definitions.delete(key);
                renderDefinitions();
            });
            list.appendChild(item);
        });
    };

    const showTooltip = (e, symbol) => {
        if (!tooltip) return;
        tooltip.innerHTML = `
            <div class="tooltip-symbol">${symbol.symbol}</div>
            <div class="tooltip-name">${symbol.name}</div>
            <div class="tooltip-meaning">${symbol.meaning || symbol.description || 'No description available.'}</div>
            ${symbol.example ? `<div class="tooltip-example"><em>e.g.,</em> "${symbol.example}"</div>` : ''}
        `;
        tooltip.classList.add('show');
        moveTooltip(e);
    };

    const hideTooltip = () => {
        if (tooltip) tooltip.classList.remove('show');
    };

    const moveTooltip = (e) => {
        if (!tooltip) return;
        const tooltipRect = tooltip.getBoundingClientRect();
        const margin = 15;
        let x = e.clientX + margin;
        let y = e.clientY + margin;
        if (x + tooltipRect.width + margin > window.innerWidth) x = e.clientX - tooltipRect.width - margin;
        if (y + tooltipRect.height + margin > window.innerHeight) y = e.clientY - tooltipRect.height - margin;
        if (x < margin) x = margin;
        if (y < margin) y = margin;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    };

    const setupExports = () => {
        document.getElementById('export-image')?.addEventListener('click', () => {
            const visualizerPanelContent = document.querySelector('#visualizer-panel .content-container');
            if (visualizerPanelContent && typeof html2canvas !== 'undefined') {
                html2canvas(visualizerPanelContent, { backgroundColor: '#0d1117' })
                    .then(canvas => {
                        const link = document.createElement('a');
                        link.href = canvas.toDataURL('image/png');
                        link.download = 'argus-pro-map.png';
                        link.click();
                    }).catch(err => console.error('Export failed:', err));
            } else {
                alert('Export functionality is not available.');
            }
        });
        document.getElementById('export-markdown')?.addEventListener('click', () => alert("Markdown export is a planned feature!"));
    };

    const setupResizers = () => {
        const resizerLeft = document.getElementById('resizer-left');
        const resizerRight = document.getElementById('resizer-right');
        const editorPanel = document.getElementById('editor-panel');
        const visualizerPanel = document.getElementById('visualizer-panel');
        const toolboxPanel = document.getElementById('toolbox-panel');
        if (resizerLeft && editorPanel && visualizerPanel) makeResizable(resizerLeft, editorPanel, visualizerPanel);
        if (resizerRight && visualizerPanel && toolboxPanel) makeResizable(resizerRight, visualizerPanel, toolboxPanel);
    };

    const makeResizable = (resizer, leftEl, rightEl) => {
        let x, leftWidth;
        const onMouseMove = (e) => {
            const dx = e.clientX - x;
            const newLeftWidth = leftWidth + dx;
            const containerWidth = leftEl.parentElement.getBoundingClientRect().width;
            const rightWidth = containerWidth - newLeftWidth - resizer.offsetWidth;
            if (newLeftWidth < 350 || rightWidth < 350) return;
            leftEl.style.flex = `0 0 ${newLeftWidth}px`;
        };
        const onMouseUp = () => {
            document.body.classList.remove('resizing');
            resizer.classList.remove('active');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        resizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            x = e.clientX;
            leftWidth = leftEl.getBoundingClientRect().width;
            document.body.classList.add('resizing');
            resizer.classList.add('active');
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    };

    // --- START THE APP ---
    initialize().catch(error => console.error('Failed to initialize application:', error));
});