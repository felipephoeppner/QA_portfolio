// @ts-check
import { test, expect } from '@playwright/test'

test('Verificar se API está online', async ({ request }) => {
  const response = await request.get('http://localhost:3333/health')
  const body = await response.json()
  
  //asserções 
  expect(response.status()).toBe(200)
  expect(body.service).toBe('shortbeyond-api')
  expect(body.status).toBe('healthy')
});

