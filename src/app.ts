declare const lucide: any;

let currentCommands: Command[] = [...commandsData];
let selectedIndex = 0;
let chainModeEnabled = false;
let currentChain: any[] = [];
let currentSubcommandParent: Command | null = null; // null if at root
let parameterMode: Command | null = null; // null or reference to command object requiring parameter
let currentParameterIndex = 0;
let collectedParameters: string[] = [];
let isModalOpen = false;
let commandBeingEdited: Command | null = null;
let chainItemBeingEditedIndex = -1;

// DOM Elements
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const suggestionList = document.getElementById('suggestion-list') as HTMLDivElement;
const chainToggle = document.getElementById('chain-mode-toggle') as HTMLInputElement;
const chainHeader = document.getElementById('chain-header') as HTMLDivElement;
const chainTrack = document.getElementById('chain-track') as HTMLDivElement;
const parameterPillsContainer = document.getElementById('parameter-pills-container') as HTMLDivElement;
const mainSearchIcon = document.getElementById('main-search-icon') as HTMLElement;
const breadcrumbsContainer = document.getElementById('breadcrumbs-container') as HTMLDivElement;
const bcRoot = document.getElementById('bc-root') as HTMLSpanElement;
const bcCurrent = document.getElementById('bc-current') as HTMLSpanElement;
const settingsModal = document.getElementById('settings-modal') as HTMLDivElement;
const closeModalBtn = document.getElementById('close-modal-btn') as HTMLButtonElement;
const saveCommandBtn = document.getElementById('save-command-btn') as HTMLButtonElement;
const editTitle = document.getElementById('edit-title') as HTMLInputElement;
const editAliases = document.getElementById('edit-aliases') as HTMLInputElement;
const editShortcut = document.getElementById('edit-shortcut') as HTMLInputElement;
const saveMacroBtn = document.getElementById('save-macro-btn') as HTMLButtonElement;
const editMacroStepsBtn = document.getElementById('edit-macro-steps-btn') as HTMLButtonElement;
const deleteMacroBtn = document.getElementById('delete-macro-btn') as HTMLButtonElement;
const chainItemModal = document.getElementById('chain-item-modal') as HTMLDivElement;
const closeChainItemBtn = document.getElementById('close-chain-item-btn') as HTMLButtonElement;
const chainItemDetails = document.getElementById('chain-item-details') as HTMLDivElement;
const deleteChainItemBtn = document.getElementById('delete-chain-item-btn') as HTMLButtonElement;

// Initialize Lucide Icons
lucide.createIcons();

// Initial Render
renderList();
searchInput.focus();

// Event Listeners
searchInput.addEventListener('input', handleSearch);
document.addEventListener('keydown', handleKeyDown);

// Keep search input focused when clicking non-interactive areas
document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!isModalOpen && target.tagName !== 'INPUT' && !target.closest('.icon-btn') && !target.closest('.switch') && !target.closest('.suggestion-item')) {
        searchInput.focus();
    }
});

// Auto-focus search input if the user starts typing letters outside the input
document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!isModalOpen && document.activeElement !== searchInput && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        searchInput.focus();
    }
});
chainToggle.addEventListener('change', (e: Event) => {
    chainModeEnabled = (e.target as HTMLInputElement).checked;
    if (!chainModeEnabled) {
        currentChain = [];
        updateChainUI();
    }
    searchInput.focus();
});
bcRoot.addEventListener('click', goBackToRoot);
closeModalBtn.addEventListener('click', closeSettingsModal);
saveCommandBtn.addEventListener('click', saveCommandSettings);
saveMacroBtn.addEventListener('click', saveChainAsMacro);
editMacroStepsBtn.addEventListener('click', () => {
    if (commandBeingEdited) editMacro(commandBeingEdited.id);
});
deleteMacroBtn.addEventListener('click', () => {
    if (commandBeingEdited) deleteMacro(commandBeingEdited.id);
});
closeChainItemBtn.addEventListener('click', closeChainItemModal);
deleteChainItemBtn.addEventListener('click', deleteChainItem);

function handleSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    const query = target.value.toLowerCase();
    
    // If in parameter mode, we just collect input, no need to filter commands
    if (parameterMode) {
        return;
    }

    let listToFilter = (currentSubcommandParent ? currentSubcommandParent.subcommands : commandsData) || [];
    
    if (!query) {
        currentCommands = [...listToFilter] as Command[];
    } else {
        currentCommands = listToFilter.filter((cmd: any) => {
            const titleMatch = cmd.title.toLowerCase().includes(query);
            const aliasMatch = cmd.aliases ? cmd.aliases.some((a: string) => a.toLowerCase().includes(query)) : false;
            return titleMatch || aliasMatch;
        });
    }
    
    selectedIndex = 0;
    renderList();
}

function handleKeyDown(e: KeyboardEvent) {
    if (isModalOpen) {
        if (e.key === 'Escape') {
            closeSettingsModal();
        } else if (e.key === 'Enter') {
            saveCommandSettings();
        }
        return;
    }
    
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        openSettingsModal();
        return;
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, currentCommands.length - 1);
        updateSelection();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelection();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        executeSelected();
    } else if (e.key === 'Escape') {
        e.preventDefault();
        if (parameterMode) {
            exitParameterMode();
        } else if (currentSubcommandParent) {
            goBackToRoot();
        } else {
            console.log("Close Launcher");
            // Here you would trigger the mechanism to close the overlay
        }
    } else if (e.key === 'Backspace' && searchInput.value === '') {
        if (parameterMode) {
            if (currentParameterIndex > 0) {
                currentParameterIndex--;
                const lastVal = collectedParameters.pop() || '';
                updateParameterUI();
                searchInput.value = lastVal;
            } else {
                exitParameterMode();
            }
        } else if (currentSubcommandParent) {
            goBackToRoot();
        }
    }
}

function executeSelected() {
    if (parameterMode) {
        const paramValue = searchInput.value.trim();
        if (paramValue) {
            collectedParameters.push(paramValue);
            
            if (parameterMode && parameterMode.parameters && currentParameterIndex < parameterMode.parameters.length - 1) {
                currentParameterIndex++;
                updateParameterUI();
                return;
            }
            
            if (chainModeEnabled) {
                addToChain(parameterMode, [...collectedParameters]);
                exitParameterMode();
                searchInput.value = '';
                handleSearch({ target: searchInput } as unknown as Event);
            } else {
                console.log(`Executed: ${parameterMode.title} with params:`, collectedParameters);
                // Close launcher in real usage
            }
            return;
        }
        return;
    }

    const cmd = currentCommands[selectedIndex];
    if (!cmd) return;

    if (cmd.hasSubcommands) {
        enterSubcommands(cmd);
    } else if (cmd.parameters && cmd.parameters.length > 0) {
        enterParameterMode(cmd);
    } else {
        if (chainModeEnabled) {
            addToChain(cmd);
            searchInput.value = '';
            handleSearch({ target: searchInput } as unknown as Event);
        } else {
            console.log(`Executed: ${cmd.title}`);
            // Close launcher in real usage
        }
    }
}

function enterSubcommands(cmd: Command) {
    currentSubcommandParent = cmd;
    currentCommands = [...(cmd.subcommands || [])] as Command[];
    selectedIndex = 0;
    searchInput.value = '';
    
    // Update UI
    breadcrumbsContainer.classList.remove('hidden');
    bcCurrent.textContent = cmd.title;
    
    renderList();
}

function goBackToRoot() {
    currentSubcommandParent = null;
    currentCommands = [...commandsData];
    selectedIndex = 0;
    searchInput.value = '';
    
    breadcrumbsContainer.classList.add('hidden');
    
    renderList();
    searchInput.focus();
}

function enterParameterMode(cmd: Command) {
    parameterMode = cmd;
    currentParameterIndex = 0;
    collectedParameters = [];
    
    updateParameterUI();
}

function updateParameterUI() {
    if (!parameterMode || !parameterMode.parameters) return;
    const currentParam = parameterMode.parameters[currentParameterIndex];
    searchInput.value = '';
    searchInput.placeholder = currentParam.placeholder || "Enter value...";
    
    mainSearchIcon.classList.add('hidden');
    parameterPillsContainer.classList.remove('hidden');
    
    let pillsHTML = `
        <div class="parameter-pill">
            <span class="pill-icon-container">
                <i data-lucide="${parameterMode.icon}" class="pill-icon"></i>
            </span>
            <span id="pill-text">${parameterMode.title}</span>
        </div>
    `;
    
    for (let val of collectedParameters) {
        pillsHTML += `<div class="parameter-value-pill">${val}</div>`;
    }
    
    parameterPillsContainer.innerHTML = pillsHTML;
    lucide.createIcons();
}

function exitParameterMode() {
    parameterMode = null;
    currentParameterIndex = 0;
    collectedParameters = [];
    searchInput.value = '';
    searchInput.placeholder = "Search websites, browser features, settings, and more";
    
    parameterPillsContainer.classList.add('hidden');
    parameterPillsContainer.innerHTML = '';
    mainSearchIcon.classList.remove('hidden');
    
    handleSearch({ target: searchInput } as unknown as Event);
}

function openSettingsModal() {
    if (parameterMode) return;
    const cmd = currentCommands[selectedIndex];
    if (!cmd) return;
    
    commandBeingEdited = cmd;
    editTitle.value = cmd.title || '';
    editAliases.value = cmd.aliases ? cmd.aliases.join(', ') : '';
    editShortcut.value = cmd.shortcut || '';
    
    if (cmd.isMacro) {
        editMacroStepsBtn.classList.remove('hidden');
        deleteMacroBtn.classList.remove('hidden');
    } else {
        editMacroStepsBtn.classList.add('hidden');
        deleteMacroBtn.classList.add('hidden');
    }
    
    settingsModal.classList.remove('hidden');
    isModalOpen = true;
    editTitle.focus();
}

function closeSettingsModal() {
    settingsModal.classList.add('hidden');
    isModalOpen = false;
    commandBeingEdited = null;
    searchInput.focus();
}

function saveCommandSettings() {
    if (!commandBeingEdited) return;
    
    commandBeingEdited.title = editTitle.value.trim();
    const aliasesRaw = editAliases.value.trim();
    commandBeingEdited.aliases = aliasesRaw ? aliasesRaw.split(',').map(s => s.trim()) : [];
    commandBeingEdited.shortcut = editShortcut.value.trim();
    
    closeSettingsModal();
    renderList();
}

function saveChainAsMacro() {
    if (currentChain.length === 0) return;
    const macroName = prompt("Enter a name for this macro:", "New Macro");
    if (!macroName) return;
    
    const newMacro = {
        id: 'macro-' + Date.now(),
        title: macroName,
        category: 'Macros',
        aliases: [],
        shortcut: '',
        icon: 'layers',
        isMacro: true,
        type: 'Macro',
        steps: [...currentChain]
    };
    
    commandsData.push(newMacro);
    
    currentChain = [];
    chainToggle.checked = false;
    chainModeEnabled = false;
    updateChainUI();
    
    if (!currentSubcommandParent && searchInput.value === '') {
        currentCommands = [...commandsData];
        renderList();
    } else {
        handleSearch({ target: searchInput } as unknown as Event);
    }
    
    searchInput.focus();
}

function addToChain(cmd: Command, params: string[] = []) {
    currentChain.push({ 
        id: cmd.id || 'unknown', 
        title: cmd.title, 
        icon: cmd.icon, 
        params: params 
    });
    updateChainUI();
}

function deleteMacro(id: string) {
    const index = commandsData.findIndex(c => c.id === id);
    if (index > -1) {
        commandsData.splice(index, 1);
        handleSearch({ target: searchInput } as unknown as Event);
        closeSettingsModal();
    }
}

function editMacro(id: string) {
    const index = commandsData.findIndex(c => c.id === id);
    if (index > -1) {
        const macro = commandsData[index];
        commandsData.splice(index, 1);
        currentChain = [...(macro.steps || [])];
        chainModeEnabled = true;
        chainToggle.checked = true;
        updateChainUI();
        searchInput.value = '';
        handleSearch({ target: searchInput } as unknown as Event);
        closeSettingsModal();
    }
}

function updateChainUI() {
    if (currentChain.length > 0) {
        chainHeader.classList.remove('hidden');
        chainTrack.innerHTML = '';
        currentChain.forEach((item, index) => {
            const block = document.createElement('div');
            block.className = 'chain-block';
            block.innerHTML = `
                <span>${item.title}</span>
            `;
            block.onclick = () => openChainItemModal(index);
            chainTrack.appendChild(block);
            
            if (index < currentChain.length - 1) {
                const arrow = document.createElement('i');
                arrow.setAttribute('data-lucide', 'arrow-right');
                arrow.className = 'chain-arrow';
                chainTrack.appendChild(arrow);
            }
        });
        lucide.createIcons();
    } else {
        chainHeader.classList.add('hidden');
    }
}

function groupCommands(commands: Command[]) {
    return commands.reduce((acc: any, cmd: Command) => {
        const cat = cmd.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(cmd);
        return acc;
    }, {});
}

function findCommandById(id: string) {
    for (let cmd of commandsData) {
        if (cmd.id === id) return cmd;
        if (cmd.subcommands) {
            const sub = cmd.subcommands.find(c => c.id === id);
            if (sub) return sub;
        }
    }
    return null;
}

function openChainItemModal(index: number) {
    const item = currentChain[index];
    if (!item) return;

    chainItemBeingEditedIndex = index;
    const cmd = findCommandById(item.id);

    let detailsHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div class="item-icon">
                <i data-lucide="${item.icon}"></i>
            </div>
            <span style="font-size: 16px; font-weight: 600; color: var(--text-primary);">${item.title}</span>
        </div>
    `;

    if (item.params && item.params.length > 0) {
        item.params.forEach((paramValue: string, i: number) => {
            let label = `Parameter ${i + 1}`;
            if (cmd && cmd.parameters && cmd.parameters[i]) {
                label = cmd.parameters[i].placeholder || label;
                if (label.endsWith('...')) label = label.slice(0, -3);
            }
            
            detailsHTML += `
                <div class="chain-detail-row">
                    <span class="chain-detail-label">${label}</span>
                    <span class="chain-detail-value">${paramValue}</span>
                </div>
            `;
        });
    } else {
        detailsHTML += `<div style="color: var(--text-tertiary); font-size: 13px;">This action has no parameters.</div>`;
    }

    chainItemDetails.innerHTML = detailsHTML;
    lucide.createIcons();
    
    chainItemModal.classList.remove('hidden');
    isModalOpen = true;
}

function closeChainItemModal() {
    chainItemModal.classList.add('hidden');
    isModalOpen = false;
    chainItemBeingEditedIndex = -1;
    searchInput.focus();
}

function deleteChainItem() {
    if (chainItemBeingEditedIndex > -1) {
        currentChain.splice(chainItemBeingEditedIndex, 1);
        updateChainUI();
        closeChainItemModal();
    }
}

function renderList() {
    suggestionList.innerHTML = '';
    
    if (currentCommands.length === 0) {
        suggestionList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-tertiary);">No results found</div>';
        return;
    }

    // Only group if we are at root
    if (!currentSubcommandParent) {
        const grouped = groupCommands(currentCommands);
        let globalIndex = 0;

        for (const [category, cmds] of Object.entries(grouped)) {
            const catLabel = document.createElement('div');
            catLabel.className = 'category-label';
            catLabel.textContent = category;
            suggestionList.appendChild(catLabel);

            (cmds as Command[]).forEach((cmd: Command) => {
                const el = createSuggestionElement(cmd, globalIndex);
                suggestionList.appendChild(el);
                globalIndex++;
            });
        }
    } else {
        currentCommands.forEach((cmd, index) => {
            const el = createSuggestionElement(cmd, index);
            suggestionList.appendChild(el);
        });
    }

    lucide.createIcons();
    scrollToSelection();
}

function createSuggestionElement(cmd: Command, index: number) {
    const el = document.createElement('div');
    el.className = `suggestion-item ${index === selectedIndex ? 'selected' : ''}`;
    el.setAttribute('data-index', index.toString());
    
    el.onclick = () => {
        selectedIndex = index;
        executeSelected();
    };

    let shortcutHTML = '';
    if (cmd.shortcut) {
        const keys = cmd.shortcut.split(' ').map(k => `<kbd>${k}</kbd>`).join('');
        shortcutHTML = `<div class="shortcut">${keys}</div>`;
    }

    el.innerHTML = `
        <div class="item-icon ${cmd.isMacro ? 'macro' : ''}">
            <i data-lucide="${cmd.icon}"></i>
        </div>
        <div class="item-content">
            <span class="item-title">${cmd.title}</span>
            ${cmd.description ? `<span class="item-subtitle">${cmd.description}</span>` : ''}
        </div>
        <div class="item-right">
            ${shortcutHTML}
            <span class="item-action-type">${cmd.type || 'Command'}</span>
        </div>
    `;
    return el;
}

function updateSelection() {
    const items = document.querySelectorAll('.suggestion-item');
    items.forEach(item => {
        if (parseInt(item.getAttribute('data-index') || '-1') === selectedIndex) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    scrollToSelection();
}

function scrollToSelection() {
    const container = document.getElementById('suggestion-list-container');
    const selected = document.querySelector('.suggestion-item.selected');
    
    if (container && selected) {
        const containerRect = container.getBoundingClientRect();
        const selectedRect = selected.getBoundingClientRect();
        
        // Number of pixels to maintain as a buffer (e.g., height of ~2 items)
        const buffer = selectedRect.height * 2;
        
        if (selectedRect.bottom + buffer > containerRect.bottom) {
            container.scrollTop += (selectedRect.bottom + buffer) - containerRect.bottom;
        } else if (selectedRect.top - buffer < containerRect.top) {
            container.scrollTop -= containerRect.top - (selectedRect.top - buffer);
        }
    }
}
