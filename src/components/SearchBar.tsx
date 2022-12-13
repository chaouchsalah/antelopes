import { Autocomplete, TextField } from "@mui/material";
import {distance as levenshtein} from "fastest-levenshtein";
import { useState } from "react";
import { useDataStore } from "../stores/data.store";
import { Antelope } from "../utils/constants";
import groupBy from "../utils/groupBy";
import BarChart from "./BarChart";

interface QuestionProps {
  data: Array<Antelope>;
  question: string;
  field?: string;
  fieldOperator?: string;
  fieldMeta?: string;
}

const QUESTION_TYPES = {
  "How many": {
    fields: ["horns"],
    fieldsOperator: ["weight", "height"],
    fieldsMeta: ["horns", "continent"],
    fn: ({
      data,
      field,
      fieldOperator,
      fieldMeta,
      question,
    }: QuestionProps) => {
      if (fieldMeta) {
        const type = "bar";
        return {
          label: `${question} ${fieldMeta} ?`,
          type,
          answer: groupBy(data, fieldMeta),
          field: fieldMeta,
        };
      } else if (fieldOperator) {
        const type = "text";
        return [">=", "<="].flatMap((operator) => {
          if (operator === ">=") {
            return [...Array(7).keys()].map((i) => ({
              type,
              label: `${question} ${fieldOperator} ${operator} ${i * 10} ?`,
              answer: `There are ${data.reduce(
                (
                  accumulator: number,
                  { [fieldOperator as keyof Antelope]: value }
                ) => {
                  if (value >= i * 10) {
                    accumulator++;
                  }
                  return accumulator;
                },
                0
              )} antelops that match the criteria`,
            }));
          } else if (operator === "<=") {
            return [...Array(7).keys()].map((i) => ({
              type,
              label: `${question} ${fieldOperator} ${operator} ${i * 10} ?`,
              answer: `There are ${data.reduce(
                (accumulator, { [fieldOperator as keyof Antelope]: value }) => {
                  if (value <= i * 10) {
                    accumulator += 1;
                  }
                  return accumulator;
                },
                0
              )} antelops that match the criteria`,
            }));
          }
        });
      } else if (field) {
        const type = "text";
        const values = Array.from(
          new Set(data.map(({ [field as keyof Antelope]: value }) => value))
        );
        const continents = Array.from(
          new Set(data.map(({ continent }) => continent))
        );
        return values.flatMap((value) => {
          const label = `${question} ${value}`;
          return [
            {
              label: `${label} ?`,
              type,
              answer: `There are ${data.reduce(
                (accumulator, { [field as keyof Antelope]: datumValue }) =>
                  value === datumValue ? accumulator++ : accumulator,
                0
              )} antelopes with ${value}`,
            },
            ...continents.map((continent) => ({
              label: `${label} in ${continent} ?`,
              type,
              answer: `There are ${data.reduce(
                (
                  accumulator,
                  {
                    [field as keyof Antelope]: datumValue,
                    continent: datumContinent,
                  }
                ) =>
                  value === datumValue && continent === datumContinent
                    ? accumulator++
                    : accumulator,
                0
              )} antelopes with ${value} in ${continent}`,
            })),
          ];
        });
      }
      return [];
    },
  },
  What: {
    fieldsMeta: ["name", "horns"],
    fn: ({ data, fieldMeta, question }: QuestionProps) => {
      const continents = Array.from(
        new Set(data.map(({ continent }) => continent))
      );
      const type = "list";
      return continents.map((continent) => ({
        type,
        label: `${question} ${
          fieldMeta === "name" ? "Antelopes" : fieldMeta
        } are in ${continent}`,
        answer: Array.from(
          new Set(
            data
              .filter((datum) => continent === datum.continent)
              .map(({ [fieldMeta as keyof Antelope]: field }) => field)
          )
        ),
      }));
    },
  },
  "Where is": {
    fields: ["name"],
    fn: ({ data, field, question }: QuestionProps) => {
      const values = Array.from(
        new Set(data.map(({ [field as keyof Antelope]: value }) => value))
      );
      return values.map((value) => ({
        label: `${question} ${value} ?`,
        type: "text",
        answer: `${value} is in ${
          data.find(
            ({ [field as keyof Antelope]: datumValue }) => value === datumValue
          )?.continent
        }`,
      }));
    },
  },
};

interface AnswerProps {
  label: string;
  answer: any;
  type: string;
  field?: string;
  distance?: string;
}

function getDistance(question: string, value: string): number {
  const questionWords = question.split(" ");
  const words = value.split(" ");
  let distance = 0;
  for (const word of words) {
    distance += Math.min(
      ...questionWords.map((questionWord) =>
        levenshtein(questionWord.toLowerCase(), word.toLowerCase())
      )
    );
  }
  return distance;
}

export default () => {
  const { data } = useDataStore();
  const [selectedQuestion, setSelectedQuestion] = useState<AnswerProps>();
  const questions = Object.entries(QUESTION_TYPES).reduce(
    (
      accumulator: Array<AnswerProps>,
      [question, { fn, fieldsMeta, fieldsOperator, fields }]: any
    ) => {
      let values = [];
      if (fieldsMeta) {
        values = fieldsMeta.flatMap((fieldMeta: string) =>
          fn({ fieldMeta, question, data })
        );
      }
      if (fieldsOperator) {
        values = [
          ...values,
          ...fieldsOperator.flatMap((fieldOperator: string) =>
            fn({ fieldOperator, question, data })
          ),
        ];
      }
      if (fields) {
        values = [
          ...values,
          ...fields.flatMap((field: string) => fn({ field, question, data })),
        ];
      }
      return [...accumulator, ...values];
    },
    []
  );

  const filterOptions = (
    options: any,
    { inputValue }: { inputValue: string }
  ) => {
    return options
      .map(({ label, ...option }: AnswerProps) => ({
        ...option,
        label,
        distance: getDistance(label, inputValue),
      }))
      .filter(({ distance }: AnswerProps) => Number(distance) <= 2);
  };
  const handleAnswer = ({ type, answer, field }: AnswerProps) => {
    switch (type) {
      case "text":
        return <div>{answer}</div>;
      case "list":
        return (
          <ul>
            {answer.map((value: string) => (
              <li>{value}</li>
            ))}
          </ul>
        );
      case "bar":
        return (
          <BarChart
            width={300}
            height={300}
            data={answer}
            getX={({ [field as string]: label }: any) => label}
            getY={({ value }: { value: number }) => value}
          />
        );
    }
  };
  return (
    <div>
      <Autocomplete
        disablePortal
        options={questions}
        value={selectedQuestion}
        filterOptions={filterOptions}
        onChange={(event: any, newValue: any) => {
          setSelectedQuestion(newValue);
        }}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} fullWidth label="Question" />
        )}
      />
      {selectedQuestion && handleAnswer(selectedQuestion)}
    </div>
  );
};
