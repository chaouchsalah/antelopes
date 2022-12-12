import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Button,
  Card,
  Chip,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import useFetchAntellopes from "../api/useFetchAntellopes";
import Alert from "../components/Alert";
import filterByConditions from "../utils/filterByConditions";
import AntelopesCards from "../components/AntelopesCards";
import { Antelope } from "../utils/constants";

interface OperatorsContainerProps {
  children: any;
  value: string;
  setValue: Function;
  vertical?: boolean;
  show?: boolean;
}

const OperatorsContainer = ({
  children,
  value,
  setValue,
  vertical = false,
  show = false,
}: OperatorsContainerProps) => {
  return (
    <div className="operators">
      {show && (
        <ToggleButtonGroup
          color="primary"
          orientation={vertical ? "vertical" : "horizontal"}
          value={value}
          exclusive
          onChange={(event:any, operator:string) => setValue(event,operator)}
        >
          <ToggleButton value="OR">OR</ToggleButton>
          <ToggleButton value="AND">AND</ToggleButton>
        </ToggleButtonGroup>
      )}
      {children}
    </div>
  );
};

interface ConditionsGeneratorProps {
  className?: string;
}

export default styled(({ className }: ConditionsGeneratorProps) => {
  const { data, loading, error } = useFetchAntellopes();
  const [collections, setCollections] = useState<any>(
    JSON.parse(localStorage.getItem("collections")|| '{}')
  );
  const [collection, setCollection] = useState<string>();
  const [selectedCollection, setSelectedCollection] = useState();
  const [helperText, setHelperText] = useState<string>();
  const [conditions, setConditions] = useState<Array<any>>([{}]);
  const [operators, setOperators] = useState<Array<any>>([]);
  if (error || loading) {
    return <Alert error={error} loading={loading} />;
  }
  return (
    <div className={className}>
      <div className="collection-container">
        <TextField
          error={!!helperText}
          helperText={helperText}
          value={collection}
          onChange={({ target: { value } }) => setCollection(value)}
          placeholder="Name of collection of conditions"
          fullWidth
        />
        <Button
          onClick={() => {
            if (collection) {
              const newCollections = {
                ...collections,
                [collection]: { conditions, operators },
              };
              setCollections(newCollections);
              localStorage.setItem(
                "collections",
                JSON.stringify(newCollections)
              );
              setHelperText(undefined);
            } else {
              setHelperText(
                "You need to fill the name of the collection before saving it"
              );
            }
          }}
        >
          Save collection
        </Button>
      </div>
      <div className="collections">
        <span>Collections: </span>
        {Object.entries(collections).map(([key, value]:any) => (
          <Chip
            key={key}
            label={key}
            onClick={() => {
              if (key === selectedCollection) {
                setConditions([{}]);
                setOperators([]);
                setSelectedCollection(undefined);
              } else {
                setConditions(value.conditions);
                setOperators(value.operators);
                setSelectedCollection(key);
              }
            }}
            className={selectedCollection === key ? "active": ''}
          />
        ))}
      </div>
      <div className="conditions-container">
        IF:{" "}
        {conditions.map((condition, index) => (
          <OperatorsContainer
            key={index}
            value={operators[index - 1]}
            setValue={(_:any, operator:string) =>
              setOperators([
                ...operators.slice(0, index - 1),
                operator,
                ...operators.slice(index),
              ])
            }
            show={index !== 0}
            vertical
          >
            <Card>
              <FilterConditions
                setCondition={(condition:any) =>
                  setConditions([
                    ...conditions.slice(0, index),
                    condition,
                    ...conditions.slice(index + 1),
                  ])
                }
                {...condition}
                data={data}
              />
            </Card>
          </OperatorsContainer>
        ))}
        <Button
          onClick={() => {
            setConditions([...conditions, {}]);
            setOperators([...operators, "OR"]);
          }}
        >
          Add
        </Button>
      </div>
      <AntelopesCards
        data={filterByConditions({ data, conditions, operators })}
      />
    </div>
  );
})`
  & {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
  }
  .collection-container,
  .collections,
  .conditions-container,
  .operators {
    display: flex;
    gap: var(--gap);
    align-items: center;
  }
  .statements {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    padding: var(--gap);
  }
  .active {
    background: var(--primary);
  }
`;

interface FilterConditionsInterface {
  className?: string;
  data: Array<Antelope>;
  setCondition: Function;
  statements?: Array<any>;
  operators?: Array<string>;
}

const FilterConditions = styled(
  ({
    className,
    data,
    setCondition,
    statements: statementsInit,
    operators: operatorsInit,
  }: FilterConditionsInterface) => {
    const [operators, setOperators] = useState<Array<string>>([]);
    const [statements, setStatements] = useState([{}]);
    const fields = Object.entries(data[0])
      .map(([field, value]) => ({ field, type: typeof value }))
      .filter(({ field }) => field !== "picture");
    useEffect(() => {
      setCondition({ statements, operators });
    }, [statements, operators]);
    useEffect(() => {
      if (operatorsInit && statementsInit) {
        setOperators(operatorsInit);
        setStatements(statementsInit);
        setCondition({ statements: statementsInit, operators: operatorsInit });
      }
    }, [statementsInit, operatorsInit]);
    return (
      <div className={`${className} statements`}>
        {statements.map((statement, index) => (
          <OperatorsContainer
            key={index}
            value={operators[index - 1]}
            setValue={(_:any, operator:string) =>
              setOperators([
                ...operators.slice(0, index - 1),
                operator,
                ...operators.slice(index),
              ])
            }
            show={index !== 0}
          >
            <FilterStatement
              data={data}
              fields={fields}
              {...statement}
              setStatements={(statement:any) =>
                setStatements([
                  ...statements.slice(0, index),
                  statement,
                  ...statements.slice(index + 1),
                ])
              }
            />
          </OperatorsContainer>
        ))}
        <Button
          onClick={() => {
            setStatements([...statements, {}]);
            setOperators([...operators, "OR"]);
          }}
        >
          Add
        </Button>
      </div>
    );
  }
)`
  .operators {
    flex-direction: column;
  }
`;

const TYPE_OPERATORS = {
  string: ["contains", "in", "equals"],
  number: [">", "=", "<"],
};

interface FilterStatementProps {
  data: Array<Antelope>;
  fields: Array<any>;
  field?: string;
  operator?: string;
  value?: string;
  setStatements: Function;
}

const FilterStatement = ({
  data,
  fields,
  setStatements,
  field: fieldInit,
  operator: operatorInit,
  value: valueInit,
}: FilterStatementProps) => {
  const [selectedField, setSelectedField] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");
  const fieldType = fields?.find(({ field }) => field === selectedField)?.type;
  const [selectedValue, setSelectedValue] = useState("");
  useEffect(() => {
    if (selectedField && selectedOperator && selectedValue) {
      setStatements({
        field: selectedField,
        operator: selectedOperator,
        value: selectedValue,
      });
    } else {
      setStatements(undefined);
    }
  }, [selectedField, selectedOperator, selectedValue]);
  useEffect(() => {
    if (fieldInit && operatorInit && valueInit) {
      setSelectedField(fieldInit);
      setSelectedOperator(operatorInit);
      setSelectedValue(valueInit);
      setStatements({
        field: fieldInit,
        operator: operatorInit,
        value: valueInit,
      });
    }
  }, [fieldInit, operatorInit, valueInit]);
  return (
    <div>
      <Select
        value={selectedField}
        onChange={({ target: { value } }) => setSelectedField(value)}
      >
        {fields.map(({ field }) => (
          <MenuItem key={field} value={field}>
            {field}
          </MenuItem>
        ))}
      </Select>
      {selectedField && (
        <Select
          value={selectedOperator}
          onChange={({ target: { value } }) => setSelectedOperator(value)}
        >
          {TYPE_OPERATORS[fieldType as keyof typeof TYPE_OPERATORS].map((operator:string) => (
            <MenuItem key={operator} value={operator}>
              {operator}
            </MenuItem>
          ))}
        </Select>
      )}
      {selectedOperator &&
        (selectedOperator === "in" ? (
          <Select
            value={selectedValue ?? []}
            onChange={({ target: { value } }) => setSelectedValue(value)}
            multiple
          >
            {Array.from(
              new Set(data.map(({ [selectedField as keyof Antelope]: value }: Antelope) => value))
            ).map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <TextField
            value={selectedValue}
            onChange={({ target: { value } }) => setSelectedValue(value)}
          />
        ))}
    </div>
  );
};
