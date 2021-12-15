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
      { name: 'Seller', value: sale?.seller?.user?.username ? `${sale?.seller?.user?.username} (${sale?.seller?.address})` : sale?.seller?.address, },
      { name: 'Buyer', value: sale?.winner_account?.user?.username ? `${sale?.winner_account?.user?.username} (${sale?.winner_account?.address})` : sale?.winner_account?.address, },

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
<<<<<<< HEAD:checkSales.ts
  const seconds = process.env.SECONDS ? parseInt(process.env.SECONDS) : 3_600;
=======
  const seconds = process.env.SECONDS ? parseInt(process.env.SECONDS) : 999600;
>>>>>>> 077cdbb130fbfa4b3b4649d46cc82b34f50ff61f:DO_NOT_RUN_oldchecksales.ts
  const hoursAgo = (Math.round(new Date().getTime() / 1000) - (seconds)); // in the last hour, run hourly?
  console.log(hoursAgo.toString())
  

  //PARAMS FOR CHURCH OF SUBWAY JESUS
  const churchParams = new URLSearchParams({
    offset: '0',
    limit: '300',
    event_type: 'successful',
    only_opensea: 'false',
    occurred_after: hoursAgo.toString(),
    collection_slug: process.env.COLLECTION_SLUG_COSJ!,
  })
  if (process.env.CONTRACT_ADDRESS !== OPENSEA_SHARED_STOREFRONT_ADDRESS) {
    churchParams.append('asset_contract_address', process.env.CONTRACT_ADDRESS!)
  }

  //PARAMS FOR IOUS
  const IOUParams = new URLSearchParams({
    offset: '0',
<<<<<<< HEAD:checkSales.ts
    limit: '300',
=======
    limit: '100',
>>>>>>> 077cdbb130fbfa4b3b4649d46cc82b34f50ff61f:DO_NOT_RUN_oldchecksales.ts
    event_type: 'successful',
    only_opensea: 'false',
    occurred_after: hoursAgo.toString(),
    collection_slug: process.env.COLLECTION_SLUG_IOU!,
  })
  if (process.env.CONTRACT_ADDRESS !== OPENSEA_SHARED_STOREFRONT_ADDRESS) {
    IOUParams.append('asset_contract_address', process.env.CONTRACT_ADDRESS!)
  }

  //PARAMS FOR NVCS
  const NVCParams = new URLSearchParams({
    offset: '0',
    limit: '300',
    event_type: 'successful',
    only_opensea: 'false',
    occurred_after: hoursAgo.toString(),
    collection_slug: process.env.COLLECTION_SLUG_NVC!,
  })
  if (process.env.CONTRACT_ADDRESS !== OPENSEA_SHARED_STOREFRONT_ADDRESS) {
    NVCParams.append('asset_contract_address', process.env.CONTRACT_ADDRESS!)
  }
    //PARAMS FOR ISID
    const ISIDParams = new URLSearchParams({
      offset: '0',
      limit: '300',
      event_type: 'successful',
      only_opensea: 'false',
      occurred_after: hoursAgo.toString(),
      collection_slug: process.env.COLLECTION_SLUG_ISID!,
    })
    if (process.env.CONTRACT_ADDRESS !== OPENSEA_SHARED_STOREFRONT_ADDRESS) {
      NVCParams.append('asset_contract_address', process.env.CONTRACT_ADDRESS!)
    }
      //PARAMS FOR CGK
  const CGKParams = new URLSearchParams({
    offset: '0',
    limit: '300',
    event_type: 'successful',
    only_opensea: 'false',
    occurred_after: hoursAgo.toString(),
    collection_slug: process.env.COLLECTION_SLUG_CGK!,
  })
  if (process.env.CONTRACT_ADDRESS !== OPENSEA_SHARED_STOREFRONT_ADDRESS) {
    NVCParams.append('asset_contract_address', process.env.CONTRACT_ADDRESS!)
  }
    //PARAMS FOR FIM
    const FIMParams = new URLSearchParams({
      offset: '0',
      limit: '300',
      event_type: 'successful',
      only_opensea: 'false',
      occurred_after: hoursAgo.toString(),
      collection_slug: process.env.COLLECTION_SLUG_FIM!,
    })
    if (process.env.CONTRACT_ADDRESS !== OPENSEA_SHARED_STOREFRONT_ADDRESS) {
      NVCParams.append('asset_contract_address', process.env.CONTRACT_ADDRESS!)
    }

<<<<<<< HEAD:checkSales.ts
=======
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

>>>>>>> 077cdbb130fbfa4b3b4649d46cc82b34f50ff61f:DO_NOT_RUN_oldchecksales.ts

  // const openSeaResponse = await fetch(
  //   "https://api.opensea.io/api/v1/events?" + params, {
  //   headers: {
  //     'X-API-KEY': process.env.OPENSEA_API_KEY
  //   }
  // })
  //   .then(async response => {
  //     try {
  //       const data = await response.json()
  //       // console.log('response data', data)
  //       return data
  //     } catch (error) {
  //       console.log("error happened here!!")
  //       console.log(error)
  //     }
  //   }).catch(error => console.log(error));

  // await sleep(1000);

  const churchSeaResponse = await fetch(
<<<<<<< HEAD:checkSales.ts
    "https://api.opensea.io/api/v1/events?" + churchParams, {
    headers: {
      'X-API-KEY': process.env.OPENSEA_API_KEY
    }
  })
    .then(async response => {
      try {
        const data = await response.json()
        console.log('response data', data)
=======
    "https://api.opensea.io/api/v1/events?" + churchParams).then(async response => {
      try {
        const data = await response.json()
        // console.log('response data', data)
>>>>>>> 077cdbb130fbfa4b3b4649d46cc82b34f50ff61f:DO_NOT_RUN_oldchecksales.ts
        return data
      } catch (error) {
        console.log("error happened here!!")
        console.log(error)
      }
    }).catch(error => console.log(error));
<<<<<<< HEAD:checkSales.ts
=======


  // const churchSeaResponse = async () => {
  //   try {
  //     const res = await fetch("https://api.opensea.io/api/v1/events?" + churchParams);
  //     const data = await res.json();
  //     return data;
  //   } catch (error) {
  //     console.log("ERROR!!")
  //     console.log(error);
  //   }
  // }
>>>>>>> 077cdbb130fbfa4b3b4649d46cc82b34f50ff61f:DO_NOT_RUN_oldchecksales.ts

  await sleep(1000);

  const IOUResponse = await fetch(
    "https://api.opensea.io/api/v1/events?" + IOUParams, {
    headers: {
      'X-API-KEY': process.env.OPENSEA_API_KEY
    }
  })
    .then(async response => {
      try {
        const data = await response.json()
        // console.log('response data', data)
        return data
      } catch (error) {
        console.log("error happened here!!")
        console.log(error)
      }
    }).catch(error => console.log(error));

<<<<<<< HEAD:checkSales.ts
  await sleep(1000);
=======
  //FILTERING FOR STEVIEP ARTWORKS
  const FakeRes = await (
    openSeaResponse.asset_events.filter(project => project.asset.name.includes('Fake'))
  );
>>>>>>> 077cdbb130fbfa4b3b4649d46cc82b34f50ff61f:DO_NOT_RUN_oldchecksales.ts

  const NVCResponse = await fetch(
    "https://api.opensea.io/api/v1/events?" + NVCParams, {
    headers: {
      'X-API-KEY': process.env.OPENSEA_API_KEY
    }
  })
    .then(async response => {
      try {
        const data = await response.json()
        // console.log('response data', data, data.asset_events[0].asset)
        return data
      } catch (error) {
        console.log("error happened here!!")
        console.log(error)
      }
    }).catch(error => console.log(error));


    await sleep(1000);
  
  const FIMResponse = await fetch(
    "https://api.opensea.io/api/v1/events?" + FIMParams, {
    headers: {
      'X-API-KEY': process.env.OPENSEA_API_KEY
    }
  })
    .then(async response => {
      try {
        const data = await response.json()
        // console.log('response data', data, data.asset_events[0].asset)
        return data
      } catch (error) {
        console.log("error happened here!!")
        console.log(error)
      }
    }).catch(error => console.log(error));

    await sleep(1000);


  const CGKResponse = await fetch(
    "https://api.opensea.io/api/v1/events?" + CGKParams, {
    headers: {
      'X-API-KEY': process.env.OPENSEA_API_KEY
    }
  })
    .then(async response => {
      try {
        const data = await response.json()
        // console.log('response data', data, data.asset_events[0].asset)
        return data
      } catch (error) {
        console.log("error happened here!!")
        console.log(error)
      }
    }).catch(error => console.log(error));

    await sleep(1000);


  const ISIDResponse = await fetch(
    "https://api.opensea.io/api/v1/events?" + ISIDParams, {
    headers: {
      'X-API-KEY': process.env.OPENSEA_API_KEY
    }
  })
    .then(async response => {
      try {
        const data = await response.json()
        // console.log('response data', data, data.asset_events[0].asset)
        return data
      } catch (error) {
        console.log("error happened here!!")
        console.log(error)
      }
    }).catch(error => console.log(error));


  //CREATING PROMISES AND BUILDING MESSAGES TO SEND

<<<<<<< HEAD:checkSales.ts
  const FIMSales = await Promise.all(
    FIMResponse.asset_events.reverse().map(async (sale: any) => {
=======
  const FakeSales = await Promise.all(
    FakeRes.reverse().map(async (sale: any) => {
>>>>>>> 077cdbb130fbfa4b3b4649d46cc82b34f50ff61f:DO_NOT_RUN_oldchecksales.ts
      const message = buildMessage(sale);
      const Fake_ID = process.env.FAKE_ID;
      channel.id = Fake_ID;
      return channel.send(message)
    })
  );

<<<<<<< HEAD:checkSales.ts
  const CGKSales = await Promise.all(
    CGKResponse.asset_events.reverse().map(async (sale: any) => {
=======
  const cgkSales = await Promise.all(
    cgkRes.reverse().map(async (sale: any) => {
>>>>>>> 077cdbb130fbfa4b3b4649d46cc82b34f50ff61f:DO_NOT_RUN_oldchecksales.ts
      const message = buildMessage(sale);
      const cgk_ID = process.env.CGK_ID;
      channel.id = cgk_ID;
      return channel.send(message)
    })
  );

<<<<<<< HEAD:checkSales.ts
  const ISIDSales = await Promise.all(
    ISIDResponse.asset_events.reverse().map(async (sale: any) => {
=======
  const dreamSales = await Promise.all(
    dreamRes.reverse().map(async (sale: any) => {
>>>>>>> 077cdbb130fbfa4b3b4649d46cc82b34f50ff61f:DO_NOT_RUN_oldchecksales.ts
      const message = buildMessage(sale);
      const dream_ID = process.env.DREAM_ID;
      channel.id = dream_ID;
      return channel.send(message)
    })
  )


  const IOUSales = await Promise.all(
    IOUResponse.asset_events.reverse().map(async (sale: any) => {
      const message = buildMessage(sale);
      const IOU_ID = process.env.IOU_ID;
      channel.id = IOU_ID;
      return channel.send(message)
    })
  );

  const ChurchSales = await Promise.all(
    churchSeaResponse.asset_events.reverse().map(async (sale: any) => {
      const message = buildMessage(sale);
      const church_ID = process.env.CHURCH_ID;
      channel.id = church_ID;
      return channel.send(message)
    })
  );


  const NVCSales = await Promise.all(
    NVCResponse.asset_events.reverse().map(async (sale: any) => {
      const message = buildMessage(sale);
      const NVC_ID = process.env.NVC_ID;
      channel.id = NVC_ID;
      return channel.send(message)
    })
  );


 
  //RETURNING MESSAGES OF SALES

  return await Promise.all(
    [
      FIMSales,
      ISIDSales,
      CGKSales,
      ChurchSales,
      IOUSales,
      NVCSales
    ]
  );
}




main()
  .then((res) => {
    if (!res.length) console.log("No recent sales");
    process.exit(0)
  })
  .catch(error => {
    // console.error(error);
    process.exit(1);
  });

