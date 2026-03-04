const trendingMarkets = [
  {
    id: 'middle-east-iran',
    badge: '🇮🇶',
    coverTitle: { zh: '中东局势追踪', en: 'Middle East Tracker' },
    topic: { zh: '中东局势', en: 'Middle East' },
    deadline: { zh: '截止 6月30日', en: 'Ends Jun 30' },
    question: { zh: '伊朗政权会在6月30日前垮台吗？', en: 'Will Iran\'s regime fall before June 30?' },
    topPercent: 39,
    topTrend: 'down',
    volume: { zh: '$7M 交易量', en: '$7M Volume' },
    image: 'https://picsum.photos/id/1011/900/500',
    outcomes: [
      { label: { zh: '是', en: 'Yes' }, percent: 39, tone: 'good' },
      { label: { zh: '否', en: 'No' }, percent: 61, tone: 'bad' },
    ],
    favorite: false,
    url: 'https://polymarket.com/',
  },
  {
    id: 'texas-primary',
    badge: '🇺🇸',
    coverTitle: { zh: '得州州长初选', en: 'Texas GOP Primary' },
    topic: { zh: '美国选举', en: 'US Election' },
    deadline: { zh: '每周更新', en: 'Weekly update' },
    question: { zh: '谁将赢得得州州长共和党初选？', en: 'Who will win the Texas Republican gubernatorial primary?' },
    topPercent: 57,
    topTrend: 'up',
    volume: { zh: '$6M 交易量', en: '$6M Volume' },
    image: 'https://picsum.photos/id/1024/900/500',
    outcomes: [
      { label: { zh: '格雷格·阿博特', en: 'Greg Abbott' }, percent: 57, tone: 'neutral' },
      { label: { zh: '丹·帕特里克', en: 'Dan Patrick' }, percent: 31, tone: 'neutral' },
      { label: { zh: '肯·帕克斯顿', en: 'Ken Paxton' }, percent: 12, tone: 'neutral' },
    ],
    chips: [
      { label: { zh: '阿博特', en: 'Abbott' }, tone: 'neutral' },
      { label: { zh: '帕特里克', en: 'Patrick' }, tone: 'neutral' },
      { label: { zh: '帕克斯顿', en: 'Paxton' }, tone: 'neutral' },
    ],
    favorite: false,
    url: 'https://polymarket.com/',
  },
  {
    id: 'btc-5m',
    badge: '₿',
    coverTitle: { zh: 'BTC 超短线', en: 'BTC Ultra-short' },
    topic: { zh: '加密市场', en: 'Crypto' },
    deadline: { zh: '5分钟结算', en: '5-minute settlement' },
    question: { zh: 'BTC 5分钟后是涨还是跌？', en: 'Will BTC be up or down in 5 minutes?' },
    topPercent: 49,
    topTrend: 'neutral',
    volume: { zh: '$5 结算', en: '$5 Settlement' },
    image: 'https://picsum.photos/id/1060/900/500',
    outcomes: [
      { label: { zh: '涨', en: 'Up' }, percent: 49, tone: 'good' },
      { label: { zh: '跌', en: 'Down' }, percent: 51, tone: 'bad' },
    ],
    favorite: false,
    url: 'https://polymarket.com/',
  },
  {
    id: 'nba-lakers-pelicans',
    badge: '🏀',
    coverTitle: { zh: 'NBA 常规赛', en: 'NBA Regular Season' },
    topic: { zh: '体育', en: 'Sports' },
    deadline: { zh: '03/15 10:00', en: '03/15 10:00' },
    question: { zh: '湖人 vs 鹈鹕谁将获胜？', en: 'Who will win: Lakers vs Pelicans?' },
    topPercent: 65,
    topTrend: 'up',
    volume: { zh: '$3M 交易量', en: '$3M Volume' },
    image: 'https://picsum.photos/id/1015/900/500',
    outcomes: [
      { label: { zh: '湖人', en: 'Lakers' }, percent: 65, tone: 'neutral' },
      { label: { zh: '鹈鹕', en: 'Pelicans' }, percent: 35, tone: 'neutral' },
    ],
    favorite: true,
    url: 'https://polymarket.com/',
  },
  {
    id: 'epl-man-city-forest',
    badge: '⚽',
    coverTitle: { zh: '英超焦点战', en: 'EPL Clash' },
    topic: { zh: '英超 EPL', en: 'EPL' },
    deadline: { zh: '明日 03:30', en: 'Tomorrow 03:30' },
    question: { zh: '曼城 vs 诺丁汉森林赛果？', en: 'Result: Man City vs Nottingham Forest?' },
    topPercent: 71,
    topTrend: 'up',
    volume: { zh: '$1M 交易量', en: '$1M Volume' },
    image: 'https://picsum.photos/id/1040/900/500',
    outcomes: [
      { label: { zh: '曼城胜', en: 'Man City' }, percent: 71, tone: 'neutral' },
      { label: { zh: '平局', en: 'Draw' }, percent: 12, tone: 'neutral' },
      { label: { zh: '森林胜', en: 'Forest' }, percent: 17, tone: 'neutral' },
    ],
    chips: [
      { label: { zh: '曼城', en: 'Man City' }, tone: 'neutral' },
      { label: { zh: '平局', en: 'Draw' }, tone: 'neutral' },
      { label: { zh: '森林', en: 'Forest' }, tone: 'neutral' },
    ],
    favorite: false,
    url: 'https://polymarket.com/',
  },
  {
    id: 'spx-range',
    badge: '📈',
    coverTitle: { zh: '标普500 月末点位', en: 'S&P 500 Month-end' },
    topic: { zh: '美股指数', en: 'US Index' },
    deadline: { zh: '月底结算', en: 'Month-end settlement' },
    question: { zh: '标普500本月收盘落在哪个区间？', en: 'Which range will the S&P 500 close in this month?' },
    topPercent: 41,
    topTrend: 'neutral',
    volume: { zh: '$825K 交易量', en: '$825K Volume' },
    image: '',
    outcomes: [
      { label: { zh: '> 6200', en: '> 6200' }, percent: 26, tone: 'neutral' },
      { label: { zh: '6100-6200', en: '6100-6200' }, percent: 41, tone: 'neutral' },
      { label: { zh: '6000-6100', en: '6000-6100' }, percent: 22, tone: 'neutral' },
      { label: { zh: '< 6000', en: '< 6000' }, percent: 11, tone: 'neutral' },
    ],
    favorite: false,
    url: 'https://polymarket.com/',
  },
];

const latestMarkets = [
  {
    id: 'lehavre-mayor',
    badge: '🇫🇷',
    coverTitle: { zh: '法国市长选举', en: 'French Mayoral Race' },
    topic: { zh: '法国地方选举', en: 'French Local Election' },
    deadline: { zh: '3月3日 初始数据', en: 'Mar 3 Initial data' },
    question: { zh: 'Le Havre 市长选举谁会赢？', en: 'Who will win the Le Havre mayoral election?' },
    topPercent: 65,
    topTrend: 'up',
    volume: { zh: '⚡ 最新 · 每周', en: '⚡ New · Weekly' },
    image: 'https://picsum.photos/id/1037/900/500',
    outcomes: [
      { label: 'Edouard Philippe', percent: 65, tone: 'neutral' },
      { label: 'Jean-Paul Lecoq', percent: 33, tone: 'neutral' },
    ],
    chips: [
      { label: 'Yes', tone: 'good' },
      { label: 'No', tone: 'bad' },
    ],
    favorite: false,
    url: 'https://polymarket.com/',
  },
  {
    id: 'netflix-global-show',
    badge: 'N',
    coverTitle: { zh: 'Netflix 榜单', en: 'Netflix Rankings' },
    topic: { zh: '流媒体', en: 'Streaming' },
    deadline: { zh: '每周', en: 'Weekly' },
    question: { zh: '本周全球 Netflix 榜首会是谁？', en: 'What will be the top global Netflix show this week?' },
    topPercent: 87,
    topTrend: 'up',
    volume: { zh: '⚡ 最新 · 每天', en: '⚡ New · Daily' },
    image: 'https://picsum.photos/id/1027/900/500',
    outcomes: [
      { label: 'Bridgerton: Season 4', percent: 87, tone: 'neutral' },
      { label: 'The Dinosaurs', percent: 13, tone: 'neutral' },
    ],
    chips: [
      { label: 'Yes', tone: 'good' },
      { label: 'No', tone: 'bad' },
    ],
    favorite: false,
    url: 'https://polymarket.com/',
  },
  {
    id: 'faze-tier1',
    badge: '🎮',
    coverTitle: { zh: '电竞赛程', en: 'Esports Calendar' },
    topic: { zh: '电竞', en: 'Esports' },
    deadline: { zh: '2026 全年', en: 'Full Year 2026' },
    question: { zh: 'FaZe 会在 2026 赢得 Tier 1 赛事吗？', en: 'Will FaZe win a Tier 1 event in 2026?' },
    topPercent: 39,
    topTrend: 'neutral',
    volume: { zh: '$2.1M 交易量', en: '$2.1M Volume' },
    image: 'https://picsum.photos/id/1050/900/500',
    outcomes: [
      { label: { zh: '会', en: 'Yes' }, percent: 39, tone: 'good' },
      { label: { zh: '不会', en: 'No' }, percent: 61, tone: 'bad' },
    ],
    chips: [
      { label: { zh: '会', en: 'Yes' }, tone: 'good' },
      { label: { zh: '不会', en: 'No' }, tone: 'bad' },
    ],
    favorite: false,
    url: 'https://polymarket.com/',
  },
  {
    id: 'oscars-speech',
    badge: '🏆',
    coverTitle: { zh: '奥斯卡热词', en: 'Oscars Mentions' },
    topic: { zh: '娱乐事件', en: 'Entertainment' },
    deadline: { zh: '3月', en: 'March' },
    question: { zh: '奥斯卡颁奖礼上会提及什么？', en: 'What will be said during the Oscars?' },
    topPercent: 91,
    topTrend: 'up',
    volume: { zh: '⚡ 最新 · $11K 交易量', en: '⚡ New · $11K Volume' },
    image: 'https://picsum.photos/id/1067/900/500',
    outcomes: [
      { label: { zh: 'Challmet +5 次', en: 'Challmet +5 times' }, percent: 91, tone: 'neutral' },
      { label: 'Netflix', percent: 88, tone: 'neutral' },
    ],
    chips: [
      { label: 'Yes', tone: 'good' },
      { label: 'No', tone: 'bad' },
    ],
    favorite: false,
    url: 'https://polymarket.com/',
  },
  {
    id: 'powell-bingo',
    badge: '🇺🇸',
    coverTitle: { zh: '美联储事件', en: 'Fed Event' },
    topic: { zh: 'Powell Bingo', en: 'Powell Bingo' },
    deadline: { zh: '3月4日', en: 'Mar 4' },
    question: { zh: 'Powell Bingo: March', en: 'Powell Bingo: March' },
    topPercent: 57,
    topTrend: 'up',
    volume: { zh: '⚡ 最新 · 每周', en: '⚡ New · Weekly' },
    image: 'https://picsum.photos/id/1025/900/500',
    outcomes: [
      { label: 'Yes', percent: 57, tone: 'good' },
      { label: 'No', percent: 43, tone: 'bad' },
    ],
    chips: [
      { label: 'Yes', tone: 'good' },
      { label: 'No', tone: 'bad' },
    ],
    favorite: false,
    url: 'https://polymarket.com/',
  },
  {
    id: 'aws-outage',
    badge: '☁️',
    coverTitle: { zh: '云服务稳定性', en: 'Cloud Reliability' },
    topic: { zh: '云服务', en: 'Cloud' },
    deadline: { zh: '3月31日', en: 'Mar 31' },
    question: { zh: 'AWS 服务会在 3 月底前中断吗？', en: 'AWS service disrupted by March 31?' },
    topPercent: 39,
    topTrend: 'down',
    volume: { zh: '⚡ 最新 · 每月', en: '⚡ New · Monthly' },
    image: 'https://picsum.photos/id/1018/900/500',
    outcomes: [
      { label: 'Yes', percent: 39, tone: 'good' },
      { label: 'No', percent: 61, tone: 'bad' },
    ],
    chips: [
      { label: 'Yes', tone: 'good' },
      { label: 'No', tone: 'bad' },
    ],
    favorite: false,
    url: 'https://polymarket.com/',
  },
];

const breakingMarkets = [
  {
    id: 'oil-spike',
    coverTitle: { zh: '油价飙升', en: 'Oil Price Spike' },
    question: { zh: '布伦特原油本周是否突破 $95？', en: 'Will Brent crude break above $95 this week?' },
    category: { zh: '🏷️ 大宗商品', en: '🏷️ Commodities' },
    deadline: { zh: '📅 截止 2026-03-08', en: '📅 Ends 2026-03-08' },
    deltaText: { zh: '▲ +12.3%', en: '▲ +12.3%' },
    deltaDirection: 'up',
    volume: { zh: '📊 成交量：$820,000', en: '📊 Volume: $820,000' },
    image: 'https://picsum.photos/id/1021/900/500',
    sparkline: [30, 28, 21, 25, 16, 10, 6],
    favorite: false,
    url: 'https://polymarket.com/',
  },
  {
    id: 'tech-policy',
    coverTitle: { zh: '科技政策', en: 'Tech Policy' },
    question: { zh: '欧盟 AI 监管法案是否在本季度前正式生效？', en: 'Will the EU AI regulation take effect before the end of this quarter?' },
    category: { zh: '🏷️ 政策', en: '🏷️ Policy' },
    deadline: { zh: '📅 截止 2026-06-30', en: '📅 Ends 2026-06-30' },
    deltaText: { zh: '▼ -9.1%', en: '▼ -9.1%' },
    deltaDirection: 'down',
    volume: { zh: '📊 成交量：$560,000', en: '📊 Volume: $560,000' },
    image: 'https://picsum.photos/id/1039/900/500',
    sparkline: [8, 10, 13, 16, 22, 28, 34],
    favorite: true,
    url: 'https://polymarket.com/',
  },
  {
    id: 'election-poll',
    coverTitle: { zh: '选举民调', en: 'Election Poll' },
    question: { zh: '英国大选民调中，执政党支持率本周是否反超？', en: 'Will the ruling party retake the lead in UK election polls this week?' },
    category: { zh: '🏷️ 选举', en: '🏷️ Election' },
    deadline: { zh: '📅 截止 2026-03-12', en: '📅 Ends 2026-03-12' },
    deltaText: { zh: '▲ +6.8%', en: '▲ +6.8%' },
    deltaDirection: 'up',
    volume: { zh: '📊 成交量：$490,000', en: '📊 Volume: $490,000' },
    image: '',
    sparkline: [31, 30, 26, 28, 24, 22, 14],
    favorite: false,
    url: 'https://polymarket.com/',
  },
];

const whaleTrades = [
  {
    id: 'whale-1',
    coverTitle: { zh: '美国大选仓位异动', en: 'US Election Position Shift' },
    amount: '$250,000',
    time: { zh: '交易时间 2026-03-03 13:42', en: 'Trade Time 2026-03-03 13:42' },
    side: 'buy',
    market: { zh: '美国大选：候选人 A 获胜概率', en: 'US Election: Candidate A Win Probability' },
    position: { zh: '下注选项：是 @ 0.68', en: 'Position: Yes @ 0.68' },
    txHash: '0x8F23...A901',
    address: '0x12...9f',
    image: 'https://picsum.photos/id/1005/900/500',
    favorite: false,
    url: 'https://polymarket.com/',
  },
  {
    id: 'whale-2',
    coverTitle: { zh: '原油市场大额卖出', en: 'Large Oil Market Sell-off' },
    amount: '$198,000',
    time: { zh: '交易时间 2026-03-03 09:17', en: 'Trade Time 2026-03-03 09:17' },
    side: 'sell',
    market: { zh: '原油价格本周突破 $95', en: 'Oil Price Breaks $95 This Week' },
    position: { zh: '卖出选项：否 @ 0.57', en: 'Position: No @ 0.57' },
    txHash: '0x4D9B...E8C2',
    address: '0x7d...c1',
    image: 'https://picsum.photos/id/1036/900/500',
    favorite: true,
    url: 'https://polymarket.com/',
  },
  {
    id: 'whale-3',
    coverTitle: { zh: '利率预期集中买入', en: 'Rate-Cut Expectation Buy' },
    amount: '$172,500',
    time: { zh: '交易时间 2026-03-03 04:05', en: 'Trade Time 2026-03-03 04:05' },
    side: 'buy',
    market: { zh: '美联储 6 月会议降息概率', en: 'Fed June Rate-Cut Probability' },
    position: { zh: '下注选项：是 @ 0.51', en: 'Position: Yes @ 0.51' },
    txHash: '0xAA10...11B7',
    address: '0x3a...e9',
    image: '',
    favorite: false,
    url: 'https://polymarket.com/',
  },
];

const favoriteItems = [
  {
    id: 'f1',
    category: 'election',
    title: {
      zh: '美国 2028 总统大选中，民主党候选人是否将赢得普选？',
      en: 'Will the Democratic candidate win the popular vote in the 2028 US presidential election?',
    },
    subtitle: { zh: '收藏于 2026-03-02 22:15', en: 'Favorited on 2026-03-02 22:15' },
    meta: { zh: '最新概率：Yes 72%', en: 'Latest odds: Yes 72%' },
    image: 'https://picsum.photos/id/1024/420/260',
    url: 'https://polymarket.com/',
  },
  {
    id: 'f2',
    category: 'policy',
    title: {
      zh: '欧盟 AI 监管法案是否在本季度前正式生效？',
      en: 'Will the EU AI regulation take effect before the end of this quarter?',
    },
    subtitle: { zh: '收藏于 2026-03-01 11:03', en: 'Favorited on 2026-03-01 11:03' },
    meta: { zh: '最新概率：Yes 48%', en: 'Latest odds: Yes 48%' },
    image: 'https://picsum.photos/id/1039/420/260',
    url: 'https://polymarket.com/',
  },
  {
    id: 'f3',
    category: 'cloud',
    title: { zh: 'AWS 服务会在 3 月底前中断吗？', en: 'Will AWS service be disrupted by March 31?' },
    subtitle: { zh: '收藏于 2026-02-28 19:40', en: 'Favorited on 2026-02-28 19:40' },
    meta: { zh: '最新概率：Yes 39%', en: 'Latest odds: Yes 39%' },
    image: 'https://picsum.photos/id/1018/420/260',
    url: 'https://polymarket.com/',
  },
  {
    id: 'f4',
    category: 'sports',
    title: { zh: '湖人 vs 鹈鹕谁将获胜？', en: 'Who will win: Lakers vs Pelicans?' },
    subtitle: { zh: '收藏于 2026-02-26 09:10', en: 'Favorited on 2026-02-26 09:10' },
    meta: { zh: '最新概率：Lakers 65%', en: 'Latest odds: Lakers 65%' },
    image: 'https://picsum.photos/id/1015/420/260',
    url: 'https://polymarket.com/',
  },
  {
    id: 'f5',
    category: 'election',
    title: { zh: '谁将赢得得州州长共和党初选？', en: 'Who will win the Texas GOP primary for governor?' },
    subtitle: { zh: '收藏于 2026-02-25 14:31', en: 'Favorited on 2026-02-25 14:31' },
    meta: { zh: '最新概率：Abbott 57%', en: 'Latest odds: Abbott 57%' },
    image: 'https://picsum.photos/id/1068/420/260',
    url: 'https://polymarket.com/',
  },
];

const profileFavorites = [
  favoriteItems[0],
  favoriteItems[1],
];

const detailFallback = {
  title: {
    zh: '候选人 A 会赢得本次选举吗？',
    en: 'Will candidate A win the election?',
  },
  source: 'polymarket.com / event/123456',
  url: 'https://polymarket.com/',
};

function clone(payload) {
  return JSON.parse(JSON.stringify(payload));
}

function getTrendingMarkets() {
  return clone(trendingMarkets);
}

function getLatestMarkets() {
  return clone(latestMarkets);
}

function getBreakingMarkets() {
  return clone(breakingMarkets);
}

function getWhaleTrades() {
  return clone(whaleTrades);
}

function getFavoriteItems() {
  return clone(favoriteItems);
}

function getProfileFavorites() {
  return clone(profileFavorites);
}

function getDetailFallback() {
  return clone(detailFallback);
}

module.exports = {
  getTrendingMarkets,
  getLatestMarkets,
  getBreakingMarkets,
  getWhaleTrades,
  getFavoriteItems,
  getProfileFavorites,
  getDetailFallback,
};

