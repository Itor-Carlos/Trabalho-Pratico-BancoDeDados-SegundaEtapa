import Joi from "joi";

// function verificaPropriedadesFaltantes(objetoJson, classeComparativa) {
//     const instanciaClasseComparativa = new classeComparativa(); 
//     const propriedadesClasseComparativa = Object.keys(instanciaClasseComparativa);
  
//     const propriedadesFaltantes = propriedadesClasseComparativa.filter(prop => !objetoJson.hasOwnProperty(prop));
    
//     const objectRequest = {}

//     propriedadesFaltantes.forEach(item => objectRequest[item] = item.concat(' is required'));
    
//     return objectRequest;
// }

function validarSchema(objectSchema, object){
    const { error, value } = objectSchema.validate(object, { abortEarly: false });
    
    if (error) {
        const errorMessages = error.details.reduce((errorAcc, detailError) => {
            errorAcc[detailError.context.key] = detailError.message;
            return errorAcc;
        }, {});

        return errorMessages;
    }
}

export default validarSchema;
