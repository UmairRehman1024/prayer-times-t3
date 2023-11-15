/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React from "react";
import { ResponsiveContainer, PieChart, Pie, LabelList, Cell } from "recharts";



const getCurrentSection = (data: number[]) => {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  //if data is undefined return error
  if (
    data?.[0] === undefined ||
    data?.[1] === undefined ||
    data?.[2] === undefined ||
    data?.[3] === undefined ||
    data?.[4] === undefined ||
    data?.[5] === undefined
  )
    return "error";

  if (current < data[0]) {
    return "beforeFajr";
  } else if (current < data[1]) {
    return "Fajr";
  } else if (current < data[2]) {
    return "beforeDhuhr";
  } else if (current < data[3]) {
    return "Dhuhr";
  } else if (current < data[4]) {
    return "Asr";
  } else if (current < data[5]) {
    return "Maghrib";
  } else {
    return "Isha";
  }
};

//current section is highlighted
const colors = (Name: string, data: number[]) => {
  const currentSection = getCurrentSection(data);

  switch (currentSection) {
    case "beforeFajr":
      return Name === "beforeFajr" ? "#5B9A9A" : "#305252";
    case "Fajr":
      return Name === "Fajr" ? "#5B9A9A" : "#305252";
    case "beforeDhuhr":
      return Name === "beforeDhuhr" ? "#5B9A9A" : "#305252";
    case "Dhuhr":
      return Name === "Dhuhr" ? "#5B9A9A" : "#305252";
    case "Asr":
      return Name === "Asr" ? "#5B9A9A" : "#305252";
    case "Maghrib":
      return Name === "Maghrib" ? "#5B9A9A" : "#305252";
    case "Isha":
      return Name === "Isha" ? "#355A5A" : "#305252";
    case "error":
      //return red if data is undefined
      return "#FF0000";
    default:
      return "#305252";
  }
};

export default function PieGraph({ data }: { data: number[] }) {

  if (
    data?.[0] === undefined ||
    data?.[1] === undefined ||
    data?.[2] === undefined ||
    data?.[3] === undefined ||
    data?.[4] === undefined ||
    data?.[5] === undefined 

  ) {
    console.log("error ", data)
    return <div>Something went wrong</div>;
  }


  //convert data into object for pie chart
  const dataObject = [
    { name: "beforeFajr", value: data[0] },
    { name: "Fajr", value: data[1] - data[0] },
    { name: "beforeDhuhr", value: data[2] - data[1] },
    { name: "Dhuhr", value: data[3] - data[2] },
    { name: "Asr", value: data[4] - data[3] },
    { name: "Maghrib", value: data[5] - data[4] },
    { name: "Isha", value: 1440 - data[5]  },
  ];

  console.log("dataObject ", dataObject)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={dataObject}
          cy="100%"
          outerRadius="100%"
          
        >
          {dataObject.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors(entry.name, data)} />
          ))}
          {/* <LabelList dataKey="name" position="outside" /> */}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
