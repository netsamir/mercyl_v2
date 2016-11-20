"""
Admin of Transport
"""
from django.contrib import admin

# Register your models here.
from .models import (Machine,
                     Cost_of_Purchase,
                     Cost_of_Sale,
                     Transport,
                     TaxCountry,
                     Aduana,
                     Flete,
                     Kma,
                     Inspection,
                     Tsa,
                     Extraordinario,
                     Puerto,
                     Gastos,
                     Honorarios,
                     Transport_Anvers,
                     Bucket,
                     BankCost)

class MachineModelAdmin(admin.ModelAdmin):
    """
    Admin view
    """
    list_display = ["kind", "brand", "model", "length", "width", "height",
                    "weight", "comment", "timestamp", "updated"]
    class Meta:
        model = Machine

admin.site.register(Machine, MachineModelAdmin)
admin.site.register(Transport)
admin.site.register(Cost_of_Purchase)
admin.site.register(Cost_of_Sale)
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
admin.site.register(BankCost)
admin.site.register(Bucket)
admin.site.register(Transport_Anvers)
