import { Request, Response } from "express";
import Resources from "../models/resources.model";

const searchResource = async (req: Request, res: Response) => {
    try {
        console.log("Search Query")
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

export default { searchResource }