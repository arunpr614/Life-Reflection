/**
 * Parse strict JSON while rejecting duplicate object keys at every depth.
 * JSON.parse alone is last-key-wins, which can present different apparent
 * values to a human reviewer and the machine authorization path.
 */
export function parseJsonWithoutDuplicateKeys(source, label = "JSON document") {
  if (typeof source !== "string") throw new TypeError(`${label} must be UTF-8 text`);
  let index = 0;

  const fail = (message) => {
    throw new SyntaxError(`${label}: ${message} at byte ${Buffer.byteLength(source.slice(0, index), "utf8")}`);
  };
  const skipWhitespace = () => {
    while (index < source.length && /[\x20\x09\x0a\x0d]/.test(source[index])) index += 1;
  };
  const parseString = () => {
    if (source[index] !== '"') fail("expected string");
    const start = index;
    index += 1;
    while (index < source.length) {
      const character = source[index];
      if (character === '"') {
        index += 1;
        return JSON.parse(source.slice(start, index));
      }
      if (character.charCodeAt(0) < 0x20) fail("unescaped control character in string");
      if (character !== "\\") {
        index += 1;
        continue;
      }
      index += 1;
      if (index >= source.length) fail("unterminated escape sequence");
      if (source[index] === "u") {
        const digits = source.slice(index + 1, index + 5);
        if (!/^[0-9a-fA-F]{4}$/.test(digits)) fail("invalid Unicode escape");
        index += 5;
      } else if ('"\\/bfnrt'.includes(source[index])) {
        index += 1;
      } else {
        fail("invalid string escape");
      }
    }
    fail("unterminated string");
  };
  const parseNumber = () => {
    const match = source.slice(index).match(/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/);
    if (!match) fail("invalid number");
    index += match[0].length;
  };
  const parseLiteral = (literal) => {
    if (!source.startsWith(literal, index)) fail(`expected ${literal}`);
    index += literal.length;
  };
  const parseArray = () => {
    index += 1;
    skipWhitespace();
    if (source[index] === "]") {
      index += 1;
      return;
    }
    while (index < source.length) {
      parseValue();
      skipWhitespace();
      if (source[index] === "]") {
        index += 1;
        return;
      }
      if (source[index] !== ",") fail("expected array comma or closing bracket");
      index += 1;
      skipWhitespace();
    }
    fail("unterminated array");
  };
  const parseObject = () => {
    index += 1;
    skipWhitespace();
    const keys = new Set();
    if (source[index] === "}") {
      index += 1;
      return;
    }
    while (index < source.length) {
      const key = parseString();
      if (keys.has(key)) fail(`duplicate object key ${JSON.stringify(key)}`);
      keys.add(key);
      skipWhitespace();
      if (source[index] !== ":") fail("expected object colon");
      index += 1;
      parseValue();
      skipWhitespace();
      if (source[index] === "}") {
        index += 1;
        return;
      }
      if (source[index] !== ",") fail("expected object comma or closing brace");
      index += 1;
      skipWhitespace();
    }
    fail("unterminated object");
  };
  const parseValue = () => {
    skipWhitespace();
    const character = source[index];
    if (character === '"') parseString();
    else if (character === "{") parseObject();
    else if (character === "[") parseArray();
    else if (character === "t") parseLiteral("true");
    else if (character === "f") parseLiteral("false");
    else if (character === "n") parseLiteral("null");
    else parseNumber();
    skipWhitespace();
  };

  parseValue();
  if (index !== source.length) fail("unexpected trailing content");
  return JSON.parse(source);
}

export function assertDuplicateKeyRejection() {
  let rejected = false;
  try {
    parseJsonWithoutDuplicateKeys('{"outer":{"key":1,"key":2}}', "duplicate-key fixture");
  } catch {
    rejected = true;
  }
  if (!rejected) throw new Error("Duplicate-key JSON fixture was accepted");
  return true;
}
