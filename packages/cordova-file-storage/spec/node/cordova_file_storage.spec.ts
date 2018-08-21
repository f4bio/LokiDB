/* global describe, it, expect */
import { Loki } from "../../../loki/src";
import { CordovaFileStorage } from "../../src/cordova_file_storage";

describe("testing fs storage", function() {

  interface Name {
    name: string;
  }

  beforeAll(() => {
    CordovaFileStorage.register();
  });

  afterAll(() => {
    CordovaFileStorage.deregister();
  });

  it("LokiFSStorage", function(done) {
    const db = new Loki("myTestApp");
    const adapter = { adapter: new CordovaFileStorage() };
    db.initializePersistence(adapter)
      .then(() => {
        db.addCollection<Name>("myColl").insert({ name: "Hello World" });
        return db.saveDatabase();
      })
      .then(() => {
        const db2 = new Loki("myTestApp");
        return db2.initializePersistence()
          .then(() => {
            return db2.loadDatabase();
          }).then(() => {
            expect(db2.getCollection<Name>("myColl").find()[0].name).toEqual("Hello World");
          });
      })
      .then(() => {
        const db2 = new Loki("myTestApp");
        return db2.initializePersistence({ persistenceMethod: "cordova-file-storage" })
          .then(() => {
            return db2.loadDatabase();
          }).then(() => {
            expect(db2.getCollection<Name>("myColl").find()[0].name).toEqual("Hello World");
          });
      })
      .then(() => {
        const db3 = new Loki("other");
        return db3.initializePersistence()
          .then(() => {
            return db3.loadDatabase();
          }).then(() => {
            expect(false).toEqual(true);
          }, () => {
            expect(true).toEqual(true);
          });
      })
      .then(() => {
        return db.deleteDatabase();
      })
      .then(() => {
        return db.loadDatabase()
          .then(() => {
            expect(db.getCollection<Name>("myColl").find()[0].name).toEqual("Hello World");
            expect(false).toEqual(true);
            done();
          }, () => {
            expect(true).toEqual(true);
            done();
          });
      });
  });
});
