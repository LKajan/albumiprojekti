from django.shortcuts import render, render_to_response, get_object_or_404, RequestContext
from django.http import Http404, HttpResponse, HttpRequest, HttpResponseBadRequest


# Create your views here.


def index(request):
    return render_to_response("albumi/index.html")