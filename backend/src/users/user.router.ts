import { Router, Request, Response } from 'express';
import { logger } from '../logger/logger.service';

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.log.info('Fetching users');
	res.json({ users: [], requestId: (req as any).id });
});

export { router as userRouter };
