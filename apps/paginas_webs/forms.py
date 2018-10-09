from django import forms

from .models import Slides


class SlidesForm(forms.ModelForm):

    imagen = forms.ImageField(required=True, widget=forms.FileInput(attrs=({
        'class': 'form-control'
    })))

    class Meta:
        fields = ['imagen']
        model = Slides
