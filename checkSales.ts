#!/usr/bin/env ts-node-script



// import 'dotenv/config';
import Discord, { TextChannel } from 'discord.js';
import fetch from 'node-fetch';
import { ethers } from "ethers";

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './.env') })

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
    .setAuthor('salesBot', 'https://files.readme.io/566c72b-opensea-logomark-full-colored.png')
    .setThumbnail(sale.asset.collection.image_url)
    .addFields(
      { name: 'Name', value: sale.asset.name },
      { name: 'Amount', value: `${ethers.utils.formatEther(sale.total_price || '0')}${ethers.constants.EtherSymbol}` },
      { name: 'Buyer', value: sale?.winner_account?.user?.username ? `${sale?.winner_account?.user?.username} (${sale?.winner_account?.address})` : sale?.winner_account?.address, },
      // { name: 'Buyer Address', value: sale?.winner_account?.address, },
      { name: 'Seller', value: sale?.seller?.user?.username ? `${sale?.seller?.user?.username} (${sale?.seller?.address})` : sale?.seller?.address, },
      // { name: 'Seller Address', value: sale?.seller?.address, },
    )
    .setImage(sale.asset.image_url)
    .setTimestamp(Date.parse(`${sale?.created_date}Z`))
    .setFooter('Sold on OpenSea', 'https://files.readme.io/566c72b-opensea-logomark-full-colored.png')
)


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function main() {
  const channel = await discordSetup();
  const seconds = process.env.SECONDS ? parseInt(process.env.SECONDS) : 99_600;
  const hoursAgo = (Math.round(new Date().getTime() / 1000) - (seconds)); // in the last hour, run hourly?
  console.log(hoursAgo.toString())
  const params = new URLSearchParams({
    offset: '0',
    limit: '300',
    event_type: 'successful',
    only_opensea: 'false',
    occurred_after: hoursAgo.toString(),
    collection_slug: process.env.COLLECTION_SLUG!,
  })

  if (process.env.CONTRACT_ADDRESS !== OPENSEA_SHARED_STOREFRONT_ADDRESS) {
    params.append('asset_contract_address', process.env.CONTRACT_ADDRESS!)
  }

  const churchParams = new URLSearchParams({
    offset: '0',
    limit: '100',
    event_type: 'successful',
    only_opensea: 'false',
    occurred_after: hoursAgo.toString(),
    collection_slug: process.env.COLLECTION_SLUG_COSJ!,
  })

  if (process.env.CONTRACT_ADDRESS !== OPENSEA_SHARED_STOREFRONT_ADDRESS) {
    churchParams.append('asset_contract_address', process.env.CONTRACT_ADDRESS!)
  }

  //error testing
  const openSeaResponse = await fetch("https://api.opensea.io/api/v1/events?" + params).then(async response => {
    try {
      const data = await response.json()
      // console.log('response data', data)
      return data
    } catch (error) {
      console.log("error happened here!!")
      console.log(error)
    }
  }).catch(error => console.log(error));
  // try {
  //   const openSeaResponse = await fetch("https://api.opensea.io/api/v1/events?" + params)
  //   const data = await openSeaResponse.json()
  //   // console.log('response data', data)
  //   return data
  // } catch (error) {
  //   console.log("error happened here!!")
  //   console.log(error)
  // }


  await sleep(2000);

  const churchSeaResponse = await fetch(
    "https://api.opensea.io/api/v1/events?" + churchParams).then(async response => {
      try {
        const data = await response.json()
        // console.log('response data', data)
        return data
      } catch (error) {
        console.log("error happened here!!")
        console.log(error)
      }
    }).catch(error => console.log(error));

  // try {
  //   const churchSeaResponse = await fetch(
  //     "https://api.opensea.io/api/v1/events?" + churchParams)
  //   const data = await churchSeaResponse.json()
  //   // console.log('response data', data)
  //   return data
  // } catch (error) {
  //   console.log("error happened here!!")
  //   console.log(error)
  // }




  //FILTERING FOR STEVIEP ARTWORKS
  const FakeRes = await (
    openSeaResponse.asset_events.filter(project => project.asset.name.includes('Fake'))
  );

  const cgkRes = await (
    openSeaResponse.asset_events.filter(project => project.asset.name.includes('CryptoGodKing'))
  );

  const dreamRes = await (
    openSeaResponse.asset_events.filter(project => project.asset.name.includes('I Saw It'))
  );

  //CREATING PROMISES AND BUILDING MESSAGES TO SEND
  const ChurchSales = await Promise.all(
    churchSeaResponse.asset_events.reverse().map(async (sale: any) => {
      const message = buildMessage(sale);
      const church_ID = '885932550453866526';
      channel.id = church_ID;
      return channel.send(message)
    })
  );

  const FakeSales = await Promise.all(
    FakeRes.reverse().map(async (sale: any) => {
      const message = buildMessage(sale);
      const Fake_ID = '885656194209939456';
      channel.id = Fake_ID;
      return channel.send(message)
    })
  );

  const cgkSales = await Promise.all(
    cgkRes.reverse().map(async (sale: any) => {
      const message = buildMessage(sale);
      const cgk_ID = '885656147758055424';
      channel.id = cgk_ID;
      return channel.send(message)
    })
  );

  const dreamSales = await Promise.all(
    dreamRes.reverse().map(async (sale: any) => {
      const message = buildMessage(sale);
      const dream_ID = '885656175272665109';
      channel.id = dream_ID;
      return channel.send(message)
    })
  )
  //RETURNING MESSAGES OF SALES

  return await Promise.all(
    [
      FakeSales,
      dreamSales,
      cgkSales,
      ChurchSales
    ]
  );
}




main()
  .then((res) => {
    if (!res.length) console.log("No recent sales");
    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

