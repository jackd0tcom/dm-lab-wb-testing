import { jest } from "@jest/globals";

const mockIsWord = jest.fn(() => true);
jest.unstable_mockModule("../src/words.js", () => {
  return {
    getWord: jest.fn(() => "APPLE"),
    isWord: mockIsWord,
  };
});

const { Wordle, buildLetter } = await import("../src/wordle.js");

describe("tests the buildLetter function", () => {
  test("returns a letter object", () => {
    expect(buildLetter("a", "building")).toEqual({
      letter: "a",
      status: "building",
    });
  });
});

describe("constructing a new wordle game", () => {
  test("sets maxGuesses to 6 if no arg is passed", () => {
    const newWordle = new Wordle();
    expect(newWordle.maxGuesses).toBe(6);
  });
  test("sets maxGuesses to arg passed", () => {
    const newWordle = new Wordle(10);
    expect(newWordle.maxGuesses).toBe(10);
  });
  test("sets guesses to an array of length maxGuesses", () => {
    const newWordle = new Wordle();
    expect(newWordle.guesses.length).toBe(6);
  });
  test("sets currGuess to 0", () => {
    const newWordle = new Wordle();
    expect(newWordle.currGuess).toBe(0);
  });
  test("sets word to a word from getword", () => {
    const newWordle = new Wordle();
    expect(newWordle.word).toBe("APPLE");
  });
});

describe("tests buildGuessFromWord", () => {
  test("sets the status of a correct letter to correct", () => {
    const newWordle = new Wordle();
    const guess = newWordle.buildGuessFromWord("A____");
    expect(guess[0].status).toBe("CORRECT");
  });
  test("sets status of present letter to present", () => {
    const newWordle = new Wordle();
    const guess = newWordle.buildGuessFromWord("E____");
    expect(guess[0].status).toBe("PRESENT");
  });
  test("sets status of abesnt letter to absent", () => {
    const newWordle = new Wordle();
    const guess = newWordle.buildGuessFromWord("Z____");
    expect(guess[0].status).toBe("ABSENT");
  });
});

describe("tests appendGuess", () => {
  test("throws an error if no more guesses are allowed", () => {
    const newWordle = new Wordle(1);
    newWordle.appendGuess("GUESS");
    expect(() => newWordle.appendGuess("GUESS")).toThrow();
  });
  test("throws an error if guess is not of length 5", () => {
    const newWordle = new Wordle();
    expect(() => newWordle.appendGuess("AB")).toThrow();
  });
  test("throws error if guess is not a word", () => {
    mockIsWord.mockReturnValueOnce(false);
    const newWordle = new Wordle();
    expect(() => newWordle.appendGuess("GUESS")).toThrow();
  });
  test("increments the current guess", () => {
    const newWordle = new Wordle();
    newWordle.appendGuess("GUESS");
    expect(newWordle.currGuess).toBe(1);
  });
});

describe("Tests isSolved", () => {
  test("returns true if the latest guess is the correct word", () => {
    const newWordle = new Wordle();
    newWordle.appendGuess("APPLE");
    expect(newWordle.isSolved()).toBe(true);
  });
  test("returns false if the latest guess is not the correct word", () => {
    const newWordle = new Wordle();
    newWordle.appendGuess("GUESS");
    expect(newWordle.isSolved()).toBe(false);
  });
});

describe("tests shouldEndGame", () => {
  test("returns true if the latest guess is the correct word", () => {
    const newWordle = new Wordle();
    newWordle.appendGuess("APPLE");
    expect(newWordle.shouldEndGame()).toBe(true);
  });
  test("returns true if there are no more guesses left", () => {
    const newWordle = new Wordle(1);
    newWordle.appendGuess("GUESS");
    expect(newWordle.shouldEndGame()).toBe(true);
  });
  test("returns false if no guess has been made", () => {
    const newWordle = new Wordle();
    expect(newWordle.shouldEndGame()).toBe(false);
  });
  test("returns false if there are guesses left and the word has not been guessed", () => {
    const newWordle = new Wordle();
    newWordle.appendGuess("GUESS");
    expect(newWordle.shouldEndGame()).toBe(false);
  });
});
