import { tagsEnum, topicsEnum, typesEnum } from "../controllers/enum.controller";
import { Resources } from "../types/app";

export function isValidResources(obj: any): obj is Resources {
    if (!Object.values(typesEnum).includes(obj.type)) {
        throw new Error(`Invalid type value: ${obj.type}`);
    }
    if (!Object.values(topicsEnum).includes(obj.topic)) {
        throw new Error(`Invalid type value: ${obj.topic}`);
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
        throw new Error('Tags must be an array');
    }
    for (const tag of obj.tags) {
        if (!Object.values(tagsEnum).includes(tag)) {
            throw new Error(`Invalid tag value: ${tag}`);
        }
    }
    return true;
}