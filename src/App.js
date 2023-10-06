import { useEffect, useState } from "react";
import axios from "axios";

import Map from "./components/Map";
import SelectItem from "./components/SelectItem";

import fuelTypesJson from "./assets/data/fuelTypes.json";
import brandsJson from "./assets/data/brands.json";
import districtsJson from "./assets/data/districts.json";
import citiesJson from "./assets/data/cities.json";

import { alpha } from "./helpers";
import "./App.css";

const initialSelection = {
  fuelTypes: "3201",
  brands: "",
  districts: "",
  cities: "",
};

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
        data.resultado.forEach((item) => {
          item.Preco =
            parseFloat(item.Preco.replace(" €", "").replace(",", ".")).toFixed(
              2
            ) + " €";
          // if (item.Marca === "GALP") {
          //   item.Preco =
          //     (
          //       parseFloat(item.Preco.replace(" €", "").replace(",", ".")) - 0.1
          //     ).toFixed(2) + " €";
          // }
        });
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
