import React, { useEffect, useState } from "react";
import axios from "axios";

import Map from "./components/Map";
import SelectItem from "./components/SelectItem";

import fuelTypeJson from "./assets/data/fuelTypes.json";
import brandsJson from "./assets/data/brands.json";
import districtsJson from "./assets/data/districts.json";
import citiesJson from "./assets/data/cities.json";

import { alpha, filterStationsByRadius, formatNumber, getMedian } from "./helpers";
import "./App.css";
import {
  Selection,
  Brand,
  Fueltype,
  District,
  City,
  ResultItem,
  Coordinates,
} from "./Types";
import { Button, Slider, Space, Switch, Typography } from "antd";

const INITIAL_SELECTION = {
  fuelType: "3201",
  brands: "",
  districts: "",
  cities: "",
};

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
};

function App() {
  const [fuelType, setFuelType] = useState<Fueltype[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [currentSelection, setCurrentSelection] =
    useState<Selection>(INITIAL_SELECTION);

  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(
    null
  );
  const [radiusKm, setRadiusKm] = useState(10);
  const [showAllResults, setShowAllResults] = useState(false);

  const [results, setResults] = useState<ResultItem[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFuelType(fuelTypeJson);
    setBrands(brandsJson);
    setDistricts(districtsJson);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({
          coords: { latitude, longitude },
        }: {
          coords: { latitude: number; longitude: number };
        }) => {
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        undefined,
        GEOLOCATION_OPTIONS
      );
    }
  }, []);

  const selectItem = (value: string, name: string) => {
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

  const printValues = (resultado: ResultItem[]) => {
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

  const setDiscount = (item: ResultItem, brand: string, discount: number) => {
    if (item.Marca === brand) {
      item.Preco =
        (
          parseFloat(item.Preco.replace(" €", "").replace(",", ".")) - discount
        ).toFixed(2) + " €";
    }
  };

  const makeQuery = async () => {
    const { fuelType, brands, districts, cities } = currentSelection;
    const url = `/PesquisarPostos?idsTiposComb=${fuelType}&idMarca=${brands}&idTipoPosto=&idDistrito=${districts}&idsMunicipios=${cities}&qtdPorPagina=5000`;
    const { data } = await axios.get(url);
    const {
      resultado,
      status,
      mensagem,
    }: { resultado: ResultItem[]; status: boolean; mensagem: string } = data;
    if (status) {
      resultado.forEach((item: ResultItem) => {
        // setting price with only two decimals
        const priceFloat = formatNumber(
          parseFloat(item.Preco.replace(" €", "").replace(",", "."))
        );
        item.price = priceFloat;
        item.Preco = priceFloat + " €";

        // fixing wrong lat coordinates
        if (item.Latitude < 37) {
          const lat = item.Latitude;
          item.Latitude = item.Longitude;
          item.Longitude = lat;
        }

        //fix wrong lng
        if (item.Longitude > 0) {
          item.Longitude = -1 * item.Longitude;
        }
        //setDiscount(item, "GALP", 0.15);
      });
      printValues(resultado);
      setMessage("");
      setResults(resultado);
    } else {
      setMessage(mensagem);
      setResults([]);
    }
  };

  const shouldFilterByRadius = Boolean(currentLocation && !showAllResults);
  const visibleResults = shouldFilterByRadius
    ? filterStationsByRadius(results, currentLocation, radiusKm)
    : results;

  return (
    <>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: "flex",
          padding: "0 24px 24px 24px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <Typography.Title>Gota em Conta</Typography.Title>
        <SelectItem
          label="Tipo de Combustível"
          id="fuelType"
          items={fuelType}
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
          isMultiple
          isDisabled={!currentSelection.districts}
        />
        <Button type="primary" onClick={makeQuery}>Procurar</Button>
        <Space align="center">
          <Typography.Text>Mostrar todos</Typography.Text>
          <Switch
            checked={showAllResults}
            onChange={(checked) => setShowAllResults(checked)}
          />
        </Space>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Typography.Text>Raio: {radiusKm} km</Typography.Text>
          <Slider
            min={1}
            max={50}
            step={1}
            value={radiusKm}
            onChange={(value) => setRadiusKm(value)}
            disabled={showAllResults}
          />
        </Space>
        <Typography.Text type="secondary">
          {currentLocation
            ? showAllResults
              ? "A mostrar todos os postos encontrados."
              : `A mostrar postos a até ${radiusKm} km da sua localização atual.`
            : "Ative a localização para filtrar postos por raio."}
        </Typography.Text>
      </Space>

      <section>
        {results.length > 0 ? (
          visibleResults.length > 0 ? (
            <Map items={visibleResults} currentLocation={currentLocation} radiusKm={radiusKm} />
          ) : (
            <p>Nenhum posto encontrado dentro de {radiusKm} km da sua localização.</p>
          )
        ) : (
          <p>{message}</p>
        )}
      </section>
    </>
  );
}

export default App;
