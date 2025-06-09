

export const mockDailyUsage = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
        {
            data: [2.5, 3.1, 4.2, 2.8, 5.0, 3.5, 2.1], // Screen time in hours
        },
    ],
};

export interface AppInfo {
    id: string;
    name: string;
    usage: string;
    icon: string;
}

export const mockTopApps: AppInfo[] = [
    { id: '1', name: 'YouTube', usage: '1 hr 45 min', icon: '▶️' },
    { id: '2', name: 'Instagram', usage: '1 hr 10 min', icon: '📸' },
    { id: '3', name: 'WhatsApp', usage: '45 min', icon: '💬' },
    { id: '4', name: 'Chrome', usage: '30 min', icon: '🌐' },
    { id: '5', name: 'FocusFlow', usage: '25 min', icon: '🎯' },
];

export const mockScreenUnlocks = 120;