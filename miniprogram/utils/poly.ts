export type Lang = 'zh-CN' | 'en'
export type TabKey = 'trending' | 'breaking' | 'latest' | 'whales' | 'profile'

export const TAB_ROUTE: Record<TabKey, string> = {
  trending: '/pages/trending/trending',
  breaking: '/pages/breaking/breaking',
  latest: '/pages/latest/latest',
  whales: '/pages/whales/whales',
  profile: '/pages/profile/profile',
}

export interface EventCardData {
  id: string
  title: string
  category: string
  deadline: string
  liquidity: string
  volume: string
  image: string
  yesRate?: number
  delta?: string
  deltaUp?: boolean
}

export interface WhaleCardData {
  id: string
  amount: string
  side: 'BUY' | 'SELL'
  title: string
  option: string
  time: string
  hash: string
  address: string
}

export interface FavoriteCardData {
  id: string
  title: string
  time: string
}

export const trendingEvents: EventCardData[] = [
  {
    id: 'trend-1',
    title: '美国 2028 总统大选中，民主党候选人是否将赢得普选？',
    category: '选举',
    deadline: '截止 2028-11-06',
    liquidity: '$2.1M',
    volume: '$1,240,000',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
    yesRate: 72,
  },
  {
    id: 'trend-2',
    title: '2026 年底前，美国是否会批准新的比特币现货 ETF 扩容方案？',
    category: 'Crypto',
    deadline: '截止 2026-12-31',
    liquidity: '$1.4M',
    volume: '$980,000',
    image: 'https://images.unsplash.com/photo-1640161704729-cbe966a08476?auto=format&fit=crop&w=1200&q=80',
    yesRate: 61,
  },
  {
    id: 'trend-3',
    title: '美联储将在下次议息会议中降息 25bp 及以上吗？',
    category: '宏观',
    deadline: '截止 2026-06-18',
    liquidity: '$950K',
    volume: '$640,000',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    yesRate: 48,
  },
]

export const breakingEvents: EventCardData[] = [
  {
    id: 'break-1',
    title: '布伦特原油本周是否突破 $95？',
    category: '大宗商品',
    deadline: '截止 2026-03-08',
    liquidity: '$820K',
    volume: '$820,000',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
    delta: '+12.3%',
    deltaUp: true,
  },
  {
    id: 'break-2',
    title: '欧盟 AI 监管法案是否在本季度前正式生效？',
    category: '政策',
    deadline: '截止 2026-06-30',
    liquidity: '$560K',
    volume: '$560,000',
    image: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1200&q=80',
    delta: '-9.1%',
    deltaUp: false,
  },
  {
    id: 'break-3',
    title: '英国大选民调中，执政党支持率本周是否反超？',
    category: '选举',
    deadline: '截止 2026-03-12',
    liquidity: '$490K',
    volume: '$490,000',
    image: 'https://images.unsplash.com/photo-1494178270175-e96de2971df9?auto=format&fit=crop&w=1200&q=80',
    delta: '+6.8%',
    deltaUp: true,
  },
]

export const latestEvents: EventCardData[] = [
  {
    id: 'latest-1',
    title: 'NASA 新预算案会在本月国会投票中通过吗？',
    category: '航天',
    deadline: '新建于 2 小时前',
    liquidity: '$180K',
    volume: '$120,000',
    image: 'https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?auto=format&fit=crop&w=1200&q=80',
    delta: '+4.7%',
    deltaUp: true,
  },
  {
    id: 'latest-2',
    title: '今年奥斯卡最佳影片是否由流媒体平台作品获得？',
    category: '娱乐',
    deadline: '新建于 6 小时前',
    liquidity: '$90K',
    volume: '$74,500',
    image: 'https://images.unsplash.com/photo-1489599510572-fd6b57f1c1fe?auto=format&fit=crop&w=1200&q=80',
    delta: '-5.2%',
    deltaUp: false,
  },
  {
    id: 'latest-3',
    title: 'COP 峰会最终协议是否包含新的碳关税框架？',
    category: '气候',
    deadline: '新建于 11 小时前',
    liquidity: '$66K',
    volume: '$48,200',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
    delta: '+3.1%',
    deltaUp: true,
  },
]

export const whaleTrades: WhaleCardData[] = [
  {
    id: 'whale-1',
    amount: '$250,000',
    side: 'BUY',
    title: '美国大选：候选人 A 获胜概率',
    option: 'Yes @ 0.68',
    time: '2026-03-03 13:42',
    hash: '0x8F23...A901',
    address: '0x12...9f',
  },
  {
    id: 'whale-2',
    amount: '$198,000',
    side: 'SELL',
    title: '原油价格本周突破 $95',
    option: 'No @ 0.57',
    time: '2026-03-03 09:17',
    hash: '0x4D9B...E8C2',
    address: '0x7d...c1',
  },
  {
    id: 'whale-3',
    amount: '$172,500',
    side: 'BUY',
    title: '美联储 6 月会议降息概率',
    option: 'Yes @ 0.51',
    time: '2026-03-03 04:05',
    hash: '0xAA10...11B7',
    address: '0x3a...e9',
  },
]

export const favoriteEvents: FavoriteCardData[] = [
  {
    id: 'fav-1',
    title: '美国 2028 总统大选中，民主党候选人是否将赢得普选？',
    time: '收藏于 2026-03-02 22:15',
  },
  {
    id: 'fav-2',
    title: '欧盟 AI 监管法案是否在本季度前正式生效？',
    time: '收藏于 2026-03-01 11:03',
  },
]

function pad(num: number): string {
  return `${num}`.padStart(2, '0')
}

export function formatNow(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

export function getLangButton(lang: Lang): string {
  return lang === 'zh-CN' ? '简体中文 | EN' : 'English | 简中'
}

export function toggleLang(lang: Lang): Lang {
  return lang === 'zh-CN' ? 'en' : 'zh-CN'
}

export function goTab(current: TabKey, target: string): void {
  if (!(target in TAB_ROUTE)) return
  const tab = target as TabKey
  if (tab === current) return
  wx.redirectTo({ url: TAB_ROUTE[tab] })
}
