// Controller for Resources page
import { Request, Response } from 'express';
import fs from 'fs';
import _ from "lodash";
import { getDataFromJson, isValidResources } from '../utils/api';
import Resources from '../models/resources.model';
import { paginate } from 'mongoose-paginate-v2';

// const getData = (req: Request, res: Response) => {
//     try {
//         const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
//         const pageSize = req.query.pageSize ? parseInt(req.query.pageSize.toString()) : 10; 
//         const data = getDataFromJson();

//         if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
//             res.status(400).json({ error: 'Invalid page number or page size' });
//             return;
//         }

//         const totalItems = data.length;
//         const totalPages = Math.ceil(totalItems / pageSize);

//         const startIndex = (page - 1) * pageSize;
//         const endIndex = page * pageSize;
//         const responseData = data.slice(startIndex, endIndex);

//         res.status(200).json({
//             data: responseData,
//             currentPage: page,
//             totalPages,
//             totalItems,
//         });
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// };


const getData = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const options = {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
        };

        const result = await Resources.paginate({}, options);

        res.json({
            data: result.docs, 
            totalItems: result.totalDocs,
            totalPages: result.totalPages,
            currentPage: result.page,
        });

    } catch (error: any) {
        console.error('Error fetching paginated resources:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const create = async (req: Request, res: Response) => {
    try {
        const data = _.omit(req.body, 'secret');

        if (!isValidResources(data)) {
            throw new Error('Invalid resource data');
        }

        const existingResource = await Resources.findOne({ title: data.title });
        if (existingResource) return res.status(409).json({ error: 'Resource already exists' });

        const newResource = new Resources({...data});
        await newResource.save();

        res.status(200).json({ message: 'Resource created successfully', data: newResource });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// const update2 = async (req: Request, res: Response) => {
//     try {
//         const existingData = getDataFromJson();
//         const { uuid } = req.params;
//         const newData = _.omit(req.body, 'secret');

//         if (!isValidResources(newData)) {
//             throw new Error('Invalid resource data');
//         }

//         const resourceIndex = existingData.findIndex((data) => data.id === uuid);

//         if (resourceIndex === -1) {
//             throw new Error('Resource not found');
//         }

//         const updatedData = _.assign(existingData[resourceIndex], newData, {updatedAt: new Date});
//         existingData[resourceIndex] = updatedData;

//         fs.writeFileSync('db/resources.json', JSON.stringify(existingData, null, 2));
//         res.status(200).json({ message: "Resource updated successfully" });
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// };


const update = async (req: Request, res: Response) => {
    try {
        const { uuid } = req.params;
        const data = _.omit(req.body, 'secret');

        if (!isValidResources(data)) throw new Error('Invalid resource data');
        
        const existingResource = await Resources.findById(uuid);
        console.log(uuid, existingResource)
        if (!existingResource) return res.status(404).json({ error: 'Resource not found' });

        existingResource.set({...data, updatedAt: new Date()});
        await existingResource.save();

        res.status(200).json({ message: 'Resource updated successfully', data: existingResource });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// const deleteResource2 = async (req: Request, res: Response) => {
//     try {
//         const existingData = getDataFromJson();
//         const { uuid } = req.params;

//         const updatedData = existingData.filter((data) => data.id !== uuid);

//         if (updatedData.length === existingData.length) {
//             throw new Error('Resource not found');
//         }

//         fs.writeFileSync('db/resources.json', JSON.stringify(updatedData, null, 2));
//         res.status(200).json({ message: "Resource deleted successfully" });
//     } catch (error: any) {
//         res.status(500).json({ message: error.message });
//     }
// };

//  DELETE IS PERMANENT AND RESOURCE CANNOT BE RECOVERED

const deleteResource = async (req: Request, res: Response) => {
    const { uuid } = req.params;

    try {
        const deletedResource = await Resources.deleteOne({ _id: uuid });

        if (deletedResource.deletedCount === 1) {
            res.json({ message: 'Resource deleted successfully' });
        } else {
            res.status(404).json({ error: 'Resource not found' });
        }
    } catch (error: any) {
        console.error('Error deleting resource:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { getData, create, update, deleteResource };
