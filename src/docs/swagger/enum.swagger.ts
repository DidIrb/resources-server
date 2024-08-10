// src/docs/swagger/enum.swagger.ts

/**
 * @swagger
 * tags:
 *   name: Enums
 *   description: Enum management endpoints
 */

/**
 * @swagger
 * /api/v1/enums:
 *   get:
 *     summary: Get all enums
 *     tags: [Enums]
 *     responses:
 *       200:
 *         description: A list of enums
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 types:
 *                   type: array
 *                   items:
 *                     type: string
 *                 topics:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Error fetching enums
 */

/**
 * @swagger
 * /api/v1/enums/tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Enums]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *                 example: newTag
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       409:
 *         description: Tag already exists
 *       500:
 *         description: Error creating tag
 */

/**
 * @swagger
 * /api/v1/enums/types:
 *   post:
 *     summary: Create a new type
 *     tags: [Enums]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *                 example: newType
 *     responses:
 *       201:
 *         description: Type created successfully
 *       409:
 *         description: Type already exists
 *       500:
 *         description: Error creating type
 */

/**
 * @swagger
 * /api/v1/enums/topics:
 *   post:
 *     summary: Create a new topic
 *     tags: [Enums]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *                 example: newTopic
 *     responses:
 *       201:
 *         description: Topic created successfully
 *       409:
 *         description: Topic already exists
 *       500:
 *         description: Error creating topic
 */
