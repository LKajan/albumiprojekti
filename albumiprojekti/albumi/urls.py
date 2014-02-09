from django.conf.urls import patterns, include, url

from views import *

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'albumiprojekti.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', index),
    url(r'albumi/(\d+).json', albumJson),
    url(r'albumi/(\d+)/(\d+).json', albumJson),
    url(r'albumi/(\d+)$', albumi),
    url(r'albumi/(\d+)/muokkaa', albumiMuokkaus),
)
