import { useEffect, useState } from "react";
import axios from "axios";

import Map from "./components/Map";
import SelectItem from "./components/SelectItem";

import fuelTypesJson from "./assets/data/fuelTypes.json";
import brandsJson from "./assets/data/brands.json";
import districtsJson from "./assets/data/districts.json";
import citiesJson from "./assets/data/cities.json";

import { alpha, formatNumber, getMedian } from "./helpers";
import "./App.css";

const initialSelection = {
  fuelTypes: "3201",
  brands: "",
  districts: "",
  cities: "",
};

const geolocationOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
};

function App() {
  const [fuelTypes, setFuelTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(initialSelection);

  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lng: null,
  });

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFuelTypes(fuelTypesJson);
    setBrands(brandsJson);
    setDistricts(districtsJson);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        undefined,
        geolocationOptions
      );
    }
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

  const printValues = (resultado) => {
    console.log("***");
    const groups = resultado.reduce((groups, item) => {
      const group = groups[item.Municipio] || [];
      group.push(item);
      groups[item.Municipio] = group;
      return groups;
    }, {});

    let totalMedian = 0;
    for (const city in groups) {
      const cityMedian = getMedian(groups[city]);
      totalMedian += cityMedian;
      console.log(city, cityMedian, groups[city][0].Distrito);
    }
    console.log(
      "media total: ",
      formatNumber(totalMedian / Object.keys(groups).length)
    );
  };

  const setDiscount = (item, brand, discount) => {
    if (item.Marca === brand) {
      item.Preco =
        (
          parseFloat(item.Preco.replace(" €", "").replace(",", ".")) - discount
        ).toFixed(2) + " €";
    }
  };

  const makeQuery = () => {
    const url = `/PesquisarPostos?idsTiposComb=${currentSelection.fuelTypes}&idMarca=${currentSelection.brands}&idTipoPosto=&idDistrito=${currentSelection.districts}&idsMunicipios=${currentSelection.cities}&qtdPorPagina=5000`;
    axios.get(url).then(({ data: { resultado, status, mensagem } }) => {
      if (status) {
        resultado.forEach((item) => {
          const preco = formatNumber(
            parseFloat(item.Preco.replace(" €", "").replace(",", "."))
          );
          item.price = preco;
          item.Preco = preco + " €";

          // fixing inverted coordinates
          if (item.Latitude < 37) {
            const lat = item.Latitude;
            item.Latitude = item.Longitude;
            item.Longitude = lat;
          }
          setDiscount(item, "GALP", 0.15);
        });
        printValues(resultado);
        setMessage(null);
        setResults(resultado);
      } else {
        setMessage(mensagem);
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
        {results.length > 0 ? (
          <Map items={results} currentLocation={currentLocation} />
        ) : (
          <p>{message}</p>
        )}
      </section>
    </div>
  );
}

export default App;
