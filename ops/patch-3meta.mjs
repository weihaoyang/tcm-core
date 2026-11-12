import { readFileSync, writeFileSync } from "node:fs";

const qimenYearPatches = [
  ["lib/qimen/QimenChart.js", "(getYearByLiChun ? getYearByLiChun() : lunar.getYearInGanZhiExact())", "lunar.getYearInGanZhiExact()"],
  ["dist/3meta.esm.js", '="exact"===F?C?C():u.getYearInGanZhiExact()', '="exact"===F?u.getYearInGanZhiExact()'],
];
for (const [path, before, after] of qimenYearPatches) {
  const file = new URL("../node_modules/3meta/" + path, import.meta.url);
  const source = readFileSync(file, "utf8");
  if (!source.includes(before)) {
    if (!source.includes(after) && !source.includes("exactYearGZ")) throw new Error("Review 3meta exact year patch");
    continue;
  }
  writeFileSync(file, source.replace(before, after));
}

const qimenCalendarPatches = [
  ["lib/qimen/QimenChart.js", "lunar.getYearInGanZhiExact()", "(opts?.exactYearGZ ?? lunar.getYearInGanZhiExact())", "lunar.getMonthInGanZhiExact()", "(opts?.exactMonthGZ ?? lunar.getMonthInGanZhiExact())"],
  ["dist/3meta.esm.js", '?u.getYearInGanZhiExact():u.getYearInGanZhi()', '?(n?.exactYearGZ??u.getYearInGanZhiExact()):u.getYearInGanZhi()', 'd=u.getMonthInGanZhiExact()', 'd=(n?.exactMonthGZ??u.getMonthInGanZhiExact())'],
];

const qimenJuPatches = [
  ["lib/qimen/QimenChart.js", "(0, calculator_1.getJuShu)(solarTerm, yuan, isYangdun);", "((0, calculator_1.getJuShu)(solarTerm, yuan, isYangdun) || (0, calculator_1.getJuShu)(solarTerm, yuan, !isYangdun));"],
  ["dist/3meta.esm.js", "||me(B,x,m),p=", "||me(B,x,m)||me(B,x,!m),p="],
];
// 值使门取寄宫之门，但旬首在中五时仍从五宫起算；不能从寄宫二起算。
for (const [path, before, after] of [
  ["lib/qimen/calculator.js", "let position = constants_1.GATE_ORIGINAL_POSITIONS[zhiShiMen];", "let position = zhiFuGong;"],
  ["dist/3meta.esm.js", "h=(le(r)-le(s)+12)%12;let g=ie[a];", "h=(le(r)-le(s)+12)%12;let g=n;"],
]) {
  const file = new URL("../node_modules/3meta/" + path, import.meta.url);
  const source = readFileSync(file, "utf8");
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error("Review 3meta central palace gate counting patch");
  writeFileSync(file, source.replace(before, after));
}
// 选择《奇门遁甲统宗》阴阳均寄坤口径：中五落宫与寄干统一归坤二。
for (const [path, before, after] of [
  ["lib/qimen/calculator.js", "const rawPosition = position;\n    if (position === 5)\n        position = isYangdun ? 8 : 2;", "const rawPosition = position;\n    if (position === 5)\n        position = 2;"],
  ["lib/qimen/calculator.js", "const targetPos = isYangdun ? 8 : 2;", "const targetPos = 2;"],
  ["lib/qimen/calculator.js", "type: isYangdun ? '阳遁寄艮八' : '阴遁寄坤二'", "type: '中五寄坤二'"],
  ["dist/3meta.esm.js", "return 5===g&&(g=t?8:2),{gate:a,position:g,rawPosition:o}", "return 5===g&&(g=2),{gate:a,position:g,rawPosition:o}"],
  ["dist/3meta.esm.js", "const a=e?8:2,s=t.find(e=>e.position===a)", "const a=2,s=t.find(e=>e.position===a)"],
  ["dist/3meta.esm.js", 'type:e?"阳遁寄艮八":"阴遁寄坤二"', 'type:"中五寄坤二"'],
]) {
  const file = new URL("../node_modules/3meta/" + path, import.meta.url);
  const source = readFileSync(file, "utf8");
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error("Review 3meta Kun palace hosting patch");
  writeFileSync(file, source.replace(before, after));
}
for (const [path, before, after] of qimenJuPatches) {
  const file = new URL("../node_modules/3meta/" + path, import.meta.url);
  const source = readFileSync(file, "utf8");
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error("Review 3meta forced dun patch");
  writeFileSync(file, source.replace(before, after));
}
for (const [path, yearBefore, yearAfter, monthBefore, monthAfter] of qimenCalendarPatches) {
  const file = new URL("../node_modules/3meta/" + path, import.meta.url);
  const source = readFileSync(file, "utf8");
  if (source.includes(yearAfter) && source.includes(monthAfter)) continue;
  if (!source.includes(yearBefore) || !source.includes(monthBefore)) throw new Error("Review 3meta calendar patch");
  writeFileSync(file, source.replace(yearBefore, yearAfter).replace(monthBefore, monthAfter));
}


// 天禽寄宫 can leave two heavenly stems on one palace.
for (const [path, before, after] of [
  ["lib/qimen/calculator.js", "tianGan === cond.tianGan && position === cond.gong", "(Array.isArray(tianGan) ? tianGan.includes(cond.tianGan) : tianGan === cond.tianGan) && position === cond.gong"],
  ["dist/3meta.esm.js", "n===t.tianGan&&e===t.gong", "(Array.isArray(n)?n.includes(t.tianGan):n===t.tianGan)&&e===t.gong"],
]) {
  const file = new URL("../node_modules/3meta/" + path, import.meta.url);
  const source = readFileSync(file, "utf8");
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error("Review 3meta hosted-stem punishment patch");
  writeFileSync(file, source.replace(before, after));
}

for (const format of ["mjs", "cjs"]) {
  const file = new URL("../node_modules/lunar-typescript/dist/index." + format, import.meta.url);
  const source = readFileSync(file, "utf8");
  const before = "  getMonthGanIndexExact() {";
  const after = `  setSolarTermReference(reference) {
    this._solarTermReference = reference;
    this._yearGanIndexExact = reference.getYearGanIndexExact();
    this._yearZhiIndexExact = reference.getYearZhiIndexExact();
    this._monthGanIndexExact = reference.getMonthGanIndexExact();
    this._monthZhiIndexExact = reference.getMonthZhiIndexExact();
  }
${before}`;
  const yunBefore = "    const prev = lunar.getPrevJie();\n    const next = lunar.getNextJie();\n    const current = lunar.getSolar();";
  const yunAfter = "    const termReference = lunar._solarTermReference ?? lunar;\n    const prev = termReference.getPrevJie();\n    const next = termReference.getNextJie();\n    const current = termReference.getSolar();";
  if (source.includes(after) && source.includes(yunAfter)) continue;
  if (source.split(before).length !== 2 || !source.includes(yunBefore)) throw new Error("Review lunar-typescript solar term reference patch");
  writeFileSync(file, source.replace(before, after).replace(yunBefore, yunAfter));
}

for (const format of ["mjs", "cjs"]) {
  const file = new URL("../node_modules/lunar-typescript/dist/index." + format, import.meta.url);
  const source = readFileSync(file, "utf8");
  const before = "const yang = 0 === lunar.getYearGanIndexExact() % 2;";
  const after = "const yang = 0 === (lunar._yunYearGanIndex ?? lunar.getYearGanIndexExact()) % 2;";
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error("Review lunar-typescript Yun year stem patch");
  writeFileSync(file, source.replace(before, after));
}



// The late Zi hour starts at the next day's shichen slot. Keep midnight
// subtraction consistent with the library's twelve-slot coarse luck method.
for (const format of ["mjs", "cjs"]) {
  const file = new URL("../node_modules/lunar-typescript/dist/index." + format, import.meta.url);
  let source = readFileSync(file, "utf8");
  for (const variable of ["end", "start"]) {
    const before = variable + ".getHour() == 23 ? 11 :";
    const after = variable + ".getHour() == 23 ? 12 :";
    if (source.includes(after)) continue;
    if (source.split(before).length !== 2) throw new Error("Review lunar-typescript late Zi luck offset patch");
    source = source.replace(before, after);
  }
  writeFileSync(file, source);
}
