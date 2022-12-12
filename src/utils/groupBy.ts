import { Antelope } from "./constants";

export default function groupBy(
  data: Array<Antelope>,
  field: string,
  matchKeys?: any
) {
  return Object.values(
    data.reduce((accumulator: any, datum: Antelope) => {
      let key;
      if (matchKeys) {
        key = matchKeys(datum[field as keyof Antelope]);
      } else {
        key = datum[field as keyof Antelope];
      }
      if (key in accumulator) {
        accumulator[key].value++;
      } else {
        accumulator[key] = { [field]: key, value: 1 };
      }
      return accumulator;
    }, [])
  );
}

export function groupByContinent(data: Array<Antelope>, field: string) {
  const values = Object.values(
    data.reduce((accumulator: any, datum: Antelope) => {
      const label = datum[field as keyof Antelope];
      const { continent } = datum;
      const key = `${label} ${continent}`;
      if (key in accumulator) {
        accumulator[key].value++;
      } else {
        accumulator[key] = { [field]: label, continent, value: 1 };
      }
      return accumulator;
    }, [])
  );
  const labels = Array.from(new Set(values.map(({ [field as keyof Antelope]: label }: any) => label)));
  const continents = Array.from(
    new Set(values.map(({ continent }:any) => continent))
  );
  return labels.map((label) => {
    return values
      .filter(
        ({ [field]: labelValue, continent }: any) =>
          labelValue === label && continents.includes(continent)
      )
      .reduce((accumulator: any,{[field]: labelValue, continent,value}: any) => {
        return {
            ...accumulator,
            [field]: labelValue,
            [continent]: value,
        }
      },{});
  });
}
