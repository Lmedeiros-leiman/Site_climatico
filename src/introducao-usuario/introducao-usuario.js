import "./introducao-usuario.css";
import {useEffect, useState} from "react";

const completarnome = new Intl.DisplayNames([], { type: 'region' });
const posicoescardinais = ["Norte", "Nordeste", "Leste", "Sudeste", "Sul", "Sudoeste", "Oeste", "Noroeste"];
function converterdirecaovento(direcao) {return posicoescardinais[Math.floor(((direcao + 22.5) % 360) /45 )];}
const chaveAPI = "18540fd8ab42c5c204bc3ef230383031";








function Introducao_usuario() {

    const [erro, set_erro] = useState();
    const [pegando_dados, set_pegando_dados] = useState(false);


    let Brasilia = {name: "local", latitude: -15.7934036, longitude: -47.8823172,};
    let Cabul = {name: "local", latitude: 34.533333, longitude: 69.166667,};
    let Londres = {name: "local", latitude: 51.507222, longitude: -0.1275,};

    const [pegando_cidade, set_pegando_cidade] = useState(Brasilia);
    const [cidade,set_cidade] = useState();

    const [tabela_usuario, set_tabela] = useState(null);

    function validarfetch(resposta) {
        if (!resposta.ok) {
            const error = new Error(`HTTP error! Status code: ${resposta.status}`);
            error.status = resposta.status;
            throw error;
            return false
        }
        return true;
    }

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

        const joao = async () => {
            try {
                let pedido;
                let tipo;
                if (typeof(pegando_cidade) === "string" ) {
                    pedido = `http://api.openweathermap.org/geo/1.0/direct?q=${pegando_cidade}&appid=${chaveAPI}`;
                    tipo = "nome";
                } if (typeof(pegando_cidade) === "object") {
                    pedido = `http://api.openweathermap.org/geo/1.0/reverse?lat=${pegando_cidade.latitude}&lon=${pegando_cidade.longitude}&limit=1&appid=${chaveAPI}`;
                    tipo = "objeto";
                }

                let resposta = await fetch(pedido);
                validarfetch(resposta)
                const json = await resposta.json();
                set_cidade(json[0]);


            } catch (error) {
                set_erro(error)
            }
        };
        joao();

    },[pegando_cidade])


    useEffect( () => {
        const joao = async () => {
            try {
                console.log(cidade)
                let pedido = `https://api.openweathermap.org/data/2.5/weather?lat=${cidade.lat}&lon=${cidade.lon}&units=metric&appid=${chaveAPI}`

                let resposta = await fetch(pedido);
                validarfetch(resposta)
                const json = await resposta.json();
                set_tabela(criar_tabela(json));



            } catch (error) {
                set_erro(error)
            }
        };
        joao();
    },[cidade])




    function criar_tabela(dados) {

        let tabela = (
            <section className="tabela_usuario">
                <section className="dados_cidade">
                    <nav className={"informacao"}> {dados.name}, {completarnome.of(dados.sys.country)} <button onClick={pegarlocalizacaousuario}>Pegar localização</button></nav>
                    <nav className={"informacao"}><aside>Coordenadas: {dados.coord.lon} Lon,  {dados.coord.lat} Lat</aside><input id={"entrada_usuario"} /><button onClick={atualizar_entrada_usuario}>Atualizar</button> </nav>
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