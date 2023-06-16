from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.getAllUsers),
    path('users/newUser/', views.addNewUser),
    path('users/<str:uuid>/', views.getUserData),
    path('users/<str:uuid>/edit/', views.editUserData),
    path('users/<str:uuid>/deletion/', views.deleteUser),
    path('users/<str:uuid>/reviews/', views.getReviewsForUser),
    path('users/<str:uuid>/reviews/products/', views.getUserReviewedProducts),
    path('users/<str:uuid>/reviews/newReview/', views.addNewReview),
    path('users/<str:uuid>/reviews/<int:review_id>/edit/', views.editReviewData),
    path('users/<str:uuid>/reviews/<int:review_id>/deletion/', views.removeReview),
    path('users/<str:uuid>/bookmarks/', views.getUserBookmarks),
    path('users/<str:uuid>/bookmarks/products/', views.getProductDataByUser),
    path('users/<str:uuid>/bookmarks/new/', views.addNewBookmark),
    path('users/<str:uuid>/bookmarks/<int:bkmark_id>/deletion/', views.removeBookmark),
    path('products/popular/', views.getProductDataByPopularity),
    path('products/newProduct/', views.addNewProduct),
    path('products/<int:id>/', views.getProductDataById),
    path('products/<int:id>/edit/', views.editProductData),
    path('products/<int:id>/deletion/', views.deleteProductData),
    path('stores/newStore/', views.addNewStore),
    path('stores/<int:id>/', views.getStoreDatabyId),
    path('stores/<int:id>/edit/', views.editStoreData),
    path('stores/<int:id>/deletion/', views.deleteStoreData),
    path('locations/newLocation/', views.addLocation),
    path('locations/<int:prefId>/products/', views.getProductDataByPrefecture),
    path('locations/<str:prefecture>/stores/', views.getStoreDatabyPrefecture),
]