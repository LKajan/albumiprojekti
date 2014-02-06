# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Albumi(models.Model):
    nimi = models.CharField(max_length="100")
    kayttaja = models.ForeignKey(User)

    koko_x = models.PositiveIntegerField()  # Albumin sivun leveys px
    koko_y = models.PositiveIntegerField()  # Albumin sivun korkeus px

    # TODO: julkinenUrlID (joku 10 merkkiä pitkä random id? Vai voidaanko käyttää pelkästään primary-key:tä)
    # TODO: Albumin salasana

    # TODO: Albumilla voisi olla myös jokin kansikuva? Sen voisi tehdä samalla tekniikalla kuin muutkin sivut.

    __unicode__ = nimi


class Sivu(models.Model):
    albumi = models.ForeignKey(Albumi, related_name='sivut', related_query_name="sivu")
    sivunumero = models.PositiveIntegerField()

    # TODO: asetteluTyyppi
    class Meta:
        ordering = ['sivunumero']


class Kuva(models.Model):
    '''Järjestelmään tallennettu (linkitetty) kuva'''

    kayttaja = models.ForeignKey(User, null=True, blank=True)
    url = models.URLField()
    nimi = models.CharField(max_length=100)



    # TODO: tageja. Taggit applikaatio tekee tämän helposti. Käytetäänkö sitä?


class Teksti(models.Model):
    teksti = models.TextField()


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
