// Controller for Resources page
import { Request, Response } from 'express';
import _ from "lodash";
import Resources from '../models/resources.model';
import { isValidResources } from '../utils/api';

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

        if (!isValidResources(data))  throw new Error('Invalid resource data');

        const existingResource = await Resources.findOne({ title: data.title });
        if (existingResource) return res.status(409).json({ error: 'Resource already exists' });

        const newResource = new Resources({...data});
        await newResource.save();

        res.status(200).json({ message: 'Resource created successfully', data: newResource });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

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
