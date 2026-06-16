import { test, expect } from "../support/fixtures/index";

import { getUser } from "../support/factories/user";


test.describe("POST /auth/register", () => {
    //Cria uma variável, NAO CONSTANTE como anteriormente
    let auth
    
    test("Deve cadastrar novo usuário | 200", async ({ auth }) => {
    //Criando costante com os metodos
    const user = getUser();

    const response = await auth.createUser(user); //Chamada da API nos services

    expect(response.status()).toBe(201);

    //Obtem JSON do response
    const responseBody = await response.json();

    //toHaveProperty e toBe são Semânticamente falando a mesma coisa, a resposta de erro do PH vai vir melhor
    expect(responseBody).toHaveProperty(
      "message",
      "Usuário cadastrado com sucesso!",
    );
    expect(responseBody.message).toBe("Usuário cadastrado com sucesso!");

    //Comparando a estrutura do response com a massa de dados enviada no POST
    expect(responseBody.user).toHaveProperty("id");
    expect(responseBody.user).toHaveProperty("name", user.name);
    expect(responseBody.user).toHaveProperty("email", user.email);

    //Em caso negativo
    expect(responseBody.user).not.toHaveProperty("password");
  });

  test("Não deve cadastrar com email existente | 200", async ({ auth }) => {
    //Criando variáveis com os metodos
    const user = getUser();

    const preCondition = await auth.createUser(user); //Chamada da API nos services

    expect(preCondition.status()).toBe(201);

    const response = await auth.createUser(user); //Chamada da API nos services
    expect(response.status()).toBe(400);

    const responseBody = await response.json();

    expect(responseBody.message).toBe(
      "Este e-mail já está em uso. Por favor, tente outro.",
    );
  });

  test("Não deve cadastrar com email inválido", async ({ auth }) => {
    const user = {
      name: "Felipão",
      email: "penhoso#Penha.dev", //email com padrão inválido
      password: "pwd123",
    };

    const response = await auth.createUser(user); //Chamada da API nos services

    expect(response.status()).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty(
      "message",
      "O campo 'Email' deve ser um email válido", //Uso de aspas simples
    );
  });

  test("Não deve cadastrar com nome vazio", async ({ auth }) => {
    const user = {
      name: "", //nome vazio
      email: "penhoso@Penha.dev",
      password: "pwd123",
    };

    const response = await auth.createUser(user); //Chamada da API nos services

    expect(response.status()).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty(
      "message",
      "O campo 'Name' é obrigatório", //Uso de aspas simples dentro de aspas simples
    );
  });

  test("Não deve cadastrar com senha vazio", async ({ auth }) => {
    const user = {
      name: "Felipe Pnehas", //nome vazio
      email: "penhoso@Penha.dev",
      password: "",
    };

    const response = await auth.createUser(user); //Chamada da API nos services

    expect(response.status()).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty(
      "message",
      "O campo 'Password' é obrigatório", //Uso de aspas simples dentro de aspas simples
    );
  });

  test("Não deve cadastrar com email vazio", async ({ auth }) => {
    const user = {
      name: "Felipe Pnehas",
      email: "", //email vazio
      password: "Pesta",
    };

    const response = await auth.createUser(user); //Chamada da API nos services

    expect(response.status()).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty(
      "message",
      "O campo 'Email' é obrigatório",
    );
  });
});
