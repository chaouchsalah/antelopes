import styled from "@emotion/styled";
import { Card } from "@mui/material";
import BarChart from "../components/BarChart";
import groupBy from "../utils/groupBy";
import GeoMap from "../components/GeoMap";
import { StyledProps } from "../utils/constants";
import { useDataStore } from "../stores/data.store";

const CONTINENTS_POS = {
  Africa: {
    latitude: -8.783195,
    longitude: 34.50852299999997,
    name: "Africa",
  },
  Asia: {
    latitude: 34.047863,
    longitude: 100.619655,
    name: "Asia",
  },
};


export default styled(({ className }: StyledProps) => {
  const { data } = useDataStore();

  const matchWeight = (weight: number) => {
    if (weight <= 50) {
      return "<= 50kg";
    } else if (weight <= 100 && weight > 50) {
      return "50kg => 100kg";
    } else if (weight > 100 && weight <= 300) {
      return "100kg => 300kg";
    } else {
      return "> 300kg";
    }
  };
  const matchHeight = (height: number) => {
    if (height <= 20) {
      return "<= 20cm";
    } else if (height <= 30 && height > 20) {
      return "20cm => 30cm";
    } else if (height > 30 && height <= 40) {
      return "30cm => 40cm";
    } else {
      return "> 40cm";
    }
  };
  const GRAPHS = [{title:'Antelopes by horns:',field:'horns'},{title:'Antelopes by weight:',field:'weight',matchFn: matchWeight},{title:'Antelopes by height:',field:'height',matchFn: matchHeight}];
  return (
    <div className={className}>
          <div className="cards">
            {data.length !== 0 && GRAPHS.map(({title,field,matchFn}) => (
                <Card>
              <h3>{title}</h3>
              <BarChart
                width={300}
                height={300}
                data={groupBy(data, field,matchFn).sort((a:any, b:any) => b.value - a.value)}
                getX={({ [field]: label }:any) => label}
                getY={({ value }:{value:number;}) => value}
              />
            </Card>
            ))}
            <Card>
              <GeoMap
                title="Map"
                points={data.map(({ continent }) => CONTINENTS_POS[continent as keyof typeof CONTINENTS_POS])}
              />
            </Card>
          </div>
    </div>
  );
})`
  .cards {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: var(--gap);
    margin-top: var(--gap);
    .MuiPaper-root {
      padding: var(--gap);
    }
    h3 {
      margin: 0;
      padding: 0;
    }
  }
`;
