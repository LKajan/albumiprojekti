from django.contrib import admin
from albumi.models import *
# Register your models here.


class SivutInline(admin.TabularInline):
    model = Sivu
    fk_name = "albumi"


class AlbumiAdmin(admin.ModelAdmin):
    inlines = [
        SivutInline,
    ]


class SivuAdmin(admin.ModelAdmin):
    pass


class SivuElementtiAdmin(admin.ModelAdmin):
    pass


class KuvaAdmin(admin.ModelAdmin):
    pass


class TekstiAdmin(admin.ModelAdmin):
    pass


class TilausAdmin(admin.ModelAdmin):
    pass

admin.site.register(Albumi, AlbumiAdmin)
admin.site.register(Sivu, SivuAdmin)
admin.site.register(SivunElementti, SivuElementtiAdmin)
admin.site.register(Kuva, KuvaAdmin)
admin.site.register(Teksti, TekstiAdmin)
admin.site.register(Tilaus, TilausAdmin)
