import { Router } from "express";
import GalpaoController from "./controllers/GalpaoController.js";
import AreaController from "./controllers/AreaController.js";
import SacaController from "./controllers/SacaController.js";
import GalpaoHasSacaController from "./controllers/GalpaoHasSacaController.js";

const router = Router();

router.get('/galpao', GalpaoController.getAll);
router.post('/galpao', GalpaoController.createGalpao)
router.delete('/galpao/:id', GalpaoController.deleteGalpao)
router.put('/galpao/:id', GalpaoController.updateGalpao)

router.get('/area', AreaController.getAll);
router.post('/area', AreaController.createArea)
router.delete('/area/:id', AreaController.deleteArea)
router.put('/area/:id', AreaController.updateArea)

router.get('/saca', SacaController.getAll);
router.post('/saca', SacaController.createSaca);
router.delete('/saca/:id', SacaController.deleteSaca);
router.put('/saca/:id', SacaController.updateSaca)

router.post('/armazena-saca-galpao', GalpaoHasSacaController.adicionaSacaGalpao);
router.get('/pega-saca-galpao/:id_galpao', GalpaoHasSacaController.pegaSacasGalpao);
router.delete('/remove-saca-galpao', GalpaoHasSacaController.removeSacaGalpao);
router.put('/edita-saca-galpao', GalpaoHasSacaController.moveSacaGalpao)

export default router;