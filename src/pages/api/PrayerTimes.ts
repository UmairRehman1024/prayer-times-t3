/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import Xray from "x-ray";

import { env } from "~/env.mjs";

type ResponseData = {
  message: string;
};

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const x = Xray();

  x("https://manchestercentralmosque.org/", {
    prayers: [".prayer_time"],
  })((err, result) => {
    let prayers = result.prayers;
    prayers = prayers.map((prayer: string) =>
      prayer.replace(/(\r\n|\n|\r)/gm, ""),
    );

    //remove the first 2 elements
    prayers.shift();
    prayers.shift();

    //keep elements 0, 2, 4, 6, 7 - keepong only the start times
    prayers = prayers.filter((prayer: string, i: string | number) => {
      return i === 0 || i === 2 || i === 4 || i === 6 || i === 7;
    });

    //for each element, keep only the last 6 characters and remove whitespace
    prayers = prayers.map((prayer: string) => prayer.slice(-6).trim());

    //set time to 24 hour clock
    prayers = prayers.map((prayer: string, i: number) => {
      //split the string into an array
      const prayerArray = prayer.split(".");
      if (prayerArray[0] === undefined || prayerArray[1] === undefined) {
        return;
      }
      //if dhuhr and first element of prayerArray < 10 add 12 to the first element
      else if (i === 1 && parseInt(prayerArray[0]) <= 10) {
        prayerArray[0] = (parseInt(prayerArray[0]) + 12).toString();
      } else if (i === 2 || i === 3 || i === 4) {
        prayerArray[0] = (parseInt(prayerArray[0]) + 12).toString();
      }

      return prayerArray.join(":");
    });
    //the output type is a array of numbers
    const prayersMin: number[] = prayers.map((prayer: string) => {
      const prayerArray = prayer.split(":");
      if (prayerArray[0] === undefined || prayerArray[1] === undefined) {
        return;
      }
      return parseInt(prayerArray[0]) * 60 + parseInt(prayerArray[1]);
    });

    const Prayers: any[] = [];

    //update the redis database
    updatePrayerTimes(prayersMin)
      .then((value) => {
        if (value === undefined) {
          return;
        }
        Prayers.push(value[0]);
        Prayers.push(value[1]);
        Prayers.push(value[2]);
        Prayers.push(value[3]);
        Prayers.push(value[4]);
        Prayers.push(value[5]);
      })

      .catch((err) => {
        res.status(500).json({ message: err });
      });

    const results = {
      message: "updated correctly",
      data: {
        fajr: Prayers[0],
        sunrise: Prayers[1],
        dhuhr: Prayers[2],
        asr: Prayers[3],
        maghrib: Prayers[4],
        isha: Prayers[5],
      }
    };

    res.status(200).json(results);

   
  });

}



const updatePrayerTimes = async (prayers: number[]) => {
  try {
    await redis.set("fajr", prayers[0]);
    await redis.set("sunrise", await getSunrise());
    await redis.set("dhuhr", prayers[1]);
    await redis.set("asr", prayers[2]);
    await redis.set("maghrib", prayers[3]);
    await redis.set("isha", prayers[4]);

    //add the sunrise to the 2nd element of the array
    prayers.splice(1, 0, await getSunrise());
    return prayers;
  } catch (error) {
    console.error(error);
  }
};

async function getSunrise() {
  // Coordinates for Manchester
  const latitude = 53.483959;
  const longitude = -2.244644;
  const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`;

  const response = await fetch(url);
  const data = await response.json();
  //split the sunrise time into an array split by ":"
  const sunriseArray = data.results.sunrise.split(":");
  //convert the hours to minutes and add the minutes
  const sunriseMinutes =
    parseInt(sunriseArray[0]) * 60 + parseInt(sunriseArray[1]);
  return sunriseMinutes;
}
