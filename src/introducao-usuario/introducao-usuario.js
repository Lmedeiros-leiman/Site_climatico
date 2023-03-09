import "./introducao-usuario.css";
import {useEffect, useState} from "react";

const completarnome = new Intl.DisplayNames([], { type: 'region' });
const posicoescardinais = ["Norte", "Nordeste", "Leste", "Sudeste", "Sul", "Sudoeste", "Oeste", "Noroeste"];
function converterdirecaovento(direcao) {return posicoescardinais[Math.floor(((direcao + 22.5) % 360) /45 )];}
const chaveAPI = "18540fd8ab42c5c204bc3ef230383031";
const brasilia = {
    name: "Brasília",
    latitude: -15.793889,
    longitude: -47.882778
    };
function Introducao_usuario() {
    const [erro,set_erro] = useState()

    const [tabela_usuario,set_tabela] = useState(null);
    const [local_usuario,set_localizacaousuario] = useState(brasilia);
    const [pegando_dados,set_pegando_dados] = useState(false);

    function pegarlocalizacaousuario(){
        if (navigator.geolocation) {
            if (!pegando_dados) {
                const pegarlocalizacao = async () =>{
                    set_pegando_dados(true);
                    try {
                        const resposta = await new Promise((resposta,rejeitado) =>{ navigator.geolocation.getCurrentPosition(resposta,rejeitado); })
                        set_localizacaousuario({
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

    useEffect( () => {
        const joao = async () => {
            try {
                let pedido = `https://api.openweathermap.org/data/2.5/weather?lat=${local_usuario.latitude}&lon=${local_usuario.longitude}&units=metric&appid=${chaveAPI}`
                const resposta = await fetch(pedido);
                if (!resposta.ok) {
                    const error = new Error(`HTTP error! Status code: ${resposta.status}`);
                    error.status = resposta.status;
                    throw error;
                }
                const json = await resposta.json();
                set_tabela(criar_tabela(json));

            } catch (erro) {
                set_erro(erro);
            }

        };
        joao();
    },[local_usuario]);

    function criar_tabela(dados) {

        let tabela = (
            <section className="tabela_usuario">
                <section className="dados_cidade">
                    <nav className={"informacao"}> {dados.name}, {completarnome.of(dados.sys.country)} <button onClick={pegarlocalizacaousuario}>Pegar localização</button></nav>
                    <aside>Coordenadas: {dados.coord.lon} Lon,  {dados.coord.lat} Lat</aside>
            </section>
            <main className={"dados_clima"}>
                <i className={"imagem bi bi-cup-hot"}></i>
                <div className={"temperatura principal"} title={"Temperatura atual"}>{Math.floor(dados.main.temp)}Cº</div>
                <div className={"temperatura"}>
                    <div className={"separador"} title={"Temperatura atual"}>{Math.floor(12.1212)}Cº</div>
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