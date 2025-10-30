import { use, useState } from 'react'
import './App.css'
import { Cloudy, MapPin,ThermometerSun, Droplets, Wind} from 'lucide-react';


function App() {
  const [cidade, setCidade] = useState("");
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const buscaClima = async () =>{
    if(!cidade.trim()){
      setErro("Por Favor, Digite uma cidade");
      return;
    }

    setCarregando(true);
    setErro("");

    try{

      const API_KEY = "50878f4678cd0841144b44b2fca0ccc0";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`;
      console.log("URL da Requisição", url);
      const resposta = await fetch(url);

      if(!resposta.ok){
        throw new Error("Cidade não encontrada")
      }

      const dados = await resposta.json();
      setClima(dados);
    } catch (error) {
      setErro(error.message);
      setClima(null);
    } finally {
      setCarregando(false);
    }
  };

  const handleKeyPress = (e) =>{
    if (e.key === "Enter"){
      buscaClima();
    }
  };
  return (
    <>
     <div className="app-container">
      <div className="content-wrapper">
        <header>
          <h1>
            <Cloudy color="white" size={48} />
            Consulta de Clima</h1>
          <p>Exemplo de consumo de API com React</p>
        </header>

        <div className="busca-box">
          <div className="busca-container"><input type="text" 
          placeholder="Dgite uma Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          onKeyDown={handleKeyPress}/>
          <button
          onClick={buscaClima}
          disabled = {carregando}>{carregando ? "Buscando...": "Buscar"}</button>
          </div>
          {erro && <p className='error-message'>{erro}</p>}
        </div>

      {clima && (<>
        <div className="card-resultado">
          <div className="info-cidade">
            <div className="nome-cidade">
              <MapPin color="red" size={40}></MapPin>
              {clima.name}, {clima.sys.country}
            </div>
            <p className="desc-cidade">
              {clima.weather[0].description}
            </p>
          </div>
          
          <div className="temperatura-box">
            <div className="temperatura-valor">
              {Math.round(clima.main.temp)}°C
            </div>
            <div className="sens-termica">
              Sensação Térmica: {Math.round(clima.main.feels_like)}°C
            </div>
          </div>

          <div className="detalhes-box">
            <div className="detal-item">
              <div className="ideal-icone">
                <ThermometerSun color="red" size={35}></ThermometerSun>
              </div>
              <p className="detal-desc">
                Min/Max
              </p>
              <p className="detal-valor">
                {Math.round(clima.main.temp.max)} °C /
                {Math.round(clima.main.temp.min)} °C
              </p>
            </div>


            <div className="detal-item">
              <div className="ideal-icone">
                <Droplets color="blue" size={35}></Droplets>
              </div>
              <p className="detal-desc">
                umidade
              </p>
              <p className="detal-valor">
                {clima.main.humidity}%
              </p>
            </div>


            <div className="detal-item">
              <div className="ideal-icone">
                <Wind color="gray" size={35}></Wind>
              </div>
              <p className="detal-desc">
                vento
              </p>
              <p className="detal-valor">
                {Math.round(clima.wind.speed * 3.6)} km/h
              </p>
            </div>
          </div>
        </div>
      </>)}
      </div>
     </div>
    </>
  )
}

export default App
