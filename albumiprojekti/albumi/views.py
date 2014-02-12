from django.shortcuts import render, get_object_or_404
from django.http import Http404, HttpResponse, HttpRequest, HttpResponseBadRequest, HttpResponseRedirect
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


def albumJson(request, albumiId, sivunumero=None):
    albumi = get_object_or_404(Albumi, pk=albumiId)
    jsonData = {'id': albumi.id,
                'nimi': albumi.nimi,
                'koko_x': albumi.koko_x,
                'koko_y': albumi.koko_y}
    jsonData['sivut'] = []
    if sivunumero:
        sivut = albumi.sivut.filter(sivunumero=sivunumero)
    else:
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
                 'koko_x': elementti.koko_x,
                 'koko_y': elementti.koko_y,
                 'kuva': None,
                 'teksti': None
                 }
            if elementti.kuva:
                e['kuva'] = {'id': elementti.kuva.pk,
                             'url': elementti.kuva.url,
                             'nimi': elementti.kuva.nimi}

            if elementti.teksti:
                e['teksti'] = {'id': elementti.teksti.pk,
                               'teksti': elementti.teksti.teksti}

            s['elementit'].append(e)

        jsonData['sivut'].append(s)

    jsonData = json.dumps(jsonData)
    callback = request.GET.get('callback', None)
    if callback:
        jsonData = u'{0}({1})'.format(callback, jsonData)
    return HttpResponse(jsonData, content_type="application/json")


def tallennus(request):
    if not request.is_ajax():
        return HttpResponse("Ei ajax")

    json = request.raw_post_data
    albumiData = json.loads(json)
    if 'id' in albumiData:
        albumi = Albumi.objects.get(pk=albumiData['id'])
    else:
        albumi = Albumi()

    albumi.nimi = albumiData['nimi']
    albumi.save()

    return HttpResponse(status=201)



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
