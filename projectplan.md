Projektisuunnitelma
===============

### CSE-C3210 Web Software Development  
17.12.2013  
Lauri Kajan, 69698H  
Juho Myrsky, 63137A  
Pekka Aaltonen, 67278W  


Toteutettavat toiminnallisuudet
---------------

Tässä lista toteutettavista toiminnallisuuksista suurpiirteisessä toteuttamisjärjestyksessä.

__Albumien perustoiminnallisuus__

Albumit sisältävät sivuja, jotka sisältävät kuvia ja tekstejä. Toteutetaan albumien luonti, muokkaus, selaus ja poistaminen. Sivuja voi luoda ja poistaa. Kuvia ja tekstejä voi lisätä, muokata ja poistaa sivuilla.

Sivujen asettelu pyritään ajan riittäessä toteuttamaan HTML5 Canvaksen avulla käyttäjälle mahdollisimman vapaaksi.

__Käyttäjienhallinta__

Käyttäjienhallinta toteutetaan django.authin avulla. Projektiin toteutetaan perusominaisuudet: rekisteröinti, sisään- ja uloskirjautuminen sekä tilinhallinta.

Ajan riittäessä toteutetaan tarkempia käyttöoikeuksia albumeihin.

__Albumien tilaaminen__

Albumien tilaaminen käyttäen: http://payments.webcourse.niksula.hut.fi/

Ajan riittäessä laajennetaan tilauksien hallintaa ja toimitetaan tilattu albumi tilaajalle PDF-muodossa.

__Ajaxin käyttö__

Ajaxia pyritään käyttämään aina kun sen käyttö on mielekästä ja järkevää.

__Albumien julkiset linkit__

Toteutetaan jaettava julkinen linkki albumiin. 

Ajan riittäessä toteutetaan linkkeihin vapaaehtoinen salasanasuojaus.

__Albumien jakaminen__

Toteutetaan Facebook- ja Google+ -jakomahdollisuus.

__Ulkoisen kuvapalvelu-API:n integraatio__

Toteutetaan Flickr-kuvahaku ja löytyneiden kuvien lisäys omaan albumiin.

__Ulkoinen sisäänkirjautumispalvelu__

Ajan riittäessä projektiin toteutetaan ulkoinen sisäänkirjautuminen OpenID:n, Google Accountin tai Facebook Loginin avulla.


Sovelluksen arkkitehtuuri
---------------

### Mallit

__User__

Käytetään Djangon valmista käyttäjämallia

__Albumi__

Kuvaa yhtä käyttäjän luomaa albumia

- nimi
- omistaja (user)
- julkinen url
- salasana

__Sivu__

Kuvaa albumin sivua

- albumi
- sivunumero (järjestys albumissa)
- tyyppi (layout preset)
?- taustaväri


__Kuva__

Järjestelmään tallennettu (linkitetty) kuva

- nimi
- url

__SivunElementti__

Sivuilla on elementtejä, jotka voivat sisältää kuvan tai tekstiä. Elementillä on ulkonäköä ja sijaintia määrittäviä ominaisuuksia.

- sivu
- kuva (id)
- teksti
- koordinaatit
- leveys
- korkeus
- sisällön muotoilu
-- ankkuripiste
-- venytys, kierto yms.

### Näkymät

__Hahmoteltuja näkymiä ja ryhmiä:__  
* Albumin käsittely
* Sivun käsittely
* Sivuelementin käsittely
* Albumien / oman gallerian hallinta 
* Tilin hallinta
* Tilausten hallinta

__Hahmoteltuja toimintoja perusnäkymille:__

__Albumi__  
- listaa (kaikki albumit)
- ominaisuuden muokkaus
- luonti
- katselu
- muokkaus / tallennus
- tuhoaminen

__Sivu__  
- listaa (albumin sivut)
- katselu
(- muokkaus)
- luonti
- tuhoaminen

__Elementti__  
- listaa (sivun elementit)
(- muokkaus)
- luonti
- tuhoaminen

### CSS

Projektissa pyritään ensisijaisesti käyttämään Bootstrap-kirjastoa.

Projektinhallinta
---------------

Ryhmä pyrkii tapaamaan kasvotusten mahdollisimman usein, erityisesti projektin alkuvaiheessa. Tehtävät jaetaan yhteisesti osaamisen ja mielenkiinnon mukaan, mutta kaikkien ryhmäläisten ollessa suurin piirtein samalla viivalla, kaikki tulevat ainakin alustavasti osallistumaan projektin osa-alueisiin kokonaisvaltaisesti. Live-tapaamisten ulkopuolella kommunikoinnissa ja ryhmätyössä hyödynnetään esim. Google Hangouttia, Google Driveä ja GitHubin ominaisuuksia.

### Aikataulu

__Projektin aikataulusuunnitelma:__

20.12.2013: Projektisuunnitelman palautus  
5.1.2013: Sivun perustoiminnallisuus  
12.1.2013: Albumien toiminnallisuus  
19.1.2013: Käyttäjien hallinta  
26.1.2013: Albumien tilaaminen  
2.2.2013: Julkiset linkit, jakaminen ja ulkoisen kuvapalvelun integrointi  
9.2.2013: Ulkoinen sisäänkirjautumispalvelu  
[Aikaa viimeistelyyn]  
14.2.2013: Projektin palautus  
