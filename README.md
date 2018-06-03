# GeoApp

This is a simple geographic quiz game. A live instance is hosted [here](https://famille-lafay.fr/geo/).

In `Play` mode, depending on the selected options in the `Settings` dialog, you will be shown some information abount a country, and asked others, among :
- its flag
- its location
- its name
- its capital (or one of its capitals for some countries)

Note that, currently, text queries require an exact match against the reference data, including casing, accents (even on uppercase letters), spaces, quotes, dashes.

In `Explore` mode, clicking on a country on the map will display all its information.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build, and the `--base-href=/my-root/` if you don't serve from the root of your site.

## License

This project is under the [MIT License](LICENSE).

All data (lists, map, flags) from Wikipedia/Wikimedia, either under GFDL or Creative Commons.
