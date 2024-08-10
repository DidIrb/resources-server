// src/docs/swagger/resources.swagger.ts

/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: Resource management endpoints
 */

/**
 * @swagger
 * /api/v1/resources:
 *   get:
 *     summary: Get paginated resources
 *     tags: [Resources]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of resources
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Resource'
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       500:
 *         description: Error fetching paginated resources
 */

/**
 * @swagger
 * /api/v1/resources:
 *   post:
 *     summary: Create a new resource
 *     tags: [Resources]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resource'
 *     responses:
 *       200:
 *         description: Resource created successfully
 *       409:
 *         description: Resource already exists
 *       500:
 *         description: Error creating resource
 */

/**
 * @swagger
 * /api/v1/resources/{uuid}:
 *   put:
 *     summary: Update a resource
 *     tags: [Resources]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resource'
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Error updating resource
 */

/**
 * @swagger
 * /api/v1/resources/{uuid}:
 *   delete:
 *     summary: Delete a resource
 *     tags: [Resources]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource UUID
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Error deleting resource
 */
