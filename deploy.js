const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [

  new SlashCommandBuilder()
    .setName("dcban")
    .setDescription("Discord ban at")
    .addUserOption(o =>
      o.setName("kullanici").setDescription("Kullanıcı").setRequired(true)
    )
    .addStringOption(o =>
      o.setName("sebep").setDescription("Sebep")
    ),

  new SlashCommandBuilder()
    .setName("oyunban")
    .setDescription("Roblox oyun ban")
    .addStringOption(o =>
      o.setName("kullanici").setDescription("Roblox username").setRequired(true)
    )
    .addStringOption(o =>
      o.setName("sebep").setDescription("Sebep")
    ),

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
    )

];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  await rest.put(
    Routes.applicationCommands("1446574859566972930"),
    { body: commands }
  );

  console.log("✅ Komutlar yüklendi!");
})();