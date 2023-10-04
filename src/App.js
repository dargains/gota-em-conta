import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Map from './components/Map';

axios.defaults.baseURL = 'https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb'

const initialSelection = {
  fuelTypes: '3201',
  brands: '',
  districts: '',
  cities: ''
}

const alpha = (a, b) => a.Descritivo.localeCompare(b.Descritivo)

function App() {
  const [fuelTypes, setFuelTypes] = useState([])
  const [brands, setBrands] = useState([])
  const [districts, setDistricts] = useState([])
  const [cities, setCities] = useState([])
  const [currentSelection, setCurrentSelection] = useState(initialSelection)

  const [results, setResults] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('/GetTiposCombustiveis')
    .then(({data:{resultado}}) => {
      setFuelTypes(resultado)
    })
    axios.get('/GetMarcas')
    .then(({data:{resultado}}) => {
      setBrands(resultado)
    })
    axios.get('/GetDistritos')
    .then(({data:{resultado}}) => {
      setDistricts(resultado)
    })
  }, [])
  
  const selectItem = ({target:{name, value}}) => {
    setCurrentSelection({
      ...currentSelection,
      [name]: value,
    })
    
    if (name === 'districts') {
      axios.get(`/GetMunicipios?idDistrito=${value}`)
      .then(({data:{resultado}}) => {
        setCities(resultado.sort(alpha))
      })
    }
  }

  const makeQuery = () => {
    const url = `/PesquisarPostos?idsTiposComb=${currentSelection.fuelTypes}&idMarca=${currentSelection.brands}&idTipoPosto=&idDistrito=${currentSelection.districts}&idsMunicipios=${currentSelection.cities}&qtdPorPagina=500&pagina=1`
    axios.get(url).then(({data}) => {
      if (data.status) {
        const uniqueResults = data.resultado.reduce((accumulator, current) => {
          if (!accumulator.find((item) => item.Id === current.Id)) {
            accumulator.push(current);
          }
          return accumulator;
        }, []);
        setResults(uniqueResults)
      } else {
        setMessage(data.mensagem)
      }
    })
  }

  return (
    <div className="App">

      <section>
        <select name="fuelTypes" id="fuelTypes" onChange={selectItem}>
          <option value="">Qualquer um</option>
          {
            fuelTypes.map(item => <option key={item.Id} value={item.Id}>{item.Descritivo}</option>)
          }
        </select>
        <select name="brands" id="brands" onChange={selectItem}>
          <option value="">Qualquer um</option>
          {
            brands.map(item => <option key={item.Id} value={item.Id}>{item.Descritivo}</option>)
          }
        </select>
        <select name="districts" id="districts" onChange={selectItem}>
          <option value="">Qualquer um</option>
          {
            districts.map(item => <option key={item.Id} value={item.Id}>{item.Descritivo}</option>)
          }
        </select>
        <select name="cities" id="cities" onChange={selectItem}>
          <option value="">Qualquer um</option>
          {
            cities.map(item => <option key={item.Id} value={item.Id}>{item.Descritivo}</option>)
          }
        </select>
        <button onClick={makeQuery}>procurar</button>
      </section>

      <section>
        {
          results.length > 0
          ? <Map items={results} />
          : <p>{message}</p>
        }
      </section>

    </div>
  );
}

export default App;
