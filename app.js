const CURRENCY = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 0 });
const INTEGER = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 });
const el = id => document.getElementById(id);

const SOURCES = {
  consumption: { title: "2025年居民收入和消费支出情况", org: "国家统计局", year: 2025, url: "https://www.stats.gov.cn/sj/zxfb/202601/t20260119_1962321.html", note: "全国居民人均消费支出29,476元，其中食品烟酒8,631元、交通通信4,306元。" },
  wages: { title: "2025年城镇单位就业人员年平均工资情况", org: "国家统计局", year: 2025, url: "https://www.stats.gov.cn/sj/zxfb/202605/t20260515_1963707.html", note: "用于收入缺失时的时间价值校验；本页优先采用用户输入的税后月收入。" },
  mortgage: { title: "关于下调个人住房公积金贷款利率的通知", org: "中国人民银行 / 中国政府网", year: 2025, url: "https://app.www.gov.cn/govdata/gov/202505/07/528461/article.html", note: "5年以上首套公积金贷款利率2.6%；本页商业组合场景使用3.4%的保守假设。" },
  scenario: { title: "一生账单场景参数", org: "产品估算", year: 2025, url: "DATA_SOURCES.md", note: "城市房价、租金、物业、托育和护理等使用透明的代表性场景值，不宣称为城市官方均价。" }
};

const CITIES = {
  tier1: { name: "一线城市", foodAnnual: 13200, transitFare: 7, rentMonthly: 5200, homePrice: 3000000, propertyMonthly: 320, education: 1.35, medical: 1.25, disposable: 85000 },
  new1: { name: "新一线城市", foodAnnual: 10800, transitFare: 5, rentMonthly: 2900, homePrice: 1650000, propertyMonthly: 230, education: 1.08, medical: 1.05, disposable: 62000 },
  county: { name: "小城市 / 县城", foodAnnual: 8600, transitFare: 3, rentMonthly: 1500, homePrice: 760000, propertyMonthly: 140, education: .82, medical: .88, disposable: 43000 }
};

const state = { profile: null, stage: 0, selections: [], pending: null };

function bill(input) {
  const unitPrice = input.unitPrice || 0;
  const frequency = input.frequency || 0;
  const years = input.years || 0;
  return {
    id: input.id,
    stage: input.stage,
    category: input.category,
    label: input.label,
    unitPrice,
    frequency,
    years,
    cashCost: input.cashCost ?? Math.round(unitPrice * frequency * years),
    timeHours: input.timeHours || 0,
    opportunityCost: input.opportunityCost || 0,
    formula: input.formula || `${formatMoney(unitPrice)} × ${frequency}次/年 × ${years}年`,
    assumptions: input.assumptions || "按2025年当前价格估算，不计未来通胀。",
    sourceIds: input.sourceIds || ["scenario"],
    small: Boolean(input.small),
    forSelf: Boolean(input.forSelf)
  };
}

function mortgagePayment(principal, annualRate, years) {
  const r = annualRate / 12;
  const n = years * 12;
  return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

function hourlyValue() {
  const income = state.profile?.income || (CITIES[state.profile?.city || "new1"].disposable / 12);
  return income / 21.75 / 8;
}

function childhood(level) {
  const c = CITIES[state.profile.city];
  const factor = level === "basic" ? .82 : level === "enriched" ? 1 : 1.45;
  return [
    bill({ id: "child-food", stage: 0, category: "成长", label: "0—18岁饮食", unitPrice: Math.round(c.foodAnnual * .72 * factor), frequency: 1, years: 18, formula: `${formatMoney(Math.round(c.foodAnnual * .72 * factor))}/年 × 18年`, sourceIds: ["consumption"], small: true }),
    bill({ id: "child-education", stage: 0, category: "成长", label: "教育与兴趣培养", unitPrice: Math.round(7200 * c.education * factor), frequency: 1, years: 15, formula: `${formatMoney(Math.round(7200 * c.education * factor))}/年 × 15年`, sourceIds: ["scenario"] }),
    bill({ id: "child-medical", stage: 0, category: "成长", label: "衣物、医疗与用品", unitPrice: Math.round(5200 * c.medical * factor), frequency: 1, years: 18, formula: `${formatMoney(Math.round(5200 * c.medical * factor))}/年 × 18年`, sourceIds: ["consumption"] }),
    bill({ id: "care-time", stage: 0, category: "成长", label: "家庭无偿照护时间", timeHours: Math.round(1.2 * 365 * 12 * factor), formula: `1.2小时/天 × 365天 × 12年`, assumptions: "只计算日常额外照护时间，不包含睡眠和共同生活。", sourceIds: ["scenario"] })
  ];
}

function education(level) {
  const c = CITIES[state.profile.city];
  const cfg = {
    vocational: { years: 3, tuition: 6500, living: 15000, delay: 0, label: "职业教育" },
    bachelor: { years: 4, tuition: 6000, living: 18000, delay: 1, label: "本科" },
    master: { years: 7, tuition: 8500, living: 21000, delay: 4, label: "研究生" }
  }[level];
  const delayedIncome = Math.round(state.profile.income * 12 * cfg.delay * .55);
  return [
    bill({ id: "tuition", stage: 1, category: "教育", label: `${cfg.label}学费`, unitPrice: Math.round(cfg.tuition * c.education), frequency: 1, years: cfg.years, formula: `${formatMoney(Math.round(cfg.tuition * c.education))}/年 × ${cfg.years}年`, sourceIds: ["scenario"] }),
    bill({ id: "campus-living", stage: 1, category: "教育", label: "在校生活与住宿", unitPrice: Math.round(cfg.living * (.8 + c.education * .2)), frequency: 1, years: cfg.years, formula: `${formatMoney(Math.round(cfg.living * (.8 + c.education * .2)))}/年 × ${cfg.years}年`, sourceIds: ["consumption", "scenario"], small: true }),
    bill({ id: "delayed-work", stage: 1, category: "教育", label: "延迟就业的收入", opportunityCost: delayedIncome, formula: `${formatMoney(state.profile.income)}/月 × 12月 × ${cfg.delay}年 × 55%`, assumptions: "相对3年职业教育路径估算；55%用于扣除在职生活支出差异。", sourceIds: ["wages"] })
  ];
}

function work(style) {
  const c = CITIES[state.profile.city];
  const cfg = {
    frugal: { food: .82, takeaway: 40, drink: 35, overtime: 2 },
    balanced: { food: 1, takeaway: 100, drink: 90, overtime: 4 },
    convenient: { food: 1.18, takeaway: 180, drink: 150, overtime: 7 }
  }[style];
  const commuteHours = state.profile.commute * 2 * 250 * 35 / 60;
  return [
    bill({ id: "adult-food", stage: 2, category: "日常", label: "工作期日常饮食", unitPrice: Math.round(c.foodAnnual * cfg.food), frequency: 1, years: 35, formula: `${formatMoney(Math.round(c.foodAnnual * cfg.food))}/年 × 35年`, sourceIds: ["consumption"], small: true }),
    bill({ id: "takeaway-premium", stage: 2, category: "日常", label: "外卖便利溢价", unitPrice: 16, frequency: cfg.takeaway, years: 35, formula: `比自炊多16元/次 × ${cfg.takeaway}次/年 × 35年`, sourceIds: ["scenario"], small: true }),
    bill({ id: "drinks", stage: 2, category: "日常", label: "咖啡、奶茶与随手买", unitPrice: 22, frequency: cfg.drink, years: 35, formula: `22元/次 × ${cfg.drink}次/年 × 35年`, sourceIds: ["scenario"], small: true, forSelf: true }),
    bill({ id: "commute-fare", stage: 2, category: "通勤", label: "上下班交通费", unitPrice: c.transitFare * 2, frequency: 250, years: 35, formula: `${formatMoney(c.transitFare)} × 往返2次 × 250天 × 35年`, sourceIds: ["consumption", "scenario"], small: true }),
    bill({ id: "commute-time", stage: 2, category: "通勤", label: "通勤占用时间", timeHours: Math.round(commuteHours), formula: `${state.profile.commute}分钟 × 往返2次 × 250天 × 35年`, assumptions: `按你的税后收入折算为约${formatMoney(hourlyValue())}/小时。`, sourceIds: ["wages"] }),
    bill({ id: "overtime", stage: 2, category: "工作", label: "未补偿的额外工作", timeHours: cfg.overtime * 48 * 30, formula: `${cfg.overtime}小时/周 × 48周 × 30年`, assumptions: "仅用于显示个人时间占用，不推断劳动关系或加班补偿。", sourceIds: ["scenario"] })
  ];
}

function housing(type) {
  const c = CITIES[state.profile.city];
  if (type === "rent") return [
    bill({ id: "rent", stage: 3, category: "住房", label: "长期租金", unitPrice: c.rentMonthly, frequency: 12, years: 35, formula: `${formatMoney(c.rentMonthly)}/月 × 12月 × 35年`, sourceIds: ["scenario"] }),
    bill({ id: "moving", stage: 3, category: "住房", label: "搬家、中介与更新", unitPrice: 6500, frequency: 1 / 3, years: 35, formula: `每3年约6,500元 × 35年`, sourceIds: ["scenario"], small: true })
  ];
  if (type === "family") return [
    bill({ id: "family-contribution", stage: 3, category: "住房", label: "家庭居住分担", unitPrice: Math.round(c.rentMonthly * .32), frequency: 12, years: 25, formula: `${formatMoney(Math.round(c.rentMonthly * .32))}/月 × 12月 × 25年`, sourceIds: ["scenario"] }),
    bill({ id: "family-renovation", stage: 3, category: "住房", label: "翻新与家电更新", unitPrice: 70000, frequency: 2, years: 1, formula: `约70,000元 × 2次`, sourceIds: ["scenario"] })
  ];
  const price = c.homePrice;
  const down = price * .3;
  const principal = price * .7;
  const monthly = mortgagePayment(principal, .034, 30);
  const interest = monthly * 360 - principal;
  const opportunity = down * (Math.pow(1.03, 30) - 1);
  return [
    bill({ id: "home-price", stage: 3, category: "住房", label: "房屋成交价", cashCost: price, formula: `代表性住房场景价`, sourceIds: ["scenario"] }),
    bill({ id: "mortgage-interest", stage: 3, category: "住房", label: "30年贷款利息", cashCost: Math.round(interest), formula: `${formatMoney(principal)}贷款本金，年利率3.4%，等额本息360期`, assumptions: `月供约${formatMoney(monthly)}；利率为商业组合场景假设。`, sourceIds: ["mortgage", "scenario"] }),
    bill({ id: "renovation", stage: 3, category: "住房", label: "装修与家电", cashCost: Math.round(price * .08), formula: `房屋总价 × 8%`, sourceIds: ["scenario"] }),
    bill({ id: "property", stage: 3, category: "住房", label: "物业费", unitPrice: c.propertyMonthly, frequency: 12, years: 30, formula: `${formatMoney(c.propertyMonthly)}/月 × 12月 × 30年`, sourceIds: ["scenario"], small: true }),
    bill({ id: "maintenance", stage: 3, category: "住房", label: "维修与更新", cashCost: Math.round(price * .06), formula: `房屋总价 × 6%`, sourceIds: ["scenario"] }),
    bill({ id: "down-opportunity", stage: 3, category: "住房", label: "首付占用的机会成本", opportunityCost: Math.round(opportunity), formula: `${formatMoney(down)}首付 × 3%年化复利30年产生的增量`, assumptions: "这是资金占用的机会成本，不是实际付款，也不与房价重复。", sourceIds: ["scenario"] })
  ];
}

function family(type) {
  const c = CITIES[state.profile.city];
  if (type === "single") return [
    bill({ id: "social", stage: 4, category: "家庭", label: "社交、探亲与独居增量", unitPrice: 5200, frequency: 1, years: 25, formula: `5,200元/年 × 25年`, sourceIds: ["scenario"], forSelf: true })
  ];
  if (type === "couple") return [
    bill({ id: "wedding", stage: 4, category: "家庭", label: "婚礼与共同安家", cashCost: Math.round(110000 * c.education), formula: `基础场景110,000元 × 城市系数${c.education}`, sourceIds: ["scenario"] }),
    bill({ id: "couple-life", stage: 4, category: "家庭", label: "纪念日、探亲与共同体验", unitPrice: 7000, frequency: 1, years: 25, formula: `7,000元/年 × 25年`, sourceIds: ["scenario"], small: true, forSelf: true })
  ];
  const careerBreak = state.profile.income * 12 * 1.5 * .7;
  return [
    bill({ id: "birth", stage: 4, category: "育儿", label: "孕产与婴幼儿用品", cashCost: Math.round(65000 * c.medical), formula: `基础场景65,000元 × 医疗系数${c.medical}`, sourceIds: ["scenario"] }),
    bill({ id: "child-living", stage: 4, category: "育儿", label: "孩子饮食、衣物与医疗", unitPrice: Math.round(12500 * c.education), frequency: 1, years: 18, formula: `${formatMoney(Math.round(12500 * c.education))}/年 × 18年`, sourceIds: ["consumption", "scenario"], small: true }),
    bill({ id: "child-school", stage: 4, category: "育儿", label: "托育、教育与兴趣", unitPrice: Math.round(19000 * c.education), frequency: 1, years: 18, formula: `${formatMoney(Math.round(19000 * c.education))}/年 × 18年`, sourceIds: ["scenario"] }),
    bill({ id: "child-space", stage: 4, category: "育儿", label: "住房空间增量", unitPrice: Math.round(c.rentMonthly * .23), frequency: 12, years: 18, formula: `${formatMoney(Math.round(c.rentMonthly * .23))}/月 × 12月 × 18年`, sourceIds: ["scenario"] }),
    bill({ id: "child-care-time", stage: 4, category: "育儿", label: "陪伴与接送时间", timeHours: 2 * 365 * 12, formula: `平均2小时/天 × 365天 × 12年`, sourceIds: ["scenario"] }),
    bill({ id: "career-break", stage: 4, category: "育儿", label: "家庭职业中断", opportunityCost: Math.round(careerBreak), formula: `${formatMoney(state.profile.income)}/月 × 12月 × 1.5年 × 70%`, assumptions: "不预设由哪位家庭成员承担，仅表达家庭层面的收入影响。", sourceIds: ["wages", "scenario"] })
  ];
}

function midlife(type) {
  const c = CITIES[state.profile.city];
  const cfg = { shared: { nursing: 12000, trips: 8, days: 8 }, personal: { nursing: 6000, trips: 12, days: 28 }, professional: { nursing: 36000, trips: 5, days: 4 } }[type];
  const leaveCost = state.profile.income / 21.75 * cfg.days * 8;
  return [
    bill({ id: "parent-medical", stage: 5, category: "照护", label: "父母医疗与康复分担", unitPrice: Math.round(19000 * c.medical), frequency: 1, years: 12, formula: `${formatMoney(Math.round(19000 * c.medical))}/年 × 12年`, sourceIds: ["consumption", "scenario"] }),
    bill({ id: "nursing", stage: 5, category: "照护", label: "护工与照护服务", unitPrice: cfg.nursing, frequency: 1, years: 8, formula: `${formatMoney(cfg.nursing)}/年 × 8年`, sourceIds: ["scenario"] }),
    bill({ id: "family-trips", stage: 5, category: "照护", label: "异地往返与临时支出", unitPrice: 900, frequency: cfg.trips, years: 12, formula: `900元/次 × ${cfg.trips}次/年 × 12年`, sourceIds: ["scenario"], small: true }),
    bill({ id: "care-leave", stage: 5, category: "照护", label: "请假与工作中断", opportunityCost: Math.round(leaveCost), formula: `税后日收入 × ${cfg.days}天/年 × 8年`, sourceIds: ["wages", "scenario"] }),
    bill({ id: "care-hours", stage: 5, category: "照护", label: "陪诊与日常照护时间", timeHours: cfg.days * 8 * 8, formula: `${cfg.days}天/年 × 8小时 × 8年`, sourceIds: ["scenario"] })
  ];
}

function retirement(type) {
  const c = CITIES[state.profile.city];
  const cfg = { basic: { living: .78, medical: .8, care: 0, self: 3500 }, community: { living: 1, medical: 1, care: 18000, self: 7000 }, quality: { living: 1.2, medical: 1.3, care: 36000, self: 16000 } }[type];
  return [
    bill({ id: "retire-living", stage: 6, category: "养老", label: "退休后日常生活", unitPrice: Math.round(c.foodAnnual * 1.8 * cfg.living), frequency: 1, years: 20, formula: `${formatMoney(Math.round(c.foodAnnual * 1.8 * cfg.living))}/年 × 20年`, sourceIds: ["consumption"], small: true }),
    bill({ id: "retire-medical", stage: 6, category: "养老", label: "医疗与康复自付", unitPrice: Math.round(9000 * c.medical * cfg.medical), frequency: 1, years: 20, formula: `${formatMoney(Math.round(9000 * c.medical * cfg.medical))}/年 × 20年`, sourceIds: ["consumption", "scenario"] }),
    bill({ id: "retire-care", stage: 6, category: "养老", label: "长期护理与适老服务", unitPrice: cfg.care, frequency: 1, years: 10, formula: `${formatMoney(cfg.care)}/年 × 10年`, sourceIds: ["scenario"] }),
    bill({ id: "retire-self", stage: 6, category: "养老", label: "兴趣、旅行与自己的生活", unitPrice: cfg.self, frequency: 1, years: 20, formula: `${formatMoney(cfg.self)}/年 × 20年`, sourceIds: ["scenario"], forSelf: true })
  ];
}

const STAGES = [
  { age: "0—18岁", title: "你会花钱以前，家里已经替你结账18年", intro: "童年支出不是你的消费，却是这段人生真实发生过的成本。", options: [{ id: "basic", label: "基础成长", desc: "公立教育，开支量力而行" }, { id: "enriched", label: "丰富成长", desc: "加入兴趣培养与家庭旅行" }, { id: "intensive", label: "高投入成长", desc: "更高教育与生活投入" }], build: childhood },
  { age: "18—25岁", title: "学历账单里，最贵的一行可能不是学费", intro: "多读几年书意味着更多投入，也意味着更晚进入职场。两者必须分开看。", options: [{ id: "vocational", label: "职业教育", desc: "三年后较早进入职场" }, { id: "bachelor", label: "本科", desc: "四年教育与生活投入" }, { id: "master", label: "研究生", desc: "更长教育周期与机会成本" }], build: education },
  { age: "23—60岁", title: "真正吃掉收入的，常常是每天都觉得不贵", intro: "工作餐、外卖、饮品、交通费都不吓人，直到把35年放在同一张账单上。", options: [{ id: "frugal", label: "克制生活", desc: "较少便利消费，工作边界清楚" }, { id: "balanced", label: "平衡生活", desc: "正常外卖、饮品和加班频率" }, { id: "convenient", label: "便利优先", desc: "用钱换时间，也接受更长工作时长" }], build: work },
  { age: "28—65岁", title: "住房价格只是第一行，完整账单在后面", intro: "租金、利息、物业和维修都不是隐藏费用，只是我们很少把它们放在一起。", profileKey: "housing", options: [{ id: "rent", label: "长期租房", desc: "保持流动性，持续支付租金" }, { id: "buy", label: "购买住房", desc: "本金、利息与长期维护" }, { id: "family", label: "与家人同住", desc: "分担居住成本与家庭更新" }], build: housing },
  { age: "28—50岁", title: "家庭没有统一价格，但每个选择都有账单", intro: "这里不判断哪条路更好，只把现金、时间和职业影响分别摊开。", profileKey: "family", options: [{ id: "single", label: "保持单身", desc: "独自承担生活，也保留个人选择" }, { id: "couple", label: "两人生活", desc: "共同安家与共享体验" }, { id: "child", label: "计划育儿", desc: "养育、教育、空间和陪伴" }], build: family },
  { age: "40—58岁", title: "中年最难的不是一笔大钱，而是几张账单同时到来", intro: "父母医疗、照护、往返与请假，常常发生在房贷和教育支出尚未结束时。", options: [{ id: "shared", label: "家人共同承担", desc: "现金和时间相对均衡" }, { id: "personal", label: "亲自多陪伴", desc: "降低服务费用，投入更多时间" }, { id: "professional", label: "专业照护", desc: "增加现金支出，保护工作连续性" }], build: midlife },
  { age: "60—82岁", title: "退休后，钱开始用来购买舒适和体面的时间", intro: "日常、医疗、护理与兴趣共同决定了退休生活的真实成本。", options: [{ id: "basic", label: "基础养老", desc: "控制支出，满足基本生活" }, { id: "community", label: "社区养老", desc: "加入社区服务与适老支持" }, { id: "quality", label: "品质养老", desc: "更多医疗、护理与个人体验" }], build: retirement }
];

function summarizeBills(bills) {
  const cash = bills.reduce((s, x) => s + x.cashCost, 0);
  const hours = bills.reduce((s, x) => s + x.timeHours, 0);
  const timeValue = bills.reduce((s, x) => s + Math.round(x.timeHours * hourlyValue()), 0);
  const opportunity = bills.reduce((s, x) => s + x.opportunityCost, 0);
  return { cash, hours, timeValue, opportunity, total: cash + timeValue + opportunity };
}

function allBills(includePending = false) {
  const picks = state.selections.slice();
  if (includePending && state.pending) picks[state.stage] = state.pending;
  return picks.filter(Boolean).flatMap(x => x.bills);
}

function formatMoney(value) { return CURRENCY.format(Math.round(value || 0)); }
function formatWan(value) { return `${(value / 10000).toFixed(value >= 1000000 ? 0 : 1)}万元`; }

function showScreen(id) {
  ["intro", "journey", "result"].forEach(name => { el(name).hidden = name !== id; });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderTimeline() {
  el("timeline").innerHTML = STAGES.map((s, i) => `<span class="${i < state.stage ? "done" : i === state.stage ? "active" : ""}"><i></i><b>${s.age.split("岁")[0]}</b></span>`).join("");
}

function renderStage() {
  const stage = STAGES[state.stage];
  state.pending = state.selections[state.stage] || null;
  el("stageAge").textContent = `${stage.age} · 第${state.stage + 1}张账单`;
  el("stageTitle").textContent = stage.title;
  el("stageIntro").textContent = stage.intro;
  el("stageCounter").textContent = `${String(state.stage + 1).padStart(2, "0")} / 07`;
  el("options").innerHTML = stage.options.map(option => {
    const selected = state.pending?.id === option.id;
    const suggested = stage.profileKey && state.profile[stage.profileKey] === option.id;
    return `<button type="button" class="option ${selected ? "selected" : ""}" data-option="${option.id}" aria-pressed="${selected}"><span>${option.label}${suggested ? "<em>你的预选</em>" : ""}</span><small>${option.desc}</small></button>`;
  }).join("");
  el("backBtn").disabled = state.stage === 0;
  el("nextBtn").disabled = !state.pending;
  el("nextBtn").textContent = state.stage === STAGES.length - 1 ? "生成最终账单" : "确认这张账单";
  renderTimeline();
  if (state.pending) renderReceipt(state.pending); else clearReceipt();
  renderRunning();
}

function clearReceipt() {
  el("receiptTitle").textContent = "等待选择";
  el("receiptAge").textContent = "—";
  el("receiptEmpty").hidden = false;
  el("receiptBody").hidden = true;
}

function sourceMarkup(ids) {
  return [...new Set(ids)].map(id => {
    const s = SOURCES[id];
    return `<article><b>${s.title}</b><span>${s.org} · ${s.year}</span><p>${s.note}</p><a href="${s.url}" target="_blank" rel="noreferrer">查看原始口径</a></article>`;
  }).join("");
}

function renderReceipt(selection) {
  const summary = summarizeBills(selection.bills);
  el("receiptTitle").textContent = selection.label;
  el("receiptAge").textContent = STAGES[state.stage].age;
  el("receiptEmpty").hidden = true;
  el("receiptBody").hidden = false;
  el("receiptLines").innerHTML = selection.bills.map(item => {
    const amount = item.cashCost || item.opportunityCost || Math.round(item.timeHours * hourlyValue());
    const kind = item.opportunityCost ? "机会成本" : item.timeHours ? `${INTEGER.format(item.timeHours)}小时` : "实际支付";
    return `<article class="receipt-line"><div><b>${item.label}</b><span>${item.formula}</span><small>${kind}</small></div><strong>${formatMoney(amount)}</strong></article>`;
  }).join("");
  el("receiptSubtotal").innerHTML = `<div><span>实际支付</span><b>${formatMoney(summary.cash)}</b></div><div><span>时间折算 · ${INTEGER.format(summary.hours)}小时</span><b>${formatMoney(summary.timeValue)}</b></div><div><span>机会成本</span><b>${formatMoney(summary.opportunity)}</b></div><div class="total"><span>这一阶段综合成本</span><b>${formatMoney(summary.total)}</b></div>`;
  const hidden = [...selection.bills].sort((a, b) => (b.opportunityCost + b.timeHours * hourlyValue() + (b.small ? b.cashCost : 0)) - (a.opportunityCost + a.timeHours * hourlyValue() + (a.small ? a.cashCost : 0)))[0];
  const hiddenAmount = hidden.opportunityCost || Math.round(hidden.timeHours * hourlyValue()) || hidden.cashCost;
  el("missedCost").innerHTML = `<span>你可能漏算了</span><b>${hidden.label}：${formatMoney(hiddenAmount)}</b><p>${hidden.assumptions}</p>`;
  el("sourceContent").innerHTML = sourceMarkup(selection.bills.flatMap(x => x.sourceIds));
}

function renderRunning(preview = false) {
  const summary = summarizeBills(allBills(preview));
  el("runningCash").textContent = formatMoney(summary.cash);
  el("runningTime").textContent = formatMoney(summary.timeValue);
  el("runningOpportunity").textContent = formatMoney(summary.opportunity);
  el("runningTotal").textContent = formatMoney(summary.total);
}

function chooseOption(id) {
  const stage = STAGES[state.stage];
  const option = stage.options.find(x => x.id === id);
  state.pending = { ...option, bills: stage.build(id) };
  document.querySelectorAll(".option").forEach(button => {
    const selected = button.dataset.option === id;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", selected);
  });
  el("nextBtn").disabled = false;
  renderReceipt(state.pending);
  renderRunning(true);
  el("receipt").classList.remove("print-in");
  requestAnimationFrame(() => el("receipt").classList.add("print-in"));
}

function start(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  state.profile = { birthYear: Number(data.get("birthYear")), city: data.get("city"), income: Number(data.get("income")), housing: data.get("housing"), commute: Number(data.get("commute")), family: data.get("family") };
  state.stage = 0; state.selections = []; state.pending = null;
  showScreen("journey"); renderStage(); el("stageTitle").focus({ preventScroll: true });
}

function nextStage() {
  if (!state.pending) return;
  state.selections[state.stage] = state.pending;
  if (state.stage === STAGES.length - 1) return renderResult();
  state.stage += 1; renderStage(); el("stageTitle").focus({ preventScroll: true });
}

function previousStage() {
  if (state.stage === 0) return;
  state.stage -= 1; renderStage(); el("stageTitle").focus({ preventScroll: true });
}

function itemTotal(item) { return item.cashCost + item.opportunityCost + Math.round(item.timeHours * hourlyValue()); }

function inspector(item) {
  const cash = item.cashCost ? `<div><span>实际支付</span><b>${formatMoney(item.cashCost)}</b></div>` : "";
  const time = item.timeHours ? `<div><span>时间折算</span><b>${INTEGER.format(item.timeHours)}小时 = ${formatMoney(item.timeHours * hourlyValue())}</b></div>` : "";
  const opp = item.opportunityCost ? `<div><span>机会成本</span><b>${formatMoney(item.opportunityCost)}</b></div>` : "";
  el("formulaInspector").innerHTML = `<p class="overline">金额追溯</p><h3>${item.label}</h3><code>${item.formula}</code><div class="inspect-values">${cash}${time}${opp}</div><p>${item.assumptions}</p><div class="inspect-sources">${sourceMarkup(item.sourceIds)}</div>`;
}

function renderResult() {
  const bills = allBills();
  const summary = summarizeBills(bills);
  const ranked = [...bills].sort((a, b) => itemTotal(b) - itemTotal(a));
  const small = bills.filter(x => x.small).sort((a, b) => itemTotal(b) - itemTotal(a));
  const smallTotal = small.reduce((s, x) => s + itemTotal(x), 0);
  const selfCash = bills.filter(x => x.forSelf).reduce((s, x) => s + x.cashCost, 0);
  const selfPct = Math.max(1, Math.round(selfCash / summary.cash * 100));
  el("finalCash").textContent = formatMoney(summary.cash);
  el("finalTime").textContent = formatMoney(summary.timeValue);
  el("finalOpportunity").textContent = formatMoney(summary.opportunity);
  el("finalTotal").textContent = formatMoney(summary.total);
  el("finalRange").textContent = `现实差异估算区间：${formatWan(summary.total * .88)}—${formatWan(summary.total * 1.15)}`;
  el("findingTitle").textContent = `有${formatWan(smallTotal)}，在付款当天都显得“不算多”。`;
  el("findingCopy").textContent = `真正累积起来的不是某一次冲动，而是几十年反复发生的饮食、通勤、便利消费、物业和家庭往返。它们占你综合成本的${Math.round(smallTotal / summary.total * 100)}%。`;
  el("topCosts").innerHTML = ranked.slice(0, 5).map((item, i) => `<button type="button" data-inspect="${item.id}"><span>${String(i + 1).padStart(2, "0")}</span><div><b>${item.label}</b><small>${item.formula}</small></div><strong>${formatMoney(itemTotal(item))}</strong></button>`).join("");
  el("formulaInspector").dataset.items = JSON.stringify(bills.map(x => x.id));
  window.__resultBills = bills;
  inspector(ranked[0]);
  el("smallTitle").textContent = `${small.length}笔小账，累计${formatWan(smallTotal)}`;
  el("smallCostList").innerHTML = small.slice(0, 6).map(item => `<div><span>${item.label}<small>${item.formula}</small></span><b>${formatMoney(itemTotal(item))}</b></div>`).join("");
  el("selfTitle").textContent = `实际支付中，约${selfPct}%明确留给了自己`;
  el("selfCopy").textContent = "这里只统计被标记为个人兴趣、体验与自由选择的支出。家庭与基本生活并非没有价值，只是不被强行包装成“为自己”。";
  el("selfPercent").textContent = `${selfPct}%`;
  el("selfCash").textContent = formatMoney(selfCash);
  const alternatives = [
    { stage: 3, current: state.selections[3].id, target: state.selections[3].id === "buy" ? "rent" : "buy", label: state.selections[3].id === "buy" ? "如果长期租房" : "如果购买住房" },
    { stage: 4, current: state.selections[4].id, target: state.selections[4].id === "child" ? "couple" : "child", label: state.selections[4].id === "child" ? "如果不育儿" : "如果计划育儿" },
    { stage: 2, current: state.selections[2].id, target: state.selections[2].id === "convenient" ? "frugal" : "convenient", label: state.selections[2].id === "convenient" ? "如果更克制" : "如果便利优先" }
  ];
  el("whatIfButtons").innerHTML = alternatives.map((x, i) => `<button type="button" data-whatif="${i}">${x.label}</button>`).join("");
  el("whatIfButtons").dataset.items = JSON.stringify(alternatives);
  el("whatIfResult").textContent = "选择一个假设，系统只替换这一阶段并重新计算。";
  el("shareLead").textContent = `我在${CITIES[state.profile.city].name}走完了一生`;
  el("shareTotal").textContent = `综合成本 ${formatWan(summary.total)}`;
  el("shareQuote").textContent = `其中${formatWan(smallTotal)}，都是当时觉得“没多少钱”的支出。`;
  showScreen("result"); el("resultTitle").focus({ preventScroll: true });
}

function renderWhatIf(index) {
  const alt = JSON.parse(el("whatIfButtons").dataset.items)[index];
  const original = summarizeBills(state.selections[alt.stage].bills).total;
  const replacement = summarizeBills(STAGES[alt.stage].build(alt.target)).total;
  const delta = replacement - original;
  const total = summarizeBills(allBills()).total + delta;
  el("whatIfResult").innerHTML = `<b>${alt.label}：综合成本将${delta < 0 ? "减少" : "增加"}${formatWan(Math.abs(delta))}</b><span>新的人生总成本约${formatWan(total)}。这里只替换一项选择，其他条件保持不变。</span>`;
}

function restart() { state.stage = 0; state.selections = []; state.pending = null; showScreen("intro"); }

async function copyResult() {
  const summary = summarizeBills(allBills());
  const smallTotal = allBills().filter(x => x.small).reduce((s, x) => s + itemTotal(x), 0);
  const text = `我的一生综合成本约${formatWan(summary.total)}，其中${formatWan(smallTotal)}都是当时觉得“没多少钱”的支出。每一笔都能拆到公式。`;
  try { await navigator.clipboard.writeText(text); toast("发现已复制，可以去分享了"); } catch { toast("复制失败，请长按分享卡复制"); }
}

let toastTimer;
function toast(message) { clearTimeout(toastTimer); el("toast").textContent = message; el("toast").classList.add("show"); toastTimer = setTimeout(() => el("toast").classList.remove("show"), 2400); }

el("commute").addEventListener("input", event => { el("commuteOutput").textContent = `${event.target.value} 分钟`; });
el("profileForm").addEventListener("submit", start);
el("options").addEventListener("click", event => { const button = event.target.closest("[data-option]"); if (button) chooseOption(button.dataset.option); });
el("nextBtn").addEventListener("click", nextStage);
el("backBtn").addEventListener("click", previousStage);
el("restartTop").addEventListener("click", restart);
el("restartBtn").addEventListener("click", restart);
el("copyResult").addEventListener("click", copyResult);
el("topCosts").addEventListener("click", event => { const button = event.target.closest("[data-inspect]"); if (button) inspector(window.__resultBills.find(x => x.id === button.dataset.inspect)); });
el("whatIfButtons").addEventListener("click", event => { const button = event.target.closest("[data-whatif]"); if (button) renderWhatIf(Number(button.dataset.whatif)); });

window.__lifeBillTest = { CITIES, STAGES, state, bill, summarizeBills, mortgagePayment, allBills, itemTotal };
