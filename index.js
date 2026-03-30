require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const noblox = require("noblox.js");
const axios = require("axios");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const YETKILI_ROL = "1446576536365826138";
const CEZA_LOG = "1487968797242425444";

client.once("ready", async () => {
  console.log("✅ Bot aktif!");
  await noblox.setCookie(process.env.ROBLOX_COOKIE);
  console.log("✅ Roblox bağlandı!");
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const member = interaction.member;
  const rol = interaction.guild.roles.cache.get(YETKILI_ROL);

  if (!rol || member.roles.highest.position < rol.position) {
    return interaction.reply({
      content: "❌ Yetkin yetersiz, Yönetim ekibinde değilsin!",
      ephemeral: true
    });
  }

  // ================= DC BAN =================
  if (interaction.commandName === "dcban") {
    const user = interaction.options.getUser("kullanici");
    const reason = interaction.options.getString("sebep") || "Belirtilmedi";

    try {
      await interaction.guild.members.ban(user.id, { reason });

      const log = interaction.guild.channels.cache.get(CEZA_LOG);

      log.send({
        embeds: [{
          color: 0xff0000,
          title: "⛔ Discord Ban",
          thumbnail: { url: user.displayAvatarURL() },
          fields: [
            { name: "👤 Kullanıcı", value: user.tag, inline: true },
            { name: "🛠️ Yetkili", value: interaction.user.tag, inline: true },
            { name: "📄 Sebep", value: reason }
          ],
          timestamp: new Date()
        }]
      });

      interaction.reply({ content: "✅ Discord ban atıldı", ephemeral: true });

    } catch (err) {
      interaction.reply({ content: "❌ Ban başarısız", ephemeral: true });
    }
  }

  // ================= OYUN BAN =================
  if (interaction.commandName === "oyunban") {
    const username = interaction.options.getString("kullanici");
    const reason = interaction.options.getString("sebep") || "Belirtilmedi";

    try {
      const userId = await noblox.getIdFromUsername(username);

      await axios.post("http://localhost:3000/ban", {
        userId,
        reason
      });

      const log = interaction.guild.channels.cache.get(CEZA_LOG);

      log.send({
        embeds: [{
          color: 0xff9900,
          title: "🎮 Oyun Ban",
          fields: [
            { name: "👤 Kullanıcı", value: username, inline: true },
            { name: "🛠️ Yetkili", value: interaction.user.tag, inline: true },
            { name: "📄 Sebep", value: reason }
          ],
          timestamp: new Date()
        }]
      });

      interaction.reply({
        content: "✅ Oyuncu oyundan banlandı",
        ephemeral: true
      });

    } catch (err) {
      interaction.reply({
        content: "❌ Oyun ban başarısız",
        ephemeral: true
      });
    }
  }

  // ================= TAM BAN =================
  if (interaction.commandName === "tamban") {
    const user = interaction.options.getUser("kullanici");
    const username = interaction.options.getString("roblox");
    const reason = interaction.options.getString("sebep") || "Belirtilmedi";

    try {
      // discord ban
      await interaction.guild.members.ban(user.id, { reason });

      // roblox ban
      const userId = await noblox.getIdFromUsername(username);

      await axios.post("http://localhost:3000/ban", {
        userId,
        reason
      });

      const log = interaction.guild.channels.cache.get(CEZA_LOG);

      log.send({
        embeds: [{
          color: 0x8b0000,
          title: "💀 TAM BAN",
          fields: [
            { name: "💬 Discord", value: user.tag, inline: true },
            { name: "🎮 Roblox", value: username, inline: true },
            { name: "🛠️ Yetkili", value: interaction.user.tag },
            { name: "📄 Sebep", value: reason }
          ],
          timestamp: new Date()
        }]
      });

      interaction.reply({
        content: "🔥 Tam ban atıldı (DC + Oyun)",
        ephemeral: true
      });

    } catch (err) {
      interaction.reply({
        content: "❌ Tam ban başarısız",
        ephemeral: true
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);