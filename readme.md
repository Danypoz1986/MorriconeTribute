# Ennio Morricone - Elokuvamusiikin Tribuutti

Tämä sovellus on kunnianosoitus Ennio Morriconelle, yhdelle maailman tunnetuimmista elokuvamusiikin säveltäjistä. Sovellus tarjoaa käyttäjille interaktiivisen kokemuksen, jossa pääsee tutustumaan Morriconen ikonisimpaan musiikkiin ja elokuvakohtauksiin eri hallien kautta.

## Sovelluksen Toiminnot ja Ominaisuudet

### 1. Hallinäkymä
- Jokainen elokuvahalli esittää yhden Ennio Morriconen musiikilla sävytetyn elokuvakohtauksen.
- Hallinäkymässä näytetään:
  - **Laskentavideo**: Ennen päävideon alkamista jokaisessa hallissa toistetaan vanhan elokuvatyylin laskentavideo (countdown).
  - **Päävideo**: Päävideo: Itse elokuvakohtaus tai yhteenveto, jossa Morriconen musiikki luo voimakkaan ja tunteikkaan taustan.
  - **Videon otsikko**: Otsikko näkyy vain päävideon aikana, ei laskentavideon aikana.

### 2. Navigointi
- Siirry hallista toiseen helposti navigointipainikkeilla:
  - **Edellinen** ja **Seuraava** painikkeet siirtävät sinut taaksepäin tai eteenpäin halleissa.
  - Hallien valikon kautta voit siirtyä suoraan haluamaasi halliin.
- Jokainen navigaatio käyttää pehmeää siirtymää (fade-in ja fade-out), jotta käyttäjäkokemus on saumaton.

### 3. Dynaaminen Videonlataus
- Sovellus lataa kaikki videot ja niihin liittyvän metadatan (otsikot ja linkit) ulkoisesta JSON-tiedostosta:
  - Tiedosto sijaitsee osoitteessa: `https://storage.googleapis.com/p3videos/videos.json`.
  - Tämä mahdollistaa videoiden ja tietojen päivittämisen ilman muutoksia koodiin.

### 4. Hover-toiminnot
- Videoiden hallinta:
  - **Kontrollit näytetään, kun hiiren osoitin on videon päällä**.
  - Tämä ominaisuus lisää käyttäjäystävällisyyttä ja pitää käyttöliittymän selkeänä.


---

## Ohjelmointitoimintojen Selitys

### `initializeHalls()`
- Lataa videot ja niiden metatiedot jokaisen hallin elementtiin.
- Asettaa laskentavideon ja päävideon lähteet.
- Lisää hover-toiminnon videon kontrollien näyttämiseksi, kun käyttäjä vie hiiren videon päälle.

### `playMovie(hallElement)`
- **Toistaa valitun hallin videot**:
  - Käynnistää laskentavideon ja siirtyy sen päätyttyä päävideoon.
  - Näyttää videon otsikon vain päävideon aikana.
- Seuraa header-elementin korkeutta ja pysäyttää videon tarvittaessa.

### `updateHall(hallIndex)`
- Siirtyy hallien välillä visuaalisesti sujuvasti.
- Piilottaa vanhat hallit ja näyttää vain valitun hallin käyttäen fade-in ja fade-out -efektejä.

---

## Asennus ja Käyttöönotto

1. **Lataa tai kloonaa projekti**:
   ```bash
   git clone <repository-url> 
   ```

2. **Avaa projekti selaimessasi**:
    - Avaa ```index.html``` tiedosto selaimella.
    - Sovellus toimii parhaiten Firefox-selaimella.

3. **Netlify-käyttö**:
    - Jos sovellus on jo Netlifyssä, kaikki GitHubiin tehdyt päivitykset näkyvät automaattisesti Netlifyssä.
    - Varmista, että Netlify on yhdistetty GitHub-repositorioosi.

## Huomioita ja Ongelmanratkaisu

**CORS-ongelmat**
- Joissain tapauksissa videot eivät avaudu selaimessa CORS-rajoitusten vuoksi.
- Ratkaisuja:
    - Käytä selaimen laajennuksia, kuten "Allow CORS".
    - Palauta videot palvelimelle, joka tukee tarvittavia CORS-asetuksia.

**Siirtymäongelmat**
- Jos otsikot näkyvät väärässä paikassa (esim. laskentavideon aikana), varmista, että ```playMovie()```-funktio on implementoitu oikein.

## Projektirakenne
```
.
├── index.html      # HTML-pohja sovellukselle
├── style.css       # Tyylitiedosto
├── script.js       # JavaScript-toiminnallisuudet
└── videos.json     # Videoiden metatiedot
```
## Tulevat Kehityssuunnitelmat

  - Sovellus ei ole vielä täysin responsiivinen, mutta tavoitteena on tehdä siitä     käyttäjäystävällinen myös mobiililaitteilla ja tableteilla tulevissa päivityksissä.
  - Parantaa käytettävyyttä pienemmillä näytöillä säilyttäen sisältöjen mittasuhteet ja asemoinnin.
  - Lisätä tuki erikokoisille laitteille, mukaan lukien sekä pysty- että vaakasuunnassa käytettävät näytöt.
  - Pyrkiä varmistamaan, että sovellus toimii saumattomasti kaikilla nykyaikaisilla selaimilla, mukaan lukien Chrome, Edge, Safari ja Firefox.
  
## Tekijänoikeus
Tämä projekti on luotu kunnioittaen Ennio Morriconen musiikillista perintöä. Kaikki oikeudet videoihin ja musiikkiin kuuluvat alkuperäisille tekijänoikeuksien omistajille.

## Resurssit
- [Projektin Raportti]()
- [Videoesitys]()
- [Sovelluksen Verkkosivusto]()