import { faker } from "@faker-js/faker"; //Massa de teste dinâmica

export const getUser = ()=>{
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        //name: firstName + ' ' +lastName, //Concatenação de STRING
        name:`${firstName} ${lastName}`, // Interpolação de String
        email:faker.internet.email({firstName, lastName}).toLocaleLowerCase(),
        password:'123456'
    }
}