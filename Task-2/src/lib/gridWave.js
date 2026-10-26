export function buildGridWave({ width = 1000, height = 260, rows = 11, colEvery = 80 } = {}) {
  const top = 28;
  const bottom = height - 28;
  const gap = (bottom - top) / (rows - 1);

  const envelope = (x) => {
    const t = Math.min(Math.max((x - width * 0.2) / (width * 0.5), 0), 1);
    return t * t * (3 - 2 * t);
  };
  const yAt = (r, x) => top + r * gap + envelope(x) * Math.sin(x / 68 + r * 0.42) * (14 + r * 1.1);

  const rowPaths = Array.from({ length: rows }, (_, r) => {
    let d = "";
    for (let x = 0; x <= width; x += 10) {
      d += `${x === 0 ? "M" : "L"}${x} ${yAt(r, x).toFixed(1)} `;
    }
    return d.trim();
  });

  const colPaths = [];
  for (let x = colEvery; x < width; x += colEvery) {
    let d = "";
    for (let r = 0; r < rows; r += 1) {
      d += `${r === 0 ? "M" : "L"}${x} ${yAt(r, x).toFixed(1)} `;
    }
    colPaths.push(d.trim());
  }

  return { rows: rowPaths, cols: colPaths };
}

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const ease = (t) => t * t * (3 - 2 * t);

export function createGridWave({ width = 1000, height = 260, rows = 9, colEvery = 80, step = 10 } = {}) {
  const top = 28;
  const bottom = height - 34; 
  const baseline = height - 1; 
  const gap = (bottom - top) / (rows - 1);

  const envelope = (x) => ease(clamp01((x - width * 0.2) / (width * 0.5)));
  const natural = (r, x) => top + r * gap + envelope(x) * Math.sin(x / 68 + r * 0.42) * (14 + r * 1.1);

  const local = (r, s) => clamp01((s - 0.3 * (1 - r / (rows - 1))) / 0.7);
  const yAt = (r, x, s = 0) => {
    const y = natural(r, x);
    return y + (baseline - y) * ease(local(r, s));
  };

  const rowPath = (r, s = 0) => {
    let d = "";
    for (let x = 0; x <= width; x += step) {
      d += `${x === 0 ? "M" : "L"}${x} ${yAt(r, x, s).toFixed(1)} `;
    }
    return d.trim();
  };

  const rowOpacity = (r, s) => (r === rows - 1 ? 1 : 1 - clamp01((local(r, s) - 0.55) / 0.45));

  const colXs = [];
  for (let x = colEvery; x < width; x += colEvery) colXs.push(x);

  const colPath = (x, s = 0) => {
    let d = "";
    for (let r = 0; r < rows; r += 1) d += `${r === 0 ? "M" : "L"}${x} ${yAt(r, x, s).toFixed(1)} `;
    return `${d}L${x} ${baseline}`;
  };

  return { rows, colXs, baseline, rowPath, rowOpacity, colPath };
}