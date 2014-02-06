# -*- coding: utf-8 -*-

'''
Created on 27.1.2014

@author: pomelo
'''
import os, sys
from django.shortcuts import get_object_or_404
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from albumi.models import *

if __name__ == '__main__':
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "albumiprojekti.settings")

    testuser = User.objects.create_user('Tester', 'tester.tetson@aalto.fi', 'tester', first_name="Tester", last_name="Tetson")
    testuser.save()

    a = Albumi(kayttaja=testuser, nimi=u"Ensimmäinen testialbumi", koko_y=595, koko_x=842)
    a.save()

    sivu0 = Sivu(albumi=a, sivunumero=0)
    sivu0.save()
    sivu1 = Sivu(albumi=a, sivunumero=1)
    sivu1.save()
    sivu2 = Sivu(albumi=a, sivunumero=2)
    sivu2.save()

    kuva1 = Kuva(url="https://drive.google.com/uc?export=view&id=0BwbdYcPHdb1pMXU3MDM4b2xiSTg")
    kuva1.save()

    elementti = SivunElementti(sivu=sivu0,
                               kuva=kuva1,
                               ankkuripiste_x=50,
                               ankkuripiste_y=50,
                               koko_x=640,
                               koko_y=412)
    elementti.save()

    tilaus = Tilaus(kayttaja=testuser,
                    albumi=a,
                    tilausAika=datetime(2014, 1, 27, 16, 50),
                    maksettu=False,
                    hinta=109.45,
                    albuminKoko_x=209.90, albuminKoko_y=297.04)
    tilaus.save()
