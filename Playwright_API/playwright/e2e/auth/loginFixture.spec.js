import { test, expect } from "../support/fixtures/index";
import { getUser } from "../support/factories/user";

test.describe("POST /auth/login", () => {

  test("Deve fazer login com sucesso | 200", async ({auth}) => {
    //Cria um usuário aleatório e guarda na constante respCreate
    const user = getUser();
    const respCreate = await auth.createUser(user);
    expect(respCreate.status()).toBe(201);

    //Usa o mesmo user que foi criado para executar login, assim deixando o teste individual
    const response = await auth.login(user);
    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty("message", "Login realizado com sucesso");
    expect(body.data).toHaveProperty("token");
    expect(body.data.user).toHaveProperty("id");
    expect(body.data.user).toHaveProperty("name", user.name);
    expect(body.data.user).toHaveProperty("email", user.email);
    expect(body.data.user).not.toHaveProperty("password");
  });

  test("Não deve logar com senha incorreta | 401", async ({auth}) => {
    //Cria um usuário aleatório e guarda na constante respCreate
    const user = getUser();

    const respCreate = await auth.createUser(user);
    expect(respCreate.status()).toBe(201);

    //Intercepta o valor que será retornado e o modifica, deixando a senha inválida
    const response = await auth.login({ ...user, password: "987" });
    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body).toHaveProperty("message", "Credenciais inválidas");
  });

  test("Não deve logar com email não cadastrado | 401", async ({auth}) => {
    //Cria um usuário aleatório e guarda na constante respCreate
    const user = {
      email: "404@invalido.dev",
      password: "invalido",
    };

    const response = await auth.login(user);
    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body).toHaveProperty("message", "Credenciais inválidas");
  });

  test("Não deve logar com email não informado | 400", async ({auth}) => {
    //Cria um usuário aleatório e guarda na constante respCreate
    const user = {
      password: "invalido",
    };

    const response = await auth.login(user);
    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body).toHaveProperty("message", "O campo 'Email' é obrigatório");
  });

  test("Não deve logar com senha não informado | 400", async ({auth}) => {
    //Cria um usuário aleatório e guarda na constante respCreate
    const user = {
      email: "invaliPenha@email.com"
    };

    const response = await auth.login(user);
    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body).toHaveProperty("message", "O campo 'Password' é obrigatório");
  });
});
