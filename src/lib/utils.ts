import { match } from "assert";
import axios from 'axios'

export function shortenString(str:string, frontLen = 4, endLen = 4, ellipsis = '...') {
    if (str.length <= frontLen + endLen) {
        return str;
    }

    return str.substr(0, frontLen) + ellipsis + str.substr(-endLen);
}
export function timestampToTime(timestamp:any) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
}

function getRandomInt(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const NEXT_PUBLIC_USDT_VALUE = getRandomInt(2000,4000)
