import { Router } from "express";
import GalpaoController from "./controllers/GalpaoController.js";
import AreaController from "./controllers/AreaController.js";

const router = Router();

router.get('/galpao', GalpaoController.getAll);
router.post('/galpao', GalpaoController.createGalpao)
router.delete('/galpao/:id', GalpaoController.deleteGalpao)
router.put('/galpao/:id', GalpaoController.updateGalpao)

router.get('/area', AreaController.getAll);
router.post('/area', AreaController.createArea)
router.delete('/area/:id', AreaController.deleteArea)
router.put('/area/:id', AreaController.updateArea)

export default router;