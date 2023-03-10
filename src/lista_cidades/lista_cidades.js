import "./lista_cidades.css";
import {useEffect, useState} from "react";


function Lista_cidades() {
    return(
        <div>
            "aeaeae"
        </div>
    );
}
const chaveAPI = "18540fd8ab42c5c204bc3ef230383031";

function validar_fetch(resposta) {
    if (!resposta.ok) {
        const error = new Error(`HTTP error! Status code: ${resposta.status}`);
        error.status = resposta.status;
        throw error;
        return false;
    }
    return true;
}


export default Lista_cidades;