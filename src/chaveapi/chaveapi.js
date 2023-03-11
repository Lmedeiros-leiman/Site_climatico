export async function pegar_chave() {
    function validarfetch(resposta) {
        if (!resposta.ok) {
            const error = new Error(`HTTP error! Status code: ${resposta.status}`);
            error.status = resposta.status;
            throw error;
            return false
        }
        return true;
    }

    let pedido = `${process.env.PUBLIC_URL}/chaveapi.txt`;
    let resposta = await fetch(pedido);
    validarfetch(resposta);
    let chave = await resposta.text()
    return chave;

}
