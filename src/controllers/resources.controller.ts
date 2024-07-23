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
        res.status(500).json({ message: error.message });
    }
};

const searchResource = (req: Request, res: Response) => {
    try {
        const { query, fields } = req.query as { query: string, fields: string | string[] };
        const searchFields = Array.isArray(fields) ? fields : [fields]; // Ensure fields is always an array
        const data = getDataFromJson();

        if (!query || !searchFields || searchFields.length === 0) {
            throw new Error('Query and fields are required');
        }

        const results = data.filter((resource) => {
            return searchFields.some((field) => {
                const value = resource[field as keyof typeof resource];
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(query.toString().toLowerCase());
                }
                return false;
            });
        });

        res.status(200).json(results);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
