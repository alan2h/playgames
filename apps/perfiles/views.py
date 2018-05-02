
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.shortcuts import render
from django.views.generic import CreateView, ListView


class UserCreateView(CreateView):

    form_class = UserCreationForm
    model = User
    template_name = 'perfiles/perfil_form.html'
    success_url = '/perfiles/alta'

    def get_context_data(self, **kwargs):
        context = super(UserCreateView, self).get_context_data(**kwargs)
        context['usuarios'] = User.objects.all()
        return context
