import { createAccount, authenticate, forgot, validateRecoverHash, changePassword } from './../controllers/userController';
import express from 'express'

const router = express.Router()

router.post('/login', authenticate)
router.post('/register', createAccount)
router.post('/forgot', forgot)
router.get('/recovery/:userId/:hash', validateRecoverHash)
router.post('/recovery', changePassword)

export default router
