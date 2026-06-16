import { cleanUpTestData } from './playwright/e2e/support/database.js';

export default async function globalSetup(){
    console.log('Limpando os dados de teste antes da execução...')
    await cleanUpTestData()
    console.log('Limpeza concluída com sucesso')
}