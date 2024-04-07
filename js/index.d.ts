declare class Storage {
    private type;
    private path;
    private keyValue;
    private mutex;
    private url;
    private database;
    constructor({ type, path, keyValue, mutex, url, database }: {
        type: string;
        path?: string;
        keyValue?: boolean;
        mutex?: boolean;
        url?: string;
        database?: string;
    });
    open(name: string): Promise<Store>;
}
declare class Store {
    private storage;
    private path;
    private keyValue;
    private mutex;
    private index;
    constructor({ type, path, keyValue, mutex, url, database }: {
        type: string;
        path?: string;
        keyValue?: boolean;
        mutex?: boolean;
        url?: string;
        database?: string;
    });
    open(name: string): Promise<void>;
    set(first: any, second?: any): Promise<void>;
    get(key: any): Promise<any>;
    getAll(): Promise<any>;
    has(key: any): Promise<boolean>;
    remove(key: any): Promise<void>;
    delete(): Promise<void>;
    _handleInputs(first: any, second: any): {
        key: any;
        value: any;
    };
    _mutex(promise: () => Promise<any>): Promise<any>;
    add: (first: any, second?: any) => Promise<void>;
    push: (first: any, second?: any) => Promise<void>;
    write: (first: any, second?: any) => Promise<void>;
    read: (key: any) => Promise<any>;
    all: () => Promise<any>;
    list: () => Promise<any>;
}

export { Storage as default };
