import { test, expect } from "../support/fixtures/index";
import { getUserWithLink } from "../support/factories/user";

test.describe("Post /api/links", () => {
  const user = getUserWithLink();
  let token;

  test.beforeEach(async ({ auth }) => {

    await auth.createUser(user);
    token = await auth.getToken(user);
  });

  test("Deve encurtar um novo link | 200", async ({ links }) => {
    const response = await links.createLink(user.link, token);

    expect(response.status()).toBe(201);

    //Essa é uma estratégia para pegar apenas campos que você quer dentro de um JSON sem precisar carregar uma constante inteira com um JSON
    const { data, message } = await response.json();

    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("original_url", user.link.original_url);
    expect(data).toHaveProperty("title", user.link.title);

    //Verificando um alphanumerico com 5 caracteres, uma vez que não sabemos o valor que será respondido, podemos usar sua estrutura
    expect(data.short_code).toMatch(/^[a-zA-Z0-9]{5}$/);

    expect(message).toBe("Link criado com sucesso");
  });

  test("Não encurtar URL quando URL original não é informada | 400", async ({ links }) => {
    const response = await links.createLink(
      { ...user.link, original_url: "" },
      token,
    ); //Essa é uma forma de conseguir editar os dados diretamente na hora de enviar como parâmetro

    expect(response.status()).toBe(400);

    //Mais uma vez criando uma constante usando como base o JSON que está sendo extraido
    const { message } = await response.json();
    expect(message).toBe("O campo 'OriginalURL' é obrigatório");
    console.log(message);
  });

  test("Não encurtar URL quando Título não é informada | 400", async ({ links }) => {
    const response = await links.createLink({ ...user.link, title: "" }, token); //Essa é uma forma de conseguir editar os dados diretamente na hora de enviar como parâmetro

    expect(response.status()).toBe(400);

    //Mais uma vez criando uma constante usando como base o JSON que está sendo extraido
    const { message } = await response.json();
    expect(message).toBe("O campo 'Title' é obrigatório");
    console.log(message);
  });

  test("Não encurtar URL quando URL original é inválida | 400", async ({ links }) => {
    const response = await links.createLink(
      { ...user.link, original_url: "Jorge" },
      token,
    ); //Essa é uma forma de conseguir editar os dados diretamente na hora de enviar como parâmetro

    expect(response.status()).toBe(400);

    //Mais uma vez criando uma constante usando como base o JSON que está sendo extraido
    const { message } = await response.json();
    expect(message).toBe("O campo 'OriginalURL' deve ser uma URL válida");
    console.log(message);
  });
});
