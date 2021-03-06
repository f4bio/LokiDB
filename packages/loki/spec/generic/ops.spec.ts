/* global describe, beforeEach, it, expect */
import { Loki } from "../../src/loki";
import { LokiOps } from "../../src/result_set";
import { Collection } from "../../src/collection";

describe("Testing operators", () => {

  interface Tree {
    text: string;
    value: string;
    id: number;
    order: number;
    parents_id: number[];
    level: number;
    open: boolean;
    checked: boolean;
  }

  let db: Loki;
  let tree: Collection<Tree>;
  let res;

  beforeEach(() => {
    db = new Loki("testOps");
    tree = db.addCollection<Tree>("tree");

    /*
			 * The following data represents a tree that should look like this:
			 *
			 ├A
			 ├B
			 └───┐
			 ├C
			 ├D
			 └───┐
			 ├E
			 ├F
			 ├G
			 └───┐
			 ├H
			 ├I
			 └───┐
			 ├J
			 ├K
			 ├L
			 ├M
			 ├N
			 └───┐
			 ├O
			 ├P
			 └───┐
			 ├Q
			 └───┐
			 ├R
			 └───┐
			 ├S
			 ├T
			 ├U
			 ├V
			 ├W
			 ├X
			 └───┐
			 ├Y
			 ├Z
			 *
			 */

    tree.insert([
      {text: "A", value: "a", id: 1, order: 1, parents_id: [], level: 0, open: true, checked: false},
      {text: "B", value: "b", id: 2, order: 2, parents_id: [], level: 0, open: true, checked: false},
      {text: "C", value: "c", id: 3, order: 3, parents_id: [2], level: 1, open: true, checked: false},
      {text: "D", value: "d", id: 4, order: 4, parents_id: [], level: 0, open: true, checked: false},
      {text: "E", value: "e", id: 5, order: 5, parents_id: [4], level: 1, open: true, checked: false},
      {text: "F", value: "f", id: 6, order: 6, parents_id: [4], level: 1, open: true, checked: false},
      {text: "G", value: "g", id: 7, order: 7, parents_id: [], level: 0, open: true, checked: false},
      {text: "H", value: "h", id: 8, order: 8, parents_id: [7], level: 1, open: true, checked: false},
      {text: "I", value: "i", id: 9, order: 9, parents_id: [7], level: 1, open: true, checked: false},
      {text: "J", value: "j", id: 10, order: 10, parents_id: [7, 9], level: 2, open: true, checked: false},
      {text: "K", value: "k", id: 11, order: 11, parents_id: [7, 9], level: 2, open: true, checked: false},
      {text: "L", value: "l", id: 12, order: 12, parents_id: [7], level: 1, open: true, checked: false},
      {text: "M", value: "m", id: 13, order: 13, parents_id: [7], level: 1, open: true, checked: false},
      {text: "N", value: "n", id: 14, order: 14, parents_id: [], level: 0, open: true, checked: false},
      {text: "O", value: "o", id: 15, order: 15, parents_id: [14], level: 1, open: true, checked: false},
      {text: "P", value: "p", id: 16, order: 16, parents_id: [14], level: 1, open: true, checked: false},
      {text: "Q", value: "q", id: 17, order: 17, parents_id: [14, 16], level: 2, open: true, checked: false},
      {text: "R", value: "r", id: 18, order: 18, parents_id: [14, 16, 17], level: 3, open: true, checked: false},
      {text: "S", value: "s", id: 19, order: 19, parents_id: [14, 16, 17, 18], level: 4, open: true, checked: false},
      {text: "T", value: "t", id: 20, order: 20, parents_id: [14, 16, 17], level: 3, open: true, checked: false},
      {text: "U", value: "u", id: 21, order: 21, parents_id: [14, 16], level: 2, open: true, checked: false},
      {text: "V", value: "v", id: 22, order: 22, parents_id: [14], level: 1, open: true, checked: false},
      {text: "W", value: "w", id: 23, order: 23, parents_id: [], level: 0, open: true, checked: false},
      {text: "X", value: "x", id: 24, order: 24, parents_id: [], level: 0, open: true, checked: false},
      {text: "Y", value: "y", id: 25, order: 25, parents_id: [24], level: 1, open: true, checked: false},
      {text: "Z", value: "z", id: 26, order: 26, parents_id: [24], level: 1, open: true, checked: false}
    ]);
  });

  it("$size works", () => {
    res = tree
      .chain()
      .find({
        "parents_id": {"$size": 4}
      });
    expect(res.data().length).toEqual(1);
    expect(res.data()[0].value).toEqual("s");
  });
});

describe("Individual operator tests", () => {

  let ops: typeof LokiOps;
  beforeEach(() => {
    ops = LokiOps;
  });

  it("$ne op works as expected", () => {
    expect(ops.$ne(15, 20)).toEqual(true);

    expect(ops.$ne(15, 15.0)).toEqual(false);

    expect(ops.$ne(0, "0")).toEqual(true);

    expect(ops.$ne(NaN, NaN)).toEqual(false);

    expect(ops.$ne("en", NaN)).toEqual(true);

    expect(ops.$ne(0, NaN)).toEqual(true);
  });

  it("misc eq ops works as expected", () => {
    expect(ops.$aeq(1, 11)).toEqual(false);
    expect(ops.$aeq(1, "1")).toEqual(true);
    expect(ops.$aeq(undefined, null)).toEqual(true);

    const dt1 = new Date();
    const dt2 = new Date();
    dt2.setTime(dt1.getTime());
    const dt3 = new Date();
    dt3.setTime(dt1.getTime() - 10000);

    expect(ops.$dteq(dt1, dt2)).toEqual(true);
    expect(ops.$dteq(dt1, dt3)).toEqual(false);
  });

  it("$type op works as expected", () => {
    expect(ops.$type("test", "string")).toEqual(true);
    expect(ops.$type(4, "number")).toEqual(true);
    expect(ops.$type({a: 1}, "object")).toEqual(true);
    expect(ops.$type(new Date(), "date")).toEqual(true);
    expect(ops.$type([1, 2], "array")).toEqual(true);

    expect(ops.$type("test", "number")).toEqual(false);
    expect(ops.$type(4, "string")).toEqual(false);
    expect(ops.$type({a: 1}, "date")).toEqual(false);
    expect(ops.$type(new Date(), "object")).toEqual(false);
    expect(ops.$type([1, 2], "number")).toEqual(false);
  });

  it("$in op works as expected", () => {
    expect(ops.$in(4, [1, 2, 3, 4])).toEqual(true);
    expect(ops.$in(7, [1, 2, 3, 4])).toEqual(false);
    expect(ops.$in("el", "hello")).toEqual(true);
    expect(ops.$in("le", "hello")).toEqual(false);
  });

  it("$between op works as expected", () => {
    expect(ops.$between(75, [5, 100])).toEqual(true);
    expect(ops.$between(75, [75, 100])).toEqual(true);
    expect(ops.$between(75, [5, 75])).toEqual(true);
    expect(ops.$between(75, [5, 74])).toEqual(false);
    expect(ops.$between(75, [76, 100])).toEqual(false);
    expect(ops.$between(null, [5, 100])).toEqual(false);
  });

  it("$between find works as expected", () => {
    // test unindexed code path
    let db = new Loki("db");

    interface User {
      name: string;
      count: number;
    }

    let coll: Collection<User> = db.addCollection<User>("coll");
    coll.insert({name: "mjolnir", count: 73});
    coll.insert({name: "gungnir", count: 5});
    coll.insert({name: "tyrfing", count: 15});
    coll.insert({name: "draupnir", count: 132});

    // simple inner between
    let results = coll.chain().find({count: {$between: [10, 80]}}).simplesort("count").data();
    expect(results.length).toEqual(2);
    expect(results[0].count).toEqual(15);
    expect(results[1].count).toEqual(73);

    // range exceeds bounds
    results = coll.find({count: {$between: [100, 200]}});
    expect(results.length).toEqual(1);
    expect(results[0].count).toEqual(132);

    // no matches in range
    expect(coll.find({count: {$between: [133, 200]}}).length).toEqual(0);
    expect(coll.find({count: {$between: [1, 4]}}).length).toEqual(0);

    // multiple low and high bounds
    db = new Loki("db");
    coll = db.addCollection<User>("coll");
    coll.insert({name: "first", count: 5});
    coll.insert({name: "mjolnir", count: 15});
    coll.insert({name: "gungnir", count: 15});
    coll.insert({name: "tyrfing", count: 75});
    coll.insert({name: "draupnir", count: 75});
    coll.insert({name: "last", count: 100});

    results = coll.chain().find({count: {$between: [15, 75]}}).simplesort("count").data();
    expect(results.length).toEqual(4);
    expect(results[0].count).toEqual(15);
    expect(results[1].count).toEqual(15);
    expect(results[2].count).toEqual(75);
    expect(results[3].count).toEqual(75);

    expect(coll.find({count: {$between: [-1, 4]}}).length).toEqual(0);
    expect(coll.find({count: {$between: [-1, 5]}}).length).toEqual(1);
    expect(coll.find({count: {$between: [-1, 6]}}).length).toEqual(1);
    expect(coll.find({count: {$between: [99, 140]}}).length).toEqual(1);
    expect(coll.find({count: {$between: [100, 140]}}).length).toEqual(1);
    expect(coll.find({count: {$between: [101, 140]}}).length).toEqual(0);
    expect(coll.find({count: {$between: [12, 76]}}).length).toEqual(4);
    expect(coll.find({count: {$between: [20, 60]}}).length).toEqual(0);

    // now test -indexed- code path
    coll.ensureRangedIndex("count");

    results = coll.chain().find({count: {$between: [15, 75]}}).simplesort("count").data();
    expect(results.length).toEqual(4);
    expect(results[0].count).toEqual(15);
    expect(results[1].count).toEqual(15);
    expect(results[2].count).toEqual(75);
    expect(results[3].count).toEqual(75);

    expect(coll.find({count: {$between: [-1, 4]}}).length).toEqual(0);
    expect(coll.find({count: {$between: [-1, 5]}}).length).toEqual(1);
    expect(coll.find({count: {$between: [-1, 6]}}).length).toEqual(1);
    expect(coll.find({count: {$between: [99, 140]}}).length).toEqual(1);
    expect(coll.find({count: {$between: [100, 140]}}).length).toEqual(1);
    expect(coll.find({count: {$between: [101, 140]}}).length).toEqual(0);
    expect(coll.find({count: {$between: [12, 76]}}).length).toEqual(4);
    expect(coll.find({count: {$between: [20, 60]}}).length).toEqual(0);
  });

  it("indexed $in find works as expected", () => {
    interface User {
      name: string;
      count: number;
    }

    // test unindexed code path
    const db = new Loki("db");
    const coll = db.addCollection<User>("coll", { rangedIndexes: { "count": {} } });
    coll.insert({name: "mjolnir", count: 73});
    coll.insert({name: "gungnir", count: 5});
    coll.insert({name: "tyrfing", count: 15});
    coll.insert({name: "draupnir", count: 132});

    const results = coll.chain().find({count: {$in: [15, 73]}}).simplesort("count").data();
    expect(results.length).toEqual(2);
    expect(results[0].count).toEqual(15);
    expect(results[1].count).toEqual(73);
  });

  it("$keyin and $nkeyin", () => {
    interface User {
      name: string;
    }

    const db = new Loki("db");
    const coll = db.addCollection<User>("coll");
    coll.insert({name: "mjolnir"});

    let results = coll.find({name: {$keyin: {mjolnir: "not relevant"}}});
    expect(results.length).toEqual(1);

    results = coll.find({name: {$keyin: {mjolnir: undefined}}});
    expect(results.length).toEqual(1);

    results = coll.find({name: {$nkeyin: {mjolnir: "not relevant"}}});
    expect(results.length).toEqual(0);

    results = coll.find({name: {$nkeyin: {mjolnir: undefined}}});
    expect(results.length).toEqual(0);
  });

  it("$definedin and $ndefinedin", () => {
    interface User {
      name: string;
    }

    const db = new Loki("db");
    const coll = db.addCollection<User>("coll");
    coll.insert({name: "mjolnir"});

    let results = coll.find({name: {$definedin: {mjolnir: "not relevant"}}});
    expect(results.length).toEqual(1);

    results = coll.find({name: {$definedin: {mjolnir: undefined}}});
    expect(results.length).toEqual(0);

    results = coll.find({name: {$undefinedin: {mjolnir: "not relevant"}}});
    expect(results.length).toEqual(0);

    results = coll.find({name: {$undefinedin: {mjolnir: undefined}}});
    expect(results.length).toEqual(1);
  });

  describe("$contains, $containsNone, $containsAny", () => {

    describe("string", () => {
      interface User {
        name: string;
      }

      const db = new Loki("db");
      const coll = db.addCollection<User>("coll");
      coll.insert({name: "odin"});
      coll.insert({name: "thor"});
      coll.insert({name: "svafrlami"});
      coll.insert({name: "arngrim"});

      it("$contains", () => {
        let results = coll.find({name: {$contains: "d"}});
        expect(results.length).toEqual(1);
        expect(results[0].name).toEqual("odin");

        results = coll.find({name: {$contains: ["o", "i"]}});
        expect(results.length).toEqual(1);
        expect(results[0].name).toEqual("odin");

        results = coll.find({name: {$contains: "x"}});
        expect(results.length).toEqual(0);
      });

      it("$containsNone", () => {
        let results = coll.find({name: {$containsNone: "d"}});
        expect(results.length).toEqual(3);
        expect(results[0].name).toEqual("thor");
        expect(results[1].name).toEqual("svafrlami");
        expect(results[2].name).toEqual("arngrim");

        results = coll.find({name: {$containsNone: ["i", "o"]}});
        expect(results.length).toEqual(0);

        results = coll.find({name: {$containsNone: "x"}});
        expect(results.length).toEqual(4);
      });

      it("$containsAny", () => {
        let results = coll.find({name: {$containsAny: "d"}});
        expect(results.length).toEqual(1);
        expect(results[0].name).toEqual("odin");

        results = coll.find({name: {$containsAny: ["o", "i"]}});
        expect(results.length).toEqual(4);

        results = coll.find({name: {$containsAny: "x"}});
        expect(results.length).toEqual(0);
      });
    });

    describe("array", () => {
      interface User {
        name: string;
        weapons: string[];
      }

      const db = new Loki("db");
      const coll = db.addCollection<User>("coll");
      coll.insert({name: "odin", weapons: ["gungnir", "draupnir"]});
      coll.insert({name: "thor", weapons: ["mjolnir"]});
      coll.insert({name: "svafrlami", weapons: ["tyrfing"]});
      coll.insert({name: "arngrim", weapons: ["tyrfing"]});

      it("$contains", () => {
        let results = coll.find({weapons: {$contains: ["gungnir", "draupnir"]}});
        expect(results.length).toEqual(1);
        expect(results[0].name).toEqual("odin");

        results = coll.find({weapons: {$contains: ["mjolnir"]}});
        expect(results).toEqual(coll.find({weapons: {$contains: "mjolnir"}}));
        expect(results.length).toEqual(1);
        coll.find({weapons: {$contains: "mjolnir"}});

        results = coll.find({weapons: {$contains: ["mjolnir", "tyrfing"]}});
        expect(results.length).toEqual(0);
      });

      it("$containsNone", () => {
        let results = coll.find({weapons: {$containsNone: ["mjolnir", "tyrfing"]}});
        expect(results.length).toEqual(1);
        expect(results[0].name).toEqual("odin");

        results = coll.find({weapons: {$containsNone: ["draupnir"]}});
        expect(results.length).toEqual(3);
      });

      it("$containsAny", () => {
        let results = coll.find({weapons: {$containsAny: ["gungnir", "mjolnir"]}});
        expect(results.length).toEqual(2);
        expect(results[0].name).toEqual("odin");
        expect(results[1].name).toEqual("thor");

        results = coll.find({weapons: {$containsAny: ["svafrlami"]}});
        expect(results.length).toEqual(0);
      });
    });

    describe("object", () => {
      interface User {
        name: string;
        options: {
          a?: boolean;
          b?: boolean;
          c?: boolean;
        };
      }

      const db = new Loki("db");
      const coll = db.addCollection<User>("coll");
      coll.insert({name: "odin", options: {a: true, b: true}});
      coll.insert({name: "thor", options: {a: true}});
      coll.insert({name: "svafrlami", options: {}});
      coll.insert({name: "arngrim", options: {b: true}});

      it("$contains", () => {
        let results = coll.find({options: {$contains: ["a", "b"]}});
        expect(results.length).toEqual(1);
        expect(results[0].name).toEqual("odin");

        results = coll.find({options: {$contains: ["a"]}});
        expect(results).toEqual(coll.find({options: {$contains: "a"}}));
        expect(results.length).toEqual(2);
        expect(results[0].name).toEqual("odin");
        expect(results[1].name).toEqual("thor");

        results = coll.find({options: {$contains: ["c"]}});
        expect(results.length).toEqual(0);
      });

      it("$containsNone", () => {
        let results = coll.find({options: {$containsNone: ["a"]}});
        expect(results).toEqual(coll.find({options: {$containsNone: "a"}}));
        expect(results.length).toEqual(2);
        expect(results[0].name).toEqual("svafrlami");
        expect(results[1].name).toEqual("arngrim");

        results = coll.find({options: {$containsNone: ["a", "b"]}});
        expect(results.length).toEqual(1);
        expect(results[0].name).toEqual("svafrlami");

        results = coll.find({options: {$containsNone: ["c"]}});
        expect(results.length).toEqual(4);
      });

      it("$containsAny", () => {
        let results = coll.find({options: {$containsAny: ["a", "b"]}});
        expect(results.length).toEqual(3);
        expect(results[0].name).toEqual("odin");
        expect(results[1].name).toEqual("thor");
        expect(results[2].name).toEqual("arngrim");

        results = coll.find({options: {$containsAny: ["b"]}});
        expect(results).toEqual(coll.find({options: {$containsAny: "b"}}));
        expect(results.length).toEqual( 2);
        expect(results[0].name).toEqual("odin");
        expect(results[1].name).toEqual("arngrim");

        results = coll.find({options: {$containsAny: ["c"]}});
        expect(results.length).toEqual(0);
      });
    });
  });

  it("ops work with mixed datatypes", () => {
    const db = new Loki("db");

    interface AB {
      a: any;
      b: number;
    }

    const coll = db.addCollection<AB>("coll");

    coll.insert({a: null, b: 5});
    coll.insert({a: "asdf", b: 5});
    coll.insert({a: "11", b: 5});
    coll.insert({a: 2, b: 5});
    coll.insert({a: "1", b: 5});
    coll.insert({a: "4", b: 5});
    coll.insert({a: 7.2, b: 5});
    coll.insert({a: "5", b: 5});
    coll.insert({a: 4, b: 5});
    coll.insert({a: "18.1", b: 5});

    expect(coll.findOne({a: "asdf"}).a).toEqual("asdf");
    // default equality is strict, otherwise use $aeq
    expect(coll.find({a: 4}).length).toEqual(1);
    expect(coll.find({a: "4"}).length).toEqual(1);
    // default range ops (lt, lte, gt, gte, between) are loose
    expect(coll.find({a: {$between: [4, 12]}}).length).toEqual(5); // "4", 4, "5", 7.2, "11"
    expect(coll.find({a: {$gte: "7.2"}}).length).toEqual(4); // 7.2, "11", "18.1", "asdf" (strings after numbers)
    expect(coll.chain().find({a: {$gte: "7.2"}}).find({a: {$finite: true}}).data().length).toEqual(3); // 7.2, "11", "18.1"
    expect(coll.find({a: {$gt: "7.2"}}).length).toEqual(3); // "11", "18.1", "asdf"
    expect(coll.find({a: {$lte: "7.2"}}).length).toEqual(7); // 7.2, "5", "4", 4, 2, 1, null

    // expect same behavior when av; index is applied to property being queried
    coll.ensureIndex("a");

    expect(coll.findOne({a: "asdf"}).a).toEqual("asdf");
    // default equality is strict, otherwise use $aeq
    expect(coll.find({a: 4}).length).toEqual(1);
    expect(coll.find({a: "4"}).length).toEqual(1);
    // default range ops (lt, lte, gt, gte, between) are loose
    expect(coll.find({a: {$between: [4, 12]}}).length).toEqual(5); // "4", 4, "5", 7.2, "11"
    expect(coll.find({a: {$gte: "7.2"}}).length).toEqual(4); // 7.2, "11", "18.1", "asdf" (strings after numbers)
    expect(coll.chain().find({a: {$gte: "7.2"}}).find({a: {$finite: true}}).data().length).toEqual(3); // 7.2, "11", "18.1"
    expect(coll.find({a: {$gt: "7.2"}}).length).toEqual(3); // "11", "18.1", "asdf"
    expect(coll.find({a: {$lte: "7.2"}}).length).toEqual(7); // 7.2, "5", "4", 4, 2, 1, null
  });

  it("js range ops work as expected", () => {
    const db = new Loki("db");
    const coll = db.addCollection<{ a: string | number, b: number }>("coll");

    coll.insert({a: null, b: 5});
    coll.insert({a: "11", b: 5});
    coll.insert({a: 2, b: 5});
    coll.insert({a: "1", b: 5});
    coll.insert({a: "4", b: 5});
    coll.insert({a: 7.2, b: 5});
    coll.insert({a: "5", b: 5});
    coll.insert({a: 4, b: 5});
    coll.insert({a: "18.1", b: 5});

    expect(coll.find({a: {$jgt: 5}}).length).toEqual(3);
    expect(coll.find({a: {$jgte: 5}}).length).toEqual(4);
    expect(coll.find({a: {$jlt: 7.2}}).length).toEqual(6);
    expect(coll.find({a: {$jlte: 7.2}}).length).toEqual(7);
    expect(coll.find({a: {$jbetween: [3.2, 7.8]}}).length).toEqual(4);
  });
});
