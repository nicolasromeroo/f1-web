import { Router } from "express"
import { addFavorite, getFavorites, removeFavorite } from "../controllers/fav.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/myFavs", authMiddleware, getFavorites)
router.post("/addFav", authMiddleware, addFavorite)
router.delete("/removeFav/:type/:id", authMiddleware, removeFavorite)

export default router

