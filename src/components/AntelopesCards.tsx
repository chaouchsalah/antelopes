import styled from "@emotion/styled";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { Antelope } from "../utils/constants";

const pageLimit = 10;

interface AntelopesCardsProps {
  className?: string;
  data: Array<Antelope>;
}

export default styled(({ data, className }: AntelopesCardsProps) => {
  const [selectedHorns, setSelectedHorns] = useState<Array<string>>([]);
  const [sortBy, setSortBy] = useState<string>("heaviest");
  const [page, setPage] = useState(1);
  const horns = Array.from(new Set(data?.map(({ horns }: Antelope) => horns)));

  const handleHorns = (horn: string) => {
    const hornIndex = selectedHorns.findIndex(
      (selectedHorn) => selectedHorn === horn
    );
    if (hornIndex !== -1) {
      setSelectedHorns([
        ...selectedHorns.slice(0, hornIndex),
        ...selectedHorns.slice(hornIndex + 1),
      ]);
    } else {
      setSelectedHorns([...selectedHorns, horn]);
    }
  };

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  if (!data || data.length === 0) {
    return <div />;
  }

  return (
    <div className={className}>
      <div className="filters">
        <div>
          Filter By:{" "}
          {horns.map((horn: string) => (
            <Chip
              className={`horn ${selectedHorns.includes(horn) && "active"}`}
              onClick={() => {
                handleHorns(horn);
              }}
              key={horn}
              label={horn}
            />
          ))}
        </div>
        <div>
          Sort by:{" "}
          <Select
            name="Sort by"
            value={sortBy}
            onChange={({ target: { value } }) => setSortBy(value)}>
            <MenuItem value="heaviest">Heaviest</MenuItem>
            <MenuItem value="lightest">Lightest</MenuItem>
            <MenuItem value="tallest">Tallest</MenuItem>
            <MenuItem value="shortest">Shortest</MenuItem>
          </Select>
        </div>
      </div>
      <div className="antelopes">
        {data
          .filter(
            ({ horns }: Antelope) =>
              selectedHorns.length === 0 || selectedHorns.includes(horns)
          )
          .sort((a: Antelope, b: Antelope) => {
            switch (sortBy) {
              case "lightest":
                return a.weight - b.weight;
              case "tallest":
                return b.height - a.height;
              case "shortest":
                return a.height - b.height;
            }
            return b.weight - a.weight;
          })
          .slice((page - 1) * pageLimit, page * pageLimit)
          .map(
            ({ name, continent, weight, height, horns, picture }: Antelope) => (
              <Card key={name}>
                <CardMedia component="img" height="194" image={picture} />
                <CardContent>
                  <div>
                    <span>
                      {name}

                      <Chip label={horns} />
                    </span>
                    <p>
                      Height: <strong>{height}</strong>
                    </p>
                    <p>
                      Weight: <strong>{weight}</strong>
                    </p>
                    <p>
                      Continent: <strong>{continent}</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          )}
      </div>
      <Pagination
        count={Math.ceil(
          data.filter(
            ({ horns }: Antelope) =>
              selectedHorns.length === 0 || selectedHorns.includes(horns)
          ).length / pageLimit
        )}
        page={page}
        onChange={handlePageChange}
        color="primary"
      />
    </div>
  );
})`
  & {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
  }
  .filters {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
`;
