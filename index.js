require("dotenv").config();
require("./api"); // API başlatır

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

  const embed = new EmbedBuilder()
    .setColor("Green")
    .setTitle("➕ Rol Oluşturuldu")
    .setDescription(`Rol: ${role}`)
    .setTimestamp();

  log.send({ embeds: [embed] });
});

client.on("roleDelete", async (role) => {
  const log = role.guild.channels.cache.get(ROLE_LOG);

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("❌ Rol Silindi")
    .setDescription(`Rol: ${role.name}`)
    .setTimestamp();

  log.send({ embeds: [embed] });
});

/* ================= VOICE LOG ================= */

client.on("voiceStateUpdate", (oldState, newState) => {
  const log = oldState.guild.channels.cache.get(VOICE_LOG);

  if (!oldState.channel && newState.channel) {
    log.send(`🔊 ${newState.member} sesliye girdi: ${newState.channel.name}`);
  }

  if (oldState.channel && !newState.channel) {
    log.send(`🔇 ${oldState.member} sesliden çıktı`);
  }

  if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
    log.send(`🔁 ${newState.member} kanal değiştirdi: ${oldState.channel.name} → ${newState.channel.name}`);
  }
});

/* ================= MOD LOG ================= */

client.on("guildBanAdd", async (ban) => {
  const log = ban.guild.channels.cache.get(MOD_LOG);

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("🔨 Ban Atıldı")
    .setDescription(`${ban.user.tag} banlandı`)
    .setTimestamp();

  log.send({ embeds: [embed] });
});

client.on("guildMemberRemove", async (member) => {
  const log = member.guild.channels.cache.get(MOD_LOG);

  const embed = new EmbedBuilder()
    .setColor("Orange")
    .setTitle("👢 Kick Atıldı")
    .setDescription(`${member.user.tag} sunucudan atıldı`)
    .setTimestamp();

  log.send({ embeds: [embed] });
});

/* ================= BOT LOGIN ================= */

client.login(process.env.DISCORD_TOKEN);