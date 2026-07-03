const USD_TO_CNY = 6.789;
const MUSK_NET_WORTH_USD = 1_053_000_000_000;
const STARTING_BALANCE = 7_148_817_000_000;
const LOTTERY_PRIZE = 5_000_000;
const AVERAGE_PRIVATE_SALARY = 71_590;

const categories = [
  { id: "all", label: "全部" },
  { id: "daily", label: "热门单品" },
  { id: "home", label: "奢侈收藏" },
  { id: "property", label: "豪车豪宅" },
  { id: "wild", label: "超级投资" }
];

const items = [
  { id: "mcdonalds-1plus1", name: "麦当劳随心配 1+1 套餐", price: 14, category: "daily", image: "assets/items/mcdonalds-1plus1.jpg", alt: "麦当劳随心配 1+1 超值套餐", heat: "13.9 元起", note: "官网基础价 13.9 元，游戏内取整。" },
  { id: "iphone-17-pro", name: "iPhone 17 Pro 256GB", price: 8_999, category: "daily", image: "assets/items/iphone-17-pro.jpg", alt: "橙色 iPhone 17 Pro", heat: "旗舰手机", note: "Apple 中国官网起售价。" },
  { id: "canon-r5-ii", name: "佳能 EOS R5 Mark II 单机身", price: 26_999, category: "daily", image: "assets/items/canon-r5-ii.jpg", alt: "佳能 EOS R5 Mark II 相机", heat: "专业相机", note: "国行单机身公开售价。" },
  { id: "luxury-bag", name: "LV Speedy Bandouliere 30 手袋", price: 15_500, category: "home", image: "assets/items/luxury-bag.jpg", alt: "LV Speedy Bandouliere 30 Monogram 手袋", heat: "经典手袋", note: "中国官网公开价。" },
  { id: "taian-table", name: "泰安门米其林三星品鉴晚餐", price: 2_888, category: "home", image: "assets/items/taian-table.jpg", alt: "上海泰安门餐厅开放式厨房", heat: "十道式菜单", note: "上海 2026 米其林三星餐厅单人套餐。" },
  { id: "cartier-necklace", name: "卡地亚 LOVE 双钻项链 B7219500", price: 22_200, category: "home", image: "assets/items/cartier-necklace.jpg", alt: "卡地亚 LOVE 黄金双钻项链", heat: "18K 黄金", note: "卡地亚中国官网公开价。" },
  { id: "mechanical-watch", name: "劳力士潜航者日历型 126610LN", price: 91_200, category: "home", image: "assets/items/mechanical-watch.jpg", alt: "劳力士潜航者日历型黑色腕表", heat: "经典腕表", note: "中国官网公开价。" },
  { id: "diamond-ring", name: "5 克拉培育钻戒", price: 95_000, category: "home", image: "assets/items/diamond-ring.jpg", alt: "五克拉培育钻戒", heat: "珠宝", note: "求婚还没开始，预算先单膝跪地。" },
  { id: "maldives", name: "安纳塔拉吉哈瓦双人七晚水上别墅", price: 87_191, category: "home", image: "assets/items/maldives.jpg", alt: "马尔代夫安纳塔拉吉哈瓦水上泳池别墅", heat: "海岛度假", note: "按 2026 年七晚套餐及页面汇率折算。" },
  { id: "everest", name: "尼泊尔南坡珠峰商业攀登", price: 271_560, category: "home", image: "assets/items/everest.jpg", alt: "登山者攀登珠穆朗玛峰", heat: "45 天登顶", note: "按 2026 年单人全包价 4 万美元折算。" },
  { id: "supercar", name: "兰博基尼 Centenario", price: 20_000_000, category: "home", image: "assets/items/supercar.jpg", alt: "兰博基尼 Centenario 超级跑车", heat: "超级跑车", note: "堵在晚高峰里，也比旁边贵几套房。" },
  { id: "superyacht", name: "Azimut VESTA 27 米游艇", price: 30_000_000, category: "home", image: "assets/items/superyacht.jpg", alt: "海面上的 Azimut VESTA 27 米游艇", heat: "私人游艇", note: "买船只是开始，养船才是连续剧。" },

  { id: "luxury-villa", name: "苏梅岛三卧泳池别墅", price: 5_000_000, category: "property", image: "assets/items/luxury-villa.jpg", alt: "苏梅岛三卧泳池别墅", heat: "别墅", note: "房子只买一套，但泳池得比客厅大。" },
  { id: "mercedes-e300l", name: "奔驰 E 300 L 时尚型", price: 439_800, category: "property", image: "assets/items/mercedes-e300l.jpg", alt: "奔驰长轴距 E 级轿车官方车型图", heat: "豪华轿车", note: "2026 款改款厂商指导价。" },
  { id: "private-jet", name: "湾流 G800 私人飞机", price: 500_000_000, category: "property", image: "assets/items/private-jet.jpg", alt: "飞行中的湾流 G800 私人飞机", heat: "公务航空", note: "不用赶航班，因为航班等你。" },

  { id: "tour-title", name: "全国体育馆巡演总冠名", price: 12_000_000, category: "wild", image: "assets/items/tour-title.jpg", alt: "全国巡演舞台", heat: "广告冠名", note: "每张票根都写着你花过钱。" },
  { id: "rocket", name: "大型运载火箭发射 1 次", price: 300_000_000, category: "wild", image: "assets/items/rocket.jpg", alt: "大型运载火箭发射", heat: "商业航天", note: "一次完整的商业发射。" },
  { id: "football-club", name: "中超足球俱乐部 100% 股权", price: 500_000_000, category: "wild", image: "assets/items/football-club.jpg", alt: "中超足球俱乐部球场", heat: "体育资产", note: "完整控股一家职业足球俱乐部。" },
  { id: "hospital", name: "1000 床三级甲等综合医院", price: 1_680_000_000, category: "wild", image: "assets/items/hospital.jpg", alt: "三级甲等综合医院大楼", heat: "医疗资产", note: "按同规模公开建设投资估算。" },
  { id: "private-island", name: "拉奈岛 97% 土地", price: 2_036_700_000, category: "wild", image: "assets/items/private-island.jpg", alt: "夏威夷拉奈岛航拍", heat: "私人岛屿", note: "参考拉里·埃里森 2012 年收购价。" },
  { id: "bitcoin", name: "1 枚比特币", price: 420_226, category: "wild", image: "assets/items/bitcoin.jpg", alt: "金色比特币实体代币", heat: "数字资产", note: "按 2026-07-03 BTC/USD 行情及页面汇率折算。" },
  { id: "anime-library", name: "Crunchyroll 动漫版权库", price: 7_977_075_000, category: "wild", image: "assets/items/anime-library.jpg", alt: "Crunchyroll 动漫片库界面", heat: "动漫版权", note: "参考索尼收购 Crunchyroll 的交易价。" },
  { id: "metro-line", name: "30 公里城市地铁线路", price: 21_200_000_000, category: "wild", image: "assets/items/metro-line.jpg", alt: "城市地铁线路", heat: "轨道交通", note: "按国内同里程公开项目投资估算。" },
  { id: "datacenter", name: "1 吉瓦 AI 数据中心园区", price: 50_000_000_000, category: "wild", image: "assets/items/datacenter.jpg", alt: "AI 数据中心服务器机房", heat: "算力资产", note: "包含基础设施与核心算力设备。" },
  { id: "film-studio", name: "米高梅电影公司整体收购", price: 57_367_050_000, category: "wild", image: "assets/items/film-studio.jpg", alt: "米高梅电影制片厂入口", heat: "影视公司", note: "参考亚马逊 84.5 亿美元收购价。" },
  { id: "tech-company", name: "X（原 Twitter）整体收购", price: 298_716_000_000, category: "wild", image: "assets/items/tech-company.jpg", alt: "X 原旧金山总部大楼", heat: "科技公司", note: "参考马斯克 440 亿美元收购价。" }
];

const achievements = [
  { id: "first", title: "第一笔消费", copy: "买下任意一件东西。", test: s => s.spent > 0 },
  { id: "luxury", title: "奢侈品入场", copy: "买下一件奢侈收藏。", test: s => ownedItems(s).some(item => item.category === "home") },
  { id: "million", title: "百万入门", copy: "累计花费超过 100 万元。", test: s => s.spent >= 1_000_000 },
  { id: "landlord", title: "别墅业主", copy: "买下一座苏梅岛泳池别墅。", test: s => (s.cart["luxury-villa"] || 0) > 0 },
  { id: "mediaEmpire", title: "内容帝国", copy: "同时买下电影公司和动漫版权库。", test: s => (s.cart["film-studio"] || 0) > 0 && (s.cart["anime-library"] || 0) > 0 },
  { id: "summit", title: "站上世界之巅", copy: "买下一次珠峰商业攀登。", test: s => (s.cart.everest || 0) > 0 },
  { id: "metro", title: "修到地铁了", copy: "修一条地铁线。", test: s => (s.cart["metro-line"] || 0) > 0 },
  { id: "variety", title: "资产配置", copy: "四个频道都买过至少一次。", test: s => new Set(ownedItems(s).map(item => item.category)).size === 4 },
  { id: "finish", title: "真的花光了", copy: "余额归零。", test: s => s.balance === 0 }
];

const state = {
  balance: STARTING_BALANCE,
  spent: 0,
  biggestPurchase: 0,
  cart: {},
  timeLimit: 0,
  timeLeft: 0,
  timerId: null,
  started: false,
  category: "all",
  sort: "priceAsc",
  search: "",
  ownedOnly: false,
  quantityMode: "1",
  quantity: 1,
  clearPending: false,
  lastAction: "还没开买，先挑一个顺眼的。"
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

function getCategoryLabel(id) {
  return categories.find(category => category.id === id)?.label || "本局推荐";
}

function getUnlockedAchievementIds(snapshot = state) {
  return new Set(achievements.filter(achievement => achievement.test(snapshot)).map(achievement => achievement.id));
}

function formatPercent(value) {
  if (value === 0) return "0%";
  if (value < 0.01) return "<0.01%";
  return `${value.toFixed(value < 1 ? 2 : 1)}%`;
}

function flashElement(element, className) {
  if (!element) return;
  element.classList.remove(className);
  window.requestAnimationFrame(() => {
    element.classList.add(className);
    window.setTimeout(() => element.classList.remove(className), 260);
  });
}

function renderRealityCheck() {
  const lotteryDays = STARTING_BALANCE / LOTTERY_PRIZE;
  const lotteryYears = lotteryDays / 365;
  const salaryYears = STARTING_BALANCE / AVERAGE_PRIVATE_SALARY;
  el("worthCompact").textContent = `约${(STARTING_BALANCE / 1_0000_0000_0000).toFixed(2)}万亿元`;
  el("worthDetail").textContent = `按实时富豪榜净值折算，口径见数据说明`;
  el("lotteryDays").textContent = `约${(lotteryDays / 10000).toFixed(1)}万天`;
  el("lotteryYears").textContent = `约 ${integer.format(Math.round(lotteryYears))} 年，天天送中大奖也要从古代中到现在。`;
  el("salaryYears").textContent = `约${(salaryYears / 10000).toFixed(0)}万年`;
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
    shown = shown.filter(item => `${item.name} ${item.heat} ${item.note} ${item.rankLabel || ""} ${getCategoryLabel(item.category)}`.toLowerCase().includes(term));
  }
  if (state.ownedOnly) shown = shown.filter(item => (state.cart[item.id] || 0) > 0);
  if (state.sort === "priceAsc") shown.sort((a, b) => a.price - b.price);
  if (state.sort === "priceDesc") shown.sort((a, b) => b.price - a.price);
  return shown;
}

function renderPills() {
  el("categoryPills").innerHTML = categories.map(category => `
    <button type="button" class="${state.category === category.id ? "active" : ""}" data-category="${category.id}">
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
    return `
      <article class="shop-card ${owned ? "is-bought" : ""}" id="card-${item.id}" data-category="${item.category}">
        <div class="item-art image-fallback" data-fallback="${item.name}">
          <img src="${item.image}" alt="${item.alt}" width="320" height="240" loading="lazy" onerror="this.remove(); this.parentElement.classList.add('failed');" />
        </div>
        <div class="item-body">
          <div class="item-head">
            <span class="badge">${item.heat}</span>
            <span class="owned">已买 ${owned.toLocaleString("zh-CN")}</span>
          </div>
          <div class="item-name">${item.name}</div>
          <div class="price">${formatMoney(item.price)}</div>
          <div class="item-actions">
            <button class="buy" type="button" data-buy="${item.id}" ${affordable ? "" : "disabled"}>购买</button>
            <button class="sell" type="button" data-sell="${item.id}" ${owned ? "" : "disabled"}>卖出</button>
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
  const unlockedCount = achievements.filter(achievement => achievement.test(state)).length;
  el("unlockedCountText").textContent = `${unlockedCount}/${achievements.length}`;
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
  el("spentPercentText").textContent = formatPercent(pct);
  el("biggestPurchaseText").textContent = state.biggestPurchase ? formatChineseAmount(state.biggestPurchase) : "¥0";
  el("lastActionText").textContent = state.lastAction;
  el("clearCart").textContent = state.clearPending ? "确认清空" : "清空购物车";
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
  const unlockedBefore = getUnlockedAchievementIds();
  startTimerIfNeeded();
  state.clearPending = false;
  state.cart[id] = (state.cart[id] || 0) + count;
  state.balance -= item.price * count;
  const purchaseTotal = item.price * count;
  state.spent += purchaseTotal;
  state.biggestPurchase = Math.max(state.biggestPurchase, purchaseTotal);
  state.lastAction = `买入 ${item.name} x ${count.toLocaleString("zh-CN")}，刷掉 ${formatMoney(purchaseTotal)}。`;
  render();
  const unlockedAfter = getUnlockedAchievementIds();
  const newAchievement = achievements.find(achievement => !unlockedBefore.has(achievement.id) && unlockedAfter.has(achievement.id));
  if (newAchievement) {
    state.lastAction = `解锁成就：${newAchievement.title}。${newAchievement.copy}`;
    renderStats();
  }
  flashElement(el("balanceText"), "balance-tick");
  flashElement(el(`card-${id}`), "deal-flash");
  flashElement(el("lastActionText"), "toast-flash");
  if (state.balance === 0) showFinish(true);
}

function sell(id) {
  const item = items.find(entry => entry.id === id);
  const owned = state.cart[id] || 0;
  if (!owned) return;
  const count = Math.min(state.quantityMode === "max" ? owned : Math.max(1, Number(state.quantity) || 1), owned);
  state.clearPending = false;
  state.cart[id] -= count;
  if (state.cart[id] <= 0) delete state.cart[id];
  state.balance += item.price * count;
  state.spent -= item.price * count;
  state.lastAction = `卖出 ${item.name} x ${count.toLocaleString("zh-CN")}，退回 ${formatMoney(item.price * count)}。`;
  render();
  flashElement(el("balanceText"), "balance-tick");
  flashElement(el("lastActionText"), "toast-flash");
}

function resetGame() {
  window.clearInterval(state.timerId);
  state.balance = STARTING_BALANCE;
  state.spent = 0;
  state.biggestPurchase = 0;
  state.cart = {};
  state.category = "all";
  state.sort = "priceAsc";
  state.search = "";
  state.ownedOnly = false;
  state.timeLeft = state.timeLimit;
  state.timerId = null;
  state.started = false;
  state.clearPending = false;
  state.lastAction = "还没开买，先挑一个顺眼的。";
  el("copyStatus").textContent = "";
  el("sortSelect").value = state.sort;
  el("searchInput").value = state.search;
  el("ownedOnly").checked = state.ownedOnly;
  el("finishDialog").close();
  render();
}

function clearCart() {
  if (state.spent > 0 && !state.clearPending) {
    state.clearPending = true;
    state.lastAction = "再点一次确认清空，战绩单会回到开局状态。";
    el("copyStatus").textContent = "再点一次“确认清空”才会清空购物车。";
    renderStats();
    flashElement(el("lastActionText"), "toast-flash");
    return;
  }
  state.balance = STARTING_BALANCE;
  state.spent = 0;
  state.biggestPurchase = 0;
  state.cart = {};
  state.ownedOnly = false;
  state.clearPending = false;
  state.lastAction = "战绩单已清空。";
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
  document.querySelectorAll(".tab").forEach(entry => {
    entry.classList.remove("active");
    entry.setAttribute("aria-selected", "false");
  });
  document.querySelectorAll(".tab-view").forEach(entry => entry.classList.remove("active"));
  tab.classList.add("active");
  tab.setAttribute("aria-selected", "true");
  el(tab.dataset.tab === "receipt" ? "receiptView" : "achievementView").classList.add("active");
});

render();
