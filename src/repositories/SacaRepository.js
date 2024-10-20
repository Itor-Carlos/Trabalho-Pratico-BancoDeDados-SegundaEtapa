import conexaoPostgres from "../database/index.js";

class SacaRepository {
    async getAll() {
        const allSacas = await conexaoPostgres.query('SELECT * FROM Saca');
        return allSacas.rows;
    }

    async createSaca({ peso, Area_id_area }) {
        const queryInsert = `
            INSERT INTO Saca (peso, Area_id_area) 
            VALUES ($1, $2) 
            RETURNING id_saca, peso, Area_id_area
        `;
        const { rows } = await conexaoPostgres.query(queryInsert, [peso, Area_id_area]);
        return rows;
    }

    async findById(sacaId) {
        if (!sacaId) return null;
        const query = "SELECT * FROM Saca WHERE id_saca = $1";
        const rows = await conexaoPostgres.query(query, [sacaId]);
        return (rows.rows.length > 0) ? rows.rows[0] : null;
    }

    async deleteById(sacaId) {
        if (!sacaId) return null;

        const sacaExists = await this.findById(sacaId);
        if (!sacaExists) return false;

        const query = "DELETE FROM Saca WHERE id_saca = $1";
        await conexaoPostgres.query(query, [sacaId]);
        return true;
    }

    async updateSaca(idSaca, { peso, Area_id_area }) {
        let updates = [];
        let values = [];
        let contador = 1;

        if (peso) {
            updates.push(`peso = $${contador++}`);
            values.push(peso);
        }

        if (Area_id_area) {
            updates.push(`Area_id_area = $${contador++}`);
            values.push(Area_id_area);
        }

        values.push(idSaca);

        const query = `
            UPDATE Saca
            SET ${updates.join(', ')} 
            WHERE id_saca = $${contador}
            RETURNING id_saca, peso, Area_id_area
        `;

        const row = await conexaoPostgres.query(query, values);
        return row.rows;
    }
}

export default new SacaRepository();
