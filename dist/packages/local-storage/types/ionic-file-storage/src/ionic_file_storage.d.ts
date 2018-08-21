import { StorageAdapter } from "../../common/types";
import { Loki } from "../../loki/src";
export interface File {
    checkFile(location: string, name: string): Promise<void>;
    readAsText(location: string, name: string): Promise<string>;
    writeFile(location: string, name: string, data: string, options?: {}): Promise<any>;
    createFile(location: string, name: string, options?: {}): Promise<void>;
    removeFile(location: string, name: string, options?: {}): Promise<void>;
}
/**
 * A loki persistence adapter which persists using ionic file module.
 */
export declare class IonicFileStorage implements StorageAdapter {
    mode: string;
    private readonly dbWriteOptions;
    private readonly dbName;
    private readonly dbLocation;
    file: File;
    constructor(file: File, options?: any);
    private static log(...msg);
    private static error(...msg);
    /**
     * Registers the fs storage as plugin.
     */
    static register(): void;
    /**
     * Deregisters the fs storage as plugin.
     */
    static deregister(): void;
    /**
     * Load data from file, will throw an error if the file does not exist
     * @param {string} dbName - the filename of the database to load
     * @returns {Promise} a Promise that resolves after the database was loaded
     */
    loadDatabase(dbName: string): Promise<Loki>;
    /**
     * Save data to file, will throw an error if the file can't be saved
     * might want to expand this to avoid dataloss on partial save
     * @param {string} dbName - the filename of the database to load
     * @param dbString
     * @returns {Promise} a Promise that resolves after the database was persisted
     */
    saveDatabase(dbName: string, dbString: string): Promise<void>;
    /**
     * Save data to file, will throw an error if the file can't be saved
     * might want to expand this to avoid dataloss on partial save
     * @param {string} dbName - the filename of the database to load
     * @param {Loki} dbRef
     * @returns {Promise} a Promise that resolves after the database was persisted
     */
    exportDatabase(dbName: string, dbRef: Loki): Promise<void>;
    /**
     * Delete the database file, will throw an error if the
     * file can't be deleted
     * @param {string} dbName - the filename of the database to delete
     * @returns {Promise} a Promise that resolves after the database was deleted
     */
    deleteDatabase(dbName: string): Promise<void>;
}
