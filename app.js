const USD_TO_CNY = 6.78015;
const MUSK_NET_WORTH_USD = 997_100_000_000;
const STARTING_BALANCE = 6_760_487_565_000;
const LOTTERY_PRIZE = 5_000_000;
const AVERAGE_PRIVATE_SALARY = 71_590;

const categories = [
  { id: "all", label: "全部" },
  { id: "daily", label: "日常刚需" },
  { id: "home", label: "家电数码" },
  { id: "property", label: "买房买车" },
  { id: "family", label: "养娃养老" },
  { id: "mood", label: "情绪消费" },
  { id: "wild", label: "离谱撒币" }
];

const items = [
  { id: "coin", name: "幸运硬币", price: 1, category: "daily", image: "assets/items/yuan-coin.jpg", alt: "人民币硬币", heat: "精确找零", note: "最后一块钱也得花明白。" },
  { id: "milk-tea", name: "奶茶加小料", price: 18, category: "daily", image: "assets/items/milk-tea.jpg", alt: "一杯珍珠奶茶", heat: "快乐水", note: "先买杯奶茶压压惊。" },
  { id: "takeout", name: "工作日外卖", price: 35, category: "daily", image: "assets/items/takeout.jpg", alt: "外卖骑手", heat: "打工人", note: "不做饭，也是一种生产力。" },
  { id: "subway", name: "一个月地铁通勤", price: 300, category: "daily", image: "assets/items/subway.jpg", alt: "城市轨道交通", heat: "通勤账单", note: "每天挤一次，钱包基本没感觉。" },
  { id: "movie", name: "周末电影票", price: 60, category: "daily", image: "assets/items/cinema.jpg", alt: "电影院内景", heat: "小确幸", note: "爆米花另算，快乐也另算。" },
  { id: "hotpot", name: "火锅双人餐", price: 388, category: "daily", image: "assets/items/hotpot.jpg", alt: "火锅", heat: "聚餐", note: "鸳鸯锅能解决一半家庭矛盾。" },

  { id: "phone", name: "旗舰手机", price: 7999, category: "home", image: "assets/items/phone.jpg", alt: "智能手机", heat: "数码刚需", note: "每年都说还能再战一年。" },
  { id: "robot-vacuum", name: "扫地机器人", price: 3999, category: "home", image: "assets/items/robot-vacuum.jpg", alt: "扫地机器人", heat: "懒人科技", note: "给家里请一个不会顶嘴的保洁。" },
  { id: "washer-dryer", name: "洗烘套装", price: 12999, category: "home", image: "assets/items/washer-dryer.jpg", alt: "洗衣机和烘干机", heat: "大件", note: "南方回南天看了会沉默。" },
  { id: "air-conditioner", name: "全屋中央空调", price: 60000, category: "home", image: "assets/items/villa.jpg", alt: "住宅空间", heat: "装修坑", note: "装的时候心痛，用的时候真香。" },
  { id: "smart-home", name: "全屋智能", price: 200000, category: "home", image: "assets/items/data-center.jpg", alt: "智能设备氛围图", heat: "科技宅", note: "灯自己亮，比人还懂下班。" },

  { id: "ev", name: "新能源车", price: 250000, category: "property", image: "assets/items/electric-car.jpg", alt: "电动车充电", heat: "车库+1", note: "续航焦虑不如余额焦虑。" },
  { id: "parking", name: "小区车位", price: 300000, category: "property", image: "assets/items/electric-car.jpg", alt: "停车位氛围图", heat: "隐藏大件", note: "车还没买，车位先把人拿下。" },
  { id: "county-home", name: "县城房首付", price: 300000, category: "property", image: "assets/items/villa.jpg", alt: "住宅楼", heat: "人生账单", note: "亲戚饭桌上终于有话题了。" },
  { id: "city-home", name: "一线城市 90 平", price: 12_000_000, category: "property", image: "assets/items/future-city.jpg", alt: "城市天际线", heat: "刚需房", note: "够买一套刚需房，也够焦虑好多年。" },
  { id: "school-district", name: "学区房", price: 18_000_000, category: "property", image: "assets/items/future-city.jpg", alt: "城市住宅区", heat: "爸妈沉默", note: "孩子还没上学，钱包先毕业了。" },

  { id: "nanny", name: "月嫂 42 天", price: 68000, category: "family", image: "assets/items/baby-care.jpg", alt: "新生儿", heat: "新手父母", note: "睡眠自由的价格，写在合同里。" },
  { id: "tutoring", name: "孩子一年补习", price: 120000, category: "family", image: "assets/items/baby-care.jpg", alt: "孩子教育氛围图", heat: "教育账单", note: "分数还没涨，账单先涨了。" },
  { id: "insurance", name: "全家商业保险", price: 150000, category: "family", image: "assets/items/shopping-coupon.jpg", alt: "票券文件", heat: "安全感", note: "买的时候心疼，真用上更心疼。" },
  { id: "health-check", name: "父母高端体检", price: 30000, category: "family", image: "assets/items/nursing-home.jpg", alt: "养老照护场景", heat: "孝心消费", note: "这笔钱花出去，心里踏实一点。" },
  { id: "nursing-home", name: "养老院一年", price: 180000, category: "family", image: "assets/items/nursing-home.jpg", alt: "养老院", heat: "长期账单", note: "养老不是远方，是每月扣款。" },

  { id: "concert", name: "演唱会内场票", price: 1880, category: "mood", image: "assets/items/concert.jpg", alt: "演唱会观众", heat: "情绪价值", note: "抢不到票的时候，钱都没资格花。" },
  { id: "sanya", name: "三亚亲子游", price: 30000, category: "mood", image: "assets/items/sanya-beach.jpg", alt: "三亚海滩", heat: "带娃放风", note: "孩子玩沙，大人刷卡。" },
  { id: "spring-trip", name: "春节全家出境游", price: 120000, category: "mood", image: "assets/items/airport-travel.jpg", alt: "机场航站楼", heat: "春节档", note: "机票越贵，朋友圈越值。" },
  { id: "cinema-buyout", name: "包场电影院", price: 50000, category: "mood", image: "assets/items/cinema.jpg", alt: "电影院", heat: "排面", note: "再也不用担心前排有人举手机。" },
  { id: "wedding", name: "办一场婚礼", price: 300000, category: "mood", image: "assets/items/wedding.jpg", alt: "婚宴", heat: "人生大场面", note: "一天花掉一辆车，大家还说值。" },

  { id: "tea-chain", name: "买下茶饮连锁", price: 8_000_000_000, category: "wild", image: "assets/items/milk-tea.jpg", alt: "奶茶", heat: "这是真撒币", note: "以后新品名就叫马斯克多肉葡萄。" },
  { id: "tour-title", name: "冠名全国巡演", price: 500_000_000, category: "wild", image: "assets/items/concert.jpg", alt: "演出现场", heat: "全网刷屏", note: "每张票根都写着你花过钱。" },
  { id: "football-club", name: "买下中超俱乐部", price: 2_000_000_000, category: "wild", image: "assets/items/soccer-stadium.jpg", alt: "足球场", heat: "老板入场", note: "花钱容易，赢球另说。" },
  { id: "hospital", name: "建一座三甲医院", price: 5_000_000_000, category: "wild", image: "assets/items/nursing-home.jpg", alt: "医疗建筑氛围图", heat: "城市级", note: "这钱花出去，评论区会安静一点。" },
  { id: "metro-line", name: "修一条地铁线", price: 30_000_000_000, category: "wild", image: "assets/items/subway.jpg", alt: "地铁列车", heat: "修到家门口", note: "从此房产中介多一句话术。" },
  { id: "city-coupon", name: "发全城消费券", price: 10_000_000_000, category: "wild", image: "assets/items/shopping-coupon.jpg", alt: "优惠券", heat: "全城撒券", note: "大家都说谢谢，顺便问第二轮呢。" },
  { id: "datacenter", name: "AI 数据中心", price: 542_412_000_000, category: "wild", image: "assets/items/data-center.jpg", alt: "数据中心机房", heat: "算力黑洞", note: "电费看了都想开会。" },
  { id: "rocket", name: "火箭发射", price: 8_136_180_000, category: "wild", image: "assets/items/rocket-launch.jpg", alt: "火箭发射", heat: "上天", note: "这回不是上头，是真的上天。" },
  { id: "mars", name: "火星基地一期", price: 4_068_090_000_000, category: "wild", image: "assets/items/mars-base.jpg", alt: "火星全球影像", heat: "终极项目", note: "地球上的钱，花到火星上。" }
];

const achievements = [
  { id: "first", title: "第一笔消费", copy: "买下任意一件东西。", test: s => s.spent > 0 },
  { id: "milkTea", title: "奶茶自由", copy: "买过奶茶，快乐先到账。", test: s => (s.cart["milk-tea"] || 0) > 0 },
  { id: "million", title: "百万入门", copy: "累计花费超过 100 万元。", test: s => s.spent >= 1_000_000 },
  { id: "landlord", title: "一线房东", copy: "买下一线城市 90 平或学区房。", test: s => (s.cart["city-home"] || 0) > 0 || (s.cart["school-district"] || 0) > 0 },
  { id: "familyBill", title: "养娃账单", copy: "买过任意养娃养老项目。", test: s => ownedItems(s).some(item => item.category === "family") },
  { id: "couponRain", title: "全城撒券", copy: "发过一轮全城消费券。", test: s => (s.cart["city-coupon"] || 0) > 0 },
  { id: "metro", title: "修到地铁了", copy: "修一条地铁线。", test: s => (s.cart["metro-line"] || 0) > 0 },
  { id: "variety", title: "横跨六类", copy: "六个频道都买过至少一次。", test: s => new Set(ownedItems(s).map(item => item.category)).size === 6 },
  { id: "finish", title: "真的花光了", copy: "余额归零。", test: s => s.balance === 0 }
];

const state = {
  balance: STARTING_BALANCE,
  spent: 0,
  cart: {},
  timeLimit: 0,
  timeLeft: 0,
  timerId: null,
  started: false,
  category: "all",
  sort: "default",
  search: "",
  ownedOnly: false,
  quantityMode: "1",
  quantity: 1
};

const money = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 0 });
const integer = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 });
const el = id => document.getElementById(id);

function formatMoney(value) {
  return money.format(value);
}

function formatChineseAmount(value) {
  if (value >= 1_0000_0000_0000) return `约 ${(value / 1_0000_0000_0000).toFixed(2)} 万亿元`;
  if (value >= 1_0000_0000) return `约 ${(value / 1_0000_0000).toFixed(1)} 亿元`;
  if (value >= 1_0000) return `约 ${(value / 1_0000).toFixed(1)} 万元`;
  return `${integer.format(value)} 元`;
}

function renderRealityCheck() {
  const lotteryDays = STARTING_BALANCE / LOTTERY_PRIZE;
  const lotteryYears = lotteryDays / 365;
  const salaryYears = STARTING_BALANCE / AVERAGE_PRIVATE_SALARY;
  el("worthCompact").textContent = formatChineseAmount(STARTING_BALANCE);
  el("worthDetail").textContent = `按实时富豪榜净值折算，口径见数据说明`;
  el("lotteryDays").textContent = `约 ${(lotteryDays / 10000).toFixed(1)} 万天`;
  el("lotteryYears").textContent = `约 ${integer.format(Math.round(lotteryYears))} 年，天天送中大奖也要从古代中到现在。`;
  el("salaryYears").textContent = `约 ${integer.format(Math.round(salaryYears))} 年`;
}

function ownedItems(snapshot = state) {
  return Object.keys(snapshot.cart)
    .map(id => items.find(item => item.id === id))
    .filter(Boolean);
}

function getQuantity(item) {
  if (state.quantityMode === "max") return Math.floor(state.balance / item.price);
  return Math.max(1, Number(state.quantity) || 1);
}

function filteredItems() {
  let shown = items.slice();
  if (state.category !== "all") shown = shown.filter(item => item.category === state.category);
  if (state.search.trim()) {
    const term = state.search.trim().toLowerCase();
    shown = shown.filter(item => `${item.name} ${item.heat} ${item.note} ${categories.find(cat => cat.id === item.category)?.label}`.toLowerCase().includes(term));
  }
  if (state.ownedOnly) shown = shown.filter(item => (state.cart[item.id] || 0) > 0);
  if (state.sort === "priceAsc") shown.sort((a, b) => a.price - b.price);
  if (state.sort === "priceDesc") shown.sort((a, b) => b.price - a.price);
  return shown;
}

function renderPills() {
  el("categoryPills").innerHTML = categories.map(category => `
    <button class="${state.category === category.id ? "active" : ""}" data-category="${category.id}">
      ${category.label}
    </button>
  `).join("");
}

function renderShop() {
  const shown = filteredItems();
  el("shopGrid").innerHTML = shown.map(item => {
    const owned = state.cart[item.id] || 0;
    const quantity = getQuantity(item);
    const affordable = quantity > 0 && item.price * quantity <= state.balance;
    const maxCount = Math.floor(state.balance / item.price);
    return `
      <article class="shop-card" data-category="${item.category}">
        <div class="item-art image-fallback" data-fallback="${item.name}">
          <img src="${item.image}" alt="${item.alt}" loading="lazy" onerror="this.remove(); this.parentElement.classList.add('failed');" />
        </div>
        <div class="item-body">
          <div class="item-head">
            <span class="badge">${item.heat}</span>
            <span class="owned">已买 ${owned.toLocaleString("zh-CN")}</span>
          </div>
          <div class="item-name">${item.name}</div>
          <p class="item-note">${item.note}</p>
          <div class="price">${formatMoney(item.price)}</div>
          <div class="item-meta">本次 ${state.quantityMode === "max" ? `最多 ${maxCount.toLocaleString("zh-CN")}` : `${quantity.toLocaleString("zh-CN")}`} 件</div>
          <div class="item-actions">
            <button class="buy" data-buy="${item.id}" ${affordable ? "" : "disabled"}>购买</button>
            <button class="sell" data-sell="${item.id}" ${owned ? "" : "disabled"}>卖出</button>
          </div>
        </div>
      </article>
    `;
  }).join("") || `<div class="empty-state shop-empty">没有匹配的商品。换个关键词，或者先把“只看已买”关掉。</div>`;
}

function renderReceipt() {
  const entries = Object.entries(state.cart).filter(([, count]) => count > 0);
  el("emptyReceipt").style.display = entries.length ? "none" : "block";
  el("receiptList").innerHTML = entries.map(([id, count]) => {
    const item = items.find(entry => entry.id === id);
    return `
      <li>
        <div class="receipt-row"><b>${item.name}</b><span>x ${count.toLocaleString("zh-CN")}</span></div>
        <div class="receipt-row"><span>小计</span><span>${formatMoney(item.price * count)}</span></div>
      </li>
    `;
  }).join("");
}

function renderAchievements() {
  el("achievementList").innerHTML = achievements.map(achievement => {
    const unlocked = achievement.test(state);
    return `
      <li class="${unlocked ? "" : "achievement-locked"}">
        <div class="achievement-title">${unlocked ? "已解锁" : "未解锁"} · ${achievement.title}</div>
        <div>${achievement.copy}</div>
      </li>
    `;
  }).join("");
}

function renderStats() {
  const totalItems = Object.values(state.cart).reduce((sum, count) => sum + count, 0);
  const pct = Math.min(100, (state.spent / STARTING_BALANCE) * 100);
  el("balanceText").textContent = formatMoney(state.balance);
  el("spentText").textContent = formatMoney(state.spent);
  el("itemCount").textContent = totalItems.toLocaleString("zh-CN");
  el("spentMeter").style.width = `${pct}%`;
  el("timerText").textContent = state.timeLimit ? `${state.timeLeft} 秒` : "不限时";
  el("quantityText").textContent = state.quantityMode === "max" ? "最大可买" : `${state.quantity} 件`;
}

function render() {
  renderRealityCheck();
  renderStats();
  renderPills();
  renderShop();
  renderReceipt();
  renderAchievements();
}

function startTimerIfNeeded() {
  if (state.started) return;
  state.started = true;
  if (!state.timeLimit) return;
  state.timeLeft = state.timeLimit;
  state.timerId = window.setInterval(() => {
    state.timeLeft -= 1;
    renderStats();
    if (state.timeLeft <= 0) {
      window.clearInterval(state.timerId);
      showFinish(false);
    }
  }, 1000);
}

function buy(id) {
  const item = items.find(entry => entry.id === id);
  const quantity = getQuantity(item);
  const maxCount = Math.floor(state.balance / item.price);
  const count = Math.min(quantity, maxCount);
  if (count <= 0) return;
  startTimerIfNeeded();
  state.cart[id] = (state.cart[id] || 0) + count;
  state.balance -= item.price * count;
  state.spent += item.price * count;
  render();
  if (state.balance === 0) showFinish(true);
}

function sell(id) {
  const item = items.find(entry => entry.id === id);
  const owned = state.cart[id] || 0;
  if (!owned) return;
  const count = Math.min(state.quantityMode === "max" ? owned : Math.max(1, Number(state.quantity) || 1), owned);
  state.cart[id] -= count;
  if (state.cart[id] <= 0) delete state.cart[id];
  state.balance += item.price * count;
  state.spent -= item.price * count;
  render();
}

function resetGame() {
  window.clearInterval(state.timerId);
  state.balance = STARTING_BALANCE;
  state.spent = 0;
  state.cart = {};
  state.category = "all";
  state.sort = "default";
  state.search = "";
  state.ownedOnly = false;
  state.timeLeft = state.timeLimit;
  state.timerId = null;
  state.started = false;
  el("copyStatus").textContent = "";
  el("categoryFilter").value = state.category;
  el("sortSelect").value = state.sort;
  el("searchInput").value = state.search;
  el("ownedOnly").checked = state.ownedOnly;
  el("finishDialog").close();
  render();
}

function clearCart() {
  state.balance = STARTING_BALANCE;
  state.spent = 0;
  state.cart = {};
  state.ownedOnly = false;
  el("ownedOnly").checked = false;
  el("copyStatus").textContent = "战绩单已清空。";
  render();
}

function receiptText() {
  const lines = [`我在《花光马斯克的钱》里花掉了 ${formatMoney(state.spent)}，还剩 ${formatMoney(state.balance)}。`];
  const entries = Object.entries(state.cart).filter(([, count]) => count > 0);
  if (!entries.length) {
    lines.push("还没开始买，钱包暂时非常体面。");
  } else {
    entries.forEach(([id, count]) => {
      const item = items.find(entry => entry.id === id);
      lines.push(`${item.name} x ${count.toLocaleString("zh-CN")} = ${formatMoney(item.price * count)}`);
    });
  }
  lines.push(`成就 ${achievements.filter(achievement => achievement.test(state)).length}/${achievements.length}`);
  return lines.join("\n");
}

async function copyReceipt() {
  const text = receiptText();
  try {
    await navigator.clipboard.writeText(text);
    el("copyStatus").textContent = "战绩已复制，值友看了都说离谱。";
  } catch {
    el("copyStatus").textContent = text;
  }
}

function showFinish(success) {
  const unlocked = achievements.filter(achievement => achievement.test(state)).length;
  const totalItems = Object.values(state.cart).reduce((sum, count) => sum + count, 0);
  el("finishTitle").textContent = success ? "你花光了全部预算" : "时间到";
  el("finishCopy").textContent = success
    ? "这张战绩单已经不是消费，是城市规划。"
    : "预算还没见底，换个更凶的购买路线再冲一次。";
  el("finishSpent").textContent = `总花费：${formatMoney(state.spent)}`;
  el("finishItems").textContent = `购买数量：${totalItems.toLocaleString("zh-CN")} 件`;
  el("finishAchievements").textContent = `成就：${unlocked}/${achievements.length}`;
  el("finishDialog").showModal();
}

function setCategory(category) {
  state.category = category;
  el("categoryFilter").value = category;
  render();
}

el("shopGrid").addEventListener("click", event => {
  const buyId = event.target.dataset.buy;
  const sellId = event.target.dataset.sell;
  if (buyId) buy(buyId);
  if (sellId) sell(sellId);
});

document.querySelector(".quantity-actions").addEventListener("click", event => {
  const button = event.target.closest("button[data-qty]");
  if (!button) return;
  document.querySelectorAll(".quantity-actions button").forEach(entry => entry.classList.remove("active"));
  button.classList.add("active");
  state.quantityMode = button.dataset.qty;
  if (state.quantityMode !== "max") {
    state.quantity = Number(state.quantityMode);
    el("quantityNumber").value = state.quantity;
    el("quantityNumber").disabled = false;
  } else {
    el("quantityNumber").disabled = true;
  }
  render();
});

el("quantityNumber").addEventListener("input", event => {
  const value = Math.max(1, Math.min(999999, Number(event.target.value) || 1));
  state.quantityMode = "custom";
  state.quantity = value;
  document.querySelectorAll(".quantity-actions button").forEach(entry => entry.classList.toggle("active", entry.dataset.qty === String(value)));
  render();
});

el("categoryFilter").addEventListener("change", event => setCategory(event.target.value));
el("sortSelect").addEventListener("change", event => {
  state.sort = event.target.value;
  render();
});
el("searchInput").addEventListener("input", event => {
  state.search = event.target.value;
  renderShop();
});
el("searchInput").addEventListener("change", event => {
  state.search = event.target.value;
  renderShop();
});
el("ownedOnly").addEventListener("change", event => {
  state.ownedOnly = event.target.checked;
  renderShop();
});
el("categoryPills").addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (button) setCategory(button.dataset.category);
});
el("startGame").addEventListener("click", () => window.scrollTo({ top: document.querySelector(".content-grid").offsetTop - 12, behavior: "smooth" }));
el("resetGame").addEventListener("click", resetGame);
el("playAgain").addEventListener("click", resetGame);
el("copyReceipt").addEventListener("click", copyReceipt);
el("clearCart").addEventListener("click", clearCart);

document.querySelector(".challenge").addEventListener("click", event => {
  const button = event.target.closest("button[data-time]");
  if (!button) return;
  document.querySelectorAll(".challenge button").forEach(entry => entry.classList.remove("active"));
  button.classList.add("active");
  state.timeLimit = Number(button.dataset.time);
  state.timeLeft = state.timeLimit;
  resetGame();
});

document.querySelector(".tabs").addEventListener("click", event => {
  const tab = event.target.closest(".tab");
  if (!tab) return;
  document.querySelectorAll(".tab").forEach(entry => entry.classList.remove("active"));
  document.querySelectorAll(".tab-view").forEach(entry => entry.classList.remove("active"));
  tab.classList.add("active");
  el(tab.dataset.tab === "receipt" ? "receiptView" : "achievementView").classList.add("active");
});

render();
