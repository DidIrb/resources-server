// Controller for Resources page
import { Request, Response } from 'express';
import fs from 'fs';
import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { getDataFromJson, isValidResources } from '../utils/api';

const getData = (req: Request, res: Response) => {
    try {
        const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize.toString()) : 10; 
        const data = getDataFromJson();

        if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
            res.status(400).json({ error: 'Invalid page number or page size' });
            return;
        }

        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const responseData = data.slice(startIndex, endIndex);

        res.status(200).json({
            data: responseData,
            currentPage: page,
            totalPages,
            totalItems,
        });
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
        
        const titleExists = existingData.some((resource) => resource.title === newData.title);
        if (titleExists) {
            throw new Error('Resource with the same title already exists');
        }

        const uniqueId = uuidv4();
        const data = _.assign({ id: uniqueId }, _.clone(newData), { createdAt: new Date(), updatedAt: new Date() });

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

export default { getData, create, update, deleteResource };
