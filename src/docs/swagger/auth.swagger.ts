// src/docs/swagger/auth.swagger.ts

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Successful sign in
 *         headers:
 *           Set-Cookie:
 *             description: httpOnly cookie with access token
 *             schema:
 *               type: string
 *               example: accessToken=abc123; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Signed in successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/auth/signout:
 *   post:
 *     summary: Sign out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful sign out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Signed out successfully
 */
