import { Router, type IRouter } from "express";
import healthRouter from "./health";
import typingTestsRouter from "./typing-tests";
import statsRouter from "./stats";
import leaderboardRouter from "./leaderboard";
import aiRouter from "./ai";
import authRouter from "./auth";
import predictionsRouter from "./predictions";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(typingTestsRouter);
router.use(statsRouter);
router.use(leaderboardRouter);
router.use(aiRouter);
router.use(predictionsRouter);

export default router;
