import { Request, response, Response } from 'express';
import Tag from '../models/tags.model';
import Topic from '../models/topics.model';
import Type from '../models/types.model';

let tagsEnum: { [key: string]: string } = {};
let typesEnum: { [key: string]: string } = {};
let topicsEnum: { [key: string]: string } = {};

const createEnum = (list: string[]): { [key: string]: string } => {
    console.log("Updating Enums")
    const enumObject: { [key: string]: string } = {};
    list.forEach(item => {
        enumObject[item.charAt(0).toUpperCase() + item.slice(1)] = item;
    });
    return enumObject;
};


const getData = async () => {
    try {
        const tags = await Tag.find({}, 'value');
        const types = await Type.find({}, 'value');
        const topics = await Topic.find({}, 'value');

        const responseObj = {
            tags: tags.map(tag => tag.value),
            types: types.map(type => type.value),
            topics: topics.map(topic => topic.value),
        };
        return responseObj;
    } catch (error) {
        throw error;
    }
}

const getEnums = async (req: Request, res: Response) => {
    try {
        const response = await getData();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tags, types, and topics' });
    }
};

// CREATE TOPIC
const createTags = async (req: Request, res: Response) => {
    try {
        const { value } = req.body;
        const existingTag = await Tag.findOne({ value });
        if (existingTag) {
            return res.status(409).json({ error: 'Tag already exists' });
        }

        const newTag = await Tag.create({ value });
        // update enums
        let data = await Tag.find({}, 'value');
        const array = data.map(item => item.value);
        tagsEnum = createEnum(array); 

        res.status(201).json({message: "Topic Created successfully", data: newTag});
    } catch (error) {
        res.status(500).json({ error: 'Error creating tag' });
    }
};

// CREATE TAGS
const createTypes = async (req: Request, res: Response) => {
    try {
        const { value } = req.body;

        const existingType = await Type.findOne({ value });
        if (existingType) return res.status(409).json({ error: 'Type already exists' });
        const newType = await Type.create({ value });
        let data = await Tag.find({}, 'value');
        const array = data.map(item => item.value);
        typesEnum = createEnum(array); 

        res.status(201).json({message: "Topic Created successfully", data: newType});
    } catch (error) {
        res.status(500).json({ error: 'Error creating type' });
    }
};


// CREATE TYPES
const createTopics = async (req: Request, res: Response) => {
    try {
        const { value } = req.body;

        const existingTopic = await Topic.findOne({ value });
        if (existingTopic)  return res.status(409).json({ error: 'Topic already exists' });

        const newTopic = await Topic.create({ value });
        let data = await Tag.find({}, 'value');
        const array = data.map(item => item.value);
        topicsEnum = createEnum(array); 

        res.status(201).json({message: "Topic Created successfully", data: newTopic});
    } catch (error) {
        res.status(500).json({ error: 'Error creating topic' });
    }
};

const initializeEnums = async () => {
    try {
        const { tags, types, topics } = await getData();
        tagsEnum = createEnum(tags);
        typesEnum = createEnum(types);
        topicsEnum = createEnum(topics);
    } catch (error) {
        console.error('Error initializing enums:', error);
    }
};

// initializeEnums();

export { tagsEnum, typesEnum, topicsEnum};
export default { createTags, createTypes, createTopics, getEnums };