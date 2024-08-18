import { database } from "./database";

export function getDB(){
    return database;
}

export const getCards = ()=>{
    return database.get("Cards")
}