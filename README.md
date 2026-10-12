# 普通人模拟器

一组中文互动网页实验，用冷静、具体、可分享的方式，把普通人生活里最容易被忽略的钱和时间摊开。

公开访问地址：

- 《一生账单》：https://puzelin35-cmyk.github.io/spend-musk-money/
- 《上班倒计时》：https://puzelin35-cmyk.github.io/spend-musk-money/workdays.html
- 《花光马斯克的钱》：https://puzelin35-cmyk.github.io/spend-musk-money/musk-site/

## 当前工具

- 《一生账单》：输入 6 项生活信息，逐张拆开住房、通勤、教育、婚育、父母照护和养老的现金支出、时间折算与机会成本。
- 《上班倒计时》：输入出生年份、收入、退休年龄、工作时长和通勤时间，计算还剩多少工作日、通勤会吞掉多少天、真正自由白天还有多少。

## 本地运行

这是纯前端静态站点，没有构建步骤。

```bash
python3 -m http.server 4173
```

然后打开：

```text
http://localhost:4173/
```

也可以直接用浏览器打开 `index.html`。

## 文件结构

- `index.html`：页面结构、输入表单、人生阶段、结果页和分享卡。
- `workdays.html`：上班倒计时独立入口。
- `app.js`：计算模型、阶段账单、公式追溯、平行人生对比和测试钩子。
- `workdays.js`：上班倒计时计算、反事实重算和分享文案。
- `styles.css`：现代银行流水 × 超市长小票 × 人生时间轴的视觉系统。
- `workdays.css`：人生考勤表 × 退休倒计时 × 时间银行流水的视觉系统。
- `DATA_SOURCES.md`：2025 年当前价格口径、官方来源和场景参数说明。
- `PRODUCT.md`：产品目标、体验原则和可访问性要求。
- `DESIGN.md`：当前视觉规范与组件说明。

## 数据与图片

- 数据口径见 `DATA_SOURCES.md`
- 当前页面只使用本地 favicon；旧版“花光马斯克的钱”的图片素材仍保留在 `assets/`，归因见 `assets/ATTRIBUTION.md`

## 验证建议

- 语法检查：`node --check app.js`
- 语法检查：`node --check workdays.js`
- 静态检查：`git diff --check`
- 浏览器验收：至少测试 375px、768px、1440px；确认长金额/长天数不横向溢出，每个结果都能看到公式与来源。
