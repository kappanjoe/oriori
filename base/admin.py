from django.contrib import admin
from .models import Location, Store, User, Product, Bookmark, Log, Review

# Register your models here.
admin.site.register(Location)
admin.site.register(Store)
admin.site.register(User)
admin.site.register(Product)
admin.site.register(Bookmark)
admin.site.register(Log)
admin.site.register(Review)