const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [

  /* ===== DC BAN ===== */
  new SlashCommandBuilder()
    .setName("dcban")
    .setDescription("Discord ban at")
    .addUserOption(o =>
      o.setName("kullanici").setDescription("Kullanıcı").setRequired(true)
    )
    .addStringOption(o =>
      o.setName("sebep").setDescription("Sebep")
    ),

  /* ===== OYUN BAN ===== */
  new SlashCommandBuilder()
    .setName("oyunban")
    .setDescription("Roblox oyun ban")
    .addStringOption(o =>
      o.setName("kullanici").setDescription("Roblox username").setRequired(true)
    )
    .addStringOption(o =>
      o.setName("sebep").setDescription("Sebep")
    ),

  /* ===== TAM BAN ===== */
  new SlashCommandBuilder()
    .setName("tamban")
    .setDescription("DC + Oyun ban")
    .addUserOption(o =>
      o.setName("kullanici").setDescription("Discord kullanıcı").setRequired(true)
    )
    .addStringOption(o =>
      o.setName("roblox").setDescription("Roblox username").setRequired(true)
    )
    .addStringOption(o =>
      o.setName("sebep").setDescription("Sebep")
    ),

  /* ===== KANAL TEMİZLE ===== */
  new SlashCommandBuilder()
    .setName("kanalıtemizle")
    .setDescription("Kanaldaki tüm mesajları siler")

];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  await rest.put(
    Routes.applicationCommands("1469816289601130677"),
    { body: commands.map(cmd => cmd.toJSON()) }
  );

  console.log("✅ Komutlar yüklendi!");
})();