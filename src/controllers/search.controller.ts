import { Request, Response } from "express";
import { getDataFromJson } from '../utils/api';
import Resources from "../models/resources.model";

const searchResource = async (req: Request, res: Response) => {
    try {
        const { query, tags, topic, type, page = 1, perPage = 10 } = req.query;
        const searchQuery: any = {};
        const itemsPerPage = Number(perPage);
        if (query) {
            searchQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ];
        }

        if (tags) {
            const tagsArray = Array.isArray(tags) ? tags : [tags];
            searchQuery.tags = { $in: tagsArray };
        }

        if (topic) {
            const topicArray = Array.isArray(topic) ? topic : [topic];
            searchQuery.topic = { $in: topicArray };
        }

        if (type) {
            const typeArray = Array.isArray(type) ? type : [type];
            searchQuery.type = { $in: typeArray };
        }


        console.log('Search Query:', searchQuery);
        const totalResults = await Resources.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalResults / itemsPerPage); // Calculate total pages

        const resources = await Resources.find(searchQuery)
            .skip((Number(page) - 1) * itemsPerPage)
            .limit(itemsPerPage);

        res.status(200).json({
            totalResults,
            currentPage: Number(page),
            totalPages, 
            resources,
        });
    } catch (error) {
        console.error('Error searching resources:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchResource2 = (req: Request, res: Response) => {
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

        const paginatedResults = results.slice(startIndex, endIndex);
        if (paginatedResults.length === 0) {
            throw Error("Search Request Returned No Results");
        } else {
            res.status(200).json({ totalMatches: results.length, paginatedResults });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default { searchResource }