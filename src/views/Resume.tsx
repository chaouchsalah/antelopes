import styled from "@emotion/styled";
import { useState } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import AntelopesCards from "../components/AntelopesCards";
import InitialGraphs from "../components/InitialGraphs";
import { StyledProps } from "../utils/constants";
import { useDataStore } from "../stores/data.store";

export default styled(({ className }: StyledProps) => {
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem("isCollapsed") === "true"
  );
  const { data } = useDataStore();
  const handleIsCollapsed = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem("isCollapsed", (!isCollapsed).toString());
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
      {isCollapsed && (
        <div className="container">
          <InitialGraphs />
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
