import { BarStack } from "@visx/shape";
import { Accessor, SeriesPoint } from "@visx/shape/lib/types";
import { Group } from "@visx/group";
import { AxisBottom } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { LegendOrdinal } from "@visx/legend";
import { localPoint } from "@visx/event";

type TooltipData = {
  bar: SeriesPoint<any>;
  key: string;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

export type BarStackProps = {
  width: number;
  height: number;
  data: any;
  getX: Accessor<any, any>;
  keys: Array<string>;
};

const purple1 = "#4dccbd";
const purple2 = "#67BDFA";
export const background = "#eaedff";
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
};

let tooltipTimeout: number;

export default ({ width, height, data, getX, keys }: BarStackProps) => {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  const valueTotal = data.reduce((allTotals: number[], currentLabel: any) => {
    const totalValue = keys.reduce((labelTotal, k) => {
      const value = Number(currentLabel[k]);
      labelTotal += isNaN(value) ? 0 : value;
      return labelTotal;
    }, 0);
    allTotals.push(totalValue);
    return allTotals;
  }, [] as number[]);

  // scales
  const xScale = scaleBand<string>({
    domain: data.map(getX),
    padding: 0.2,
  });
  const yScale = scaleLinear<number>({
    domain: [0, Math.max(...valueTotal)],
    nice: true,
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: [purple1, purple2],
  });

  if (width < 10) return null;
  // bounds
  const xMax = width;
  const yMax = height - 140;

  xScale.rangeRound([0, xMax]);
  yScale.range([yMax, 0]);

  return width < 10 ? null : (
    <div style={{ position: "relative" }}>
      <svg ref={containerRef} width={width} height={height}>
        <Group top={40}>
          <BarStack<any, string>
            data={data}
            keys={keys}
            x={getX}
            xScale={xScale}
            yScale={yScale}
            color={colorScale}>
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                    onMouseLeave={() => {
                      tooltipTimeout = window.setTimeout(() => {
                        hideTooltip();
                      }, 300);
                    }}
                    onMouseMove={(event) => {
                      if (tooltipTimeout) clearTimeout(tooltipTimeout);
                      const eventSvgCoords = localPoint(event);
                      const left = bar.x + bar.width / 2;
                      showTooltip({
                        tooltipData: bar,
                        tooltipTop: eventSvgCoords?.y,
                        tooltipLeft: left,
                      });
                    }}
                  />
                ))
              )
            }
          </BarStack>
        </Group>
        <AxisBottom
          top={yMax + 40}
          scale={xScale}
          stroke={purple2}
          tickStroke={purple2}
          tickLabelProps={() => ({
            fontSize: 11,
            textAnchor: "middle",
          })}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 40 / 2 - 10,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: "14px",
        }}>
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          labelMargin="0 15px 0 0"
        />
      </div>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}>
          <div style={{ color: colorScale(tooltipData.key) }}>
            <strong>{tooltipData.key}</strong>
          </div>
          <div>{tooltipData.bar.data[tooltipData.key]}</div>
          <div>
            <small>{getX(tooltipData.bar.data)}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
};
