import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import List from './components/List';
import axios from 'axios';

function App() {
  const [fuelTypes, setFuelTypes] = useState([])
  const [brands, setBrands] = useState([])
  const [currentSelection, setCurrentSelection] = useState({})

  useEffect(() => {
    axios.get('https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetTiposCombustiveis')
    .then(response => {
      setFuelTypes(response.data.resultado)
    })
    axios.get('https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetMarcas')
    .then(response => {
      setBrands(response.data.resultado)
    })
  }, [])
  
  const selectItem = ({target:{name, value}}) => {
    setCurrentSelection({
      ...currentSelection,
      [name]: value,
    })
  }

  return (
    <div className="App">
      <select name="fuelType" id="fuelTypes" onChange={selectItem}>
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
    </div>
  );
}

export default App;
