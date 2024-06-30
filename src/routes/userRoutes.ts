import { createAccount } from './../controllers/userController';
import express from 'express'

const router = express.Router()

router.post('/register', createAccount)

export default router
