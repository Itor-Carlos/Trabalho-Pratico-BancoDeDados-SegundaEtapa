import GalpaoHasSacaRepository from "../repositories/GalpaoHasSacaRepository.js";
import GalpaoRepository from "../repositories/GalpaoRepository.js";
import SacaRepository from "../repositories/SacaRepository.js";
import validarSchema from "../utils.js";
import Joi from "joi";


const galpasHasSacaSchema = Joi.object({
    Galpao_id_galpao: Joi.number().integer().required().messages({
        "number.base": "Galpao_id_galpao deve ser um número",
        "any.required": "Galpao_id_galpao é obrigatório"
    }),
    Saca_id_saca: Joi.number().integer().required().messages({
        "any.required": "Saca_id_saca é obrigatório",
        "number.base": "Saca_id_saca deve ser um número inteiro"
    })
});

class GalpaoHasSacaController {
    async adicionaSacaGalpao(request, response) {
        const { Galpao_id_galpao, Saca_id_saca } = request.body;

        const errors = validarSchema(galpasHasSacaSchema, request.body)
        if(errors) return response.status(400).send(errors)

        const galpaoExists = await GalpaoRepository.findById(Galpao_id_galpao);
        if (!galpaoExists) {
            return response.status(404).json({ error: "O galpão informado não existe" });
        }

        const sacaExists = await SacaRepository.findById(Saca_id_saca);
        if (!sacaExists) {
            return response.status(404).json({ error: "A saca informada não existe" });
        }

        const galpasAlredyHasThisSaca = await GalpaoHasSacaRepository.findRelation(request.body.Galpao_id_galpao, request.body.Saca_id_saca)
        
        if(galpasAlredyHasThisSaca){
            return response.status(400).send({
                "Erro":"A saca em quetão já está presente nesse galpao."
            })
        }

        const galpaoHasSaca = await GalpaoHasSacaRepository.adicionaSacaGalpao(Galpao_id_galpao, Saca_id_saca);
        return response.status(201).json(galpaoHasSaca);
    }

    async pegaSacasGalpao(request, response) {
        const { id_galpao } = request.params;

        const galpaoExists = await GalpaoRepository.findById(id_galpao);


        if (!galpaoExists) {
            return response.status(404).json({ error: "O galpão informado não existe" });
        }

        const sacas = await GalpaoHasSacaRepository.pegaSacasGalpao(id_galpao);
        return response.status(200).json(sacas);
    }

    async removeSacaGalpao(request, response) {
        const { Galpao_id_galpao, Saca_id_saca } = request.body;

        const relationExists = await GalpaoHasSacaRepository.findRelation(Galpao_id_galpao, Saca_id_saca);
        if (!relationExists) {
            return response.status(404).json({ error: "A relação entre esse galpão e essa saca não existe" });
        }

        await GalpaoHasSacaRepository.removeSacaGalpao(Galpao_id_galpao, Saca_id_saca);
        return response.status(204).send();
    }

    async moveSacaGalpao(request, response) {
        const { Galpao_id_galpao_atual, Saca_id_saca, Galpao_id_novo } = request.body;

        const sacaExists = await SacaRepository.findById(Saca_id_saca);
        if (!sacaExists) {
            return response.status(404).json({ error: "A saca informada não existe" });
        }

        const galpaoAtualExists = await GalpaoRepository.findById(Galpao_id_galpao_atual);
        if (!galpaoAtualExists) {
            return response.status(404).json({ error: "O galpão atual informado não existe" });
        }

        const galpaoNovoExists = await GalpaoRepository.findById(Galpao_id_novo);
        if (!galpaoNovoExists) {
            return response.status(404).json({ error: "O novo galpão informado não existe" });
        }

        const relationExists = await GalpaoHasSacaRepository.findRelation(Galpao_id_galpao_atual, Saca_id_saca);
        if (!relationExists) {
            return response.status(404).json({ error: "A relação entre a saca e o galpão atual não existe" });
        }

        const updatedRelation = await GalpaoHasSacaRepository.moveSacaGalpao(Galpao_id_galpao_atual, Saca_id_saca, Galpao_id_novo);
        return response.status(200).json(updatedRelation);
    }
}

export default new GalpaoHasSacaController();
