// Pure-JS QR Code Model 2 generator. Byte mode only. Reed-Solomon over GF(256).
// No external dependencies. Deterministic output for snapshot testing.
// Reference: ISO/IEC 18004:2015 (with practical simplifications: byte mode only, versions 1-10, mask 0 fixed for now is not sufficient — see mask selection below).

// -------- Galois Field 256 (primitive poly 0x11d) --------
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a, b) {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255];
}

function gfPolyMul(p, q) {
  const r = new Uint8Array(p.length + q.length - 1);
  for (let i = 0; i < p.length; i++) {
    for (let j = 0; j < q.length; j++) {
      r[i + j] ^= gfMul(p[i], q[j]);
    }
  }
  return r;
}

function gfPolyMod(data, gen) {
  let r = data;
  for (let i = 0; i < data.length - gen.length + 1; i++) {
    const coef = r[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        r[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return r.slice(data.length - gen.length + 1);
}

function rsGeneratorPoly(degree) {
  let g = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    g = gfPolyMul(g, new Uint8Array([1, GF_EXP[i]]));
  }
  return g;
}

function rsEncode(data, ecLen) {
  const gen = rsGeneratorPoly(ecLen);
  const buf = new Uint8Array(data.length + ecLen);
  buf.set(data, 0);
  const ec = gfPolyMod(buf, gen);
  const out = new Uint8Array(data.length + ecLen);
  out.set(data, 0);
  out.set(ec, data.length);
  return out;
}

// -------- QR Version / Capacity table (subset) --------
// Each entry: { version, totalCodewords, ecCodewordsPerBlock, blocks, dataCodewordsTotal, modules }
// We support versions 1-10 with all 4 EC levels.
const VERSION_TABLE = {
  1: { modules: 21, ec: { L: { blocks: [[1, 19, 7]], data: 19 }, M: { blocks: [[1, 16, 10]], data: 16 }, Q: { blocks: [[1, 13, 13]], data: 13 }, H: { blocks: [[1, 9, 17]], data: 9 } } },
  2: { modules: 25, ec: { L: { blocks: [[1, 34, 10]], data: 34 }, M: { blocks: [[1, 28, 16]], data: 28 }, Q: { blocks: [[1, 22, 22]], data: 22 }, H: { blocks: [[1, 16, 28]], data: 16 } } },
  3: { modules: 29, ec: { L: { blocks: [[1, 55, 15]], data: 55 }, M: { blocks: [[1, 44, 26]], data: 44 }, Q: { blocks: [[2, 17, 18]], data: 34 }, H: { blocks: [[2, 13, 22]], data: 26 } } },
  4: { modules: 33, ec: { L: { blocks: [[1, 80, 20]], data: 80 }, M: { blocks: [[2, 32, 18]], data: 64 }, Q: { blocks: [[2, 24, 26]], data: 48 }, H: { blocks: [[4, 9, 16]], data: 36 } } },
  5: { modules: 37, ec: { L: { blocks: [[1, 108, 26]], data: 108 }, M: { blocks: [[2, 43, 24]], data: 86 }, Q: { blocks: [[2, 15, 18, 2, 16, 18]], data: 62 }, H: { blocks: [[2, 11, 22, 2, 12, 22]], data: 46 } } },
  6: { modules: 41, ec: { L: { blocks: [[2, 68, 18]], data: 136 }, M: { blocks: [[4, 27, 16]], data: 108 }, Q: { blocks: [[4, 19, 24]], data: 76 }, H: { blocks: [[4, 15, 28]], data: 60 } } },
  7: { modules: 45, ec: { L: { blocks: [[2, 78, 20]], data: 156 }, M: { blocks: [[4, 31, 18]], data: 124 }, Q: { blocks: [[2, 14, 18, 4, 15, 18]], data: 88 }, H: { blocks: [[4, 13, 26, 1, 14, 26]], data: 66 } } },
  8: { modules: 49, ec: { L: { blocks: [[2, 97, 24]], data: 194 }, M: { blocks: [[2, 38, 22, 2, 39, 22]], data: 154 }, Q: { blocks: [[4, 18, 22, 2, 19, 22]], data: 110 }, H: { blocks: [[4, 14, 26, 2, 15, 26]], data: 78 } } },
  9: { modules: 53, ec: { L: { blocks: [[2, 116, 30]], data: 232 }, M: { blocks: [[3, 36, 22, 2, 37, 22]], data: 182 }, Q: { blocks: [[4, 16, 20, 4, 17, 20]], data: 132 }, H: { blocks: [[4, 12, 24, 4, 13, 24]], data: 92 } } },
  10: { modules: 57, ec: { L: { blocks: [[2, 68, 18, 2, 69, 18]], data: 274 }, M: { blocks: [[4, 43, 26]], data: 216 }, Q: { blocks: [[6, 19, 24, 2, 20, 24]], data: 154 }, H: { blocks: [[6, 15, 28, 2, 16, 28]], data: 122 } } },
};

// -------- Capacity (byte mode) for versions 1-10, all 4 EC levels --------
const BYTE_CAPACITY = {
  1: { L: 17, M: 14, Q: 11, H: 7 },
  2: { L: 32, M: 26, Q: 20, H: 14 },
  3: { L: 53, M: 42, Q: 32, H: 24 },
  4: { L: 78, M: 62, Q: 46, H: 34 },
  5: { L: 106, M: 84, Q: 60, H: 44 },
  6: { L: 134, M: 106, Q: 74, H: 58 },
  7: { L: 154, M: 122, Q: 86, H: 64 },
  8: { L: 192, M: 152, Q: 108, H: 84 },
  9: { L: 230, M: 180, Q: 130, H: 98 },
  10: { L: 271, M: 213, Q: 151, H: 119 },
};

export function getCapacity(version, ec) {
  if (version < 1 || version > 10) return 0;
  return BYTE_CAPACITY[version][ec] || 0;
}

export function getModules(version) {
  return VERSION_TABLE[version] ? VERSION_TABLE[version].modules : 0;
}

// -------- Mode indicator --------
const MODE_BYTE = 0b0100;

// -------- Character count bits (byte mode) for versions 1-10 --------
function charCountBits(version) {
  return version < 10 ? 8 : 16;
}

// -------- Pick smallest version that fits --------
export function pickVersion(byteLength, ec) {
  for (let v = 1; v <= 10; v++) {
    if (getCapacity(v, ec) >= byteLength) return v;
  }
  return -1;
}

// -------- Bit buffer --------
class BitBuffer {
  constructor() {
    this.bytes = [];
    this.bitLen = 0;
  }
  put(value, len) {
    for (let i = len - 1; i >= 0; i--) {
      this.putBit(((value >> i) & 1) === 1);
    }
  }
  putBit(bit) {
    const byteIdx = this.bitLen >> 3;
    const bitIdx = 7 - (this.bitLen & 7);
    if (this.bytes.length <= byteIdx) this.bytes.push(0);
    if (bit) this.bytes[byteIdx] |= 1 << bitIdx;
    this.bitLen++;
  }
}

// -------- UTF-8 encode --------
export function utf8Bytes(str) {
  const out = [];
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 0x80) {
      out.push(c);
    } else if (c < 0x800) {
      out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else if ((c & 0xfc00) === 0xd800 && i + 1 < str.length) {
      const c2 = str.charCodeAt(++i);
      c = 0x10000 + (((c & 0x3ff) << 10) | (c2 & 0x3ff));
      out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 0x3f), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    } else {
      out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
  }
  return out;
}

// -------- Encode byte data into codewords (mode + count + payload + terminator + padding) --------
export function encodeData(text, version, ec) {
  const capacity = VERSION_TABLE[version].ec[ec].data;
  const data = new Uint8Array(capacity);
  const buf = new BitBuffer();
  buf.put(MODE_BYTE, 4);
  buf.put(utf8Bytes(text).length, charCountBits(version));
  for (const b of utf8Bytes(text)) buf.put(b, 8);

  // total data codewords * 8 bits
  const totalBits = capacity * 8;
  const remaining = totalBits - buf.bitLen;
  if (remaining < 0) {
    throw new Error("Data too long for version " + version + " at EC " + ec);
  }
  // terminator
  const termLen = Math.min(4, remaining);
  buf.put(0, termLen);
  // pad to byte boundary
  while (buf.bitLen % 8 !== 0) buf.putBit(false);
  // pad bytes
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (buf.bytes.length < capacity) {
    buf.put(padBytes[padIdx], 8);
    padIdx = 1 - padIdx;
  }
  data.set(buf.bytes.slice(0, capacity), 0);
  return data;
}

// -------- Block interleaving for final message --------
function interleaveCodewords(data, version, ec) {
  const ecSpec = VERSION_TABLE[version].ec[ec];
  const blockSpecs = ecSpec.blocks;
  const blocks = [];
  const ecBlocks = [];
  let dataIdx = 0;
  for (const [count, dataLen, ecLen] of blockSpecs) {
    for (let i = 0; i < count; i++) {
      const dataBlock = data.slice(dataIdx, dataIdx + dataLen);
      dataIdx += dataLen;
      const ecBlock = rsEncode(dataBlock, ecLen).slice(dataLen);
      blocks.push(dataBlock);
      ecBlocks.push(ecBlock);
    }
  }
  const interleaved = [];
  const maxDataLen = Math.max(...blocks.map((b) => b.length));
  for (let i = 0; i < maxDataLen; i++) {
    for (const b of blocks) {
      if (i < b.length) interleaved.push(b[i]);
    }
  }
  for (let i = 0; i < ecBlocks[0].length; i++) {
    for (const b of ecBlocks) {
      if (i < b.length) interleaved.push(b[i]);
    }
  }
  return Uint8Array.from(interleaved);
}

// -------- Module matrix and patterns --------
function makeMatrix(size) {
  const m = new Array(size);
  const r = new Array(size);
  for (let i = 0; i < size; i++) {
    m[i] = new Array(size).fill(null);
    r[i] = new Array(size).fill(false);
  }
  return { m, reserved: r };
}

function placeFinder(m, r, row, col) {
  for (let dr = -1; dr <= 7; dr++) {
    for (let dc = -1; dc <= 7; dc++) {
      const rr = row + dr;
      const cc = col + dc;
      if (rr < 0 || cc < 0 || rr >= m.length || cc >= m.length) continue;
      let v = 0;
      if (
        (dr >= 0 && dr <= 6 && (dc === 0 || dc === 6)) ||
        (dc >= 0 && dc <= 6 && (dr === 0 || dr === 6)) ||
        (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4)
      ) {
        v = 1;
      }
      m[rr][cc] = v;
      r[rr][cc] = true;
    }
  }
}

function placeAlignment(m, r, row, col) {
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      const v = (Math.max(Math.abs(dr), Math.abs(dc)) !== 1) ? 1 : 0;
      m[row + dr][col + dc] = v;
      r[row + dr][col + dc] = true;
    }
  }
}

function getAlignmentPositions(version) {
  // From ISO/IEC 18004, versions 2-40
  const table = {
    2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34],
    7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
  };
  return table[version] || [];
}

function placeTimingPatterns(m, r) {
  const size = m.length;
  for (let i = 8; i < size - 8; i++) {
    m[6][i] = (i % 2 === 0) ? 1 : 0;
    m[i][6] = (i % 2 === 0) ? 1 : 0;
    r[6][i] = true;
    r[i][6] = true;
  }
}

function reserveFormatInfo(m, r) {
  const size = m.length;
  for (let i = 0; i < 9; i++) {
    if (m[8][i] == null) { r[8][i] = true; }
    if (m[i][8] == null) { r[i][8] = true; }
  }
  for (let i = 0; i < 8; i++) {
    r[8][size - 1 - i] = true;
    r[size - 1 - i][8] = true;
  }
  m[size - 8][8] = 1; // dark module
  r[size - 8][8] = true;
}

function placeData(m, r, codewords) {
  const size = m.length;
  let bitIdx = 0;
  let totalBits = codewords.length * 8;
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--; // skip vertical timing column
    for (let i = 0; i < size; i++) {
      const row = upward ? size - 1 - i : i;
      for (let c = 0; c < 2; c++) {
        const cc = col - c;
        if (!r[row][cc]) {
          let bit = 0;
          if (bitIdx < totalBits) {
            const byte = codewords[bitIdx >> 3];
            const b = 7 - (bitIdx & 7);
            bit = (byte >> b) & 1;
            bitIdx++;
          }
          m[row][cc] = bit;
        }
      }
    }
    upward = !upward;
  }
}

// -------- BCH(15,5) for format info --------
function bchFormat(data) {
  let d = data << 10;
  const gen = 0b10100110111;
  for (let i = 14; i >= 10; i--) {
    if ((d >> i) & 1) d ^= gen << (i - 10);
  }
  return ((data << 10) | d) & 0x7fff;
}

// -------- Apply mask --------
function maskFunc(maskId) {
  switch (maskId) {
    case 0: return (r, c) => ((r + c) % 2) === 0;
    case 1: return (r) => r % 2 === 0;
    case 2: return (_, c) => c % 3 === 0;
    case 3: return (r, c) => (r + c) % 3 === 0;
    case 4: return (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
    case 5: return (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0;
    case 6: return (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
    case 7: return (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
    default: return () => false;
  }
}

function applyMask(m, r, maskId) {
  const fn = maskFunc(maskId);
  const size = m.length;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!r[row][col] && fn(row, col)) {
        m[row][col] = m[row][col] ^ 1;
      }
    }
  }
}

// -------- Place format info around finders --------
function placeFormat(m, ecBits, maskId) {
  const size = m.length;
  const data = (ecBits << 3) | maskId;
  const bch = bchFormat(data);

  // top-left
  for (let i = 0; i < 6; i++) m[8][i] = (bch >> i) & 1;
  m[8][7] = (bch >> 6) & 1;
  m[8][8] = (bch >> 7) & 1;
  m[7][8] = (bch >> 8) & 1;
  for (let i = 9; i < 15; i++) m[14 - i][8] = (bch >> i) & 1;

  // top-right and bottom-left
  for (let i = 0; i < 8; i++) m[size - 1 - i][8] = (bch >> i) & 1;
  for (let i = 8; i < 15; i++) m[8][size - 15 + i] = (bch >> i) & 1;
  m[size - 8][8] = 1;
}

// -------- Mask penalty --------
function maskPenalty(m) {
  const size = m.length;
  let p = 0;
  // Rule 1: runs of 5+ same color
  for (let r = 0; r < size; r++) {
    let run = 1;
    for (let c = 1; c < size; c++) {
      if (m[r][c] === m[r][c - 1]) {
        run++;
        if (run === 5) p += 3;
        else if (run > 5) p += 1;
      } else run = 1;
    }
  }
  for (let c = 0; c < size; c++) {
    let run = 1;
    for (let r = 1; r < size; r++) {
      if (m[r][c] === m[r - 1][c]) {
        run++;
        if (run === 5) p += 3;
        else if (run > 5) p += 1;
      } else run = 1;
    }
  }
  // Rule 2: 2x2 same color
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      if (m[r][c] === m[r][c + 1] && m[r][c] === m[r + 1][c] && m[r][c] === m[r + 1][c + 1]) {
        p += 3;
      }
    }
  }
  return p;
}

// -------- Public: choose best mask --------
function chooseMask(m, r, ecBits) {
  let best = -1;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    const clone = m.map((row) => row.slice());
    const rsv = r.map((row) => row.slice());
    applyMask(clone, rsv, mask);
    placeFormat(clone, ecBits, mask);
    const score = maskPenalty(clone);
    if (score < bestScore) {
      bestScore = score;
      best = mask;
    }
  }
  return best;
}

// EC level bits used in format info
export const EC_BITS = { L: 1, M: 0, Q: 3, H: 2 };

// -------- Main: generate QR code as a 2D array of 0/1 --------
export function generateQR(text, options = {}) {
  const ec = options.ec || "M";
  if (!VERSION_TABLE[1].ec[ec]) {
    throw new Error("Unsupported EC level: " + ec);
  }
  const utf8 = utf8Bytes(text);
  const version = pickVersion(utf8.length, ec);
  if (version < 0) {
    throw new Error("Data too long for versions 1-10");
  }
  const data = encodeData(text, version, ec);
  const codewords = interleaveCodewords(data, version, ec);
  const size = VERSION_TABLE[version].modules;
  const { m, reserved: r } = makeMatrix(size);

  // Finder patterns
  placeFinder(m, r, 0, 0);
  placeFinder(m, r, 0, size - 7);
  placeFinder(m, r, size - 7, 0);

  // Alignment patterns
  const aligns = getAlignmentPositions(version);
  for (const r1 of aligns) {
    for (const c1 of aligns) {
      // Skip if overlaps a finder
      if ((r1 === 6 && c1 === 6) || (r1 === 6 && c1 === size - 7) || (r1 === size - 7 && c1 === 6)) continue;
      placeAlignment(m, r, r1, c1);
    }
  }

  // Timing
  placeTimingPatterns(m, r);

  // Reserve format info
  reserveFormatInfo(m, r);

  // Data
  placeData(m, r, codewords);

  // Mask + format
  const ecBits = EC_BITS[ec];
  const maskId = chooseMask(m, r, ecBits);
  applyMask(m, r, maskId);
  placeFormat(m, ecBits, maskId);

  return {
    version,
    size,
    mask: maskId,
    modules: m,
  };
}

// -------- Render: text art (for tests/display) --------
export function renderText(qr, inverse = false) {
  const lines = [];
  for (let r = 0; r < qr.size; r++) {
    let line = "";
    for (let c = 0; c < qr.size; c++) {
      const bit = qr.modules[r][c];
      line += (bit ^ (inverse ? 1 : 0)) ? "██" : "  ";
    }
    lines.push(line);
  }
  return lines.join("\n");
}

// -------- Render to a small data-URL (PNG via canvas) --------
export function renderToCanvas(qr, scale = 6) {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  const size = qr.size * scale;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#000000";
  for (let r = 0; r < qr.size; r++) {
    for (let c = 0; c < qr.size; c++) {
      if (qr.modules[r][c]) {
        ctx.fillRect(c * scale, r * scale, scale, scale);
      }
    }
  }
  return canvas;
}

export function renderToPngDataUrl(qr, scale = 6) {
  const canvas = renderToCanvas(qr, scale);
  if (!canvas) return null;
  return canvas.toDataURL("image/png");
}

export function downloadPng(qr, filename = "qr.png", scale = 8) {
  if (typeof document === "undefined") return;
  const dataUrl = renderToPngDataUrl(qr, scale);
  if (!dataUrl) return;
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}