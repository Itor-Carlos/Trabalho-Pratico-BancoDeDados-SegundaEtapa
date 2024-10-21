import { Router } from "express";
import GalpaoController from "./controllers/GalpaoController.js";
import AreaController from "./controllers/AreaController.js";
import SacaController from "./controllers/SacaController.js";
import GalpaoHasSacaController from "./controllers/GalpaoHasSacaController.js";

const router = Router();

// CRUD - Tabela Galpao
router.get('/galpao', GalpaoController.getAll);
router.post('/galpao', GalpaoController.createGalpao)
router.delete('/galpao/:id', GalpaoController.deleteGalpao)
router.put('/galpao/:id', GalpaoController.updateGalpao)

// CRUD - Tabela Area
router.get('/area', AreaController.getAll);
router.post('/area', AreaController.createArea)
router.delete('/area/:id', AreaController.deleteArea)
router.put('/area/:id', AreaController.updateArea)

// CRUD - Tabela Saca
router.get('/saca', SacaController.getAll);
router.post('/saca', SacaController.createSaca);
router.delete('/saca/:id', SacaController.deleteSaca);
router.put('/saca/:id', SacaController.updateSaca)

// CRUD - Relacionamento GalpaoHasSaca
router.post('/armazena-saca-galpao', GalpaoHasSacaController.adicionaSacaGalpao);
router.get('/pega-saca-galpao/:id_galpao', GalpaoHasSacaController.pegaSacasGalpao);
router.delete('/remove-saca-galpao', GalpaoHasSacaController.removeSacaGalpao);
router.put('/move-saca-galpao', GalpaoHasSacaController.moveSacaGalpao)
router.post("/armazena-multiplas-sacas", GalpaoHasSacaController.adicionaMultiplasSacasGalpao);

export default router;