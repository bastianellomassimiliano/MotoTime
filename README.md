# Moto Time

Catalogo statico per confrontare 24 moto adventure, crossover, touring e sport touring.

## Funzioni

- filtro multiplo per marca;
- range di prezzo, potenza e coppia;
- visualizzazione a griglia o lista;
- scheda dedicata con tre immagini e collegamento alla ricerca foto;
- confronto fino a cinque modelli;
- dati e immagini conservati nel repository, senza database e senza backend;
- deploy automatico su GitHub Pages.

## Avvio locale

Il progetto non richiede installazione o build.

```powershell
python -m http.server 4173
```

Aprire `http://127.0.0.1:4173`.

## Struttura

```text
assets/
  css/styles.css
  images/motos/
  js/
data/
  motorcycles.js
  image-credits.json
scripts/
  download-images.ps1
index.html
detail.html
compare.html
credits.html
```

## Immagini

Il repository contiene tre immagini locali per ciascuno dei 24 modelli. Le attribuzioni disponibili sono elencate nella pagina `credits.html`.

## Dati

I prezzi sono indicativi per il mercato italiano e possono variare per promozioni, colore, allestimento e immatricolazione. I costruttori non adottano tutti lo stesso metodo di pesatura: la pagina crediti riporta questa limitazione e collega la scheda ufficiale di ogni modello.
