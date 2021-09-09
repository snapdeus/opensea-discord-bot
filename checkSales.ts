import 'dotenv/config';
import Discord, { TextChannel } from 'discord.js';
import fetch from 'node-fetch';
import { ethers } from "ethers";

const OPENSEA_SHARED_STOREFRONT_ADDRESS = '0x495f947276749Ce646f68AC8c248420045cb7b5e';

const discordBot = new Discord.Client();
const discordSetup = async (): Promise<TextChannel> => {
  return new Promise<TextChannel>((resolve, reject) => {
    ['DISCORD_BOT_TOKEN', 'DISCORD_CHANNEL_ID'].forEach((envVar) => {
      if (!process.env[envVar]) reject(`${envVar} not set`)
    })

    discordBot.login(process.env.DISCORD_BOT_TOKEN);
    discordBot.on('ready', async () => {
      const channel = await discordBot.channels.fetch(process.env.DISCORD_CHANNEL_ID!);
      resolve(channel as TextChannel);
    });
  })
}

const buildMessage = (sale: any) => (
  new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(sale.asset.name + ' sold!')
    .setURL(sale.asset.permalink)
    .setAuthor('OpenSea Bot', 'https://files.readme.io/566c72b-opensea-logomark-full-colored.png', 'https://github.com/sbauch/opensea-discord-bot')
    .setThumbnail(sale.asset.collection.image_url)
    .addFields(
      { name: 'Name', value: sale.asset.name },
      { name: 'Amount', value: `${ethers.utils.formatEther(sale.total_price || '0')}${ethers.constants.EtherSymbol}` },
      { name: 'Buyer Name', value: sale?.winner_account?.user.username, },
      { name: 'Buyer Address', value: sale?.winner_account?.address, },
      { name: 'Seller Name', value: sale?.seller.user.username, },
      { name: 'Seller Address', value: sale?.seller?.address, },
    )
    .setImage(sale.asset.image_url)
    .setTimestamp(Date.parse(`${sale?.created_date}Z`))
    .setFooter('Sold on OpenSea', 'https://files.readme.io/566c72b-opensea-logomark-full-colored.png')
)

async function main() {
  const channel = await discordSetup();
  const seconds = process.env.SECONDS ? parseInt(process.env.SECONDS) : 3_600;
  const hoursAgo = (Math.round(new Date().getTime() / 1000) - (seconds)); // in the last hour, run hourly?
  console.log(hoursAgo.toString())
  const params = new URLSearchParams({
    offset: '0',
    limit: '50',
    event_type: 'successful',
    only_opensea: 'false',
    occurred_after: hoursAgo.toString(),
    collection_slug: process.env.COLLECTION_SLUG!,
  })

  if (process.env.CONTRACT_ADDRESS !== OPENSEA_SHARED_STOREFRONT_ADDRESS) {
    params.append('asset_contract_address', process.env.CONTRACT_ADDRESS!)
  }

  const openSeaResponse = await fetch(
    "https://api.opensea.io/api/v1/events?" + params).then((resp) => resp.json());
  // console.log(openSeaResponse.asset_events[3].asset)

  const FakeRes = await (
    openSeaResponse.asset_events.filter(project => project.asset.name.includes('Fake Internet Money'))
  );

  const cgkRes = await (
    openSeaResponse.asset_events.filter(project => project.asset.name.includes('CryptoGodKing'))
  );

  const dreamRes = await (
    openSeaResponse.asset_events.filter(project => project.asset.name.includes('I Saw It'))
  );


  const FakeSales = await Promise.all(
    FakeRes.map(async (sale: any) => {
      const message = buildMessage(sale);
      const Fake_ID = '885656194209939456';
      channel.id = Fake_ID;
      return channel.send(message)
    })
  );

  const cgkSales = await Promise.all(
    cgkRes.map(async (sale: any) => {
      const message = buildMessage(sale);
      const cgk_ID = '885656147758055424';
      channel.id = cgk_ID;
      return channel.send(message)
    })
  );

  const dreamSales = await Promise.all(
    dreamRes.map(async (sale: any) => {
      const message = buildMessage(sale);
      const dream_ID = '885656175272665109';
      channel.id = dream_ID;
      return channel.send(message)
    })
  )



  return await Promise.all(
    [
      FakeSales,
      dreamSales,
      cgkSales
    ]
  );
}

// openSeaResponse?.asset_events?.filter(project => project.asset.name.includes('Fake Internet')).map(async (sale: any) => {
//   const message = buildMessage(sale);
//   const Fake_ID = '885610656831778938';
//   channel.id = Fake_ID;
//   return channel.send(message)
// }),
// openSeaResponse?.asset_events?.filter(project => project.asset.name.includes('CryptoGodKing')).map(async (sale: any) => {
//   const message = buildMessage(sale);
//   const CGK_ID = '885610626259497040';
//   channel.id = CGK_ID;
//   return channel.send(message)
// })



main()
  .then((res) => {

    if (!res.length) console.log("No recent sales")
    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
