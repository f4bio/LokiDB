// import { File } from "@ionic-native/file";
import { PLUGINS } from "../../common/plugin";
import { StorageAdapter } from "../../common/types";
import { Loki } from "../../loki/src";

export declare interface File {
  checkFile(location: string, name: string): Promise<void>;
  readAsText(location: string, name: string): Promise<string>;
  writeFile(location: string, name: string, data: string, options?: {}): Promise<any>;
  createFile(location: string, name: string, options?: {}): Promise<void>;
  removeFile(location: string, name: string, options?: {}): Promise<void>;
}

/**
 * A loki persistence adapter which persists using ionic file module.
 */
export class IonicFileStorage implements StorageAdapter {
  // private static readonly TAG = "IonicFileStorage";

  mode: string = "reference"; // "reference" or "basic"

  private readonly dbWriteOptions: {}; // IWriteOptions;
  private readonly dbName: string;
  private readonly dbLocation: string;

  file: File;

  constructor(file: File, options: any = {}) {
    this.file = file;
    this.dbName = options.name;
    this.dbLocation = (options.location || "cdvfile://localhost/temporary/db/");
    this.dbWriteOptions = (options.writeoptions || {
      replace: true,
      append: false,
      truncate: 0
    });
  }

  private static log(...msg: any[]) {
    // console.log(this.TAG, msg);
    return msg;
  }

  private static error(...msg: any[]) {
    // console.error(this.TAG, msg);
    return msg;
  }

  /**
   * Registers the fs storage as plugin.
   */
  static register(): void {
    PLUGINS["IonicFileStorage"] = IonicFileStorage;
  }

  /**
   * Deregisters the fs storage as plugin.
   */
  static deregister(): void {
    delete PLUGINS["IonicFileStorage"];
  }

  /**
   * Load data from file, will throw an error if the file does not exist
   * @param {string} dbName - the filename of the database to load
   * @returns {Promise} a Promise that resolves after the database was loaded
   */
  loadDatabase(dbName: string): Promise<Loki> {
    const _name = (this.dbName || dbName);
    return this.file.checkFile(this.dbLocation, _name).then(() => {
      return this.file.readAsText(this.dbLocation, _name).then((text: string) => {
        const _loki = new Loki();
        _loki.loadJSON(text);
        return _loki;
      });
    }).catch(() => {
      IonicFileStorage.error("loadDatabase", "does not exist, creating");
      return this.file.createFile(this.dbLocation, _name, true).then(() => {
        return new Loki();
      });
    });
  }

  /**
   * Save data to file, will throw an error if the file can't be saved
   * might want to expand this to avoid dataloss on partial save
   * @param {string} dbName - the filename of the database to load
   * @param dbString
   * @returns {Promise} a Promise that resolves after the database was persisted
   */
  saveDatabase(dbName: string, dbString: string): Promise<void> {
    IonicFileStorage.log("saveDatabase");
    const _name = (this.dbName || dbName);
    IonicFileStorage.log("saveDatabase:", _name, dbString.substring(0, 100));

    return this.file.writeFile(
      this.dbLocation,
      _name,
      dbString,
      this.dbWriteOptions
    );
  }

  /**
   * Save data to file, will throw an error if the file can't be saved
   * might want to expand this to avoid dataloss on partial save
   * @param {string} dbName - the filename of the database to load
   * @param {Loki} dbRef
   * @returns {Promise} a Promise that resolves after the database was persisted
   */
  exportDatabase(dbName: string, dbRef: Loki): Promise<void> {
    IonicFileStorage.log("exportDatabase");
    const _name = (this.dbName || dbName);
    IonicFileStorage.log("exportDatabase", _name,
      dbRef.serialize({ serializationMethod: "normal" }).substring(0, 100));

    return this.file.writeFile(
      this.dbLocation,
      _name,
      dbRef.serialize({ serializationMethod: "normal" }),
      this.dbWriteOptions
    );
  }

  /**
   * Delete the database file, will throw an error if the
   * file can't be deleted
   * @param {string} dbName - the filename of the database to delete
   * @returns {Promise} a Promise that resolves after the database was deleted
   */
  deleteDatabase(dbName: string): Promise<void> {
    const _name = (dbName || this.dbName);
    return this.file.removeFile(this.dbLocation, _name);
  }
}
