import * as fs from 'fs';
import * as path from 'path';
import { Request, Response } from 'express';

let tagsEnum: { [key: string]: string } = {};
let typesEnum: { [key: string]: string } = {};


const createDbFolderIfNotExists = () => {
    const dbFolderPath = 'db';
    if (!fs.existsSync(dbFolderPath)) {
        fs.mkdirSync(dbFolderPath);
    }
}

export const enumsFilePath = path.resolve('db/enums.json');


export const readEnumsFromFile = () => {
    createDbFolderIfNotExists();
    const filePath = enumsFilePath;
    console.log(filePath);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '{"tags": [], "types": []}');
    }
    let enums: { tags: string[], types: string[] } = { tags: [], types: [] };
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        enums = JSON.parse(fileContent);
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error("Error parsing JSON:", error);
            enums = { tags: [], types: [] };
        } else {
            throw error;
        }
    }
    return enums;
};

const createEnum = (list: string[]): { [key: string]: string } => {
    const enumObject: { [key: string]: string } = {};
    list.forEach(item => {
        enumObject[item.charAt(0).toUpperCase() + item.slice(1)] = item;
    });
    return enumObject;
};


const initializeEnums = () => {
    const { tags, types } = readEnumsFromFile();
    tagsEnum = createEnum(tags);
    typesEnum = createEnum(types);
};

const updateEnums = (type: 'tags' | 'types', data: string) => {
    const enums = readEnumsFromFile();
    if (data && !enums[type].includes(data)) {
        enums[type].push(data);
        fs.writeFileSync(enumsFilePath, JSON.stringify(enums, null, 2), 'utf8');
        if (type === 'tags') {
            tagsEnum = createEnum(enums[type]);
        } else {
            typesEnum = createEnum(enums[type]);
        }
        return true;
    }
    return false;
};

const manageEnums = (type: 'tags' | 'types') => (req: Request, res: Response) => {
    const { data } = req.body;

    if (data) {
        if (!Object.values(type === 'tags' ? tagsEnum : typesEnum).includes(data)) {
            updateEnums(type, data);
            return res.status(200).json({ message: `${type.slice(0, -1)} created successfully` });
        } else {
            return res.status(400).json({ error: `${type.slice(0, -1)} already exists` });
        }
    } else {
        return res.status(400).json({ error: 'Invalid input' });
    }
};

const getEnums = (req: Request, res: Response) => {
    try {
        const enums = readEnumsFromFile();
        return res.status(200).json(enums);
    } catch (error: any) {
        console.error("Error getting enums:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

initializeEnums();

const ManageTags = manageEnums('tags');
const ManageTypes = manageEnums('types');

export { tagsEnum, typesEnum };
export default { ManageTags, ManageTypes, getEnums };
