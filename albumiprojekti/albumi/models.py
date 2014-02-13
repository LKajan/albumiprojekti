# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth.models import User
import random, json
# Create your models here.


class Kayttaja(models.Model):
    kayttaja = models.OneToOneField(User)

    osoite_katu = models.CharField(max_length=60)
    osoite_postinumero = models.CharField(max_length=5)
    osoite_postitoimipaikka = models.CharField(max_length=20)

    puhelinnumero = models.CharField(max_length=15)

    # Override the __unicode__() method to return out something meaningful!
    def __unicode__(self):
        return self.kayttaja.username


def random_id(cls, field):
    while 1:
        code = str(random.random())[2:]
        try:
            cls.objects.get(**dict((field, code)))
        except:
            return code



class Albumi(models.Model):
    nimi = models.CharField(max_length="100")
    kayttaja = models.ForeignKey(User)

    koko_x = models.PositiveIntegerField()  # Albumin sivun leveys px
    koko_y = models.PositiveIntegerField()  # Albumin sivun korkeus px

    julkinen = models.BooleanField(default=False)
    julkinenUrlID = models.CharField(max_length=15, editable=False, unique=True)

    # TODO: julkinenUrlID (joku 10 merkkiä pitkä random id? Vai voidaanko käyttää pelkästään primary-key:tä)
    # TODO: Albumin salasana

    # TODO: Albumilla voisi olla myös jokin kansikuva? Sen voisi tehdä samalla tekniikalla kuin muutkin sivut.

    __unicode__ = nimi

    def save(self):
        if not self.id:
            while 1:
                code = str(random.random())[2:]
                try:
                    Albumi.objects.get(julkinenUrlID=code)
                except:
                    self.julkinenUrlID = code
                    break

        super(Albumi, self).save()


    def toJson(self):
        jsonData = {'id': self.id,
                    'nimi': self.nimi,
                    'julkinen': self.julkinen,
                    'koko_x': self.koko_x,
                    'koko_y': self.koko_y}
        jsonData['sivut'] = []

        sivut = self.sivut.all()
        jsonData['sivut'] = [sivu.toJson() for sivu in sivut]


        return json.dumps(jsonData)



class Sivu(models.Model):
    albumi = models.ForeignKey(Albumi, related_name='sivut', related_query_name="sivu")
    sivunumero = models.PositiveIntegerField()

    # TODO: asetteluTyyppi

    def toJson(self):
        elementit = self.elementit.all()
        s = {'id': self.pk,
             'sivunumero': self.sivunumero,
             'elementit': [elementti.toJson() for elementti in elementit]}

        return s

    class Meta:
        ordering = ['sivunumero']


class Kuva(models.Model):
    '''Järjestelmään tallennettu (linkitetty) kuva'''

    kayttaja = models.ForeignKey(User, null=True, blank=True)
    url = models.URLField()
    nimi = models.CharField(max_length=100, blank=True)

    # TODO: tageja. Taggit applikaatio tekee tämän helposti. Käytetäänkö sitä?

    def toJson(self):
        return {'id': self.pk,
                 'url': self.url,
                 'nimi': self.nimi}



class Teksti(models.Model):
    teksti = models.TextField()

    def toJson(self):
        return {'id': self.pk,
                'teksti': self.teksti}



class SivunElementti(models.Model):
    '''Sivuilla on elementtejä, jotka voivat sisältää kuvan tai tekstiä.
    Elementillä on ulkonäköä ja sijaintia määrittäviä ominaisuuksia.'''

    sivu = models.ForeignKey(Sivu, related_name='elementit', related_query_name="elementti")
    elementinTyyppi = models.CharField(max_length=3, choices=(('img', 'Kuva'), ('txt', 'Teksti')), blank=True)
    kuva = models.ForeignKey(Kuva, null=True, blank=True)
    teksti = models.ForeignKey(Teksti, null=True, blank=True)

    # ankkuripiste on tämän elementin vasen ylänurkka
    ankkuripiste_x = models.PositiveIntegerField()
    ankkuripiste_y = models.PositiveIntegerField()

    koko_x = models.PositiveIntegerField()
    koko_y = models.PositiveIntegerField()

    z = models.IntegerField()
    # TODO: kiertokulma
    # TODO: sisällön muotoilu (venytys, ankkuripiste, kiertokulma, tekstin fontti ja koko)

    def toJson(self):
        e = {'id': self.pk,
             'x': self.ankkuripiste_x,
             'y': self.ankkuripiste_y,
             'z': self.z,
             'koko_x': self.koko_x,
             'koko_y': self.koko_y,
             'kuva': None,
             'teksti': None
             }
        if self.kuva:
            e['kuva'] = self.kuva.toJson()
        if self.teksti:
            e['teksti'] = self.teksti.toJson()

        return e

    class Meta:
        ordering = ['z']



class Tilaus(models.Model):
    kayttaja = models.ForeignKey(User)
    albumi = models.ForeignKey(Albumi)

    tilausAika = models.DateTimeField()
    hinta = models.FloatField()
    maksettu = models.BooleanField()

    albuminKoko_x = models.PositiveIntegerField()  # Albumin sivun koko millimetreissä
    albuminKoko_y = models.PositiveIntegerField()  # Albumin sivun koko millimetreissä
