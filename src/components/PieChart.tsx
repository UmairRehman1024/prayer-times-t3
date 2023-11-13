import React from "react";
import { ResponsiveContainer, PieChart, Pie, LabelList, Cell } from "recharts";

328;
// 5.28 - fajr
452;
// 7.32 - sunrise
713;
// 11.53 - dhuhr
866;
// 14.26 - asr
979;
// 16.19 - magrhib
1098;
// 18.18 - isha
const data = [
  { name: "beforeFajr", value: 328, additiveValue: 328 },
  { name: "Fajr", value: 124, additiveValue: 452 },
  { name: "beforeDhuhr", value: 261, additiveValue: 713 },
  { name: "Dhuhr", value: 153, additiveValue: 866 },
  { name: "Asr", value: 113, additiveValue: 979 },
  { name: "Maghrib", value: 119, additiveValue: 1098 },
  { name: "Isha", value: 342, additiveValue: 1440 },
];

const getCurrentSection = () => {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  if (
    data[0] === undefined ||
    data[1] === undefined ||
    data[2] === undefined ||
    data[3] === undefined ||
    data[4] === undefined ||
    data[5] === undefined ||
    data[6] === undefined
  ) {
    return "beforeFajr";
  } else if (current < data[0].additiveValue) {
    return "beforeFajr";
  } else if (current < data[1].additiveValue) {
    return "Fajr";
  } else if (current < data[2].additiveValue) {
    return "beforeDhuhr";
  } else if (current < data[3].additiveValue) {
    return "Dhuhr";
  } else if (current < data[4].additiveValue) {
    return "Asr";
  } else if (current < data[5].additiveValue) {
    return "Maghrib";
  } else if (current < data[6].additiveValue) {
    return "Isha";
  }
};


//current section is highlighted
const colors = (Name: string) => {

  const currentSection = getCurrentSection();

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
      return Name === "Isha" ? "#5B9A9A" : "#305252";
    default:
      return "#305252";
  }
};

export default function PieGraph() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cy="100%"
          outerRadius="100%"
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors(entry.name)} />
          ))}
          {/* <LabelList dataKey="name" position="inside" /> */}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
