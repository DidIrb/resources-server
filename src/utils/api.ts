import fs from "fs";
import { User } from "../types/app.types";
import { Resources, tags, types } from "../types/data.types";

export const update = (arr: any[], id: number, update: any ) => {
   return arr.map((item) => (item.id === id ? { ...item, ...update } : item));
}

export const getUserFromJson = () => {
    const filePath = 'db/users.json';
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]');
    }
    const users: User[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return users;
};

export const getDataFromJson = () => {
    const filePath = 'db/resources.json';
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]');
    }
    const data: Resources[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data;
};
export function isValidResources(obj: any): obj is Resources {
    if (!Object.values(types).includes(obj.type)) {
        throw new Error(`Invalid type value: ${obj.type}`);
    }
    if (typeof obj.title !== 'string' || obj.title.trim() === '') {
        throw new Error('Title is required');
    }
    if (typeof obj.description !== 'string' || obj.description.trim() === '') {
        throw new Error('Description is required');
    }
    if (typeof obj.link !== 'string' || obj.link.trim() === '') {
        throw new Error('Link is required');
    }
    if (!Array.isArray(obj.tags)) {
        return false;
    }
    for (const tag of obj.tags) {
        if (!Object.values(tags).includes(tag)) {
            throw new Error(`Invalid tag value: ${tag}`);
        }
    }
    return true;
}
