# Anetlopes browser

## Project

Web app that displays statistics about antelopes species.

## Libaries used

* Material UI: It had everything I needed, and I'm used to using it
* Visx for graphs: It's easily usable and quite powerful, and the learning curve isn't as steep as D3
* Maplibre-gl for the maps: An OSS alternative to mapbox-gl-js
* @emotion/styled for styled components
* wouter for routing: It has zero dependency, and it's quite powerful
* zustand for state management: It's non opinonated and very easy to use

## Demo

The demo is hosted on <https://antelopes.s3.eu-west-1.amazonaws.com/index.html>

### Locally

To run it locally, you need to first clone the project and then run these commands:

```bash
pnpm | npm | yarn install

pnpm | npm | yarn dev
```

## Features

* Graphs:
    - Antelopes by horns [Bar]
    - Antelopes by weight categories [Bar]
    - Anetlopes by height categories [Bar]
    - Antelops by continents [Map]
    - Antelopes by horns by continen [Stacked Bar]
    - Average weight and height by continent [Stacked Bar]
    - Average weight and height by horns [Stacked Bar]
* Antelops cards with filter (horns) and sort (weight, height)
* AB test between 2 advanced modes
    - Advanced 1: search with a combination of operators (=,<,>,contains,in...) and logic operators (OR, AND)
    - Advanced 2: autocomplete search bar with pregenrated questions 

## Improvements

* Connect to a backend, do the computation there, add a cache for the most requested conditions
* Save the AB test actions
* Create a notebook with the analysis of the AB test result
* Improve the search bar to include a dynamic value that can be inputted by the user
* Improve the search bar by using levenshtein distance, for easier questions match
* Try and connect more data, to be able to make more interesting visuals and analysis
