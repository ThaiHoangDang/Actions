const commandsData = [
    { 
        id: 'new-tab', 
        title: 'New Tab', 
        category: 'Browser', 
        aliases: ['open tab', 'create tab'], 
        shortcut: 'Ctrl T', 
        icon: 'plus',
        type: 'Command'
    },
    { 
        id: 'close-tab', 
        title: 'Close Tab', 
        category: 'Browser', 
        aliases: ['kill tab', 'exit tab'], 
        shortcut: 'Ctrl W', 
        icon: 'x',
        type: 'Command'
    },
    { 
        id: 'history', 
        title: 'History', 
        category: 'Browser', 
        aliases: ['recent', 'past'], 
        shortcut: 'Ctrl Y', 
        icon: 'clock',
        type: 'Command'
    },
    { 
        id: 'incognito', 
        title: 'Incognito Mode', 
        category: 'Browser', 
        aliases: ['private', 'secret'], 
        shortcut: 'Ctrl Shift N', 
        icon: 'ghost',
        type: 'Command'
    },
    { 
        id: 'web-search', 
        title: 'Web Search', 
        category: 'Search', 
        aliases: ['google', 'search', 'query'], 
        shortcut: '', 
        icon: 'search', 
        requiresParameter: true, 
        placeholder: 'Search the web...',
        type: 'Command'
    },
    { 
        id: 'youtube', 
        title: 'YouTube', 
        category: 'Search', 
        aliases: ['yt', 'video'], 
        shortcut: '', 
        icon: 'youtube', 
        hasSubcommands: true, 
        subcommands: [
            { id: 'yt-search', title: 'YouTube Search', icon: 'search', requiresParameter: true, placeholder: 'Search YouTube...' },
            { id: 'yt-trending', title: 'Trending Videos', icon: 'trending-up' },
            { id: 'yt-profile', title: 'My Profile', icon: 'user' },
            { id: 'yt-playlists', title: 'Playlists', icon: 'list-video' }
        ],
        type: 'Command'
    },
    { 
        id: 'gmail', 
        title: 'Gmail Compose', 
        category: 'Deep Links', 
        aliases: ['email', 'mail', 'send'], 
        shortcut: '', 
        icon: 'mail', 
        requiresParameter: true, 
        placeholder: 'To...',
        type: 'Command'
    },
    { 
        id: 'shopee', 
        title: 'Shopee Search', 
        category: 'Search', 
        aliases: ['shop', 'buy'], 
        shortcut: '', 
        icon: 'shopping-bag', 
        requiresParameter: true, 
        placeholder: 'Search Shopee...',
        type: 'Command'
    },
    { 
        id: 'coccoc-points', 
        title: 'Cốc Cốc Points', 
        category: 'Cốc Cốc Features', 
        aliases: ['points', 'rewards'], 
        shortcut: '', 
        icon: 'award',
        type: 'Command'
    },
    { 
        id: 'ask-ai', 
        title: 'Ask AI', 
        category: 'Cốc Cốc Features', 
        aliases: ['ai', 'chat', 'sidebar'], 
        shortcut: 'Ctrl /', 
        icon: 'sparkles',
        requiresParameter: true,
        placeholder: 'Ask AI anything...',
        type: 'Command'
    },
    { 
        id: 'macro-morning', 
        title: 'Morning Setup', 
        category: 'Macros', 
        aliases: ['start', 'morning', 'work'], 
        shortcut: '', 
        icon: 'sun', 
        isMacro: true,
        type: 'Macro',
        steps: [
            { title: 'New Tab', icon: 'plus' },
            { title: 'Gmail Compose', icon: 'mail' },
            { title: 'YouTube', icon: 'youtube' }
        ]
    }
];
