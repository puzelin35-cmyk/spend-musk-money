const INTEGER = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 });
const DECIMAL = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 });
const CURRENCY = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 0 });
const DAY_MS = 24 * 60 * 60 * 1000;
const LIFE_EXPECTANCY = 79.25;
const ANNUAL_LEAVE_AND_HOLIDAYS = 21;

const CITIES = {
  tier1: { name: "一线城市", disposable: 85000 },
  new1: { name: "新一线城市", disposable: 62000 },
  county: { name: "小城市 / 县城", disposable: 43000 }
};

const el = id => document.getElementById(id);
const today = startOfDay(new Date());
let currentProfile = null;
let currentResult = null;
let shareText = "";

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatDays(value) {
  return `${INTEGER.format(Math.max(0, Math.round(value)))} 天`;
}

function formatHours(value) {
  return `${INTEGER.format(Math.max(0, Math.round(value)))} 小时`;
}

function formatWan(value) {
  return `${(value / 10000).toFixed(value >= 1000000 ? 0 : 1)} 万`;
}

function dateText(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getProfile(form = el("workForm")) {
  const data = new FormData(form);
  return {
    birthYear: Number(data.get("birthYear")),
    city: data.get("city"),
    income: Number(data.get("income")),
    retireAge: Number(data.get("retireAge")),
    workDays: Number(data.get("workDays")),
    workHours: Number(data.get("workHours")),
    commute: Number(data.get("commute"))
  };
}

function validate(profile) {
  const currentAge = today.getFullYear() - profile.birthYear;
  if (!profile.birthYear || profile.birthYear < 1950 || profile.birthYear > today.getFullYear()) return "出生年份需要在 1950 年到当前年份之间。";
  if (profile.retireAge <= currentAge) return `你现在约 ${currentAge} 岁，预计退休年龄需要大于当前年龄。`;
  if (profile.workDays <= 0 || profile.workDays > 7) return "每周工作天数需要在 1 到 7 天之间。";
  if (profile.workHours <= 0 || profile.workHours > 16) return "每天工作时长需要在 1 到 16 小时之间。";
  if (profile.income < 0) return "税后月收入不能为负数。";
  return "";
}

function calculate(profile) {
  const birthDate = new Date(profile.birthYear, 0, 1);
  const retireDate = new Date(profile.birthYear + profile.retireAge, 0, 1);
  const lifeEndDate = new Date(profile.birthYear + Math.floor(LIFE_EXPECTANCY), Math.round((LIFE_EXPECTANCY % 1) * 12), 1);
  const naturalDays = Math.max(0, Math.ceil((retireDate - today) / DAY_MS));
  const elapsedDays = Math.max(0, Math.ceil((today - birthDate) / DAY_MS));
  const lifeDays = Math.max(1, Math.ceil((lifeEndDate - birthDate) / DAY_MS));
  const weeks = naturalDays / 7;
  const annualYears = naturalDays / 365.2425;
  const leaveDays = Math.min(naturalDays, Math.round(ANNUAL_LEAVE_AND_HOLIDAYS * annualYears));
  const grossWorkdays = weeks * profile.workDays;
  const workdays = Math.max(0, Math.round(grossWorkdays - leaveDays));
  const workHours = Math.round(workdays * profile.workHours);
  const commuteHours = Math.round(workdays * profile.commute * 2 / 60);
  const commuteDays24 = commuteHours / 24;
  const commuteAwakeDays = commuteHours / 16;
  const monthsLeft = naturalDays / 365.2425 * 12;
  const futureIncome = Math.round(profile.income * monthsLeft);
  const nonWorkdays = Math.max(0, naturalDays - workdays);
  const freeDayLow = Math.max(0, Math.round(nonWorkdays * .44));
  const freeDayHigh = Math.max(freeDayLow, Math.round(nonWorkdays * .58));
  const freeDayMid = Math.round((freeDayLow + freeDayHigh) / 2);
  const hourlyValue = profile.income > 0 ? profile.income / 21.75 / Math.max(1, profile.workHours) : CITIES[profile.city].disposable / 12 / 21.75 / Math.max(1, profile.workHours);
  const retiredDays = Math.max(0, Math.ceil((lifeEndDate - retireDate) / DAY_MS));
  return {
    ...profile,
    cityName: CITIES[profile.city].name,
    today,
    birthDate,
    retireDate,
    lifeEndDate,
    currentAge: today.getFullYear() - profile.birthYear,
    naturalDays,
    elapsedDays,
    lifeDays,
    retiredDays,
    annualYears,
    leaveDays,
    workdays,
    workHours,
    commuteHours,
    commuteDays24,
    commuteAwakeDays,
    monthsLeft,
    futureIncome,
    nonWorkdays,
    freeDayLow,
    freeDayHigh,
    freeDayMid,
    hourlyValue
  };
}

function cutSegments(result) {
  const commute = Math.round(result.commuteDays24);
  const free = result.freeDayMid;
  const rest = Math.max(0, result.naturalDays - result.workdays - commute - free);
  return [
    { id: "work", label: "工作日", value: result.workdays, tone: "danger", note: "先交给工作" },
    { id: "commute", label: "通勤折算", value: commute, tone: "danger2", note: "路上消失" },
    { id: "rest", label: "休假 / 周末碎片", value: rest, tone: "neutral", note: "不等于完整自由" },
    { id: "free", label: "真正自由白天", value: free, tone: "green", note: "能完整支配" }
  ];
}

function scenarioProfile(type, base = currentProfile) {
  if (!base) return null;
  const next = { ...base };
  if (type === "lessCommute") next.commute = Math.max(0, next.commute - 30);
  if (type === "fourDays") next.workDays = Math.max(1, next.workDays - 1);
  if (type === "earlyRetire") next.retireAge = Math.max(next.retireAge - 5, today.getFullYear() - next.birthYear + 1);
  if (type === "raiseOvertime") {
    next.income += 3000;
    next.workHours = Math.min(16, next.workHours + 1);
  }
  return next;
}

function scenarioSummary(type, baseResult = currentResult, baseProfile = currentProfile) {
  if (!baseResult || !baseProfile) return null;
  const alt = calculate(scenarioProfile(type, baseProfile));
  const data = {
    lessCommute: {
      title: "少通勤 30 分钟",
      preview: `拿回 ${INTEGER.format(Math.max(0, baseResult.commuteAwakeDays - alt.commuteAwakeDays))} 个清醒日`,
      main: `你拿回了 ${INTEGER.format(Math.max(0, baseResult.commuteAwakeDays - alt.commuteAwakeDays))} 个清醒日`,
      sub: `相当于 ${DECIMAL.format(Math.max(0, baseResult.commuteAwakeDays - alt.commuteAwakeDays) / 30)} 个月不用通勤的生活。`,
      share: `如果我单程少通勤 30 分钟，能拿回 ${INTEGER.format(Math.max(0, baseResult.commuteAwakeDays - alt.commuteAwakeDays))} 个清醒日。`
    },
    fourDays: {
      title: "每周少上一天",
      preview: `少交出 ${INTEGER.format(Math.max(0, baseResult.workdays - alt.workdays))} 个工作日`,
      main: `你少交出 ${INTEGER.format(Math.max(0, baseResult.workdays - alt.workdays))} 个工作日`,
      sub: `新的剩余工作日约 ${INTEGER.format(alt.workdays)} 天，原始判定不变。`,
      share: `如果我每周少上一天班，能少交出 ${INTEGER.format(Math.max(0, baseResult.workdays - alt.workdays))} 个工作日。`
    },
    earlyRetire: {
      title: "提前退休 5 年",
      preview: `少上约 ${INTEGER.format(Math.max(0, baseResult.workdays - alt.workdays))} 天班`,
      main: `你少上约 ${INTEGER.format(Math.max(0, baseResult.workdays - alt.workdays))} 天班`,
      sub: `这只是时间差估算，不代表现实政策承诺。`,
      share: `如果我提前退休 5 年，能少上约 ${INTEGER.format(Math.max(0, baseResult.workdays - alt.workdays))} 天班。`
    },
    raiseOvertime: {
      title: "多赚 3000 但多加班",
      preview: `用 ${INTEGER.format(Math.max(0, alt.workHours - baseResult.workHours))} 小时换 ${formatWan(alt.futureIncome - baseResult.futureIncome)}`,
      main: `多拿 ${formatWan(alt.futureIncome - baseResult.futureIncome)}`,
      sub: `代价是多坐 ${INTEGER.format(Math.max(0, alt.workHours - baseResult.workHours))} 小时。钱变多了，时间也被重新定价。`,
      share: `如果月薪多 3000 但每天多加班 1 小时，我要多坐 ${INTEGER.format(Math.max(0, alt.workHours - baseResult.workHours))} 小时。`
    }
  };
  return data[type];
}

function renderPreview(result) {
  el("heroWorkdays").textContent = INTEGER.format(result.workdays);
  el("heroCommuteDays").textContent = formatDays(result.commuteDays24);
  el("heroCommuteAwake").textContent = `约 ${INTEGER.format(result.commuteAwakeDays)} 个清醒日`;
  el("heroFreeDays").textContent = `${INTEGER.format(result.freeDayLow)}—${INTEGER.format(result.freeDayHigh)} 天`;
  el("heroProfile").textContent = `${result.birthYear} / ${result.retireAge} 岁`;
}

function updatePreview() {
  const profile = getProfile();
  const error = validate(profile);
  if (error) {
    el("heroWorkdays").textContent = "—";
    el("heroCommuteDays").textContent = "调整后计算";
    el("heroCommuteAwake").textContent = error;
    el("heroFreeDays").textContent = "—";
    el("heroProfile").textContent = "口径有误";
    return;
  }
  renderPreview(calculate(profile));
}

function renderResult(result) {
  currentResult = result;
  shareText = defaultShareText(result);
  const commuteDayText = INTEGER.format(Math.round(result.commuteDays24));
  el("cutWorkdays").textContent = formatDays(result.workdays);
  el("cutWorkdaysNote").textContent = `约 ${DECIMAL.format(result.annualYears)} 年继续打卡`;
  el("cutWorkHours").textContent = formatHours(result.workHours);
  el("cutWorkHoursNote").textContent = `${INTEGER.format(result.workdays)} 天 × ${result.workHours / Math.max(1, result.workdays)} 小时/天`;
  el("cutCommute").textContent = `${commuteDayText} / ${INTEGER.format(result.commuteAwakeDays)} 天`;
  el("naturalDays").textContent = formatDays(result.naturalDays);
  el("naturalFormula").textContent = `${dateText(result.retireDate)} - ${dateText(result.today)}`;
  el("workdayStat").textContent = formatDays(result.workdays);
  el("workdayFormula").textContent = `${DECIMAL.format(result.naturalDays / 7)} 周 × 每周 ${result.workDays} 天 - ${INTEGER.format(result.leaveDays)} 天休假`;
  el("workHourStat").textContent = formatHours(result.workHours);
  el("workHourFormula").textContent = `${INTEGER.format(result.workdays)} 天 × ${result.workHours / Math.max(1, result.workdays)} 小时/天`;
  el("commuteStat").textContent = `${commuteDayText} 天`;
  el("commuteFormula").textContent = `${result.commute} 分钟 × 往返 × ${INTEGER.format(result.workdays)} 天 ÷ 24`;
  el("freeDayStat").textContent = `${INTEGER.format(result.freeDayLow)}—${INTEGER.format(result.freeDayHigh)} 天`;
  el("freeDayFormula").textContent = `${INTEGER.format(result.nonWorkdays)} 个非工作日 × 44%—58%`;
  el("futureIncome").textContent = CURRENCY.format(result.futureIncome);
  el("incomeFormula").textContent = `${CURRENCY.format(result.income)}/月 × ${DECIMAL.format(result.monthsLeft)} 个月`;
  el("lifeExpectancyLabel").textContent = `寿命参考 ${LIFE_EXPECTANCY} 岁 · 当前约 ${result.currentAge} 岁`;
  renderCutBars(result);
  renderScenarioCards(result);
  renderShare(result);
  el("takeBackResult").innerHTML = `<span>拿回人生</span><b>先点一张卡</b><p>系统会只替换这一项，原始判定不丢失。</p>`;
  el("result").hidden = false;
  el("resultTitle").focus({ preventScroll: true });
  el("result").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

function renderCutBars(result) {
  const segments = cutSegments(result);
  el("cutBars").innerHTML = segments.map(segment => {
    const pct = result.naturalDays ? clamp(segment.value / result.naturalDays * 100, 2, 100) : 0;
    return `<article class="${segment.tone}"><div><b>${segment.label}</b><span>${formatDays(segment.value)}</span><small>${segment.note}</small></div><i style="--w:${pct}%"></i></article>`;
  }).join("");
  el("cutSummary").textContent = `你以为未来还有 ${INTEGER.format(result.naturalDays)} 天，但能完整自由支配的白天，可能只剩 ${INTEGER.format(result.freeDayMid)} 天。`;
}

function renderScenarioCards(result) {
  el("whatIfCards").innerHTML = ["lessCommute", "fourDays", "earlyRetire", "raiseOvertime"].map(type => {
    const summary = scenarioSummary(type, result, currentProfile);
    return `<button type="button" data-scenario="${type}"><span>${summary.title}</span><b>${summary.preview}</b></button>`;
  }).join("");
}

function renderShare(result, scenario = null) {
  if (scenario) {
    el("shareLineA").textContent = scenario.share;
    el("shareLineB").textContent = "这是我能拿回的人生。";
    el("shareQuote").textContent = "有些自由，不是买来的，是少被切走的。";
    shareText = scenario.share;
    return;
  }
  el("shareLineA").textContent = `我离退休还有 ${INTEGER.format(result.workdays)} 个工作日。`;
  el("shareLineB").textContent = `其中 ${INTEGER.format(Math.round(result.commuteDays24))} 天，会花在通勤路上。`;
  el("shareQuote").textContent = "最贵的不是 8 小时上班，而是上班前后那段没人付钱的时间。";
  shareText = defaultShareText(result);
}

function defaultShareText(result) {
  return `我离退休还有 ${INTEGER.format(result.workdays)} 个工作日。其中 ${INTEGER.format(Math.round(result.commuteDays24))} 天，会花在通勤路上。`;
}

function showError(message) {
  el("formError").textContent = message;
  el("formError").hidden = false;
}

function clearError() {
  el("formError").textContent = "";
  el("formError").hidden = true;
}

function submit(event) {
  event.preventDefault();
  const profile = getProfile(event.currentTarget);
  const error = validate(profile);
  if (error) {
    showError(error);
    return;
  }
  clearError();
  currentProfile = profile;
  const result = calculate(profile);
  renderPreview(result);
  renderResult(result);
}

function renderScenario(type) {
  if (!currentResult || !currentProfile) return;
  const summary = scenarioSummary(type);
  el("takeBackResult").innerHTML = `<span>拿回人生</span><b>${summary.main}</b><p>${summary.sub}</p>`;
  renderShare(currentResult, summary);
}

async function copyResult() {
  if (!shareText) return;
  try {
    await navigator.clipboard.writeText(shareText);
    toast("人生考勤已复制，可以去分享了");
  } catch {
    toast("复制失败，请长按分享卡复制");
  }
}

function toast(message) {
  el("toast").textContent = message;
  el("toast").classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el("toast").classList.remove("show"), 2400);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

el("asOfLabel").textContent = `AS OF ${dateText(today)}`;
el("commute").addEventListener("input", event => {
  el("commuteOutput").textContent = `${event.target.value} 分钟`;
  updatePreview();
});
["birthYear", "city", "income", "retireAge", "workDays", "workHours"].forEach(id => {
  el(id).addEventListener("input", updatePreview);
  el(id).addEventListener("change", updatePreview);
});
el("workForm").addEventListener("submit", submit);
el("resetBtn").addEventListener("click", () => {
  el("result").hidden = true;
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
});
el("copyResult").addEventListener("click", copyResult);
el("whatIfCards").addEventListener("click", event => {
  const button = event.target.closest("[data-scenario]");
  if (button) renderScenario(button.dataset.scenario);
});

currentProfile = getProfile();
currentResult = calculate(currentProfile);
renderPreview(currentResult);
shareText = defaultShareText(currentResult);

window.__workdaysTest = { calculate, validate, cutSegments, scenarioSummary, CITIES, LIFE_EXPECTANCY };
