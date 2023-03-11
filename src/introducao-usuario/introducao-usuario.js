import "./introducao-usuario.css";
import {useEffect, useState} from "react";
import { pegar_chave } from "../chaveapi/chaveapi.js";

const completarnome = new Intl.DisplayNames([], { type: 'region' });
const posicoescardinais = ["Norte", "Nordeste", "Leste", "Sudeste", "Sul", "Sudoeste", "Oeste", "Noroeste"];
function converterdirecaovento(direcao) {return posicoescardinais[Math.floor(((direcao + 22.5) % 360) /45 )];}

let cidade_inicial = "Brasilia";
function Introducao_usuario() {
    //const [chaveAPI, set_chave] = useState(chave());
    const [erro, set_erro] = useState(); // função que lida com erros e mostrara o que deu errado para o usuário.

    const [pegando_dados, set_pegando_dados] = useState(false); // aqui impede qualquer botão de enviar multiplos pedidos desnecessarios e sobrecarregar o navegador
    const [pegando_cidade, set_pegando_cidade] = useState(cidade_inicial); // aqui define a cidade mostrada inicialmente no painel do usuário.
    const [tabela_usuario, set_tabela] = useState(null); // aqui define a tabela mostrada para o usuário (desenho em html)


    function pegarlocalizacaousuario(){
        if (navigator.geolocation) {
            if (!pegando_dados) {
                const pegarlocalizacao = async () =>{
                    set_pegando_dados(true);
                    try {
                        const resposta = await new Promise((resposta,rejeitado) =>{ navigator.geolocation.getCurrentPosition(resposta,rejeitado); })
                        set_pegando_cidade({
                            name: "Local",
                            latitude: resposta.coords.latitude,
                            longitude: resposta.coords.longitude
                        });
                    } catch (erro) {
                        set_erro(erro);
                    }
                }
                pegarlocalizacao();
            }
        }


    }
    function atualizar_entrada_usuario(){
        let entrada = document.getElementById("entrada_usuario").value;
        set_pegando_cidade(entrada)
    }
    useEffect( () => {
        // codigo principal;
        const alle = async () => {
            try {
                async function lidar_com_pedido(pedido){
                    function validarfetch(resposta) {
                        if (!resposta.ok) {
                            const error = new Error(`HTTP error! Status code: ${resposta.status}`);
                            error.status = resposta.status;
                            throw error;
                            return false
                        }
                        return true;
                    }
                    try {
                        let resposta = await fetch(pedido);
                        validarfetch(resposta);
                        let json;
                        if (json = await resposta.json()) {
                            return json;
                        }

                    } catch (error) {console.warn(error)}
                }

                let pedidooriginal = pegando_cidade;
                let pedido;
                let json;
                let chaveAPI = await pegar_chave();




                // pega as coordenadas da cidade e prepara para pedir os dados da api de clima;
                if (typeof(pegando_cidade) === "string" ) {
                    //pega os dados de forma normal com o nome da cidade;
                    pedido = `http://api.openweathermap.org/geo/1.0/direct?q=${pedidooriginal}&appid=${chaveAPI}`;
                    json = await lidar_com_pedido(pedido);
                    pedidooriginal = json[0];
                } else {
                    // pega os dados assumindo que é um pedido por objeto com as coordenadas da cidade;
                    pedido = `http://api.openweathermap.org/geo/1.0/reverse?lat=${pedidooriginal.latitude}&lon=${pedidooriginal.longitude}&limit=1&appid=${chaveAPI}`;
                    if (json = await lidar_com_pedido(pedido)) {
                        pedidooriginal = json[0];
                    } else {
                        pedido = `http://api.openweathermap.org/geo/1.0/reverse?lat=${pedidooriginal.lat}&lon=${pedidooriginal.lon}&limit=1&appid=${chaveAPI}`;
                        json = await lidar_com_pedido(pedido)
                        pedidooriginal = json[0];
                    }

                }

                // pega os dados climáticos da cidade
                pedido = `https://api.openweathermap.org/data/2.5/weather?lat=${pedidooriginal.lat}&lon=${pedidooriginal.lon}&units=metric&appid=${chaveAPI}`
                json = await lidar_com_pedido(pedido);


                // modifica o pedido para mostrar o nome da cidade, não do local onde fica a estação e outros detalhes caso nescessario;
                json.name = pedidooriginal.name;



                // mostra o pedido para o usuário;
                set_tabela(criar_tabela(json));

            } catch (error) {
                set_erro(error)
            }
        };

        // chama a função principal;
        alle();

    },[pegando_cidade])

    function criar_tabela(dados) {
        let tabela = (
            <section className="tabela_usuario">
                <section className="dados_cidade">
                    <nav className={"informacao"}> {dados.name}, {completarnome.of(dados.sys.country)} <span><input id={"entrada_usuario"} /><button onClick={atualizar_entrada_usuario}>Atualizar</button> </span></nav>
                    <nav className={"informacao"}><aside>Coordenadas: {dados.coord.lon} Lon,  {dados.coord.lat} Lat</aside> <button onClick={pegarlocalizacaousuario}>Pegar localização</button> </nav>
                </section>
                <main className={"dados_clima"}>
                    <i className={"imagem bi bi-cup-hot"}></i>
                    <div className={"temperatura principal"} title={"Temperatura atual"}>{Math.floor(dados.main.temp)}Cº</div>
                    <div className={"temperatura"}>
                        <div className={"separador"} title={"Temperatura atual"}>{Math.floor(dados.main.temp)}Cº</div>
                        <div title={"Sensação Térmica"}>{Math.floor(dados.main.feels_like)}Cº</div>
                    </div>

                    <div>
                        <div>Vento: {dados.wind.speed}Km/h <span>{converterdirecaovento(dados.wind.deg)}</span></div>
                        <div>{dados.weather[0].description}</div>
                        <div>Humidade: {dados.main.humidity} %</div>
                    </div>

                </main>
            </section>);

        return tabela;
    }

    return (
        <div>
            {tabela_usuario}
        </div>
    );
}

export default Introducao_usuario;