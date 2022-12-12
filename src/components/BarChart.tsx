import React, { useMemo } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';


interface BarsProps {
  width: number;
  height: number;
  getX: Function;
  getY: Function;
  data: any;
};

export default ({ width, height, getX, getY, data }: BarsProps) => {
  const xMax = width;
  const yMax = height - 120;

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(getX),
        padding: 0.4,
      }),
    [xMax],
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(getY))],
      }),
    [yMax],
  );

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <Group>
        {data.map((d:any) => {
          const label = getX(d);
          const value = getY(d);
          const y = xScale(label);
          return (
            <>
            <text
                        x={10}
                        y={y}
                        fill="#111"
                        fontSize={12}
                        textAnchor="left"
                        dy="1.4em"
                      >
                        {label}
                      </text>
            <Bar
              key={`bar-${label}`}
              x={90}
              y={y}
              width={yMax - (yScale(getY(d)) ?? 0)}
              height={xScale.bandwidth()}
              fill="var(--primary)"
            />
            <text
                        x={95 + yMax - (yScale(getY(d)) ?? 0)}
                        y={y}
                        fill="#111"
                        fontSize={12}
                        fontWeight={600}
                        textAnchor="right"
                        dy="1.4em"
                      >
                        {value}
                      </text>
            </>
          );
        })}
      </Group>
    </svg>
  );
}
