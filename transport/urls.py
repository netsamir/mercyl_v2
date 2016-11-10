from django.conf.urls import url
from django.conf import settings
from django.conf.urls.static import static

from .views import TransportView

urlpatterns = [
    url(r'^$',
        TransportView.as_view(),
        name='transport'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
