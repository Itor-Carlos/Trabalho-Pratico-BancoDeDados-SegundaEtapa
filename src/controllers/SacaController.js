import Joi from "joi";
import SacaRepository from "../repositories/SacaRepository.js";
import validarSchema from "../utils.js";
import AreaRepository from "../repositories/AreaRepository.js";

const sacaSchema = Joi.object({
    peso: Joi.number().min(0.1).required().messages({
        "number.base": "peso deve ser um número",
        "number.min": "peso deve ser maior ou igual a 0.1",
        "any.required": "peso é obrigatório"
    }),
    Area_id_area: Joi.number().integer().required().messages({
        "any.required": "Area_id_area é obrigatório",
        "number.base": "Area_id_area deve ser um número inteiro"
    })
});

class SacaController {
    async getAll(request, response) {
        const allSacas = await SacaRepository.getAll();
        return response.status(200).send(allSacas);
    }

    async createSaca(request, response) {
        const errors = validarSchema(sacaSchema, request.body);

        if (errors) return response.status(400).send(errors);
        const areaExists = await AreaRepository.findById(request.body.Area_id_area);

        if(!areaExists) return response.status(400).send({
            "Area_id_area": "Não existe nenhum área com o id informado"
        });

        const sacaCreated = await SacaRepository.createSaca(request.body);
        return response.status(201).json(sacaCreated[0]);
    }

    async deleteSaca(request, response) {
        try {
            const { id } = request.params;
            const saca = await SacaRepository.findById(id);

            if(!saca) return response.status(404).json({ error: "A saca informada não existe" })
            
            await SacaRepository.deleteById(id);

            return response.status(204).send();
        } catch (error) {
            return response.status(500).json({ error: "Erro interno ao deletar a saca" });
        }
    }

    async updateSaca(request, response) {
        const { id } = request.params;

        const sacaExists = await SacaRepository.findById(id);

        if (!sacaExists) return response.status(404).send({
            "error": "A saca informada não existe"
        });

        const { peso, Area_id_area } = request.body;

        if(Area_id_area){
            console.log(Area_id_area)
            const areaExists = await AreaRepository.findById(Area_id_area);
            if(!areaExists) return response.status(400).send({
                "Area": "Não existe nenhum área com o id informado"
            });
        }

        const sacaUpdated = await SacaRepository.updateSaca(id, { peso, Area_id_area });
        return response.status(200).send(sacaUpdated[0]);
    }
}

export default new SacaController();
