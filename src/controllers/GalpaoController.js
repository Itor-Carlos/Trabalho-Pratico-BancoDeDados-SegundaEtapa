import GalpaoRepository from "../repositories/GalpaoRepository.js";
import Galpao from "../models/Galpao.js";
import Joi from "joi";
import validarSchema from "../utils.js"


const statusEnum = {
    VAZIO: "vazio",
    CHEIO: "cheio",
    UTILIZADO: "utilizado"
};

function validaStatus(status) {
    return Object.values(statusEnum).includes(status);
}

const galpaoSchema = Joi.object({
    capacidade: Joi.number().min(1).required().messages({
        "number.base": "capacidade deve ser um número",
        "number.min": "capacidade deve ser maior ou igual a 1",
        "any.required": "capacidade é obrigatória"
    }),
    status: Joi.string().valid("vazio", "cheio", "utilizado").required().messages({
        "string.base": "status deve ser uma string",
        "any.only": "status deve ser um dos seguintes: vazio, cheio, utilizado",
        "any.required": "status é obrigatório"
    }),
});

class GalpaoController {
    async getAll(request, response){
        const responseQuery = await GalpaoRepository.getAll();
        return response.status(200).send(responseQuery);
    }

    async createGalpao(request, response) {
        const errors = validarSchema(galpaoSchema, request.body);
        if(errors) return response.status(400).send(errors)
    
        const galpaoCreated = await GalpaoRepository.createGalpao(request.body);
        return response.status(201).json(galpaoCreated);
    }

    async deleteGalpao(request, response) {
        try {
            const { id } = request.params;
            const galpao = await GalpaoRepository.deleteById(id);

            return galpao ? response.status(204).send() : response.status(404).json({ error: "O galpão informado não existe" });
        } catch (error) {
            return response.status(500).json({ error: "Erro interno ao deletar galpão" });
        }
    }
    

    async updateGalpao(request, response){
        const {id} = request.params;

        const {capacidade, status} = request.body;

        const galpaoExists = await GalpaoRepository.findById(id);

        if(!galpaoExists) return response.status(400).json({
            error: "O galpão informado não existe"
        })

        if(status){
            if (!validaStatus(status)) {
                return response.status(400).json({
                    error: "O valor de status deve ser um dos três tipos a seguir: vazio, cheio, utilizado"
                });
            }
        }
        const galpaoUpdated = await GalpaoRepository.updateGalpao(id,{capacidade, status});
        return response.status(200).send(galpaoUpdated[0])
    }
}

export default new GalpaoController();