import styled from "@emotion/styled";
import ConditionsGenerator from "../components/ConditionsGenerator";
import SearchBar from "../components/SearchBar";

interface AdvancedProps {
  className?: string;
}

export default styled(({ className }: AdvancedProps) => {
  const group = localStorage.getItem("group");

  return (
    <div className={className}>
      <h2>Advanced</h2>
      {group === "A" ? <ConditionsGenerator /> : <SearchBar />}
    </div>
  );
})`
  & {
    margin: calc(var(--gap) * 2);
    padding: var(--gap);
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    background: #fff;
    border-radius: var(--radius);
  }
`;
