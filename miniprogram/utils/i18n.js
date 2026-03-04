const zh = require('../i18n/zh');
const en = require('../i18n/en');

const STORAGE_KEY = 'polytrend_lang';

const packs = {
  zh,
  en,
};

function normalizeLang(lang) {
  return lang === 'en' ? 'en' : 'zh';
}

function getStoredLang() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    return normalizeLang(raw);
  } catch (err) {
    return 'zh';
  }
}

function setStoredLang(lang) {
  const normalized = normalizeLang(lang);
  try {
    wx.setStorageSync(STORAGE_KEY, normalized);
  } catch (err) {
    // Ignore local storage exceptions.
  }
  const app = getApp && getApp();
  if (app && app.globalData) {
    app.globalData.lang = normalized;
  }
  return normalized;
}

function getLang() {
  const app = getApp && getApp();
  const current = app && app.globalData ? app.globalData.lang : '';
  return normalizeLang(current || getStoredLang());
}

function getPack(lang) {
  return packs[normalizeLang(lang)] || zh;
}

function text(path, lang) {
  const pack = getPack(lang);
  const keys = String(path || '').split('.');
  let current = pack;
  for (let i = 0; i < keys.length; i += 1) {
    if (!current || typeof current !== 'object') return '';
    current = current[keys[i]];
  }
  return current === undefined || current === null ? '' : String(current);
}

function formatText(template, params) {
  let output = String(template || '');
  Object.keys(params || {}).forEach((key) => {
    output = output.replace(new RegExp(`\\{${key}\\}`, 'g'), String(params[key]));
  });
  return output;
}

function pickText(value, lang) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    return value[normalizeLang(lang)] || value.zh || value.en || '';
  }
  return '';
}

function formatPercent(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${Math.round(value)}%`;
  }
  const textValue = String(value === undefined || value === null ? '' : value).trim();
  if (!textValue) return '--';
  return textValue.endsWith('%') ? textValue : `${textValue}%`;
}

function trendClass(trend) {
  if (trend === 'up' || trend === 'down') return trend;
  return 'neutral';
}

function toneClass(tone) {
  if (tone === 'good' || tone === 'bad') return tone;
  return 'neutral';
}

function buildCoverStyle(image, palettes, index) {
  if (image) {
    return `background-image: linear-gradient(135deg, rgba(9,21,43,0.08), rgba(9,21,43,0.56)), url('${image}');`;
  }
  const fallback = (palettes && palettes.length) ? palettes[index % palettes.length] : 'linear-gradient(135deg,#1565c0,#2d7dd2)';
  return `background: ${fallback};`;
}

function normalizeList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.markets)) return payload.markets;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.result && Array.isArray(payload.result.list)) return payload.result.list;
  return [];
}

module.exports = {
  normalizeLang,
  getStoredLang,
  setStoredLang,
  getLang,
  getPack,
  text,
  formatText,
  pickText,
  formatPercent,
  trendClass,
  toneClass,
  buildCoverStyle,
  normalizeList,
};

