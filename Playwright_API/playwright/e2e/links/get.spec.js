import { test, expect } from "../support/fixtures";
import { getUserWithLink, getUserWithLinks } from "../support/factories/user";

test.describe("Get /links", () => {
  test("Deve retornar uma lista de links pré-encurtados", async ({
    auth,
    links,
  }) => {
    const user = getUserWithLinks();

    await auth.createUser(user);
    const token = await auth.getToken(user);

    for (let link of user.links) {
      await links.createLink(link, token);
    }

    const response = await links.getLinks(token);
    expect(response.status()).toBe(200);

    const { message, count, data } = await response.json();

    expect(message).toBe("Links Encurtados");
    expect(count).toBe(user.links.length);
    expect(Array.isArray(data)).toBeTruthy(); // Voltar igual a true de forma dahora
    expect(data).toHaveProperty;

    for (let [index, link] of data.entries()) {
      expect(link).toHaveProperty("id");
      expect(link).toHaveProperty(
        "original_url",
        user.links[index].original_url,
      ); //Interessante esse ponto, coloca duas verificações no mesmo local - Temos a verificação da propriedade e do conteúdo
      expect(link).toHaveProperty("short_code");
      expect(link).toHaveProperty("title");

      expect(link.short_code).toMatch(/^[a-zA-Z0-9]{5}$/);
    }
  });

  test("Deve retornar uma lista vazia", async ({ auth, links }) => {
    const user = getUserWithLinks(0);

    await auth.createUser(user);
    const token = await auth.getToken(user);

    const response = await links.getLinks(token);

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.count).toBe(0);
    expect(body.data).toHaveLength(0);
    expect(body.message).toBe("Links Encurtados");
  });
});
