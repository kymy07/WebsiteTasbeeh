// Notification automation
// 1) In-app notification (bell) for Boss — always
// 2) WhatsApp automatic via CallMeBot (free) — if API key is set in Settings
// 3) Telegram Bot — if token + chat id are set in Settings
// 4) Fallback: wa.me link that opens WhatsApp with the message pre-filled
const Notify = {
  waLink(phone, text) {
    return 'https://wa.me/' + String(phone || '').replace(/\D/g, '') + '?text=' + encodeURIComponent(text);
  },

  orderMessage(o) {
    const lines = o.items.map(i => `• ${i.name} x ${i.qty} ${i.unit === 'kg' ? 'kg' : 'ekor'} = RM${i.subtotal.toFixed(2)}`).join('\n');
    return `🐟 *TEMPAHAN BARU ${o.no}*\n` +
      `Pelanggan: ${o.buyerName}\nTel: ${o.buyerPhone}\n\n${lines}\n\n` +
      `*Jumlah: RM${o.total.toFixed(2)}*\n` +
      `Kaedah: ${o.method === 'delivery' ? 'Penghantaran — ' + o.address : 'Ambil sendiri'}\n` +
      `Tarikh: ${o.pickupDate || '-'}` + (o.note ? `\nCatatan: ${o.note}` : '');
  },

  statusMessage(o) {
    const st = { confirmed: 'telah DISAHKAN ✅', ready: 'telah SEDIA untuk diambil/dihantar 📦', completed: 'telah SELESAI. Terima kasih! 🙏', cancelled: 'telah DIBATALKAN ❌', pending: 'sedang diproses' }[o.status];
    return `Salam ${o.buyerName}, tempahan anda *${o.no}* (RM${o.total.toFixed(2)}) ${st}\n\n— ${Store.data.settings.businessName}`;
  },

  async sendExternal(text) {
    const s = Store.data.settings;
    const sent = [];
    if (s.bossPhone && s.callmebotKey) {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(s.bossPhone.replace(/\D/g, ''))}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(s.callmebotKey)}`;
      try { await fetch(url, { mode: 'no-cors' }); sent.push('WhatsApp'); } catch (e) { console.warn('CallMeBot failed', e); }
    }
    if (s.telegramToken && s.telegramChatId) {
      try {
        const r = await fetch(`https://api.telegram.org/bot${s.telegramToken}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: s.telegramChatId, text: text.replace(/\*/g, '') }),
        });
        if (r.ok) sent.push('Telegram');
      } catch (e) { console.warn('Telegram failed', e); }
    }
    return sent;
  },

  inApp(to, title, body) {
    Store.data.notifications.unshift({ id: uid('n'), to, title, body, date: new Date().toISOString(), read: false });
    Store.save();
  },

  async newOrder(o) {
    const text = this.orderMessage(o);
    this.inApp('boss', `${t('newOrderNotif')} ${o.no}`, `${o.buyerName} · RM${o.total.toFixed(2)}`);
    return this.sendExternal(text);
  },
};
