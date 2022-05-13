import Recognizer from "../recognizer";

let recognizer;

beforeEach(() => {
  recognizer = new Recognizer();
});

// query types
it("handles simple get query", () => {
  recognizer.parseInput(`get artist:"rammstein"`);
});

it("handles simple add to query", () => {
  recognizer.parseInput(
    `add to "My Playlist" from album:"Mutter" - artist:"Rammstein"`
  );
});

it("handles delete tracks query", () => {
  recognizer.parseInput(`delete from "My Playlist"`);
});

it("handles search query", () => {
  recognizer.parseInput(`search artist "carly rae jepsen"`);
});

it("handles create playlist query", () => {
  recognizer.parseInput(`create playlist "New Playlist"`);
});

it("handle delete playlist query", () => {
  recognizer.parseInput(`delete playlist "New Playlist"`);
});

// primary conditions

it("handles primary conditions with different keywords", () => {
  recognizer.parseInput(`get artist:"Rammstein"`);
  recognizer.parseInput(`get album:"Mutter"-artist:"Rammstein"`);
  recognizer.parseInput(`get track:"Mein Herz brennt"-artist:"Rammstein"`);
  recognizer.parseInput(`get track:"Mein Herz brennt"-album:"Mutter"`);
  recognizer.parseInput(`get playlist:"My playlist"`);
});

it("handles primary conditions with multiple entrys", () => {
  recognizer.parseInput(`get artist:["Rammstein","Daft Punk"]`);
  recognizer.parseInput(
    `get album:["Mutter"-artist:"Rammstein","Discovery"-artist:"Daft Punk","Hybrid Theory"-artist:"Linkin Park"]`
  );
  recognizer.parseInput(
    `get track:["Mutter"-artist:"Rammstein","Harder Better Faster Stronger"-album:"Discovery"]`
  );
});

it("handles primary conditions with unions", () => {
  recognizer.parseInput(
    `get artist:"Rammstein" union album:"Discovery"-artist:"Daft Punk"`
  );
  recognizer.parseInput(
    `get artist:"Rammstein" union album:["Discovery"-artist:"Daft Punk", "Alive 2007"-artist:"Daft Punk"]`
  );
  recognizer.parseInput(
    `get artist:"Rammstein" union album:["Discovery"-artist:"Daft Punk", "Alive 2007"-artist:"Daft Punk"] union track:"Wonderwall"-artist:"Oasis"`
  );
});

// secondary conditions
it("handles simple secondary conditions", () => {
  recognizer.parseInput(`get artist:"Rammstein" where album="Mutter"`);
});

it("handles secondary conditions with one and, or or not terms", () => {
  recognizer.parseInput(
    `get artist:"Rammstein" where album="Mutter" and track="Feuer Frei!"`
  );
  recognizer.parseInput(
    `get artist:"Rammstein" where album="Mutter" or album="Reise Reise"`
  );
  recognizer.parseInput(`get artist:"Rammstein" where not album="Remixes"`);
});

it("handles secondary condtions with brackets", () => {
  recognizer.parseInput(
    `get artist:"Rammstein" where not (album="Remixes" or album="XXI - Klavier")`
  );
});

it("handles secondary condtions with a mix of and, or, not and brackets", () => {
  recognizer.parseInput(
    `get artist:"Rammstein" where (album="Mutter" or album="Reise Reise") and not (album="Remixes" and album="Rosenrot")`
  );
});

// secondary conditions keywords
it("handles all types of secondary conditions keywords", () => {
  recognizer.parseInput(`get artist:"Rammstein" where artist="Rammstein"`);
  recognizer.parseInput(`get artist:"Rammstein" where album="Mutter"`);
  recognizer.parseInput(
    `get artist:"Rammstein" where track="Mein herz brennt"`
  );
});

// secondary condtions RHS
it("handles all types of secondary conditions RHS", () => {
  recognizer.parseInput(`get artist:"Rammstein" where artist="Rammstein"`);
  recognizer.parseInput(
    `get artist:"Rammstein" where album in ("Mutter", "Reise Reise", "Rosenrot")`
  );
  recognizer.parseInput(`get artist:"Rammstein" where track like "a*"`);
});

// Advanced queries
it("handles an advanced query", () => {
  recognizer.parseInput(
    `get artist:"Sabaton" union artist:["Rammstein", "Daft Punk", "Oasis"] union album:"Discovery"-artist:"Daft Punk" union album:["Hybrid Theory"-artist:"Linkin Park","Meteora"-artist:"Linkin Park","Minutes to Midnight"-artist:"Linkin Park"] union track:"Take on Me"-artist:"a-ha" where (not (album like "/live/" or album in ("Discovery", "Homework")) and track="touch") or (album in ("Discovery", "Homework")) and track="Mann Gegen Mann"`
  );
});

// incorrect queries
// TODO: Add in tests with incorrect queries and see if the proper errors are thrown
