import styled from "@emotion/styled";
import { Card } from "@mui/material";
import AntelopesCards from "../components/AntelopesCards";
import InitialGraphs from "../components/InitialGraphs";
import StackedChart from "../components/StackedChart";
import { useDataStore } from "../stores/data.store";
import { Antelope } from "../utils/constants";
import { groupByContinent } from "../utils/groupBy";

export default styled(({ className }: any) => {
  const { data } = useDataStore();

  const continents = Array.from(
    new Set(data.map(({ continent }) => continent))
  );
  const horns = Array.from(new Set(data.map(({ horns }) => horns)));
  return (
    <div className={className}>
      <h2>Details</h2> <InitialGraphs />
      <div className="stacked-charts">
        <Card>
          <h3>Antelopes by horns by continent</h3>
          <StackedChart
            width={300}
            height={400}
            keys={continents}
            data={groupByContinent(data, "horns")}
            getX={({ horns }:Antelope) => horns}
          />
        </Card>
        <Card>
          <h3>Average weight and height by continent</h3>
          <StackedChart
            width={300}
            height={400}
            keys={["height", "weight"]}
            data={continents.map((continent) => ({
              label: continent,
              ...["height", "weight"]
                .map((field) => {
                  const values = data.filter(
                    ({ continent: datumContinent }) =>
                      continent === datumContinent
                  );
                  const total = values.reduce(
                    (
                      accumulator: number,
                      { [field as keyof Antelope]: value }
                    ) => accumulator + Number(value),
                    0
                  );
                  return { field, average: (total / values.length).toFixed(2) };
                })
                .reduce((accumulator:any, { field, average }:any) => {
                  return {
                    ...accumulator,
                    [field]: average,
                  };
                }, {}),
            }))}
            getX={({ label }: { label: string }) => label}
          />
        </Card>
        <Card>
          <h3>Average weight and height by horns</h3>
          <StackedChart
            width={300}
            height={400}
            keys={["height", "weight"]}
            data={horns.map((horn) => ({
              label: horn,
              ...["height", "weight"]
                .map((field) => {
                  const values = data.filter(
                    ({ horns: datumHorn }) => horn === datumHorn
                  );
                  const total = values.reduce(
                    (accumulator, { [field as keyof Antelope]: value }) => accumulator + Number(value),
                    0
                  );
                  return { field, average: (total / values.length).toFixed(2) };
                })
                .reduce((accumulator, { field, average }) => {
                  return {
                    ...accumulator,
                    [field]: average,
                  };
                }, {}),
            }))}
            getX={({ label }:{label: string;}) => label}
          />
        </Card>
      </div>
      <AntelopesCards data={data} />
    </div>
  );
})`
  & {
    margin: calc(var(--gap) * 2);
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    background: #fff;
    padding: var(--gap);
    border-radius: var(--radius);
    h2 {
      margin: 0;
      padding: 0;
    }
  }
  .stacked-charts {
    display: flex;
    justify-content: space-between;
  }
  .MuiPaper-root {
    padding: var(--gap);
  }
`;
