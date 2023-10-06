import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Map from "./components/Map";

import fuelTypesJson from "./assets/data/fuelTypes.json";
import brandsJson from "./assets/data/brands.json";
import districtsJson from "./assets/data/districts.json";
import citiesJson from "./assets/data/cities.json";
import SelectItem from "./components/SelectItem";

axios.defaults.baseURL = "https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb";

const initialSelection = {
  fuelTypes: "3201",
  brands: "",
  districts: "",
  cities: "",
};

const alpha = (a, b) => a.Descritivo.localeCompare(b.Descritivo);

function App() {
  const [fuelTypes, setFuelTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(initialSelection);

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFuelTypes(fuelTypesJson);
    setBrands(brandsJson);
    setDistricts(districtsJson);
  }, []);

  const selectItem = ({ target: { name, value } }) => {
    const isDistrict = name === "districts";
    setCurrentSelection({
      ...currentSelection,
      [name]: value,
      ...(isDistrict && { cities: "" }),
    });

    if (isDistrict) {
      const districtCities = citiesJson
        .filter((city) => city.IdDistrito === parseInt(value))
        .sort(alpha);
      setCities(districtCities);
    }
  };

  const makeQuery = () => {
    const url = `/PesquisarPostos?idsTiposComb=${currentSelection.fuelTypes}&idMarca=${currentSelection.brands}&idTipoPosto=&idDistrito=${currentSelection.districts}&idsMunicipios=${currentSelection.cities}&qtdPorPagina=500`;
    axios.get(url).then(({ data }) => {
      if (data.status) {
        const uniqueResults = data.resultado.reduce((accumulator, current) => {
          if (!accumulator.find((item) => item.Id === current.Id)) {
            accumulator.push(current);
          }
          return accumulator;
        }, []);
        setMessage(null);
        setResults(uniqueResults);
      } else {
        setMessage(data.mensagem);
        setResults([]);
      }
    });
  };

  return (
    <div className="App">
      <section>
        <SelectItem
          label="Tipo de Combustível"
          id="fuelTypes"
          items={fuelTypes}
          onSelect={selectItem}
        />
        <SelectItem
          label="Marca"
          id="brands"
          items={brands}
          onSelect={selectItem}
        />
        <SelectItem
          label="Distrito"
          id="districts"
          items={districts}
          onSelect={selectItem}
        />
        <SelectItem
          label="Município"
          id="cities"
          items={cities}
          onSelect={selectItem}
        />
        <button onClick={makeQuery}>procurar</button>
      </section>

      <section>
        {results.length > 0 ? <Map items={results} /> : <p>{message}</p>}
      </section>
    </div>
  );
}

export default App;
