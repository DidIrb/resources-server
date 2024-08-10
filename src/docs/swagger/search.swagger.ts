/**
 * @swagger
 * tags:
 *   name: Search Methods
 *   description: API for search operations
 */

/**
 * @swagger
 * /api/v1/search:
 *   get:
 *     summary: Search resources
 *     tags: [Search Methods]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         required: false
 *         description: Tags to filter the search use [comma](,) to search multiple
 *       - in: query
 *         name: topic
 *         schema:
 *           type: string
 *         required: false
 *         description: Topic to filter the search [comma](,) to search multiple
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Type of resource
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of resources
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resource'
 */
