from django.contrib import admin

# Register your models here.
from .models import *

class MachineModelAdmin(admin.ModelAdmin):
    list_display = ["kind", "brand", "model", "length", "width", "height",
                    "weight", "comment", "timestamp", "updated"]
    class Meta:
        model = Machine

admin.site.register(Machine, MachineModelAdmin)
admin.site.register(Transport)
admin.site.register(Cost_Purchase)
admin.site.register(TaxCountry)
admin.site.register(Aduana)
admin.site.register(Flete)
admin.site.register(Kma)
admin.site.register(Inspection)
admin.site.register(Tsa)
admin.site.register(Extraordinario)
admin.site.register(Puerto)
admin.site.register(Gastos)
admin.site.register(Honorarios)
admin.site.register(Cost_Sell)
admin.site.register(Bank_Cost)
admin.site.register(Fix_Cost)
admin.site.register(Investment)
admin.site.register(Bucket)
admin.site.register(Taxes)
admin.site.register(Transport_Anvers)
