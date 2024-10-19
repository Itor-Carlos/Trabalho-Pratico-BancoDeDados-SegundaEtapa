import Joi from "joi";
import AreaRepository from "../repositories/AreaRepository.js";
import validarSchema from "../utils.js";

const areaSchema = Joi.object({
    tamanho_hectar: Joi.number().min(1).required().messages({
        "number.base": "tamanho_hectar deve ser um número",
        "number.min": "tamanho_hectar deve ser maior ou igual a 1",
        "any.required": "tamanho_hectar é obrigatório"
    }),
    colheita_disponivel: Joi.bool().required().messages({
        "any.required": "colheita_disponivel é obrigatório",
        "boolean.base": "colheita_disponivel deve ser true ou false"
    }),
    localizacao: Joi.string().min(4).required().messages({
        "any.required": "localizacao é obrigatório",
        "string.min": "localizacao deve ter 4 ou mais caracteres",
        "string.base": "localizacao deve ser string"
    })
})

class AreaController{
    async getAll(request, response){
        const allArea = await AreaRepository.getAll();
        return response.status(200).send(allArea);
    }

    async createArea(request, response){
        const errors = validarSchema(areaSchema, request.body);
        
        if(errors) return response.status(400).send(errors)
    
        const areaCreated = await AreaRepository.createArea(request.body);
        return response.status(201).json(areaCreated);
    }

    async deleteArea(request, response) {
        try {
            const { id } = request.params;
            const area = await AreaRepository.deleteById(id);

            return area ? response.status(204).send() : response.status(404).json({ error: "A área informada não existe" });
        } catch (error) {
            return response.status(500).json({ error: "Erro interno ao deletar área" });
        }
    }

    async updateArea(request, response){
        const {id} = request.params;

        const areaExists = await AreaRepository.findById(id);

        if(!areaExists) return response.status(404).send({
            "error": "A área informada não existe"
        })

        const {tamanho_hectar, localizacao, colheita_disponivel} = request.body;

        if(colheita_disponivel){
            console.log(typeof colheita_disponivel)
            if(colheita_disponivel !== "true" && colheita_disponivel !== "false") return response.status(400).json({
                "colheita_disponivel": "O valor de colheira_disponivel deve ser true ou false"
            })

        }
        const galpaoUpdated = await AreaRepository.updateGalpao(id,{tamanho_hectar, localizacao, colheita_disponivel});
        return response.status(200).send(galpaoUpdated[0])
    }
}


export default new AreaController();