Kuva-albumi -ohjelmointiprojekti
===============
**ryhmä: group-23-2013**

Albumi.fi-sivustolla voi luoda kuva-albumeita vaikka omasta lomamatkastaan.
Albumia voi esitellä ystävilleen julkaisemalla siihen linkin tai albumista voi tilata 
palvelun kautta kovakantisen albumikirjan.



Projektisuunnitelma
---------------

Projekti on vasta suunnittelu / toteutusvaiheessa.
Projektisuunnitelman löydät [docs/projectplan.md](docs/projectplan.md)


Kehitys
---------------

## Ympäristön pystyttäminen

```bash
mkdir albumi
cd albumi
git clone https://github.com/Aalto-U-Web-Software-Development-course/group-23-2013.git src
virtualenv env
env/bin/activate
pip install -r src/requirements.txt
cd src/albumiprojekti
manage.py syncdb --noinput
manage.py migrate albumi
```

### Eclipse-projektin luominen

1. Luo uusi yleinen projekti ja määritä se src-kansioon. 
2. Lisää pydeviin python-kääntäjä ja aseta se käyttämään äsken luodun virtuaaliympäristön python.exe:ä 
3. Määritä projekti ensiksi pydev-projektiksi ja sen jälkeen vielä django-projektiksi.
4. Aseta source-kansioksi albumiprojekti.
5. Määritä djangon manage.py ja settings moduulien polut

#### Debuggaus Eclipsellä

Etsi kansio, josta löytyy pydevd-moduuli ja lisää se projektin käyttämän python-kääntäjän 
PYTHONPATH-listaan. Poista --noreload käynnistysparametreista.

manage.py tiedostoon on lisätty debuggausta varten muutama rivi koodia.

Käynnistä remote debugger (debugger server). Käynnistä nyt djangoprojekti tavallisesti (runserver).
Nyt kaikki breakpointit toimii ja djangoserveri päivittyy automaattisesti kun tiedostoja muokkaa ja tallentaa.

### eclipsen muut lisäosat

"GitHub Flavored Markdown viewer" plugini tuntuu olevan ihan kätevä *.md tiedostojen editoinnissa.

## Projektin rakenne

Djangoprojektin nimi on albumiprojekti. Tämä projekti sisältää toistaiseksi yhden ohjelman nimeltä albumi.

Albumiprojektin alla olevassa static-kansiossa on yleisesti käytetyt js-kirjastot ja css-tyylitiedostot.

Albumi-applikaation alla olevassa static-kansiossa on applikaatiolle olennaiset tyylitiedostot ja js-tiedostot. 


## Mallien / tietokannan scheman päivitys
    
Projekti käyttää Djangon South-laajennosta tietokannan scheeman päivittämiseen.
South:n avulla tietokannan rakennetta voidaan päivittää ilman, että tietokantaa tarvitsee poistaa. 
South:n avulla myös tietokannan rakenteen historia pysyy tallessa, ja edelliseen tilanteeseen voidaan 
tarvittaessa palata.
    
Mallien muutokset voi päivittää tietokantaan seuraavasti:

```bash
manage.py schemamigration albumi [scheema päivityksen "nimi"] --auto
manage.py migrate albumi
```

## GIT

Pyritään pitämään master-branch aina mahdollisimman toimivana.
Tehdään ominaisuuksien lisäys aina omissa brancheissa, joihin voi vaikka pushata 
hieman keskeneräistäkin koodia vaikka muiden jatkettavaksi.

```bash
# Luodaan uusi branch ja siirrytään käyttämään sitä
git checkout -b newFeatureBranch
# tehdään jotain lisäyksiä ja commitoidaan kaikki muutokset
git commit -a -m "luotu kaikki modelit"
# Muokataan vielä jotain ja commitoidaan kaikki muutokset
git commit -a -m "päivitetty Kuva-modelia"
# vaihdetaan takaisin master-branchiin
git checkout master
# mergetään ilman fast-forwardia
git merge --no-ff newFeatureBranch
# poistetaan branch
git branch -d newFeatureBranch
git push origin master
```