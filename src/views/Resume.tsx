import styled from "@emotion/styled";
import { useState } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Card } from "@mui/material";
import BarChart from "../components/BarChart";
import useFetchAntellopes from "../api/useFetchAntellopes";
import Alert from "../components/Alert";
import groupBy from "../utils/groupBy";
import GeoMap from "../components/GeoMap";
import AntelopesCards from "../components/AntelopesCards";

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

interface ResumeProps {
  className?: string;
}

export default styled(({ className }: ResumeProps) => {
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem("isCollapsed") === "true"
  );
  const { data, loading, error, refetch } = useFetchAntellopes();
  const handleIsCollapsed = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem("isCollapsed", (!isCollapsed).toString());
  };

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
  return (
    <div className={className}>
      <div className="collapsible" onClick={handleIsCollapsed}>
        <h2>Overview</h2>{" "}
        {isCollapsed ? (
          <ArrowDropUp fontSize="large" />
        ) : (
          <ArrowDropDown fontSize="large" />
        )}
      </div>
      {!isCollapsed ? null : loading || error ? (
        <Alert loading={loading} error={error} onTryAgain={refetch} />
      ) : (
        <div className="container">
          <div className="cards">
            <Card>
              <h3>Antelopes by horns:</h3>
              <BarChart
                width={300}
                height={300}
                data={groupBy(data, "horns").sort((a:any, b:any) => b.value - a.value)}
                getX={({ horns }:{horns: string;}) => horns}
                getY={({ value }:{value:number;}) => value}
              />
            </Card>
            <Card>
              <h3>Antelopes by weight:</h3>
              <BarChart
                width={300}
                height={300}
                data={groupBy(data, "weight", matchWeight).sort(
                  (a:any, b:any) => b.value - a.value
                )}
                getX={({ weight }:{weight:number;}) => weight}
                getY={({ value }:{value:number;}) => value}
              />
            </Card>
            <Card>
              <h3>Antelopes by height:</h3>
              <BarChart
                width={300}
                height={300}
                data={groupBy(data, "height", matchHeight).sort(
                  (a:any, b:any) => b.value - a.value
                )}
                getX={({ height }:{height:number;}) => height}
                getY={({ value }:{value:number;}) => value}
              />
            </Card>
            <Card>
              <GeoMap
                title="Map"
                points={data.map(({ continent }) => CONTINENTS_POS[continent as keyof typeof CONTINENTS_POS])}
              />
            </Card>
          </div>
          <AntelopesCards data={data} />
        </div>
      )}
    </div>
  );
})`
  & {
    padding: calc(var(--gap) * 2);
  }
  .collapsible {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: var(--gap);
    cursor: pointer;
    border-top-right-radius: var(--radius);
    border-top-left-radius: var(--radius);
  }
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
  .container {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    background: #fff;
    padding: var(--gap);
    border-bottom-right-radius: var(--radius);
    border-bottom-left-radius: var(--radius);
  }
  .antelopes {
    display: grid;
    gap: var(--gap);
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    grid-auto-rows: max-content;
    .MuiPaper-root {
      span {
        display: flex;
        gap: var(--gap);
        align-items: baseline;
      }
      div {
        padding: calc(var(--gap) * 0.5);
      }
    }
  }
  .horn {
    cursor: pointer;
  }
  .active {
    background: var(--primary);
  }
  .filter-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
  }
`;
