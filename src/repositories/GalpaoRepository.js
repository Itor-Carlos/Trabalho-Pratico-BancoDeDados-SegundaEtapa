import conexaoPostgres from "../database/index.js";

class GalpaoRepository{
    async getAll(){
        const reponseQuery = await conexaoPostgres.query('SELECT * FROM galpao');
        return reponseQuery.rows;
    }

    async createGalpao({capacidade, status}){
        const queryInsert = "INSERT INTO Galpao (capacidade, status) VALUES ($1, $2) RETURNING id_galpao, capacidade, status";
        const {rows} = await conexaoPostgres.query(queryInsert, [capacidade, status]);
        return rows;
    }

    async findById(galpaoId){
        if(!galpaoId) return null;
        const query = "SELECT * FROM Galpao WHERE id_galpao=$1";
        const rows = await conexaoPostgres.query(query, [galpaoId]);
        return (rows.rows.length > 0);
    }

    async deleteById(galpaoId){
        if(!galpaoId) return null;

        const galpaoExists = await this.findById(galpaoId);
        if(galpaoExists === false) return false;

        const query = "DELETE FROM Galpao WHERE id_galpao=$1";
        await conexaoPostgres.query(query, [galpaoId]);
        return true;
    }

    async updateGalpao(idGalpao,{capacidade, status}){
        let query = "UPDATE Galpao SET ";
        const values = []
        let contador = 1;
        if(capacidade){
            query += `capacidade = $${contador}`
            contador++;
            values.push(capacidade)
        }
        if(status){
            if(contador>1){
                query += `,`
            }
            query += `status = $${contador}`
            contador++;
            values.push(status)
            console.log(status,values)
        }

        query += ` WHERE id_galpao = $${contador} RETURNING id_galpao, capacidade, status`
        values.push(idGalpao)
        const row = await conexaoPostgres.query(query, values);
        return row.rows
    }
}

export default new GalpaoRepository();