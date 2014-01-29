from django.shortcuts import render, render_to_response, get_object_or_404, RequestContext
from django.http import Http404, HttpResponse, HttpRequest, HttpResponseBadRequest

from albumi.models import *
import json

# Create your views here.


def index(request):
    return render_to_response("albumi/index.html")


def albumJson(request, albumiId):
    jsonData = []
    albumi = get_object_or_404(Albumi, pk=albumiId)
    sivut = albumi.sivut.all()
    for sivu in sivut:
        s = {'id': sivu.pk,
             'sivunumero': sivu.sivunumero,
             'elementit': []}
        elementit = sivu.elementit.all()
        for elementti in elementit:
            e = {'id': elementti.pk,
                 'x': elementti.ankkuripiste_x,
                 'y': elementti.ankkuripiste_y,
                 'z': elementti.z,
                 'koko_X': elementti.koko_x,
                 'koko_y': elementti.koko_y,
                 'kuva': None,
                 'teksti': None
                 }
            if elementti.kuva:
                e['kuva'] = {'id': elementti.kuva.pk,
                             'url': elementti.kuva.url}

            if elementti.teksti:
                e['teksti'] = {'id': elementti.teksti.pk,
                               'teksti': elementti.teksti.teksti}

            s['elementit'].append(e)

        jsonData.append(s)

    jsonData = json.dumps(jsonData)
    callback = request.GET.get('callback', None)
    if callback:
        jsonData = u'{0}({1})'.format(callback, jsonData)
    return HttpResponse(jsonData, content_type="application/json")
