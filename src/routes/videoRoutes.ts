import express from 'express'
import { getFavorites, getVideos, toggleFavorite } from '../controllers/videoController'
import checkAuth from '../middleware/checkAuth'

const router = express.Router()

router.get('/', checkAuth, getVideos)
router.post('/toggle-favorite', checkAuth, toggleFavorite)
router.get('/favorites', checkAuth, getFavorites)

export default router