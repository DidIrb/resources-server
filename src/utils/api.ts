import fs from "fs";
import { User } from "../types/app.types";
import { Resources, tags, types } from "../types/data.types";

export const update = (arr: any[], id: number, update: any) => {
    return arr.map((item) => (item.id === id ? { ...item, ...update } : item));
}

const createDbFolderIfNotExists = () => {
    const dbFolderPath = 'db';
    if (!fs.existsSync(dbFolderPath)) {
        fs.mkdirSync(dbFolderPath);
    }
}


export const getUserFromJson = () => {
    createDbFolderIfNotExists();
    const filePath = 'db/users.json';
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]');
    }
    let users: User[] = [];
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        users = JSON.parse(fileContent);
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error("Error parsing JSON:", error);
            users = [];
        } else {
            throw error;
        }
    }
    return users;
};
export const getDataFromJson = () => {
    createDbFolderIfNotExists();
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

export function getNextId(array: User[]) {
    if (array.length === 0) {
        return 1;
    } else {
        const lastId = array[array.length - 1].id;
        return lastId + 1;
    }
}