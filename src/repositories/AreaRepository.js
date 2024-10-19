import conexaoPostgres from "../database/index.js";

class AreaRepository{
    async getAll(){
        const allArea = await conexaoPostgres.query('SELECT * FROM area');
        return allArea.rows;
    }

    async createArea({tamanho_hectar, localizacao, colheita_disponivel}){
        const queryInsert = "INSERT INTO Area (tamanho_hectar, localizacao, colheita_disponivel) VALUES ($1, $2, $3) RETURNING id_area, tamanho_hectar, localizacao, colheita_disponivel";
        const {rows} = await conexaoPostgres.query(queryInsert, [tamanho_hectar, localizacao, colheita_disponivel]);
        return rows;
    }
    
    async findById(areaId){
        if(!areaId) return null;
        const query = "SELECT * FROM Area WHERE id_area=$1";
        const rows = await conexaoPostgres.query(query, [areaId]);
        return (rows.rows.length > 0);
    }

    async deleteById(areaId){
        if(!areaId) return null;

        const areaExists = await this.findById(areaId);
        if(areaExists === false) return false;

        const query = "DELETE FROM Area WHERE id_area=$1";
        await conexaoPostgres.query(query, [areaId]);
        return true;
    }

    async updateGalpao(idArea, { tamanho_hectar, localizacao, colheita_disponivel }) {
        let updates = [];
        let values = [];
        let contador = 1;
    
        if (tamanho_hectar) {
            updates.push(`tamanho_hectar = $${contador++}`);
            values.push(tamanho_hectar);
        }
    
        if (localizacao) {
            updates.push(`localizacao = $${contador++}`);
            values.push(localizacao);
        }

        if (colheita_disponivel) {
            updates.push(`colheita_disponivel = $${contador++}`);
            values.push(colheita_disponivel);
        }
    
        values.push(idArea);
    
        const query = `
            UPDATE Area 
            SET ${updates.join(', ')} 
            WHERE id_area = $${contador}
            RETURNING id_area, tamanho_hectar, localizacao, colheita_disponivel
        `;

        const row = await conexaoPostgres.query(query, values);
        return row.rows;
    }
}

export default new AreaRepository();