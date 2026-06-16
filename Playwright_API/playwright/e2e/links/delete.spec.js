import { getUserWithLink } from "../support/factories/user";
import { test, expect } from "../support/fixtures";
import { generateULID } from "../support/utils";

test.describe("DELETE /link/:id", () => {
  const user = getUserWithLink();
  let token;
  test.beforeEach(async ({ auth }) => {
    await auth.createUser(user);
    token = await auth.getToken(user);
  });

  test("Deve remover um link encurtado | 200", async ({ auth, links }) => {
    const linkId = await links.createAndReturnLinkId(user.link, token);

    const response = await links.removeLink(linkId, token);
    expect(response.status()).toBe(200);

    const { message } = await response.json();
    expect(message).toBe("Link excluído com sucesso");
  });

  test("Não deve remover um link encurtado | 400", async ({ auth, links }) => {
    const linkId = generateULID();

    const response = await links.removeLink(linkId, token);
    expect(response.status()).toBe(404);

    const { message } = await response.json();
    expect(message).toBe("Link não encontrado");
  });
});
