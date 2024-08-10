
/**
 * @swagger
 * tags:
 *   name: Sitemap
 *   description: Sitemap generation endpoints
 */

/**
 * @swagger
 * api/v1/sitemap:
 *   get:
 *     summary: Generate XML sitemap
 *     tags: [Sitemap]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: XML sitemap generated successfully
 *         content:
 *           application/xml:
 *             schema:
 *               type: string
 *       401:
 *         description: Access denied
 */