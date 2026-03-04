const { getLang, getPack, setStoredLang } = require('../../utils/i18n');
const {
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  applyAuthToApp,
  callUserAuth,
} = require('../../utils/auth');

function getAvatarText(name) {
  const text = String(name || '').trim();
  if (!text) return 'PT';
  return text.slice(0, 1).toUpperCase();
}

const DEFAULT_NICKNAME = '\u8d8b\u52bf\u7528\u6237';

Page({
  data: {
    lang: 'zh',
    i18n: {},
    pageTitle: '',
    isLoggedIn: false,
    displayName: '',
    avatarUrl: '',
    avatarSource: '',
    avatarText: 'PT',
    loadingProfile: false,
    updatingAvatar: false,
    updatingNickname: false,
  },

  onLoad() {
    this.syncLanguage();
    this.syncUserState();
  },

  onShow() {
    const lang = getLang();
    if (lang !== this.data.lang || !this.data.i18n.pages) {
      this.syncLanguage();
    }
    this.syncUserState();
    this.pullRemoteUser();
  },

  onPullDownRefresh() {
    this.pullRemoteUser().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  syncLanguage() {
    const lang = getLang();
    const i18n = getPack(lang);
    this.setData({
      lang,
      i18n,
      pageTitle: i18n.pages.profile.title,
    });
    this.syncUserState(undefined, i18n);
  },

  syncUserState(user, i18nPack) {
    const current = user || getStoredUser();
    const i18n = i18nPack || this.data.i18n || {};
    const profileText = (i18n.pages && i18n.pages.profile) || {};

    if (!current || !current.openid) {
      applyAuthToApp(null);
      this.setData({
        isLoggedIn: false,
        displayName: profileText.guestName || 'Guest',
        avatarUrl: '',
        avatarSource: '',
        avatarText: 'PT',
      });
      return;
    }

    const normalized = setStoredUser(current) || current;
    applyAuthToApp(normalized);
    this.setData({
      isLoggedIn: true,
      displayName: normalized.nickName || DEFAULT_NICKNAME,
      avatarSource: normalized.avatarUrl || '',
      avatarUrl: normalized.avatarUrl || '',
      avatarText: getAvatarText(normalized.nickName),
    });
    this.updateAvatarDisplay(normalized.avatarUrl);
  },

  updateAvatarDisplay(source) {
    const fileId = String(source || '').trim();
    if (!fileId) {
      this.setData({ avatarUrl: '' });
      return;
    }
    if (!fileId.startsWith('cloud://')) {
      this.setData({ avatarUrl: fileId });
      return;
    }
    if (!wx.cloud || !wx.cloud.getTempFileURL) {
      this.setData({ avatarUrl: fileId });
      return;
    }
    wx.cloud.getTempFileURL({
      fileList: [fileId],
      success: (res) => {
        const list = (res && res.fileList) || [];
        const tempUrl = list[0] && list[0].tempFileURL;
        this.setData({ avatarUrl: tempUrl || fileId });
      },
      fail: () => {
        this.setData({ avatarUrl: fileId });
      },
    });
  },

  getAvatarCloudPath(user, filePath) {
    const uid = String((user && (user._id || user.openid)) || '').trim();
    if (!uid) return '';
    const textPath = String(filePath || '').trim();
    const extMatch = textPath.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'png';
    return `avatars/${uid}.${ext}`;
  },

  deleteAvatarIfNeeded(fileID) {
    return new Promise((resolve) => {
      const id = String(fileID || '').trim();
      if (!id || !id.startsWith('cloud://') || !wx.cloud || !wx.cloud.deleteFile) {
        resolve();
        return;
      }
      wx.cloud.deleteFile({
        fileList: [id],
        complete: () => resolve(),
      });
    });
  },

  uploadAvatar(filePath, user) {
    return new Promise((resolve, reject) => {
      if (!wx.cloud || !wx.cloud.uploadFile) {
        reject(new Error('cloud_unavailable'));
        return;
      }
      const cloudPath = this.getAvatarCloudPath(user, filePath);
      if (!cloudPath) {
        reject(new Error('missing_user_id'));
        return;
      }
      this.deleteAvatarIfNeeded(this.data.avatarSource).then(() => {
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: (res) => resolve((res && res.fileID) || ''),
          fail: reject,
        });
      });
    });
  },

  resolveLocalAvatarPath(pathLike) {
    return new Promise((resolve, reject) => {
      const source = String(pathLike || '').trim();
      if (!source) {
        reject(new Error('avatar_path_empty'));
        return;
      }
      if (
        source.startsWith('wxfile://')
        || source.startsWith('file://')
        || source.startsWith('/')
      ) {
        resolve(source);
        return;
      }
      if (source.startsWith('http://') || source.startsWith('https://')) {
        wx.downloadFile({
          url: source,
          success: (res) => {
            const ok = Number(res && res.statusCode) >= 200 && Number(res && res.statusCode) < 300;
            const tempFilePath = (res && res.tempFilePath) || '';
            if (ok && tempFilePath) {
              resolve(tempFilePath);
              return;
            }
            reject(new Error('avatar_download_failed'));
          },
          fail: () => reject(new Error('avatar_download_failed')),
        });
        return;
      }
      reject(new Error('avatar_path_unsupported'));
    });
  },

  async ensureCloudUser() {
    const result = await callUserAuth('login', {
      profile: {
        nickName: this.data.displayName || DEFAULT_NICKNAME,
        avatarUrl: this.data.avatarSource || '',
      },
      lang: this.data.lang,
    });
    if (!result || !result.success || !result.user) {
      throw new Error((result && result.message) || 'login_failed');
    }
    const normalized = setStoredUser(result.user) || result.user;
    applyAuthToApp(normalized);
    this.syncUserState(normalized);
    return normalized;
  },

  async callUserAuthWithRetry(action, payload) {
    let result = await callUserAuth(action, payload);
    if (result && result.success) {
      return result;
    }
    if (result && result.message === 'user_not_found') {
      await this.ensureCloudUser();
      result = await callUserAuth(action, payload);
    }
    return result;
  },

  async pullRemoteUser() {
    if (this.data.loadingProfile) return;
    const localUser = getStoredUser();
    if (!localUser || !localUser.openid) return;

    this.setData({ loadingProfile: true });
    try {
      const result = await callUserAuth('getProfile');
      if (result && result.success && result.user) {
        this.syncUserState(result.user);
      } else if (result && result.message === 'user_not_found') {
        await this.ensureCloudUser();
      }
    } catch (err) {
      // Keep local profile when cloud fetch fails.
    } finally {
      this.setData({ loadingProfile: false });
    }
  },

  onToggleLang() {
    const next = this.data.lang === 'en' ? 'zh' : 'en';
    setStoredLang(next);
    this.syncLanguage();
  },

  onGoFavorites() {
    const profileText = (this.data.i18n.pages && this.data.i18n.pages.profile) || {};
    if (!this.data.isLoggedIn) {
      wx.showToast({
        title: profileText.needLogin || '请先登录',
        icon: 'none',
      });
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 200);
      return;
    }
    wx.navigateTo({ url: '/pages/favorites/index' });
  },

  onGoLogin() {
    wx.navigateTo({ url: '/pages/login/index' });
  },

  onEditNickname() {
    if (!this.data.isLoggedIn || this.data.updatingNickname) return;
    const profile = (this.data.i18n.pages && this.data.i18n.pages.profile) || {};
    const currentName = this.data.displayName || '';
    wx.showModal({
      title: profile.editNicknameTitle || (this.data.lang === 'en' ? 'Edit Nickname' : '编辑昵称'),
      editable: true,
      content: currentName,
      placeholderText: profile.editNicknamePlaceholder || (this.data.lang === 'en' ? 'Enter nickname' : '请输入昵称'),
      success: async (res) => {
        if (!res.confirm) return;
        const nickName = String(res.content || '').trim();
        if (!nickName) {
          wx.showToast({
            title: profile.editNicknameEmpty || (this.data.lang === 'en' ? 'Nickname required' : '昵称不能为空'),
            icon: 'none',
          });
          return;
        }
        this.setData({ updatingNickname: true });
        wx.showLoading({ title: this.data.lang === 'en' ? 'Saving...' : '保存中...' });
        try {
          const result = await this.callUserAuthWithRetry('updateNickname', { nickName });
          if (!result || !result.success || !result.user) {
            throw new Error((result && result.message) || 'nickname_update_failed');
          }
          const normalized = setStoredUser(result.user) || result.user;
          applyAuthToApp(normalized);
          this.syncUserState(normalized);
          wx.hideLoading();
          wx.showToast({
            title: profile.editNicknameSuccess || (this.data.lang === 'en' ? 'Nickname updated' : '昵称已更新'),
            icon: 'success',
            duration: 1400,
          });
        } catch (err) {
          wx.hideLoading();
          wx.showToast({
            title: profile.editNicknameFailed || (this.data.lang === 'en' ? 'Update failed' : '更新失败'),
            icon: 'none',
          });
        } finally {
          this.setData({ updatingNickname: false });
        }
      },
    });
  },

  async onEditAvatar(event) {
    if (!this.data.isLoggedIn || this.data.updatingAvatar) return;
    const profile = (this.data.i18n.pages && this.data.i18n.pages.profile) || {};
    const avatarPath = (event.detail && event.detail.avatarUrl) || '';
    if (!avatarPath) return;

    const user = getStoredUser();
    if (!user || (!user._id && !user.openid)) {
      wx.showToast({
        title: profile.needLogin || '请先登录',
        icon: 'none',
      });
      return;
    }

    this.setData({ updatingAvatar: true });
    wx.showLoading({ title: this.data.lang === 'en' ? 'Uploading...' : '上传中...' });
    try {
      const localAvatarPath = await this.resolveLocalAvatarPath(avatarPath);
      const fileID = await this.uploadAvatar(localAvatarPath, user);
      if (!fileID) {
        throw new Error('avatar_upload_failed');
      }
      const result = await this.callUserAuthWithRetry('updateAvatar', { avatarUrl: fileID });
      if (!result || !result.success || !result.user) {
        throw new Error((result && result.message) || 'avatar_update_failed');
      }
      const normalized = setStoredUser(result.user) || result.user;
      applyAuthToApp(normalized);
      this.syncUserState(normalized);
      wx.hideLoading();
      wx.showToast({
        title: profile.editAvatarSuccess || (this.data.lang === 'en' ? 'Updated' : '更新成功'),
        icon: 'success',
        duration: 1400,
      });
    } catch (err) {
      wx.hideLoading();
      const msg = String((err && err.errMsg) || (err && err.message) || '');
      console.error('onEditAvatar failed:', msg, err);
      if (msg.includes('avatar_download_failed')) {
        wx.showToast({
          title: this.data.lang === 'en' ? 'Avatar download failed' : '头像下载失败，请重试',
          icon: 'none',
        });
      } else if (msg.includes('avatar_path_unsupported')) {
        wx.showToast({
          title: this.data.lang === 'en' ? 'Unsupported avatar source' : '不支持的头像来源',
          icon: 'none',
        });
      } else if (msg.includes('avatar_path_empty')) {
        wx.showToast({
          title: this.data.lang === 'en' ? 'No avatar selected' : '未选择头像',
          icon: 'none',
        });
      } else if (msg.includes('cloud_unavailable')) {
        wx.showToast({
          title: this.data.lang === 'en' ? 'Cloud unavailable' : '云开发不可用',
          icon: 'none',
        });
      } else {
        wx.showToast({
          title: profile.editAvatarFailed || (this.data.lang === 'en' ? 'Update failed' : '更新失败'),
          icon: 'none',
        });
      }
    } finally {
      this.setData({ updatingAvatar: false });
    }
  },

  onLogout() {
    if (!this.data.isLoggedIn) return;
    const profile = (this.data.i18n.pages && this.data.i18n.pages.profile) || {};
    wx.showModal({
      title: profile.logout || '退出登录',
      content: profile.logoutConfirm || '确认退出当前账号吗？',
      success: async (res) => {
        if (!res.confirm) return;

        wx.showLoading({ title: this.data.lang === 'en' ? 'Signing out...' : '退出中...' });
        try {
          await callUserAuth('logout');
        } catch (err) {
          // Keep local logout flow even if cloud request fails.
        } finally {
          wx.hideLoading();
        }

        clearStoredUser();
        applyAuthToApp(null);
        this.syncUserState(null);
        wx.showToast({
          title: profile.logoutSuccess || '已退出登录',
          icon: 'success',
          duration: 1500,
        });
        setTimeout(() => {
          wx.reLaunch({ url: '/pages/login/index' });
        }, 180);
      },
    });
  },
});
