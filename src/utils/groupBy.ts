import { Antelope } from "./constants";

export default function groupBy(data: Array<Antelope>,field: string, matchKeys?: any) {
    return Object.values(data.reduce((accumulator:any,datum:Antelope) => {
        let key;
        if(matchKeys) {
            key = matchKeys(datum[field as keyof Antelope]);
        } else {
         key = datum[field as keyof Antelope];
        }
        if(key in accumulator) {
            accumulator[key].value++;
        } else {
            accumulator[key] = {[field]:key,value:1}
        }
        return accumulator;
    }, []));
}
