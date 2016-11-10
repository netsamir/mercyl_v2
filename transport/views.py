from django.shortcuts import render
from django.views.generic import TemplateView

from .models import *


# Create your views here.
class TransportView(TemplateView):
    """The view for the TransportView"""

    template_name = 'transport/price.html'
    
    def get(self, request):
        title = "Machine price (Simulation)"
        machines = Machine.objects.all()
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
        cost_sells = Cost_Sell.objects.all()
        cost_purchases = Cost_Purchase.objects.all()
        bank_costs = Bank_Cost.objects.all()

        context = {
            'title' : title,
            'machine' : machines,
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
            'cost_sell' : cost_sells,
            'cost_purchase' : cost_purchases,
            'bank_cost' : bank_costs,
        }

        return render(request, self.template_name, context)
