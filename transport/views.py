from django.shortcuts import render
from django.views.generic import TemplateView

from .models import *


# Create your views here.
class TransportView(TemplateView):
    """The view for the TransportView"""

    template_name = 'transport/price.html'

    def _make_tuple(self, lst, n):
        for i in range(0, len(lst), n):
            val = lst[i:i+n]
            if len(val) == n:
                yield tuple(val)

    def get(self, request):
        title = "Machine price (Simulation)"
        machines = Machine.objects.all()
        cost_of_purchase = Cost_of_Purchase.objects.all()
        cost_of_sale = Cost_of_Sale.objects.all()
        cost_of_sale_tuple = list(self._make_tuple(Cost_of_Sale.objects.all(), 3))
        cost_of_purchase_tuple = list(self._make_tuple(Cost_of_Purchase.objects.all(), 3))
        transports = Transport.objects.all()
        taxcountrys = TaxCountry.objects.all()
        aduanas = Aduana.objects.all()
        fletes = Flete.objects.all()
        kmas = Kma.objects.all()
        inspections = Inspection.objects.all()
        tsas = Tsa.objects.all()
        extraordinarios = Extraordinario.objects.all()
        puertos = Puerto.objects.all()
        gastoss = Gastos.objects.all()
        honorarioss = Honorarios.objects.all()
        transport_anverss = Transport_Anvers.objects.all()
        fix_costs = Fix_Cost.objects.all()
        taxess = Taxes.objects.all()
        investments = Investment.objects.all()
        buckets = Bucket.objects.all()
        bank_costs = Bank_Cost.objects.all()

        context = {
            'title' : title,
            'machine' : machines,
            'cost_of_sale' : cost_of_sale,
            'cost_of_purchase' : cost_of_purchase,
            'cost_of_sale_tuple' : cost_of_sale_tuple,
            'cost_of_purchase_tuple' : cost_of_purchase_tuple,
            'transport' : transports,
            'taxcountry' : taxcountrys,
            'aduana' : aduanas,
            'flete' : fletes,
            'kma' : kmas,
            'inspection' : inspections,
            'tsa' : tsas,
            'extraordinario' : extraordinarios,
            'puerto' : puertos,
            'gastos' : gastoss,
            'honorarios' : honorarioss,
            'transport_anvers' : transport_anverss,
            'fix_cost' : fix_costs,
            'taxes' : taxess,
            'investment' : investments,
            'bucket' : buckets,
            'bank_cost' : bank_costs,
        }

        return render(request, self.template_name, context)
