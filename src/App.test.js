import { filterStationsByRadius } from './helpers';

describe('filterStationsByRadius', () => {
  it('keeps only stations within the selected radius from the current location', () => {
    const currentLocation = { lat: 38.7, lng: -9.1 };
    const stations = [
      {
        Id: 1,
        Latitude: 38.7005,
        Longitude: -9.1005,
        Preco: '1.50 €',
      },
      {
        Id: 2,
        Latitude: 38.8,
        Longitude: -9.2,
        Preco: '1.60 €',
      },
    ];

    const filtered = filterStationsByRadius(stations, currentLocation, 10);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].Id).toBe(1);
  });
});
