"""
DocString
"""

from django.db import models

# Balance
class Fix_Cost(models.Model):
    """
    DocString
    """
    name = models.CharField(max_length=120, default='contadora')
    annual = models.DecimalField(max_digits=10, decimal_places=2, default=5124)
    currency = models.CharField(max_length=3, default='UYU')

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name

class Taxes(models.Model):
    """
    DocString
    """

    name = models.CharField(max_length=120, default='taxes')
    irae = models.DecimalField(max_digits=10, decimal_places=2, default=0.25)
    dividend = models.DecimalField(max_digits=10, decimal_places=2, default=0.05)
    currency = models.CharField(max_length=3, default='UYU')

    def __str__(self):
        return self.name

class Investment(models.Model):
    """
    DocString
    """
    name = models.CharField(max_length=120)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name

# CIF
class Transport_Anvers(models.Model):
    """
    DocString
    """
    name = models.CharField(max_length=120, default='generic')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=500)
    currency = models.CharField(max_length=3, default='EUR')

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name

class Bucket(models.Model):
    """
    DocString
    """
    size = models.CharField(max_length=120)

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.size

class Machine(models.Model):
    """Every machine has some features
    Default Values:

        Type Length (meter)  Width (meter) > 2.5m    Height  Weight (Tonne)
        Miniretro    3.63    0.00    0.00    4   exemple case 95 xt
        Excavadora   10.20   3.19    2.99    24  exemple volvo ec240
        Retroexcavadora 1    5.56    2.29    3.36    8
        Retroexcavadora 2    5.65    2.40    3.81    8
        dumper   10.20   2.85    3.42    8   exemple case 5860 sle
        Compactadora 4.22    0.00    2.99    9   exemple BW 174 AC-2
        Tractor 7710 8.16    2.93    3.37    18
        John Deer 6200   4.19    2.20    2.80    7
        chargeuse    8.16    2.93    3.37    18  exemple 924 G, Caterpillar
        Caterpillar 312 BL   7.61    2.49    2.89    3.054
        """

    kind = models.CharField(max_length=120, default='retroexcavadora')
    brand = models.CharField(max_length=120, default='Case')
    model = models.CharField(max_length=120, default='580 SLE')
    length = models.DecimalField(max_digits=10, decimal_places=2, default=5.56)
    width = models.DecimalField(max_digits=10, decimal_places=2, default=2.29)
    height = models.DecimalField(max_digits=10, decimal_places=2, default=3.80)
    weight = models.DecimalField(max_digits=10, decimal_places=2, default=8.0)
    comment = models.CharField(max_length=120, default='')
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.kind

class Cost_of_Purchase(models.Model):
    """
    All the price that are encountered for
    purchasing a machine
    """
    item = models.CharField(max_length=120)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=500)
    currency = models.CharField(max_length=3, default='EUR')
    checked = models.BooleanField()

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.item

class Cost_of_Sale(models.Model):
    """
    DocString
    """
    item = models.CharField(max_length=120, default='Mercyl')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=500)
    currency = models.CharField(max_length=3, default='USD')
    checked = models.BooleanField()

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.item

class Transport(models.Model):
    """
    DocString
    """
    name = models.CharField(max_length=120, default='Soccar Shipping Agency')
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=440)
    currency = models.CharField(max_length=3, default='EUR')

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name

class TaxCountry(models.Model):
    """
    DocString
    """
    country = models.CharField(max_length=120, default='Denmark')
    currency = models.CharField(max_length=3, default='EUR')
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=375)

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.country

class Inspection(models.Model):
    """
    DocString
    """
    name = models.CharField(max_length=120, default='Mevas')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=500)
    currency = models.CharField(max_length=3, default='EUR')

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name

# ---------------------------------------------------------------------------
# Uruguay
# ---------------------------------------------------------------------------

class Aduana(models.Model):
    """
    DocString
    """
    # -----------------------------------------------------------------------
    # Derechos Aduaneros
    # -----------------------------------------------------------------------
    city = models.CharField(max_length=120, default='Montevideo')
    guia_de_transito = models.DecimalField(max_digits=10, decimal_places=2, default=6)
    timbre_profesional = models.DecimalField(max_digits=10, decimal_places=2, default=6)

    # -----------------------------------------------------------------------
    # Pago oficiales
    # -----------------------------------------------------------------------
    recargo = models.DecimalField(max_digits=10, decimal_places=4, default=0.02)
    iva = models.DecimalField(max_digits=10, decimal_places=4, default=0.22)
    anticipo_iva = models.DecimalField(max_digits=10, decimal_places=4, default=0.1)
    cert_empadronamiento = models.DecimalField(max_digits=7, decimal_places=2, default=15)
    currency = models.CharField(max_length=3, default='USD')

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.city

class Tsa(models.Model):
    """ Tasa de Servicio Aduanero - Escala
    Default Values:

        CIF_low   | CIF_Up        | Porcentual | U$S
        0.00      | 25,000.00     | 0.20       | NA
        25,000.01 | 10,000,000.00 | NA         | 50.00

    """
    name = models.CharField(max_length=120, default='Escala 1')
    cif_low = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    cif_up = models.DecimalField(max_digits=10, decimal_places=2, default=25000.0)
    percentage = models.DecimalField(max_digits=10, decimal_places=4, default=0.2)
    fix = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='USD')

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name

class Extraordinario(models.Model):
    """ Escala
    Default Values:

        CIF Low    | CIF Up        | Price  |
        0.00       | 500.00        | 0.00   |
        500.01     | 1,000.00      | 12.00  |
        1,000.01   | 2,000.00      | 30.00  |
        2,000.01   | 8,000.00      | 48.00  |
        8,000.01   | 30,000.00     | 108.00 |
        30,000.01  | 100,000.00    | 240.00 |
        100,000.01 | 10,000,000.00 | 600.00 |

       """
    name = models.CharField(max_length=120, default='Escala 1')
    cif_low = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    cif_up = models.DecimalField(max_digits=10, decimal_places=2, default=500.0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    currency = models.CharField(max_length=3, default='USD')

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name

class Puerto(models.Model):
    """ Administration Nacional de Puertos - Escala

    Formula : CIF/Tone = Ratio
    Price = Ratio * Multiplicator
    Total price = Price + ley de Estiba (25% of price)
    Default Values :

        Ratio_Low    | Ratio_Up      | Multiplicator |
        0.00         | 500.00        | 13.00         |
        500.01       | 1,000.00      | 20.00         |
        1,000.01     | 1,500.00      | 39.00         |
        1,500.01     | 2,000.00      | 78.00         |
        2,000.01     | 2,500.00      | 111.00        |
        2,500.01     | 10,000,000.00 | 130.00        |

    """
    name = models.CharField(max_length=120, default='Escala 1')
    ratio_low = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ratio_up = models.DecimalField(max_digits=10, decimal_places=2, default=500)
    multiplicator = models.DecimalField(max_digits=6, decimal_places=2, default=13)
    ley_de_estiba = models.DecimalField(max_digits=6, decimal_places=2, default=0.25)
    currency = models.CharField(max_length=3, default='USD')

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name

class Kma(models.Model):
    """
    DocString
    """
    name = models.CharField(max_length=120, default='KMA')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=1500)
    currency = models.CharField(max_length=3, default='USD')

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name

class Flete(models.Model):
    """
    DocString
    """
    name = models.CharField(max_length=120, default='Full Cargo')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=800)
    currency = models.CharField(max_length=3, default='USD')

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name

class Honorarios(models.Model):
    """
    Default Values:

            cif_low | cif_up        | percentage |
        0.00        | 25,000.00     | 1.50       |
        25,000.01   | 50,000.00     | 1.25       |
        50,000.01   | 100,000.00    | 1.00       |
        100,000.01  | 250,000.00    | 0.75       |
        250,000.01  | 500,000.00    | 0.50       |
        500,000.01  | 10,000,000.00 | 0.20       |

        """
    name = models.CharField(max_length=120, default='Escala 1')
    despachante = models.CharField(max_length=120, default='Navatta')
    cif_low = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    cif_up = models.DecimalField(max_digits=10, decimal_places=2, default=25000)
    percentage = models.DecimalField(max_digits=10, decimal_places=4, default=1.5)
    currency = models.CharField(max_length=3, default='USD')

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name

class Gastos(models.Model):
    """
    DocString
    """
    despachante = models.CharField(max_length=120, default='Navatta')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=90)
    currency = models.CharField(max_length=3, default='USD')

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.despachante


class BankCost(models.Model):
    """
        8.1 Ordenes de pago recibidas del exterior
        Personas Físicas U$S 10.-
        Personas Jurídicas 1,5 por mil (mínimo U$S 25.- y maximo U$S 250.-)
        mas diferencia de cambio
        Las transferencias recibidas desde el exterior tienen costos de
        corresponsal de acuerdo a la tabla
        adjunta:
        Monto de la operacion Costo corresponsal
        U$S 101 – 500 U$S 10.-
        U$S 501 – 2000 U$S 15.-
        U$S 2001 – 20000 U$S 25.-
        Más de U$S 20000 U$S 35.-
        8.2 Transferencias enviadas al exterior
        Personas físicas 1,5 por mil (mínimo U$S 25.- y máximo U$S 250.-)
        mas diferencia de cambio más
        U$S 30.- de Swift.
        Personas Jurídicas1,8 por mil (mínimo U$S 30.- y máximo U$S 300.-)
        mas diferencia de cambio más
        U$S 30.- de Swift.
        Las transferencias enviadas al exterior tienen costos de corresponsal
        de acuerdo a la tabla adjunta:
        Monto de la operación Costo corresponsal
        U$S 101 – 500 U$S 15.-
        U$S 501 – 2.000 U$S 20.-
        U$S 2.001 – 20.000 U$S 30.-
        Más de U$S 20.000 U$S 40.-
        El cliente podra optar por asumir estos costos o que los mismos sean
        debitados al beneficiario,
        lo que debera quedar establecido en la instruccion de giro. Por
        defecto se asumira esta ultima opcion.
    """

    name = models.CharField(max_length=120, default='Itau')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=10)
    currency = models.CharField(max_length=3, default='USD')

    # transfer_out_local = models.DecimalField(max_digits=10, decimal_places=2, default=10)
    # transfer_in_local = models.DecimalField(max_digits=10, decimal_places=2, default=10)
    # transfer_out_international = models.DecimalField(max_digits=10, decimal_places=2, default=150)
    # commission_usd_eur = models.DecimalField(max_digits=10, decimal_places=2, default=10)

    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name
