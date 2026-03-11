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

export async function filterMenuItems(
    categories: string[],
    query: string
): Promise<MenuItem[]> {
    if (!db) throw new Error('Database not initialized');

    const hasCategories = categories.length > 0;
    const hasQuery = query.trim().length > 0;

    if (!hasCategories && !hasQuery) {
        return await db.getAllAsync<MenuItem>('SELECT * FROM menu;');
    }

    if (hasCategories && !hasQuery) {
        const placeholders = categories.map(() => '?').join(', ');
        return await db.getAllAsync<MenuItem>(
            `SELECT * FROM menu WHERE category IN (${placeholders});`,
            categories
        );
    }

    if (!hasCategories && hasQuery) {
        return await db.getAllAsync<MenuItem>(
            'SELECT * FROM menu WHERE name LIKE ?;',
            [`%${query.trim()}%`]
        );
    }

    const placeholders = categories.map(() => '?').join(', ');
    return await db.getAllAsync<MenuItem>(
        `SELECT * FROM menu WHERE category IN (${placeholders}) AND name LIKE ?;`,
        [...categories, `%${query.trim()}%`]
    );
}
