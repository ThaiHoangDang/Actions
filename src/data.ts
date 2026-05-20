interface CommandParameter {
    id: string;
    placeholder: string;
}

interface Subcommand {
    id: string;
    title: string;
    description: string;
    icon: string;
    parameters?: CommandParameter[];
    aliases?: string[];
}

interface Step {
    title: string;
    icon: string;
}

interface Command {
    id: string;
    title: string;
    description?: string;
    category?: string;
    aliases?: string[];
    shortcut?: string;
    icon: string;
    type?: string;
    parameters?: CommandParameter[];
    hasSubcommands?: boolean;
    subcommands?: Subcommand[];
    isMacro?: boolean;
    steps?: Step[];
}

const commandsData: Command[] = [
    {
        id: 'web-search',
        title: 'Web Search',
        description: 'Tìm kiếm web hoặc url',
        category: 'Browser',
        aliases: ['google', 'search', 'query', "tìm kiếm"],
        shortcut: '',
        icon: 'search',
        parameters: [{ id: 'query', placeholder: 'Search the web...' }],
        type: 'Command'
    },
    {
        id: 'reorder-tab',
        title: 'Reorder Tab',
        description: 'Sắp xếp lại tab',
        category: 'Browser',
        aliases: [],
        shortcut: '',
        icon: 'arrow-left-right',
        type: 'Command'
    },
    {
        id: 'new-tab',
        title: 'New Tab',
        description: 'Mở tab mới',
        category: 'Browser',
        aliases: ['open tab', 'create tab', 'mở tab mới'],
        shortcut: 'Ctrl T',
        icon: 'plus',
        type: 'Command'
    },
    {
        id: 'close-tab',
        title: 'Close Tab',
        description: 'Đóng tab hiện tại',
        category: 'Browser',
        aliases: ['kill tab', 'exit tab', 'đóng tab'],
        shortcut: 'Ctrl W',
        icon: 'x',
        type: 'Command'
    },
    {
        id: 'print-screen',
        title: 'Print Screen',
        description: 'Chụp màn hình',
        category: 'Browser',
        aliases: ['chụp màn hình'],
        shortcut: '',
        icon: 'camera',
        hasSubcommands: true,
        subcommands: [
            { id: 'print-screen-full', title: 'Chụp vùng chọn', description: 'Chọn vùng để chụp', icon: 'camera' },
            { id: 'print-screen-area', title: 'Chụp phần hiển thị', description: 'Chụp phần trang web đang hiển thị', icon: 'camera' },
            { id: 'print-screen-window', title: 'Chụp toàn bộ trang', description: 'Chụp từ trên xuống dưới', icon: 'camera' },
        ],
        type: 'Command'
    },
    {
        id: 'history',
        title: 'History',
        description: 'Xem lịch sử duyệt web',
        category: 'Browser',
        aliases: ['recent', 'past'],
        shortcut: 'Ctrl Y',
        icon: 'clock',
        type: 'Command'
    },
    {
        id: 'incognito',
        title: 'Incognito Mode',
        description: 'Mở cửa sổ ẩn danh',
        category: 'Browser',
        aliases: ['private', 'secret'],
        shortcut: 'Ctrl Shift N',
        icon: 'ghost',
        type: 'Command'
    },
    {
        id: 'youtube',
        title: 'YouTube',
        description: 'Các tính năng với Youtube',
        category: 'Apps',
        aliases: ['yt', 'video'],
        shortcut: '',
        icon: 'video',
        hasSubcommands: true,
        subcommands: [
            { id: 'yt-search', title: 'YouTube Search', description: 'Tìm kiếm video', icon: 'search', parameters: [{ id: 'query', placeholder: 'Search YouTube...' }] },
            { id: 'yt-trending', title: 'Trending Videos', description: 'Xem video thịnh hành', icon: 'trending-up' },
            { id: 'yt-profile', title: 'My Profile', description: 'Xem hồ sơ YouTube của bạn', icon: 'user' },
            { id: 'yt-playlists', title: 'Playlists', description: 'Xem danh sách phát của bạn', icon: 'list-video' }
        ],
        type: 'Application'
    },
    {
        id: 'outlook',
        title: 'Outlook',
        description: 'Các tính năng với Outlook',
        category: 'Apps',
        aliases: ['email', 'mail', 'send'],
        shortcut: '',
        icon: 'mail',
        hasSubcommands: true,
        subcommands: [
            { id: 'outlook-compose', title: 'Outlook Compose', description: 'Soạn email mới trong Outlook', icon: 'mail', parameters: [{ id: 'to', placeholder: 'To...' }, { id: 'subject', placeholder: 'Subject...' }, { id: 'body', placeholder: 'Message...' }] },
            { id: 'outlook-calendar', title: 'Outlook Calendar', description: 'Xem lịch làm việc của bạn', icon: 'calendar' },
            { id: 'outlook-contacts', title: 'Outlook Contacts', description: 'Danh sách liên hệ Outlook của bạn', icon: 'users' },
            { id: 'outlook-tasks', title: 'Outlook Tasks', description: 'Danh sách công việc Outlook của bạn', icon: 'clipboard-list' }
        ],
        type: 'Application'
    },
    {
        id: 'shopee',
        title: 'Shopee',
        description: 'Các tính năng với Shopee',
        category: 'Apps',
        aliases: ['shop', 'buy'],
        shortcut: '',
        icon: 'shopping-bag',
        hasSubcommands: true,
        subcommands: [
            { id: 'shopee-search', title: 'Shopee Search', description: 'Tìm kiếm sản phẩm trên Shopee', icon: 'search', parameters: [{ id: 'query', placeholder: 'Search Shopee...' }] },
            { id: 'shopee-trending', title: 'Shopee Trending', description: 'Xem các sản phẩm thịnh hành', icon: 'trending-up' },
            { id: 'shopee-profile', title: 'My Profile', description: 'Xem hồ sơ của bạn', icon: 'user' }
        ],
        type: 'Application'
    },
    {
        id: 'coccoc-points',
        title: 'Cốc Cốc Points',
        description: 'Xem điểm Cốc Cốc của bạn',
        category: 'Cốc Cốc Features',
        aliases: ['points', 'rewards'],
        shortcut: '',
        icon: 'award',
        type: 'Command'
    },
    {
        id: 'ask-ai',
        title: 'Ask AI',
        description: 'Hỏi trợ lý AI của Cốc Cốc',
        category: 'Cốc Cốc Features',
        aliases: ['ai', 'chat', 'sidebar'],
        shortcut: 'Ctrl /',
        icon: 'sparkles',
        parameters: [{ id: 'query', placeholder: 'Ask AI anything...' }],
        type: 'Command'
    },
    {
        id: 'macro-morning',
        title: 'Morning Setup',
        description: 'Mở một chuỗi lệnh buổi sáng',
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
