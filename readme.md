
<h1> Sistema Maxikiosco y Drugstore  </h1>
<p> Requerimientos básicos: Python3 and Django 1.10 </p>


<p> Requerimientos de paquetes </p>
<pre>
	<code>
		appdirs==1.4.3
		Django==1.10
		django-filter==1.0.2
		djangorestframework==3.6.2
		httpie==0.9.9
		Markdown==2.6.8
		olefile==0.44
		packaging==16.8
		Pillow==4.0.0
		psycopg2==2.7.1
		Pygments==2.2.0
		pyparsing==2.2.0
		reportlab==3.4.0
		requests==2.14.2
		six==1.10.0
	<code>
</pre>

<pre>

	<code>
		Método de instalación:

		* Se debe crear la base de datos llamada sigdrugstore.
		El método de conexión es el siguiente:

		DATABASES = {
		    'default': {
		        'ENGINE': 'django.db.backends.postgresql_psycopg2',
		        'NAME': 'sigdrugstore',
		        'USER': 'xx',
		        'PASSWORD': 'xxxxxx',
		        'HOST': 'localhost',
		        'PORT': '5432',
		    }
		}
	</code>

</pre>
