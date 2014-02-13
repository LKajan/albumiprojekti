# -*- coding: utf-8 -*-

from django.shortcuts import render, get_object_or_404
from django.http import Http404, HttpResponse, HttpRequest, HttpResponseBadRequest, HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from albumi.forms import UserForm, KayttajaForm

from albumi.models import *
import json

# Create your views here.


def index(request):
    return render(request, "albumi/index.html")


def albumit(request):
    user = request.user
    if user.is_authenticated():
        albumit = Albumi.objects.filter(kayttaja=user)
    else:
        albumit = Albumi.objects.filter(julkinen=True)

    return render(request, 'albumi/albumit.html', {'albumit': albumit})


def albumi(request, albumiId):
    user = request.user
    albumi = get_object_or_404(Albumi, julkinenUrlID=albumiId)
    if albumi.julkinen or (user.is_authenticated() and albumi.kayttaja == user):
        return render(request, 'albumi/albumi.html', {'albumi': albumi})
    else:
        return render(request, 'registration/login.html')


@login_required
def albumiMuokkaus(request, albumiId):
    user = request.user
    if albumiId == 'uusi':
        albumi = None
    else:
        albumi = get_object_or_404(Albumi, julkinenUrlID=albumiId)

    if albumi is None or albumi.kayttaja == user:
        kuvat = Kuva.objects.filter(kayttaja=user)
        return render(request, 'albumi/albumiMuokkaus.html', {'albumi': albumi,
                                                              'kuvat': kuvat})
    else:
        return HttpResponse("Ei oikeuksia kyseiseen albumiin.")


def albumJson(request, albumiId):
    if albumiId == 'uusi':
        jsonData = json.dumps({})
    else:
        albumi = get_object_or_404(Albumi, pk=albumiId)
        jsonData = albumi.toJson()

    callback = request.GET.get('callback', None)
    if callback:
        jsonData = u'{0}({1})'.format(callback, jsonData)
    return HttpResponse(jsonData, content_type="application/json")


@login_required
@require_http_methods(["POST"])
def tallennus(request):
    if not request.is_ajax():
        return HttpResponse("Ei ajax")

    user = request.user

    jsonIn = request.body
    albumiData = json.loads(jsonIn)
    if 'id' in albumiData:
        albumi = Albumi.objects.get(pk=albumiData['id'])
    else:
        albumi = Albumi()
    if 'nimi' in albumiData:
        nimi = albumiData['nimi']
    else:
        nimi = u'Nimetön'
    albumi.nimi = nimi
    albumi.kayttaja = user
    albumi.koko_x = albumiData['koko_x']
    albumi.koko_y = albumiData['koko_y']
    albumi.save()

    for sivuData in albumiData['sivut']:
        if 'id' in sivuData:
            sivu = Sivu.objects.get(pk=sivuData['id'])
        else:
            sivu = Sivu()

        sivu.sivunumero = sivuData['sivunumero']
        sivu.albumi = albumi
        sivu.save()

        for elementtiData in sivuData['elementit']:
            if 'id' in elementtiData and  elementtiData['id'] is not None:
                elementti = SivunElementti.objects.get(pk=elementtiData['id'])
            else:
                elementti = SivunElementti()
            elementti.ankkuripiste_x = elementtiData['x']
            elementti.ankkuripiste_y = elementtiData['y']
            elementti.z = elementtiData['z']
            elementti.koko_x = float(elementtiData['koko_x'])
            elementti.koko_y = float(elementtiData['koko_y'])

            if 'kuva' in elementtiData:
                kuvaData = elementtiData['kuva']
                if 'id' in kuvaData:
                    kuva = Kuva.objects.get(pk=kuvaData['id'])
                else:
                    kuva = Kuva()
                kuva.url = kuvaData['url']
                if 'nimi' in kuvaData:
                    kuva.nimi = kuvaData['nimi']
                kuva.kayttaja = user
                kuva.save()

            elementti.kuva = kuva
            elementti.sivu = sivu

            elementti.save()

    jsonData = albumi.toJson()

    callback = request.GET.get('callback', None)
    if callback:
        jsonData = u'{0}({1})'.format(callback, jsonData)

    return HttpResponse(jsonData, content_type="application/json")



def rekisteroityminen(request):
    # A boolean value for telling the template whether the registration was successful.
    # Set to False initially. Code changes value to True when registration succeeds.
    registered = False

    # If it's a HTTP POST, we're interested in processing form data.
    if request.method == 'POST':
        # Attempt to grab information from the raw form information.
        # Note that we make use of both UserForm and UserProfileForm.
        user_form = UserForm(data=request.POST)
        profile_form = KayttajaForm(data=request.POST)

        # If the two forms are valid...
        if user_form.is_valid() and profile_form.is_valid():
            # Save the user's form data to the database.
            user = user_form.save()

            # Now we hash the password with the set_password method.
            # Once hashed, we can update the user object.
            user.set_password(user.password)
            user.save()

            # Now sort out the UserProfile instance.
            # Since we need to set the user attribute ourselves, we set commit=False.
            # This delays saving the model until we're ready to avoid integrity problems.
            profile = profile_form.save(commit=False)
            profile.kayttaja = user

            # Now we save the UserProfile model instance.
            profile.save()

            # Update our variable to tell the template registration was successful.
            registered = True

        # Invalid form or forms - mistakes or something else?
        # Print problems to the terminal.
        # They'll also be shown to the user.
        else:
            print user_form.errors, profile_form.errors

    # Not a HTTP POST, so we render our form using two ModelForm instances.
    # These forms will be blank, ready for user input.
    else:
        user_form = UserForm()
        profile_form = KayttajaForm()

    # Render the template depending on the context.
    return render(request, 'registration/rekisterointi.html', {'user_form': user_form,
                                                               'profile_form': profile_form,
                                                               'registered': registered})


def user_login(request):
    # If the request is a HTTP POST, try to pull out the relevant information.
    if request.method == 'POST':
        # Gather the username and password provided by the user.
        # This information is obtained from the login form.
        username = request.POST['username']
        password = request.POST['password']

        # Use Django's machinery to attempt to see if the username/password
        # combination is valid - a User object is returned if it is.
        user = authenticate(username=username, password=password)

        # If we have a User object, the details are correct.
        # If None (Python's way of representing the absence of a value), no user
        # with matching credentials was found.
        if user is not None:
            # Is the account active? It could have been disabled.
            if user.is_active:
                # If the account is valid and active, we can log the user in.
                # We'll send the user back to the homepage.
                login(request, user)
                return HttpResponseRedirect('/albumi/')
            else:
                # An inactive account was used - no logging in!
                return HttpResponse("Tunnuksesi on vanhentunut.")
        else:
            # Bad login details were provided. So we can't log the user in.
            print "Invalid login details: {0}, {1}".format(username, password)
            return HttpResponse("Invalid login details supplied.")

    # The request is not a HTTP POST, so display the login form.
    # This scenario would most likely be a HTTP GET.
    else:
        # No context variables to pass to the template system, hence the
        # blank dictionary object...
        return render(request, 'registration/login.html')
