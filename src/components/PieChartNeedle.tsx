/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/jsx-key */
import React, { PureComponent } from "react";
import { PieChart, Pie, Cell, LabelList, ResponsiveContainer } from "recharts";

const RADIAN = Math.PI / 180;
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
  { name: "beforeFajr", value: 328 },
  { name: "Fajr", value: 124 },
  { name: "beforeDhuhr", value: 261 },
  { name: "Dhuhr", value: 153 },
  { name: "Asr", value: 113 },
  { name: "Maghrib", value: 119 },
  { name: "Isha", value: 342 },
];

const cx = 400;
const cy = 100;
const iR = 0;
const oR = 100;
const value = 800;

const needle = (
  value: number,
  data: any[],
  cx: number,
  cy: number,
  iR: number,
  oR: number,
  color: string | undefined,
) => {
  const total = 1440;
  //   data.forEach((v) => {
  //     total += v.value;
  //   });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path
      d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
      stroke="#none"
      fill={color}
    />,
  ];
};

export default class Example extends PureComponent {
  render() {
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
          </Pie>
          {needle(value, data, cx, cy, iR, oR, "#d0d000")}
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
