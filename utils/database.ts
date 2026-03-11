import * as SQLite from 'expo-sqlite';

export type MenuItem = {
    id?: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
};

const IMAGE_BASE = 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/';
const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
    db = await SQLite.openDatabaseAsync('little_lemon');
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            image TEXT,
            category TEXT
        );
    `);
}

export async function getMenuItems(): Promise<MenuItem[]> {
    if (!db) throw new Error('Database not initialized');
    return await db.getAllAsync<MenuItem>('SELECT * FROM menu;');
}

export async function saveMenuItems(items: MenuItem[]): Promise<void> {
    if (!db) throw new Error('Database not initialized');
    await db.runAsync('DELETE FROM menu;');
    for (const item of items) {
        await db.runAsync(
            'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?);',
            [item.name, item.price, item.description, item.image, item.category]
        );
    }
}

export async function fetchMenuFromAPI(): Promise<MenuItem[]> {
    const response = await fetch(API_URL);
    const json = await response.json();
    return json.menu as MenuItem[];
}

export function getImageUrl(imageFileName: string): string {
    return `${IMAGE_BASE}${imageFileName}?raw=true`;
}
