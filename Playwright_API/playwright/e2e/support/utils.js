export function generateULID() {
    // Tabela de caracteres do Base32 de Crockford
    const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    const ENCODING_LEN = ENCODING.length;
    
    // Pega o timestamp atual em milissegundos
    let time = Date.now();

    // Gera os 10 caracteres baseados no tempo
    let timeChars = "";
    for (let i = 0; i < 10; i++) {
        timeChars = ENCODING.charAt(time % ENCODING_LEN) + timeChars;
        time = Math.floor(time / ENCODING_LEN);
    }

    // Gera os 16 caracteres aleatórios
    let randChars = "";
    for (let i = 0; i < 16; i++) {
        // Usamos Math.random() para criar a aleatoriedade
        let randIndex = Math.floor(Math.random() * ENCODING_LEN);
        randChars += ENCODING.charAt(randIndex);
    }

    // Junta as duas partes para formar o ULID final
    return timeChars + randChars;
}