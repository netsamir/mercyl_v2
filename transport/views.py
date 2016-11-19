"""
The view for the machine price simulator
"""

from django.shortcuts import render
from django.views.generic import TemplateView

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
                     Bank_Cost)

def make_tuple(lst, col):
    """
    Create a list of tuple from a flat list
    """
    for i in range(0, len(lst), col):
        val = lst[i:i+col]
        yield tuple(val)

# Create your views here.
class TransportView(TemplateView):
    """The view for the TransportView"""

    template_name = 'transport/price.html'

    def get(self, request):

        context = {
            'title' : "Machine price (Simulation)",
            'machine' : Machine.objects.all(),
            'cost_of_sale' : Cost_of_Sale.objects.all(),
            'cost_of_purchase' : Cost_of_Purchase.objects.all(),
            'cost_of_sale_tuple' :
                list(make_tuple(Cost_of_Sale.objects.all(), 3)),
            'cost_of_purchase_tuple' :
                list(make_tuple(Cost_of_Purchase.objects.all(), 3)),
            'transport' : Transport.objects.all(),
            'taxcountry' : TaxCountry.objects.all(),
            'aduana' : Aduana.objects.all(),
            'flete' : Flete.objects.all(),
            'kma' : Kma.objects.all(),
            'inspection' : Inspection.objects.all(),
            'tsa' : Tsa.objects.all(),
            'extraordinario' : Extraordinario.objects.all(),
            'puerto' : Puerto.objects.all(),
            'gastos' : Gastos.objects.all(),
            'honorarios' : Honorarios.objects.all(),
            'transport_anvers' : Transport_Anvers.objects.all(),
            'bucket' : Bucket.objects.all(),
            'bank_cost' : Bank_Cost.objects.all(),
        }

        return render(request, self.template_name, context)
