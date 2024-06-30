import { createAccount, authenticate } from './../controllers/userController';
import express from 'express'

const router = express.Router()

router.post('/login', authenticate)
router.post('/register', createAccount)

export default router
