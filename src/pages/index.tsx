import Head from "next/head";
import Link from "next/link";
import PieGraph from "~/components/PieChart";
import Example from "~/components/PieChartNeedle";
import { Redis } from '@upstash/redis'

import { api } from "~/utils/api";


export default function Home() {
  // const hello = api.post.hello.useQuery({ text: "from tRPC" });

  const prayerTimes = {
    fajr: "05:00",
    dhuhr: "12:00",
    asr: "15:00",
    maghrib: "18:00",
    isha: "20:00",
  };

  //051f1c
  //4d8e86

  //#5B9A9A

  //bg-[#305252]
  //  via-[#113f3c] via-60% 

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

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
            <PieGraph />
          </div>

          <div className="flex flex-col items-center pt-10 lg:w-1/4">
            <PrayerTime prayerType="Fajr" prayerTime={prayerTimes.fajr} />
            <PrayerTime prayerType="Dhuhr" prayerTime={prayerTimes.dhuhr} />
            <PrayerTime prayerType="Asr" prayerTime={prayerTimes.asr} />
            <PrayerTime prayerType="Maghrib" prayerTime={prayerTimes.maghrib} />
            <PrayerTime prayerType="Isha" prayerTime={prayerTimes.isha} />
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
  prayerTime: string;
}) {
  return (
    <div className="  flex w-4/5  flex-row justify-between rounded pb-5">
      <div className="flex w-2/6 justify-center">
        <p className="text-2xl ">{prayerType}</p>
      </div>
      <div className="flex w-2/6 justify-center">
        <p className="text-2xl ">{prayerTime}</p>
      </div>
    </div>
  );
}
