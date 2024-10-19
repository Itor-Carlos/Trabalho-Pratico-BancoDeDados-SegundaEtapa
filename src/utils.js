function verificaPropriedadesFaltantes(objetoJson, classeComparativa) {
    const instanciaClasseComparativa = new classeComparativa(); 
    const propriedadesClasseComparativa = Object.keys(instanciaClasseComparativa);
  
    const propriedadesFaltantes = propriedadesClasseComparativa.filter(prop => !objetoJson.hasOwnProperty(prop));
    
    const objectRequest = {}

    propriedadesFaltantes.forEach(item => objectRequest[item] = item.concat(' is required'));
    
    return objectRequest;
}

export default verificaPropriedadesFaltantes;
