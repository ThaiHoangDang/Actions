let currentCommands = [...commandsData];
let selectedIndex = 0;
let chainModeEnabled = false;
let currentChain = [];
let currentSubcommandParent = null; // null if at root
let parameterMode = null; // null or reference to command object requiring parameter
let isModalOpen = false;
let commandBeingEdited = null;

// DOM Elements
const searchInput = document.getElementById('search-input');
const suggestionList = document.getElementById('suggestion-list');
const chainToggle = document.getElementById('chain-mode-toggle');
const chainHeader = document.getElementById('chain-header');
const chainTrack = document.getElementById('chain-track');
const parameterPill = document.getElementById('parameter-pill');
const mainSearchIcon = document.getElementById('main-search-icon');
const pillIcon = document.getElementById('pill-icon');
const pillText = document.getElementById('pill-text');
const breadcrumbsContainer = document.getElementById('breadcrumbs-container');
const bcRoot = document.getElementById('bc-root');
const bcCurrent = document.getElementById('bc-current');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const saveCommandBtn = document.getElementById('save-command-btn');
const editTitle = document.getElementById('edit-title');
const editAliases = document.getElementById('edit-aliases');
const editShortcut = document.getElementById('edit-shortcut');
const saveMacroBtn = document.getElementById('save-macro-btn');
const editMacroStepsBtn = document.getElementById('edit-macro-steps-btn');
const deleteMacroBtn = document.getElementById('delete-macro-btn');

// Initialize Lucide Icons
lucide.createIcons();

// Initial Render
renderList();
searchInput.focus();

// Event Listeners
searchInput.addEventListener('input', handleSearch);
searchInput.addEventListener('keydown', handleKeyDown);
chainToggle.addEventListener('change', (e) => {
    chainModeEnabled = e.target.checked;
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

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    
    // If in parameter mode, we just collect input, no need to filter commands
    if (parameterMode) {
        return;
    }

    let listToFilter = currentSubcommandParent ? currentSubcommandParent.subcommands : commandsData;
    
    if (!query) {
        currentCommands = [...listToFilter];
    } else {
        currentCommands = listToFilter.filter(cmd => {
            const titleMatch = cmd.title.toLowerCase().includes(query);
            const aliasMatch = cmd.aliases ? cmd.aliases.some(a => a.toLowerCase().includes(query)) : false;
            return titleMatch || aliasMatch;
        });
    }
    
    selectedIndex = 0;
    renderList();
}

function handleKeyDown(e) {
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
            exitParameterMode();
        } else if (currentSubcommandParent) {
            goBackToRoot();
        }
    }
}

function executeSelected() {
    if (parameterMode) {
        const paramValue = searchInput.value.trim();
        if (chainModeEnabled) {
            addToChain(`${parameterMode.title}: ${paramValue}`, parameterMode.icon);
            exitParameterMode();
            searchInput.value = '';
            handleSearch({ target: searchInput });
        } else {
            console.log(`Executed: ${parameterMode.title} with param: ${paramValue}`);
            // Close launcher in real usage
        }
        return;
    }

    const cmd = currentCommands[selectedIndex];
    if (!cmd) return;

    if (cmd.hasSubcommands) {
        enterSubcommands(cmd);
    } else if (cmd.requiresParameter) {
        enterParameterMode(cmd);
    } else {
        if (chainModeEnabled) {
            addToChain(cmd.title, cmd.icon);
            searchInput.value = '';
            handleSearch({ target: searchInput });
        } else {
            console.log(`Executed: ${cmd.title}`);
            // Close launcher in real usage
        }
    }
}

function enterSubcommands(cmd) {
    currentSubcommandParent = cmd;
    currentCommands = [...cmd.subcommands];
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

function enterParameterMode(cmd) {
    parameterMode = cmd;
    searchInput.value = '';
    searchInput.placeholder = cmd.placeholder || "Enter value...";
    
    // Show pill
    parameterPill.classList.remove('hidden');
    mainSearchIcon.classList.add('hidden');
    
    pillText.textContent = cmd.title;
    pillIcon.setAttribute('data-lucide', cmd.icon);
    lucide.createIcons();
}

function exitParameterMode() {
    parameterMode = null;
    searchInput.value = '';
    searchInput.placeholder = "Search websites, browser features, settings, and more";
    
    parameterPill.classList.add('hidden');
    mainSearchIcon.classList.remove('hidden');
    
    handleSearch({ target: searchInput });
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
        handleSearch({ target: searchInput });
    }
    
    searchInput.focus();
}

function addToChain(title, iconName) {
    currentChain.push({ title, icon: iconName });
    updateChainUI();
}

function deleteMacro(id) {
    const index = commandsData.findIndex(c => c.id === id);
    if (index > -1) {
        commandsData.splice(index, 1);
        handleSearch({ target: searchInput });
        closeSettingsModal();
    }
}

function editMacro(id) {
    const index = commandsData.findIndex(c => c.id === id);
    if (index > -1) {
        const macro = commandsData[index];
        commandsData.splice(index, 1);
        currentChain = [...macro.steps];
        chainModeEnabled = true;
        chainToggle.checked = true;
        updateChainUI();
        searchInput.value = '';
        handleSearch({ target: searchInput });
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
                <i data-lucide="${item.icon}"></i>
                <span>${item.title}</span>
            `;
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

function groupCommands(commands) {
    return commands.reduce((acc, cmd) => {
        const cat = cmd.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(cmd);
        return acc;
    }, {});
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

            cmds.forEach(cmd => {
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

function createSuggestionElement(cmd, index) {
    const el = document.createElement('div');
    el.className = `suggestion-item ${index === selectedIndex ? 'selected' : ''}`;
    el.setAttribute('data-index', index);
    
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
            ${cmd.aliases && cmd.aliases.length > 0 ? `<span class="item-subtitle">${cmd.aliases.join(', ')}</span>` : ''}
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
        if (parseInt(item.getAttribute('data-index')) === selectedIndex) {
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
