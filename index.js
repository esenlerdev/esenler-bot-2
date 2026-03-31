require("dotenv").config();
require("./api");

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  AuditLogEvent
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.once("ready", () => {
  console.log(`✅ Bot aktif: ${client.user.tag}`);
});

/* ================= LOG KANALLARI ================= */

const MESSAGE_LOG = "1487954559425839194";
const ROLE_LOG = "1487954684764229692";
const CHANNEL_LOG = "1487955664562163712";
const VOICE_LOG = "1487967018199027732";
const MOD_LOG = "1487968797242425444";

/* ================= MESAJ LOG ================= */

client.on("messageDelete", async (message) => {
  if (!message.guild || message.author?.bot) return;

  const log = message.guild.channels.cache.get(MESSAGE_LOG);
  if (!log) return;

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("🗑️ Mesaj Silindi")
    .addFields(
      { name: "Kullanıcı", value: `${message.author}`, inline: true },
      { name: "Kanal", value: `${message.channel}`, inline: true },
      { name: "Mesaj", value: message.content || "Yok" }
    )
    .setTimestamp();

  log.send({ embeds: [embed] });
});

client.on("messageUpdate", async (oldMsg, newMsg) => {
  if (!oldMsg.guild || oldMsg.author?.bot) return;

  const log = oldMsg.guild.channels.cache.get(MESSAGE_LOG);
  if (!log) return;

  const embed = new EmbedBuilder()
    .setColor("Orange")
    .setTitle("✏️ Mesaj Düzenlendi")
    .addFields(
      { name: "Kullanıcı", value: `${oldMsg.author}`, inline: true },
      { name: "Eski", value: oldMsg.content || "Yok" },
      { name: "Yeni", value: newMsg.content || "Yok" }
    )
    .setTimestamp();

  log.send({ embeds: [embed] });
});

/* ================= ROL LOG ================= */

client.on("roleCreate", async (role) => {
  const log = role.guild.channels.cache.get(ROLE_LOG);
  if (!log) return;

  const fetched = await role.guild.fetchAuditLogs({ type: AuditLogEvent.RoleCreate, limit: 1 });
  const entry = fetched.entries.first();

  const embed = new EmbedBuilder()
    .setColor("Green")
    .setTitle("➕ Rol Oluşturuldu")
    .addFields(
      { name: "Rol", value: role.name },
      { name: "Oluşturan", value: entry?.executor?.tag || "Bilinmiyor" }
    )
    .setTimestamp();

  log.send({ embeds: [embed] });
});

client.on("roleDelete", async (role) => {
  const log = role.guild.channels.cache.get(ROLE_LOG);
  if (!log) return;

  const fetched = await role.guild.fetchAuditLogs({ type: AuditLogEvent.RoleDelete, limit: 1 });
  const entry = fetched.entries.first();

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("❌ Rol Silindi")
    .addFields(
      { name: "Rol", value: role.name },
      { name: "Silen", value: entry?.executor?.tag || "Bilinmiyor" }
    )
    .setTimestamp();

  log.send({ embeds: [embed] });
});

/* ================= ROL İZİN ================= */

client.on("roleUpdate", async (oldRole, newRole) => {
  const log = newRole.guild.channels.cache.get(ROLE_LOG);
  if (!log) return;

  const oldPerms = oldRole.permissions.toArray();
  const newPerms = newRole.permissions.toArray();

  const added = newPerms.filter(p => !oldPerms.includes(p));
  const removed = oldPerms.filter(p => !newPerms.includes(p));

  if (!added.length && !removed.length) return;

  const embed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle("🔧 Rol Yetkileri Güncellendi")
    .addFields(
      { name: "Rol", value: newRole.name },
      { name: "Eklenen", value: added.join(", ") || "Yok" },
      { name: "Kaldırılan", value: removed.join(", ") || "Yok" }
    )
    .setTimestamp();

  log.send({ embeds: [embed] });
});

/* ================= KANAL LOG ================= */

client.on("channelUpdate", async (oldCh, newCh) => {
  const log = newCh.guild.channels.cache.get(CHANNEL_LOG);
  if (!log) return;

  if (oldCh.name !== newCh.name) {
    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle("📁 Kanal Güncellendi")
      .addFields(
        { name: "Eski", value: oldCh.name },
        { name: "Yeni", value: newCh.name }
      )
      .setTimestamp();

    log.send({ embeds: [embed] });
  }
});

/* ================= VOICE LOG ================= */

client.on("voiceStateUpdate", (oldState, newState) => {
  const log = oldState.guild.channels.cache.get(VOICE_LOG);
  if (!log) return;

  if (!oldState.channel && newState.channel) {
    log.send(`🔊 ${newState.member.user.tag} → ${newState.channel.name}`);
  }

  if (oldState.channel && !newState.channel) {
    log.send(`🔇 ${newState.member.user.tag} çıktı`);
  }

  if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
    log.send(`🔁 ${newState.member.user.tag}: ${oldState.channel.name} → ${newState.channel.name}`);
  }
});

/* ================= MOD LOG ================= */

client.on("guildBanAdd", async (ban) => {
  const log = ban.guild.channels.cache.get(MOD_LOG);
  if (!log) return;

  const fetched = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 });
  const entry = fetched.entries.first();

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("🔨 Ban Atıldı")
    .addFields(
      { name: "Kullanıcı", value: ban.user.tag },
      { name: "Yetkili", value: entry?.executor?.tag || "Bilinmiyor" }
    )
    .setTimestamp();

  log.send({ embeds: [embed] });
});

client.on("guildMemberRemove", async (member) => {
  const log = member.guild.channels.cache.get(MOD_LOG);
  if (!log) return;

  const fetched = await member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 });
  const entry = fetched.entries.first();

  if (!entry) return;

  const embed = new EmbedBuilder()
    .setColor("Orange")
    .setTitle("👢 Kick Atıldı")
    .addFields(
      { name: "Kullanıcı", value: member.user.tag },
      { name: "Yetkili", value: entry.executor.tag }
    )
    .setTimestamp();

  log.send({ embeds: [embed] });
});

/* ================= KOMUT SİSTEMİ (FIXLİ) ================= */

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  await interaction.deferReply({ ephemeral: true }); // 🔥 timeout fix

  try {

    if (interaction.commandName === "dcban") {
      const user = interaction.options.getUser("kullanici");
      const sebep = interaction.options.getString("sebep") || "Sebep yok";

      await interaction.guild.members.ban(user.id, { reason: sebep });

      await interaction.editReply(`🔨 ${user.tag} banlandı\nSebep: ${sebep}`);
    }

    if (interaction.commandName === "oyunban") {
      const roblox = interaction.options.getString("kullanici");
      const sebep = interaction.options.getString("sebep") || "Sebep yok";

      await interaction.editReply(`🎮 ${roblox} oyun banlandı\nSebep: ${sebep}`);
    }

    if (interaction.commandName === "tamban") {
      const user = interaction.options.getUser("kullanici");
      const roblox = interaction.options.getString("roblox");
      const sebep = interaction.options.getString("sebep") || "Sebep yok";

      await interaction.guild.members.ban(user.id, { reason: sebep });

      await interaction.editReply(
        `☠️ TAM BAN\n👤 ${user.tag} + 🎮 ${roblox}\nSebep: ${sebep}`
      );
    }

  } catch (err) {
    console.error("HATA:", err);
    await interaction.editReply("❌ işlem başarısız (yetki veya hata)");
  }
});

/* ================= LOGIN ================= */

if (!process.env.DISCORD_TOKEN) {
  console.log("❌ TOKEN YOK");
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);