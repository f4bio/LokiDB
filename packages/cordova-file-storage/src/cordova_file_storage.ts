import { PLUGINS } from "../../common/plugin";
import { StorageAdapter } from "../../common/types";

/**
 * A loki persistence adapter which persists using cordova file module.
 */
export class CordovaFileStorage implements StorageAdapter {
  options: any = {};

  constructor() {
  }

  /**
   * Registers the fs storage as plugin.
   */
  static register(): void {
    PLUGINS["CordovaFileStorage"] = CordovaFileStorage;
  }

  /**
   * Deregisters the fs storage as plugin.
   */
  static deregister(): void {
    delete PLUGINS["CordovaFileStorage"];
  }

  /**
   * Load data from file, will throw an error if the file does not exist
   * @param {string} dbname - the filename of the database to load
   * @returns {Promise} a Promise that resolves after the database was loaded
   */
  loadDatabase(dbname: string): Promise<any> {
    // console.log("loadDatabase");
    return new Promise((resolve, reject) => {
      const err = dbname;
      if (err) {
        reject(err);
      } else {
        resolve();
      }

      // console.log(this._file(dbname));
      //   this._file(dbname, (fileEntry) => {
      //       fileEntry.file((file) => {
      //         var reader = new FileReader();
      //         reader.onloadend = (event) => {
      //           var contents = event.target.result;
      //           if (contents.length === 0) {
      //             console.warn(TAG, "couldn't find database");
      //             callback(null);
      //           }
      //           else {
      //             callback(contents);
      //           }
      //         };
      //         reader.readAsText(file);
      //       }, (err) => {
      //         console.error(TAG, "error reading file", err);
      //         callback(new LokiCordovaFSAdapterError("Unable to read file" + err.message));
      //       });
      //     },
      //     (err) => {
      //       console.error(TAG, "error getting file", err);
      //       callback(new LokiCordovaFSAdapterError("Unable to get file: " + err.message));
      //     });
    });
  }

  /**
   * Save data to file, will throw an error if the file can't be saved
   * might want to expand this to avoid dataloss on partial save
   * @param {string} dbname - the filename of the database to load
   * @param dbstring
   * @returns {Promise} a Promise that resolves after the database was persisted
   */
  saveDatabase(dbname: string, dbstring: string): Promise<void> {
    // console.log("saveDatabase");
    const tmpdbname = dbname + "~";
    return new Promise((resolve, reject) => {
      // this._file.writeFile(tmpdbname, dbstring, (err) => {
      const err = [dbname, dbstring];
      if (err) {
        reject(err);
      } else {
        // fs.rename(tmpdbname, dbname, (err) => {
        const err = tmpdbname;
        if (err) {
          reject(err);
        } else {
          resolve();
        }
        // });
      }
      // });
    }) as any as Promise<void>;
  }

  /**
   * Delete the database file, will throw an error if the
   * file can't be deleted
   * @param {string} dbname - the filename of the database to delete
   * @returns {Promise} a Promise that resolves after the database was deleted
   */
  deleteDatabase(dbname: string): Promise<void> {
    // console.log("deleteDatabase");
    return new Promise((resolve, reject) => {
      // this._file.unlink(dbname, function deleteDatabaseCallback(err) {
      const err = dbname;
      if (err) {
        reject(err);
      } else {
        this._file(dbname);
        resolve();
      }
    });
    // });
  }

  private _file(name: string) {
    // console.log("_file", (<any>window)["cordova"]);
    return (<any> window).resolveLocalFileSystemURL(
      (<any> window)["cordova"].file.dataDirectory, (dir: any) => {
        let fileName = this.options.prefix + "__" + name;
        dir.getFile(fileName, { create: true });
      }, (err: any) => {
        throw new Error(
          "Unable to resolve local file system URL" + JSON.stringify(err)
        );
      }
    );
  }
}
