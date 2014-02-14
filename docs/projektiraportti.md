Albumi.fi projektiraportti
===============

### Ryhmä 23

Ryhmästä on tippunut pois Juho ja Pekka.   
Jäljellä olen minä, Lauri Kajan 69698H.

Juho ja Pekka osallistuivat projektisuunnitelman kirjoittamiseen, mutta kaiken koodaamisen 
olen tehnyt yksin. Tästä syystä ohjelmasta puuttuu monia merkittäviä ja suunniteltuja ominaisuuksia. 
Jopa muutamia tehtävänannossa pakollisiksi merkittyjä.

### Heroku applikaatio
http://secret-escarpment-7082.herokuapp.com/albumi/

Projekti on julkaistu herokussa, mutta siinä on vielä kirjoitushetkellä jotakin ongelmaa 
staattisten tiedostojen
kanssa.


## Ohjelman ominaisuudet
En yksin tehden ehtinyt toteuttaa kaikkia suunniteltuja ominaisuuksia. 
Albumin tärkeimmät ominaisuudet kuitenkin toimivat.

### Toteutetut ominaisuudet
__Authentication (mandatory, 100-200 points)__   
Sovelluksessa toimii käyttäjien hallinta. Käyttäjä voi luoda oman tunnuksen ja tämän jälkeen luoda omia albumeita.
Albumin voi salata, jolloin sitä ei pääse muut katselemaan.

Tavoitepisteet: 200

__Basic album functionalities (mandatory, 250-500 points)__  
Sovelluksella pystyy luomaan uusia albumeita ja muokkaamaan vanhoja. Albumit on toteutettu html5 canvaksella, 
jolla voi raahata kuvia vapaasti. Sovelluksessa ei ole ennaltamääritettyjä layoutteja sivuille. 
Yksi merkittävä puute sovellukseen jäi. En ehtinyt toteuttaa teksimuotoisten kohteiden lisäämistä sivulle.

Tavoitepisteet: 450

__Public link to photo albums (max 70 points)__  
Albumia koskeva modeli luo jokaiselle albumille uniikin numerosarjan, josta muodostuu albumille linkki.
Albumia voi katsella tätä linkkiä käyttäen, jos se on asetettu julkiseksi.

Tavoitepisteet: 70

__Use of Ajax (max 100 points)__  
Sovellus käyttää ajaxia sivun rakenteen hakemiseen, sekä albumin tallennukseen.
Sivun rakenne heataan jsonina, josta javascriptillä muodostetaan sivulle canvakset.
Tallennettaessa sovellus lähettää POST-kutsun mukana muokatusta albumista json-sanoman Djangolle, joka 
tallentaa tiedot tietokantaan.

Tavoitepisteet: 80


### Toteutumatta jääneet ominaisuudet

__Order albums (mandatory, 50-200 points)__  
Albumien tilaamista en ehtinyt toteuttaa.

__Muut suunnitellut ominaisuudet__  
- Albumien jakaminen
- Ulkoisen kuvapalvelu-API:n integraatio
- Ulkoinen sisäänkirjautumispalvelu


## Sovelluksen rakenne

### Mallit

Mallit tässä sovelluksessa oli aika itsestään selvät.

Jokaisella Albumin osaa kuvaavalla malli-luokalla on metodi olion esittämiseksi 
jsonia vastaavana python rakenteena.

__Kayttaja__  
Viittaa Djangon normaaliin User-modeliin. Lisää käyttäjälle ominaisia tietoja 
kuten osoitteen ja puhelinnumeron. Näitä oli tarkoitus käyttää albumin tilauksen tekemisessä.

__Albumi__  
Albumi-mallilla on tiedot mm. sen nimestä, omistavasta käyttäjästä ja koosta.
Albumia ensimmäistä kertaa tallennettaessa se luo uniikin 12-numeroa pitkän id:n jota käytetään sen 
linkkinä.
- nimi
- kayttaja
- koko_x
- koko_y
- julkinen
- julkinenUrlID

__Sivu__  
- albumi
- sivunumero

__SivunElementti__  
Tämä on ehkä merkittävin luokka koko sovelluksessa. Jokaista albumin sivuilla olevaa kuvaa ja tekstiä 
vastaa yksi elementti, joka pitää kirjaa sen sijainnista, leveydestä ja korkeudesta.

Tavoitteena minulla oli myös toteuttaa elementtien kiertäminen ja rajaus.

- sivu = models.ForeignKey(Sivu, related_name='elementit', related_query_name="elementti")
- elementinTyyppi = models.CharField(max_length=3, choices=(('img', 'Kuva'), ('txt', 'Teksti')), blank=True)
- kuva = models.ForeignKey(Kuva, null=True, blank=True)
- teksti = models.ForeignKey(Teksti, null=True, blank=True)
- ankkuripiste_x = models.PositiveIntegerField()
- ankkuripiste_y = models.PositiveIntegerField()
- z
- koko_x
- koko_y

__Kuva__  
Tarkoitus oli vielä lisätä mahdollisuus lisätä kuvalle tageja, joidenka avulla kuvia olisi voinut etsiä.
- kayttaja
- url
- nimi

__Teksti__  
Tämä olisi ainoastaan tallentanut sivuilla olevat tekstit. En ehtinyt käyttää tätä missään.
- teksti

__Tilaus__  
Suunnittelin tämän luokan pitävän kirjaa tilauksista. Minkä kokoisen tuotteen asiakas on tilannut, milloin 
hän on sen tilannut ja onko tuote jo maksettu. Tilauksia en ehtinyt toteuttamaan.
- kayttaja = models.ForeignKey(User)
- albumi = models.ForeignKey(Albumi)
- tilausAika = models.DateTimeField()
- hinta = models.FloatField()
- maksettu = models.BooleanField()
- albuminKoko_x
- albuminKoko_y


### Näkymät
__index__  
palauttaa indeksi-sivun jos muuta ei ole pyydetty.

__albumit__  
ohjaa templateen, joka esittää joko omat tai julkiset albumit listana sivulla.

__albumi__  
ohjaa käyttäjän katselemaan albumia, jos albumi on julkinen tai sitten se on käyttäjän oma.

__albumiMuokkaus__  
login_reguired koristelulla varustettu näkymä ohjaa käyttäjän albumin muokkaussivulle.

__albumJson__  
palauttaa httpresponsena albumin rakennetta kuvaavan json-viestin.

__tallennus__  
vastaanottaa POST-kyselystä muokattua albumia kuvaavan json-viestin ja tallentaa tai päivittää sen 
mukaisesti tietokannan objektit.

Palauttaa vastaavan json-viestin, johon on lisätty uusien objektien id:t.

__poista__  
Poistaa tietokannasta albumin

__rekisteröinti__
Palauttaa käyttäjälle rekisteröintisivun tai sitten jos se on jo täytetty, niin luo uuden käyttäjän. 
Näkymä tallentaa ensiksi uuden User-objektin ja sen jälkeen siihen viittaavan Kayttaja-objektin.

### Forms
Käytin käyttäjän rekisteröinnissä djangon luomia lomakkeita. Omia custom-lomakkeita ei tarvinnut tehdä.

### Templatet
__albumi__  

__albumiMuokkaus__  

__albumit__  

__index__  

__login__  

__rekisteröinti__  

### JavaScriptit
Kutakin django-mallia vastaa yksi JS-luokka. Muokattavassa albumissa näistä on periytetty muokattavat versiot.

Löysin canvaksen käyttöön internetistä hyvät ohjeet ja kopioin aika paljon koodia valmiina. Silti itse tehtävää jäi paljon.
Varmasti canvaksen käyttöön olisi voinut käyttää myös jotain valmista APIa.
