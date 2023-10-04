import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Map from './components/Map';

axios.defaults.baseURL = 'https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb'

const initialSelection = {
  fuelTypes: '3201',
  brand: '',
}

const removeDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) === index);

function App() {
  const [fuelTypes, setFuelTypes] = useState([])
  const [brands, setBrands] = useState([])
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
  }, [])
  
  const selectItem = ({target:{name, value}}) => {
    setCurrentSelection({
      ...currentSelection,
      [name]: value,
    })
  }

  const makeQuery = () => {
    const url = `/PesquisarPostos?idsTiposComb=${currentSelection.fuelTypes}&idMarca=${currentSelection.brand}&idTipoPosto=&idDistrito=11&idsMunicipios=161&qtdPorPagina=500&pagina=1`
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
      <select name="fuelTypes" id="fuelTypes" onChange={selectItem}>
        {
          fuelTypes.map(item => <option key={item.Id} value={item.Id}>{item.Descritivo}</option>)
        }
      </select>
      <select name="brand" id="brands" onChange={selectItem}>
        {
          brands.map(item => <option key={item.Id} value={item.Id}>{item.Descritivo}</option>)
        }
      </select>
      <p>{JSON.stringify(currentSelection)}</p>
      <button onClick={makeQuery}>procurar</button>
      {
        results.length > 0
        ? <Map items={results} />
        : <p>{message}</p>
      }
    </div>
  );
}

export default App;
