function verificaPropriedadesFaltantes(objetoJson, classeComparativa) {
    const instanciaClasseComparativa = new classeComparativa(); 
    const propriedadesClasseComparativa = Object.keys(instanciaClasseComparativa);
  
    const propriedadesFaltantes = propriedadesClasseComparativa.filter(prop => !objetoJson.hasOwnProperty(prop));
  
    return propriedadesFaltantes;
}

export default {
    verificaPropriedadesFaltantes
}