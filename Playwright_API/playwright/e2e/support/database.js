import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();
// Configuração da conexão com o banco de dados.
// O ideal é que esses dados venham de variáveis de ambiente (.env)
const pool = new Pool({
  host: process.env.DB_HOST, // ou o endereço do seu banco
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
});

/**
 * Função responsável por limpar toda a massa de dados de teste
 * gerada com o domínio penha.dev
 */
export async function cleanUpTestData() {
  const query = `
        WITH target_users AS (
            SELECT id 
            FROM users 
            WHERE email LIKE '%@penha.dev%'
        ),
        deleted_links AS (
            DELETE FROM links
            WHERE user_id IN (SELECT id FROM target_users)
            RETURNING id
        )
        DELETE FROM users
        WHERE id IN (SELECT id FROM target_users)
          AND (SELECT COUNT(*) FROM deleted_links) >= 0;
    `;

  // Pegamos um "cliente" (conexão) emprestado do Pool
  const client = await pool.connect();

  try {
    // Executamos a query
    const result = await client.query(query);
    console.log(
      `[Database Cleanup] Sucesso. ${result.rowCount} usuários de teste removidos.`,
    );
  } catch (error) {
    console.error("[Database Cleanup] Erro ao limpar a massa de dados:", error);
    throw error; // Lança o erro para que o teste falhe caso o banco dê problema
  } finally {
    // Passo extremamente importante: devolver a conexão para o Pool
    // para não estourar o limite do banco de dados nas próximas execuções
    client.release();
  }
}

