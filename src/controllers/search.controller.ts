import { Request, Response } from "express";
import { getDataFromJson } from '../utils/api';

const searchResource = (req: Request, res: Response) => {
    try {
        const { query, fields, tags, type, order, page, pageSize } = req.query as {
            query?: string;
            fields?: string | string[];
            tags?: string | string[];
            type?: string | string[];
            order?: 'asc' | 'desc';
            page?: number;
            pageSize?: number;
        };
        const data = getDataFromJson();

        // Sort by updatedAt (ascending or descending) 
        // I may need to change this based transfer it to get method
        const sortedData = order === 'asc'
            ? data.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) 
            : data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        const currentPage = page || 1;
        const currentPageSize = pageSize || 2;

        const searchFields = fields ? (Array.isArray(fields) ? fields : fields.split(',')) : [];
        const typesArray = type ? (Array.isArray(type) ? type : type.split(',')) : [];
        const tagsArray = tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [];

        const results = sortedData.filter((resource) => {
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

        // Calculate start and end indices for pagination
        const startIndex = (currentPage - 1) * currentPageSize;
        const endIndex = startIndex + currentPageSize;

        // Get the relevant subset of results
        const paginatedResults = results.slice(startIndex, endIndex);

        res.status(200).json({ totalMatches: results.length, paginatedResults });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};



export default {searchResource}