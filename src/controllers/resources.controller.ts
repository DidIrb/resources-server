// Controller for Resources page
import { Request, Response } from 'express';
import fs from 'fs';
import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { getDataFromJson, isValidResources } from '../utils/api';

const getData = (req: Request, res: Response) => {
    try {
        const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
        const pageSize = 10;
        const data = getDataFromJson();

        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const responseData = data.slice(startIndex, endIndex);

        res.status(200).json(responseData);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const searchResource = (req: Request, res: Response) => {
    try {
        const { query, fields, tags, type } = req.query as { query?: string, fields?: string | string[], tags?: string | string[], type?: string | string[] };
        const searchFields = fields ? (Array.isArray(fields) ? fields : fields.split(',')) : [];
        const typesArray = type ? (Array.isArray(type) ? type : type.split(',')) : [];
        const tagsArray = tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [];
        const data = getDataFromJson();

        const results = data.filter((resource) => {
            let matches = true;

            if (tagsArray.length > 0) {
                matches = matches && tagsArray.some(tag => resource.tags.includes(tag));
            }

            if (typesArray.length > 0) {
                matches = matches && typesArray.includes(resource.type);
            }

            if (query && searchFields.length > 0) {
                matches = matches && searchFields.some((field) => {
                    const value = resource[field as keyof typeof resource];
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(query.toLowerCase());
                    }
                    return false;
                });
            }
            return matches;
        });

        const totalMatches = results.length;
        const limitedResults = results.slice(0, 2); // Limit the results to 2

        res.status(200).json({ totalMatches, limitedResults });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


const create = async (req: Request, res: Response) => {
    try {
        const existingData = getDataFromJson();
        const newData = _.omit(req.body, 'secret');

        if (!isValidResources(newData)) {
            throw new Error('Invalid resource data');
        }

        const uniqueId = uuidv4();
        const data = _.assign({ id: uniqueId}, _.clone(newData), {createdAt: new Date, updatedAt: new Date });

        existingData.push(data);
        fs.writeFileSync('db/resources.json', JSON.stringify(existingData, null, 2));
        res.status(200).json({ message: "Resource created successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const existingData = getDataFromJson();
        const { uuid } = req.params;
        const newData = _.omit(req.body, 'secret');

        if (!isValidResources(newData)) {
            throw new Error('Invalid resource data');
        }

        const resourceIndex = existingData.findIndex((data) => data.id === uuid);

        if (resourceIndex === -1) {
            throw new Error('Resource not found');
        }

        const updatedData = _.assign(existingData[resourceIndex], newData, {updatedAt: new Date});
        existingData[resourceIndex] = updatedData;

        fs.writeFileSync('db/resources.json', JSON.stringify(existingData, null, 2));
        res.status(200).json({ message: "Resource updated successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};



const deleteResource = async (req: Request, res: Response) => {
    try {
        const existingData = getDataFromJson();
        const { uuid } = req.params;

        const updatedData = existingData.filter((data) => data.id !== uuid);

        if (updatedData.length === existingData.length) {
            throw new Error('Resource not found');
        }

        fs.writeFileSync('db/resources.json', JSON.stringify(updatedData, null, 2));
        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export default { getData, create, update, deleteResource, searchResource };
