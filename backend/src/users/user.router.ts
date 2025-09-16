import { Router } from 'express';

const router = Router();

router.get('/', () => {
    console.log('User route');
});

export { router as userRouter };