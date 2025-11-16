const CACHE_PREFIX = 'prism_cache_';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

interface CachedItem<T> {
    data: T;
    timestamp: number;
}

export const saveToCache = <T>(key: string, data: T): void => {
    const item: CachedItem<T> = {
        data,
        timestamp: Date.now(),
    };
    try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch (error) {
        console.error('Error saving to cache:', error);
    }
};

export const loadFromCache = <T>(key: string): T | null => {
    try {
        const itemString = localStorage.getItem(CACHE_PREFIX + key);
        if (!itemString) {
            return null;
        }
        const item: CachedItem<T> = JSON.parse(itemString);
        if (Date.now() - item.timestamp > CACHE_DURATION_MS) {
            // Cache is stale
            localStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }
        return item.data;
    } catch (error) {
        console.error('Error loading from cache:', error);
        localStorage.removeItem(CACHE_PREFIX + key); // Clear corrupted cache
        return null;
    }
};

export const invalidateCache = (key: string): void => {
    try {
        localStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
        console.error('Error invalidating cache:', error);
    }
};

export const invalidateAllCache = (): void => {
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        }
    } catch (error) {
        console.error('Error invalidating all cache:', error);
    }
};
