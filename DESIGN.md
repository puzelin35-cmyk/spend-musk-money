# Design

## System

静态中文网页小游戏，核心界面由财富控制台、尺度换算、购买频道、商品信息流和战绩单组成。设计服务于连续点击和快速理解。

## Visual Theme

方向是“财富控制台 + 消费战绩单”。首屏像一台已经装入马斯克资产的游戏机器，右侧放一张静态换算账本，用具体消费尺度压住空泛炫技；商品区像紧凑推荐流，右侧像不断打印的战绩单。

## Color Tokens

- `--ink`: #101820，主文字和深色控制台。
- `--panel`: #f7f8f1，浅色内容面。
- `--surface`: #ffffff，商品流与输入控件。
- `--line`: #d7ded2，分隔线。
- `--accent`: #ff4d2e，购买、进度和关键反馈。
- `--signal`: #b7ff5f，控制台状态灯和成功反馈。
- `--cash`: #f2ffe3，首屏大额余额数字。
- `--gold`: #ffbc38，大额财富和高亮数字。
- `--teal`: #12716c，次级正向操作。

## Typography

使用系统中文无衬线栈：`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif`。数字使用 `font-variant-numeric: tabular-nums`，标题不使用过大的流体字号，商品流保持紧凑可扫读。

## Components

- Console: 首屏主控件，包含头像、总资产、余额条、计时、已花费、开始/重开。
- Scale Ledger: 首屏静态换算账本，用具体消费换算制造记忆点。
- Reality Strip: 三个尺度换算指标，像榜单而不是装饰卡片。
- Channel Rail: 横向频道按钮，支持滚动和清晰选中态。
- Deal Row: 左图右文商品卡，价格、短评、已买数量和买卖按钮一屏可见。
- Battle Receipt: sticky 战绩单，显示已花比例、最高单笔、成就数量、最近动作、小票列表。

## Motion

只为状态服务：购买成功闪动、余额数字轻微跳动、成就解锁提示。持续时间控制在 150-250ms，并在 `prefers-reduced-motion: reduce` 下关闭。

## Responsive

桌面为商品流 + 右侧战绩单；960px 以下改成单列；390px 手机下按钮不换成超小字，商品图保持稳定比例，价格允许换行。
