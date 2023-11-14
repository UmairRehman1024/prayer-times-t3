/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { NextApiRequest, NextApiResponse } from "next";
import Xray from "x-ray";

type ResponseData = {
  message: string;
};

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
    prayers.shift()
    prayers.shift()


    //keep elements 0, 2, 4, 6, 7 - keepong only the start times
    prayers = prayers.filter(
        (prayer: string, i: string | number) => {
            return i === 0 || i === 2 || i === 4 || i === 6 || i === 7;
        }
    );

    //for each element, keep only the last 6 characters and remove whitespace
    prayers = prayers.map((prayer: string) => prayer.slice(-6).trim());

    //set time to 24 hour clock
    prayers = prayers.map((prayer: string, i:number) => {
        //split the string into an array
        const prayerArray = prayer.split(".");
        if (prayerArray[0] === undefined || prayerArray[1] === undefined) {
            return;
        }
        //if dhuhr and first element of prayerArray < 10 add 12 to the first element
        else if (i === 1 && parseInt(prayerArray[0]) <= 10){
            prayerArray[0] = (parseInt(prayerArray[0]) + 12).toString();

        }
        else if (i === 2 || i === 3 || i === 4){
            prayerArray[0] = (parseInt(prayerArray[0]) + 12).toString();

        }
        
        return prayerArray.join(":");

        
    });

    const prayersMin = prayers.map((prayer: string) => {
        const prayerArray = prayer.split(":");
        if (prayerArray[0] === undefined || prayerArray[1] === undefined) {
            return;
        }
        return (parseInt(prayerArray[0]) * 60) + parseInt(prayerArray[1]);
    });


    

    //turn the time into a date object
    //prayers = prayers.map((prayer: string) => new Date(`2021-01-01 ${prayer}`));


    //add the prayer name to the time
    // prayers[0] = `Fajr ${prayers[0]}`;
    // prayers[1] = `Zuhr ${prayers[1]}`;
    // prayers[2] = `Asr ${prayers[2]}`;
    // prayers[3] = `Maghrib ${prayers[3]}`;
    // prayers[4] = `Isha ${prayers[4]}`;

    //console.log the prayerMIn array
    console.log(prayersMin);
    
    prayers.forEach((prayer: string) => console.log(`- ${prayer}`));
  });

  res.status(200).json({ message: "Hello from Next.js!" });
}
