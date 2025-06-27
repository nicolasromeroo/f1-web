import express from 'express'
import { importResultsFromJSON } from '../controllers/imp-resultados-reales.controller.js'
import { getRealChampionship } from '../controllers/championship.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import isAdmin from '../middlewares/isAdmin.middleware.js'

const router = express.Router()

router.get('/', authMiddleware, getRealChampionship)
router.post('/import-local/:round', authMiddleware, isAdmin, importResultsFromJSON)

export default router
