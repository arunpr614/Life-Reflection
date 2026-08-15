import { TextDecoder, types as utilTypes } from "node:util";

const strictUtf8Decoder = new TextDecoder("utf-8", { fatal: true });

const BINARY_MAGIC_PREFIXES = Object.freeze([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.from([0xff, 0xd8, 0xff]),
  Buffer.from("GIF87a", "ascii"),
  Buffer.from("GIF89a", "ascii"),
  Buffer.from([0x50, 0x4b, 0x03, 0x04]),
  Buffer.from([0x50, 0x4b, 0x05, 0x06]),
  Buffer.from([0x50, 0x4b, 0x07, 0x08]),
  Buffer.from([0x1f, 0x8b]),
  Buffer.from("BZh", "ascii"),
  Buffer.from([0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c]),
  Buffer.from([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07]),
  Buffer.from("%PDF-", "ascii"),
  Buffer.from([0x7f, 0x45, 0x4c, 0x46]),
  Buffer.from([0x00, 0x61, 0x73, 0x6d]),
  Buffer.from("SQLite format 3\0", "binary"),
  Buffer.from("OggS", "ascii"),
  Buffer.from("ID3", "ascii"),
  Buffer.from("RIFF", "ascii"),
  Buffer.from("MZ", "ascii"),
  Buffer.from("BM", "ascii"),
  Buffer.from([0x49, 0x49, 0x2a, 0x00]),
  Buffer.from([0x4d, 0x4d, 0x00, 0x2a]),
]);

const MEDIA_DATA_SCHEME = /\bdata\s*:\s*(?:image|audio|video)\//iu;
const SVG_ELEMENT = /<\s*(?:[^<>\s/:]+:)?svg\b/iu;
const ENCODED_MEDIA_SIGNATURES = Object.freeze([
  "iVBORw0KGgo",
  "/9j/",
  "R0lGOD",
  "UklGR",
  "JVBERi0",
  "UEsDB",
  "H4sI",
  "TVqQ",
  "SUQz",
  "Z0eXBoZWlj",
]);

const PUBLIC_TEXT_FORBIDDEN_PATTERNS = Object.freeze([
  /(?:gh[pousr]_|github_pat_)[A-Za-z0-9_]{16,}/u,
  /xox[aboprs]-[A-Za-z0-9-]{10,}/u,
  /\bBearer\s+[A-Za-z0-9._~+/=-]{12,}/iu,
  /\bsk[-_][A-Za-z0-9_-]{12,}(?![A-Za-z0-9_-])/u,
  /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/u,
  /\bAIza[A-Za-z0-9_-]{20,}\b/u,
  /\b\d{6,12}:AA[A-Za-z0-9_-]{25,}\b/u,
  /\b[A-Za-z][A-Za-z0-9+.-]*:\/\/[^\s/@:]+:[^\s/@]+@/u,
  /\bhttps?:\/\/(?:10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)(?=[:/]|$)/iu,
  /\/Users\//u,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u,
  /\b(?:PVT|PVTI|PVTF|PVTV)_[A-Za-z0-9_-]+\b/u,
]);

const SANITIZED_RESULT_KEYS = Object.freeze(new Set([
  "ok",
  "code",
  "taskId",
  "stageId",
  "state",
  "sourceRevision",
  "receiptDigest",
  "planDigest",
  "attempt",
  "gateKind",
  "scopeClass",
  "actionClass",
  "dossierDigest",
  "predecessorReceiptDigest",
  "idempotencyKey",
  "authorityDeadline",
  "authorityStatus",
  "mutationStatement",
  "rollbackSnapshotReference",
  "immediateVerification",
  "quiescentVerification",
  "consequence",
  "nextAction",
]));

const PUBLIC_STAGE_AUTHORITY_STATUSES = Object.freeze(new Set([
  "current",
  "historical-terminal",
  "not-current",
  "not-rechecked",
]));
const PUBLIC_STAGE_MUTATION_STATEMENTS = Object.freeze(new Set([
  "Mutation verified complete",
  "Mutation may have occurred",
  "No mutation performed",
  "Rollback verified complete",
]));
const PUBLIC_STAGE_VERIFICATION_RESULTS = Object.freeze(new Set(["pass", "fail", "not-run"]));
const PUBLIC_STAGE_CONSEQUENCES = Object.freeze(new Set([
  "Stage effect is verified; task delivery status is unchanged.",
  "Stage state requires reviewed recovery before replay.",
  "Stage was already terminal; no second execution occurred.",
]));
const PUBLIC_STAGE_NEXT_ACTIONS = Object.freeze(new Set([
  "Run a separately reviewed delivery transition.",
  "Perform reviewed recovery or rollback.",
  "Preserve the terminal receipt; no replay is permitted.",
]));

function bytesAfterTextPreamble(value) {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
  let offset = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf ? 3 : 0;
  while (offset < bytes.length && [0x09, 0x0a, 0x0d, 0x20].includes(bytes[offset])) offset += 1;
  return bytes.subarray(offset);
}

function knownBinaryMagicDetected(value) {
  const bytes = bytesAfterTextPreamble(value);
  return BINARY_MAGIC_PREFIXES.some((prefix) => bytes.subarray(0, prefix.length).equals(prefix))
    || (bytes.length >= 12 && bytes.subarray(4, 8).toString("ascii") === "ftyp");
}

function encodedBinaryMagicDetected(text) {
  const candidates = text.match(/[A-Za-z0-9+/_-]{24,}={0,2}/gu) ?? [];
  return candidates.some((candidate) => {
    if (/^[0-9a-f]{40,128}$/iu.test(candidate)) return false;
    try {
      const normalized = candidate.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
      const decoded = Buffer.from(padded, "base64");
      const trimmed = bytesAfterTextPreamble(decoded);
      return BINARY_MAGIC_PREFIXES
        .filter((prefix) => prefix.length >= 4)
        .some((prefix) => trimmed.subarray(0, prefix.length).equals(prefix))
        || (trimmed.length >= 12 && trimmed.subarray(4, 8).toString("ascii") === "ftyp");
    } catch {
      return false;
    }
  });
}

export function inspectPublicTextBytes(value) {
  let bytes;
  try {
    bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
  } catch {
    return { safe: false, reasonCode: "TEXT_BYTES" };
  }
  if (bytes.includes(0)) return { safe: false, reasonCode: "TEXT_NUL" };
  if (knownBinaryMagicDetected(bytes)) return { safe: false, reasonCode: "TEXT_BINARY_MAGIC" };
  let text;
  try {
    text = strictUtf8Decoder.decode(bytes);
  } catch {
    return { safe: false, reasonCode: "TEXT_UTF8" };
  }
  if (MEDIA_DATA_SCHEME.test(text)) return { safe: false, reasonCode: "TEXT_MEDIA_DATA_URI" };
  if (SVG_ELEMENT.test(text)) return { safe: false, reasonCode: "TEXT_SVG" };
  if (PUBLIC_TEXT_FORBIDDEN_PATTERNS.some((pattern) => pattern.test(text))) {
    return { safe: false, reasonCode: "TEXT_SENSITIVE_PATTERN" };
  }
  if (encodedBinaryMagicDetected(text)) return { safe: false, reasonCode: "TEXT_ENCODED_BINARY" };
  const encodedMedia = ENCODED_MEDIA_SIGNATURES.some((signature) => {
    const index = text.indexOf(signature);
    return index >= 0 && /^[A-Za-z0-9+/=]{16,}/.test(text.slice(index));
  });
  return encodedMedia
    ? { safe: false, reasonCode: "TEXT_ENCODED_MEDIA" }
    : { safe: true, reasonCode: null };
}

export function publicTextBytesAreSafe(value) {
  return inspectPublicTextBytes(value).safe;
}

function serializableGraphIsSafe(value, ancestors = new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || utilTypes.isProxy(value) || ancestors.has(value)) return false;
  try {
    const array = Array.isArray(value);
    if (Object.getPrototypeOf(value) !== (array ? Array.prototype : Object.prototype)
      || Object.getOwnPropertySymbols(value).length !== 0) return false;
    const descriptors = Object.getOwnPropertyDescriptors(value);
    ancestors.add(value);
    if (array) {
      const lengthDescriptor = descriptors.length;
      if (!lengthDescriptor || !Object.hasOwn(lengthDescriptor, "value")
        || !Number.isSafeInteger(lengthDescriptor.value) || lengthDescriptor.value < 0) return false;
      const elementKeys = Object.keys(descriptors).filter((key) => key !== "length");
      if (elementKeys.length !== lengthDescriptor.value) return false;
      for (let index = 0; index < lengthDescriptor.value; index += 1) {
        const descriptor = descriptors[String(index)];
        if (!descriptor || !Object.hasOwn(descriptor, "value")
          || descriptor.get !== undefined || descriptor.set !== undefined
          || descriptor.enumerable !== true
          || !serializableGraphIsSafe(descriptor.value, ancestors)) return false;
      }
      return true;
    }
    return Object.values(descriptors).every((descriptor) => Object.hasOwn(descriptor, "value")
      && descriptor.get === undefined
      && descriptor.set === undefined
      && descriptor.enumerable === true
      && serializableGraphIsSafe(descriptor.value, ancestors));
  } catch {
    return false;
  } finally {
    ancestors.delete(value);
  }
}

export function isPlainRecord(value) {
  return value !== null
    && typeof value === "object"
    && !utilTypes.isProxy(value)
    && !Array.isArray(value)
    && serializableGraphIsSafe(value);
}

export function hasExactKeys(value, expectedKeys) {
  if (!isPlainRecord(value)) return false;
  try {
    return Object.keys(value).sort().join("\0") === [...expectedKeys].sort().join("\0");
  } catch {
    return false;
  }
}

export function canonicalJson(value) {
  if (!serializableGraphIsSafe(value)) throw new TypeError("canonical JSON requires a safe serializable graph");
  return canonicalJsonUnchecked(value);
}

function canonicalJsonUnchecked(value) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") return JSON.stringify(value);
  const descriptors = Object.getOwnPropertyDescriptors(value);
  if (Array.isArray(value)) {
    return `[${Array.from({ length: descriptors.length.value }, (_, index) => (
      canonicalJsonUnchecked(descriptors[String(index)].value)
    )).join(",")}]`;
  }
  const entries = Object.keys(descriptors).sort().map((key) => (
    `${JSON.stringify(key)}:${canonicalJsonUnchecked(descriptors[key].value)}`
  ));
  return `{${entries.join(",")}}`;
}

/**
 * Closed public result validation. Raw child output, paths, commands, errors,
 * URLs, environment, and arbitrary detail fields cannot cross this boundary.
 */
export function sanitizedResultIsSafe(value) {
  if (!isPlainRecord(value) || Object.keys(value).some((key) => !SANITIZED_RESULT_KEYS.has(key))) return false;
  if (value.ok !== true && value.ok !== false) return false;
  if (typeof value.code !== "string" || !/^[A-Z][A-Z0-9_]{2,80}$/.test(value.code)) return false;
  for (const key of ["taskId", "stageId", "state", "sourceRevision", "receiptDigest", "planDigest"]) {
    if (Object.hasOwn(value, key) && (typeof value[key] !== "string" || !publicTextBytesAreSafe(value[key]))) return false;
  }
  if (Object.hasOwn(value, "sourceRevision") && !/^[0-9a-f]{40}$/.test(value.sourceRevision)) return false;
  for (const key of ["receiptDigest", "planDigest"]) {
    if (Object.hasOwn(value, key) && !/^sha256:[0-9a-f]{64}$/.test(value[key])) return false;
  }
  if (Object.hasOwn(value, "gateKind") && !["execute", "accept"].includes(value.gateKind)) return false;
  for (const key of ["scopeClass", "actionClass"]) {
    if (Object.hasOwn(value, key) && !/^[a-z][a-z0-9-]{2,63}$/.test(value[key])) return false;
  }
  if (Object.hasOwn(value, "dossierDigest") && !/^[0-9a-f]{64}$/.test(value.dossierDigest)) return false;
  if (Object.hasOwn(value, "predecessorReceiptDigest")
    && value.predecessorReceiptDigest !== null
    && !/^sha256:[0-9a-f]{64}$/.test(value.predecessorReceiptDigest)) return false;
  if (Object.hasOwn(value, "idempotencyKey")
    && !/^P0-IDEMP-[A-Za-z0-9][A-Za-z0-9._:-]{15,111}$/.test(value.idempotencyKey)) return false;
  if (Object.hasOwn(value, "authorityDeadline")
    && (typeof value.authorityDeadline !== "string" || !Number.isFinite(Date.parse(value.authorityDeadline)))) return false;
  if (Object.hasOwn(value, "authorityStatus") && !PUBLIC_STAGE_AUTHORITY_STATUSES.has(value.authorityStatus)) return false;
  if (Object.hasOwn(value, "mutationStatement") && !PUBLIC_STAGE_MUTATION_STATEMENTS.has(value.mutationStatement)) return false;
  if (Object.hasOwn(value, "rollbackSnapshotReference")
    && (typeof value.rollbackSnapshotReference !== "string"
      || !/^[a-z][a-z0-9-]*:[A-Za-z0-9._/-]{4,160}$/.test(value.rollbackSnapshotReference)
      || !publicTextBytesAreSafe(value.rollbackSnapshotReference))) return false;
  for (const key of ["immediateVerification", "quiescentVerification"]) {
    if (Object.hasOwn(value, key) && !PUBLIC_STAGE_VERIFICATION_RESULTS.has(value[key])) return false;
  }
  if (Object.hasOwn(value, "consequence") && !PUBLIC_STAGE_CONSEQUENCES.has(value.consequence)) return false;
  if (Object.hasOwn(value, "nextAction") && !PUBLIC_STAGE_NEXT_ACTIONS.has(value.nextAction)) return false;
  return !Object.hasOwn(value, "attempt") || Number.isSafeInteger(value.attempt) && value.attempt >= 0;
}
