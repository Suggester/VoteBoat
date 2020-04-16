const lists = require("../lists.json");
module.exports = {
	controls: {
		permission: 10,
		aliases: ["shop", "store", "purchase"],
		usage: "help",
		description: "Shows help information"
	},
	do: async (message, client, args, Discord) => {
    let supporter = "569954188675776522";
    let upvoter = "640906114321612821";
    let supersup = "618893176295653397";
    let beaner = "657644875499569161";
    if (!args[0]) {
      let embed = new Discord.MessageEmbed()
        .setTitle("Voting Rewards!")
        .setDescription("With your votes, you can buy various items like roles and acknowledgements!")
        .addField("Available Rewards", "`1` **Supporter Role**\n> _A fancy hoisted role that gives you access to the supporter chat_\n> __Cost:__ 50 Votes\n\n`2` **Upper Tier Upvoter Role**\n> _An even fancier hoisted role that gives you access to another secret chat! (must be purchased after Supporter)_\n> __Cost:__ 500 Votes\n\n`3` **Super Supporter Role**\n> _The highest tier of voting - you get another hoisted role & chat, as well as nickname permissions! (must be purchased after Upper Tier Upvoter)_\n> __Cost:__ 1500 Votes\n\n`4` **Custom Acknowledgement**\n> _Get a custom acknowledgement added to your `.verify` command! (must be purchased after Super Supporter)_\n> __Cost:__ 750 Votes")
        .addField("Buying Rewards", "To purchase a reward, use the **v!buy** command, followed by the number of the item you would like to buy.\n> __Example: Buying the Supporter role__\n> v!buy 1")
        .setColor("#5334eb");
      return message.channel.send(embed)
    }
    let votes = client.stats.get(message.author.id, "total")
    if (!votes) return message.channel.send("Err... looks like something is wrong with your vote total. Try voting on any bot list site and retry this command.")
    let info = [];
    switch (args[0]) {
      case "1":
        info = [50, "Supporter role", supporter]
        break;
      case "2":
        info = [500, "Upper Tier Upvoter role", upvoter, supporter]
        break;
      case "3":
        info = [1500, "Super Supporter role", supersup, upvoter]
        break;
      case "4":
        info = [750, "Custom Acknowledgement! Please DM <@624711903930744873> to get it added", "", supersup]
        break;
      default:
        return message.channel.send("That is an invalid item! Use **v!buy** with no parameters to see a list of available items.")
    }
    
    if (info[3] && !message.member.roles.cache.has(info[3])) return message.channel.send(`You must purchase the ${message.guild.roles.cache.get(info[3]).name} role before buying this one!`)
    if (votes < info[0]) return message.channel.send(`You don't have enough votes to purchase this item, which costs **${info[0].toString()}** votes! You need **${(info[0]-votes).toString()}** more!`)
    if (info[2]) await message.member.roles.add(info[2]);
    client.stats.math(message.author.id, "-", info[0], "total");
    return message.channel.send(`You have successfully purchased the **${info[1]}**!`);
  }
};