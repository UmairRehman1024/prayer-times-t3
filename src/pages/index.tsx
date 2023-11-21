/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import Head from "next/head";
import PieGraph from "~/components/PieChart";

import { api } from "~/utils/api";

export default function Home() {
  //getprayertimes from trpc
  const { data: prayerTimes, isLoading } = api.prayer.getPrayerTimes.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
    // TODO add loading spinner and make look nicer
  }

  if (
    prayerTimes?.[0] === undefined ||
    prayerTimes[1] === undefined ||
    prayerTimes[2] === undefined ||
    prayerTimes[3] === undefined ||
    prayerTimes[4] === undefined ||
    prayerTimes[5] === undefined
  ) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <Head>
        <title>Prayer Times</title>
        <meta
          name="description"
          content="prayer times taken from manchester central mosque"
        />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        {/* TODO add prayer icon */}
      </Head>
      <main className="h-screen w-screen bg-gradient-to-t from-[#051f1c] from-5%  to-[#4d8e86] to-95% font-open">
        <div className="mx-5 flex flex-col items-center lg:flex-row lg:justify-center  ">
          <div className=" h-48 w-full lg:w-1/4">
            <PieGraph data={prayerTimes} />
          </div>

          <div className="flex flex-col items-center pt-10 lg:w-1/4">
            <PrayerTime prayerType="Fajr" prayerTime={prayerTimes[0]} />
            <PrayerTime prayerType="Sunrise" prayerTime={prayerTimes[1]} />
            <PrayerTime prayerType="Dhuhr" prayerTime={prayerTimes[2]} />
            <PrayerTime prayerType="Asr" prayerTime={prayerTimes[3]} />
            <PrayerTime prayerType="Maghrib" prayerTime={prayerTimes[4]} />
            <PrayerTime prayerType="Isha" prayerTime={prayerTimes[5]} />
          </div>
        </div>
      </main>
    </>
  );
}

function PrayerTime({
  prayerType,
  prayerTime,
}: {
  prayerType: string;
  prayerTime: number;
}) {
  return (
    <div className="  flex w-4/5  flex-row justify-between rounded pb-5">
      <div className="flex w-2/6 justify-center">
        <p className="text-2xl ">{prayerType}</p>
      </div>
      <div className="flex w-2/6 justify-center">
        <p className="text-2xl ">{minutesToTime(prayerTime)}</p>
        
      </div>
    </div>
  );
}


function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  // Pad minutes with leading zero if necessary
  const paddedMins = mins < 10 ? `0${mins}` : mins;

  return `${hours}:${paddedMins}`;
}

