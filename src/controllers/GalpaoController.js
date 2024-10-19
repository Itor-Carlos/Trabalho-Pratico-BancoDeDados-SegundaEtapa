import GalpaoRepository from "../repositories/GalpaoRepository.js";
import verificaPropriedadesFaltantes from "../utils.js"
import Galpao from "../models/Galpao.js";

const statusEnum = {
    VAZIO: "vazio",
    CHEIO: "cheio",
    UTILIZADO: "utilizado"
};

class GalpaoController {
    async getAll(request, response){
        const responseQuery = await GalpaoRepository.getAll();
        return response.status(200).send(responseQuery);
    }

    async createGalpao(request, response){
        const bodyRequest = request.body;
        const missingProperties = verificaPropriedadesFaltantes(bodyRequest, Galpao);
        if(Object.keys(missingProperties).length === 0){
            if(!Object.values(statusEnum).includes(bodyRequest.status)){
                return response.status(400).send({
                    "error": "O valor de status deve ser um dos três tipos a seguir: vazio, cheio, utilizado"
                })
            }

            const galpaoCreated = await GalpaoRepository.createGalpao(bodyRequest);
            if(galpaoCreated.length > 0) response.status(201).send(galpaoCreated[0])
        }
        return response.status(400).send(missingProperties);
    }

    async deleteGalpao(request, response){
        const {id} = request.params;
        // if(!id) return response.status(400).send({
        //     "error": "O id do galpão é necessário"
        // })
        const galpao = await GalpaoRepository.deleteById(id);

        return galpao ? response.status(200).send({
            "message": "Galpão deletado com sucesso"
        }) : response.status(404).send({
            "error": "O galpão informado não existe"
        })
    }

    async updateGalpao(request, response){
        const {id} = request.params;

        const {capacidade, status} = request.body;

        if(status){
            if(!Object.values(statusEnum).includes(status)){
                return response.status(400).send({
                    "error": "O valor de status deve ser um dos três tipos a seguir: vazio, cheio, utilizado"
                })
            }
        }
        const galpaoUpdated = await GalpaoRepository.updateGalpao(id,{capacidade, status});
        return response.status(200).send(galpaoUpdated[0])
    }
}

export default new GalpaoController();