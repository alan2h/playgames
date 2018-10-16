from django.views.generic import CreateView, DeleteView

from .models import Slides
from .forms import SlidesForm


class SlidesCreateView(CreateView):

    form_class = SlidesForm
    model = Slides
    template_name = 'paginas_webs/slide_form.html'
    success_url = '/slides/alta'

    def get_context_data(self, **kwargs):
        context = super(SlidesCreateView, self).get_context_data(**kwargs)
        context['object_list'] = Slides.objects.all()
        print(Slides.objects.all())
        return context


class SlidesDeleteView(DeleteView):

    model = Slides
    template_name = 'paginas_webs/slide_confirm_delete.html'
    success_url = '/slides/alta'
