/**
 * Module Dependencies
 */

import express from 'express';

import ItemsController from 'controllers/ItemsController';


/**
 * Routes
 */
 
const router = express.Router();
const ItemsControllerInstance = new ItemsController(router);


export default router;