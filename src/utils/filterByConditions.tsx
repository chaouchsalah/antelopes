import { Antelope } from "./constants";

const operatorsFn = {
  equals: (a:any, b:any) => a.toLowerCase() === b.toLowerCase(),
  contains: (a:any, b:any) => a.toLowerCase().includes(b.toLowerCase()),
  in: (a:any, b:Array<any>) => b.map((v) => v.toLowerCase()).includes(a.toLowerCase()),
  "=": (a:any, b:any) => +a === +b,
  ">": (a:any, b:any) => +a > +b,
  "<": (a:any, b:any) => +a < +b,
  AND: (a:any, b:any) => a && b,
  OR: (a:any, b:any) => a || b,
};

interface FilterByConditionsProps {
  data: Array<Antelope>;
  conditions: any;
  operators: any;
}

export default function filterByConditions({ data, conditions, operators }: FilterByConditionsProps):Array<Antelope>  {
  if (
    !conditions[0].statements ||
    !conditions[0].statements[0] ||
    !conditions[0].statements[0].field
  ) {
    return [];
  }
  function handleStatements(datum: Antelope, { field, operator, value }:any) {
    return operatorsFn[operator as keyof typeof operatorsFn](datum[field as keyof Antelope], value);
  }
  function handleConditions(
    datum: Antelope,
    { statements, operators: operatorsStatements }:any
  ) {
    if (
      operatorsStatements.length !== 0 &&
      statements[1] &&
      statements[1].field
    ) {
      return operatorsStatements.reduce((accumulator:any, logicOperator:string, index:number) => {
        if (
          accumulator &&
          statements[index + 1] &&
          statements[index + 1].operator
        ) {
          accumulator = operatorsFn[logicOperator as keyof typeof operatorsFn](
            accumulator,
            handleStatements(datum, statements[index + 1])
          );
        } else if (
          statements[index] &&
          statements[index + 1] &&
          statements[index].operator &&
          statements[index + 1].operator
        ) {
          accumulator = operatorsFn[logicOperator as keyof typeof operatorsFn](
            handleStatements(datum, statements[index]),
            handleStatements(datum, statements[index + 1])
          );
        }

        return accumulator;
      }, undefined);
    } else {
      return handleStatements(datum, statements[0]);
    }
  }
  return data.filter((datum) => {
    if (
      operators.length !== 0 &&
      conditions[1] &&
      conditions[1].statements &&
      conditions[1].statements[0] &&
      conditions[1].statements[0].field
    ) {
      return operators.reduce((accumulator:any, logicOperator:string, index:number) => {
        if (accumulator) {
          accumulator = operatorsFn[logicOperator as keyof typeof operatorsFn](
            accumulator,
            handleConditions(datum, conditions[index + 1])
          );
        } else {
          accumulator = operatorsFn[logicOperator as keyof typeof operatorsFn](
            handleConditions(datum, conditions[index]),
            handleConditions(datum, conditions[index + 1])
          );
        }
        return accumulator;
      }, undefined);
    } else {
      return handleConditions(datum, conditions[0]);
    }
  });
}
