import { faker } from "@faker-js/faker"; //Massa de teste dinâmica

export const getUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    //name: firstName + ' ' +lastName, //Concatenação de STRING
    name: `${firstName} ${lastName}`, // Interpolação de String
    email: faker.internet.email({ firstName, lastName, provider: 'penha.dev' }).toLocaleLowerCase(),
    password: "123456",
  };
};

export const getUserWithLink = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    //name: firstName + ' ' +lastName, //Concatenação de STRING
    name: `${firstName} ${lastName}`, // Interpolação de String
    email: faker.internet.email({ firstName, lastName, provider: 'penha.dev'  }).toLocaleLowerCase(),
    password: "123456",
    link: {
      //Usando faker para criar URLs diferentes para testes
      original_url: faker.internet.url(),
      title: faker.music.songName(),
    },
  };
};

export const getUserWithLinks = (linkCount = 5) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    //name: firstName + ' ' +lastName, //Concatenação de STRING
    name: `${firstName} ${lastName}`, // Interpolação de String
    email: faker.internet.email({ firstName, lastName , provider: 'penha.dev' }).toLocaleLowerCase(),
    password: "123456",
    links: faker.helpers.multiple(
      () => ({
        original_url: faker.internet.url(),
        title: faker.music.songName(),
      }),
      { count: linkCount },
    ),
  };
};
