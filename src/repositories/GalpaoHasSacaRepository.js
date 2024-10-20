import conexaoPostgres from "../database/index.js";

class GalpaoHasSacaRepository {
    async adicionaSacaGalpao(Galpao_id_galpao, Saca_id_saca) {
        const result = await conexaoPostgres.query(
            "INSERT INTO Galpao_has_Saca (Galpao_id_galpao, Saca_id_saca) VALUES ($1, $2) RETURNING *",
            [Galpao_id_galpao, Saca_id_saca]
        );
        return result.rows[0];
    }

    async pegaSacasGalpao(Galpao_id_galpao) {
        const result = await conexaoPostgres.query(
            "SELECT * FROM Saca INNER JOIN Galpao_has_Saca ON Saca.id_saca = Galpao_has_Saca.Saca_id_saca WHERE Galpao_has_Saca.Galpao_id_galpao = $1",
            [Galpao_id_galpao]
        );
        return result.rows;
    }

    async findRelation(Galpao_id_galpao, Saca_id_saca) {
        const result = await conexaoPostgres.query(
            "SELECT * FROM Galpao_has_Saca WHERE Galpao_id_galpao = $1 AND Saca_id_saca = $2",
            [Galpao_id_galpao, Saca_id_saca]
        );
        return result.rows.length > 0;
    }

    async removeSacaGalpao(Galpao_id_galpao, Saca_id_saca) {
        await conexaoPostgres.query(
            "DELETE FROM Galpao_has_Saca WHERE Galpao_id_galpao = $1 AND Saca_id_saca = $2",
            [Galpao_id_galpao, Saca_id_saca]
        );
    }

    async moveSacaGalpao(Galpao_id_galpao_atual, Saca_id_saca, Galpao_id_novo) {
        const result = await conexaoPostgres.query(
            "UPDATE Galpao_has_Saca SET Galpao_id_galpao = $1 WHERE Galpao_id_galpao = $2 AND Saca_id_saca = $3 RETURNING *",
            [Galpao_id_novo, Galpao_id_galpao_atual, Saca_id_saca]
        );
        return result.rows[0];
    }
}

export default new GalpaoHasSacaRepository();
