from rest_framework.response import Response
from rest_framework.decorators import api_view
from base.models import User, Location, Store, Product, Bookmark, Log, Review
from base.serializers import UserSerializer, LocationSerializer, StoreSerializer, ProductSerializer, BookmarkSerializer, LogSerializer, ReviewSerializer
from django.db.models import Count

# Create your views here.

@api_view(['GET'])
def hello(request):
  return Response('Hello World 🌎')

# Views for User data
@api_view(['GET'])
def getAllUsers(request):
  user = User.objects.all()
  serializer = UserSerializer(user, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def getUserData(request, uuid):
  try: 
    user = User.objects.get(uuid=uuid)
    serializer = UserSerializer(user)
    return Response(serializer.data)
  except:
    return Response(serializer.errors)

@api_view(['POST'])
def addNewUser(request):
  serializer = UserSerializer(data=request.data)
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data)
  else: 
    return Response(serializer.errors)

@api_view(['PATCH'])
def editUserData(request, uuid):
  try:
    user = User.objects.get(uuid=uuid)
    user.username = request.data.get('username', user.username)
    user.email = request.data.get('email', user.email)
    location_id = request.data.get('location')
    if location_id:
      location = Location.objects.get(pk=location_id)
      user.location_id = location.pk
    user.save()
    serializer = UserSerializer(user)
    return Response(serializer.data)
  except Exception as e:
    return Response({'error': str(e)})

@api_view(['DELETE'])
def deleteUser(request, uuid):
  user = User.objects.get(uuid=uuid)
  user.delete()
  return Response("User Deleted")

# Views for Bookmarks data
@api_view(['GET'])
def getUserBookmarks(request, uuid):
  try:
    bookmarks = Bookmark.objects.filter(user__uuid=uuid)
    serializer = BookmarkSerializer(bookmarks, many=True)
    return Response(serializer.data)
  except:
    return Response(serializer.errors)

@api_view(['POST'])
def addNewBookmark(request, uuid):
  product_id = request.data.get('product_id')
  user = User.objects.get(uuid=uuid)
  product = Product.objects.get(id=product_id)
  data = {
    "user": user.pk,
    "product": product.pk
  }
  serializer = BookmarkSerializer(data=data)
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data)
  else: 
    return Response(serializer.errors)

@api_view(['DELETE'])
def removeBookmark(request, uuid, bkmark_id):
  try:
    user = User.objects.get(uuid=uuid)
    bookmark = Bookmark.objects.get(id=bkmark_id, user=user)
    bookmark.delete()
    return Response("Bookmark Deleted")
  except Exception as e:
    return Response({'error': str(e)})

# Views for Product data
@api_view(['GET'])
def getProductDataById(request, id):
  try:
    product = Product.objects.get(pk=id)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)
  except:
    return Response(serializer.errors)
  
@api_view(['GET'])
def getProductDataByUser(request, uuid):
  try:
    user = User.objects.get(uuid=uuid)
    bookmarks = Product.objects.filter(bookmark__user_id=user)
    serializer = ProductSerializer(bookmarks, many=True)
    return Response(serializer.data)
  except:
    return Response(serializer.errors)
  
@api_view(['GET'])
def getProductDataByPrefecture(request, prefId):
  try:
    products = Product.objects.filter(location__id=prefId)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
  except Exception as e:
    return Response({'error': str(e)})
  
@api_view(['GET'])
def getProductDataByPopularity(request):
  try:
    products = Product.objects.annotate(num_bkmarks=Count('bookmark')).order_by("num_bkmarks").reverse()
    serializer = ProductSerializer(products[0:10], many=True)
    return Response(serializer.data)
  except Exception as e:
    return Response({'error': str(e)})

@api_view(['POST'])
def addNewProduct(request):
  serializer = ProductSerializer(data=request.data)
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data)
  else: 
    return Response(serializer.errors)

@api_view(['PATCH'])
def editProductData(request, id):
  try:
    product = Product.objects.get(pk=id)
    product.product_name = request.data.get('product_name', product.product_name)
    store = request.data.get('store')
    if store:
      store = Store.objects.get(store=store)
      product.store_id = store.id
    product.start_date = request.data.get('start_date', product.start_date)
    product.end_date = request.data.get('end_date', product.end_date)
    product.img_url = request.data.get('img_url', product.img_url)
    product.link_url = request.data.get('link_url', product.link_url)
    product.save()
    serializer = ProductSerializer(product)
    return Response(serializer.data)
  except Exception as e:
    return Response({'error': str(e)})

@api_view(['DELETE'])
def deleteProductData(request, id):
  product = Product.objects.get(pk=id)
  product.delete()
  return Response("Product Deleted")

# Views for Store data
@api_view(['GET'])
def getStoreDatabyId(request, id):
  try:
    store = Store.objects.get(pk=id)
    serializer = StoreSerializer(store)
    return Response(serializer.data)
  except:   
    return Response(serializer.errors)
  
@api_view(['GET'])
def getStoreDatabyPrefecture(request, prefecture):
  try:
    stores = Store.objects.filter(location__prefecture=prefecture)
    serializer = StoreSerializer(stores, many=True)
    return Response(serializer.data)
  except:   
    return Response(serializer.errors)

@api_view(['POST'])
def addNewStore(request):
  serializer = StoreSerializer(data=request.data)
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data)
  else: 
    return Response(serializer.errors)

@api_view(['PATCH'])
def editStoreData(request, id):
  try:
    store = Store.objects.get(pk=id)
    store.name = request.data.get('name', store.name)
    prefecture = request.data.get('prefecture')
    if prefecture:
      location = Location.objects.get(prefecture=prefecture)
      store.location_id = location.id
    store.save()
    serializer = StoreSerializer(store)
    return Response(serializer.data)
  except Exception as e:
    return Response({'error': str(e)})

@api_view(['DELETE'])
def deleteStoreData(request, id):
  store = Store.objects.get(pk=id)
  store.delete()
  return Response("Store Deleted")

@api_view(['POST'])
def addLocation(request):
  serializer = LocationSerializer(data=request.data)
  if serializer.is_valid():
    serializer.save()
  return Response(serializer.data)

# Views for Log data
@api_view(['GET'])
def getLogsForUser(request, uuid):
  try:
    user = User.objects.get(uuid=uuid)
    logs = Log.objects.filter(user__id=user.pk)
    serializer = LogSerializer(logs, many=True)
    return Response(serializer.data)
  except:
    return Response(serializer.errors)
  
@api_view(['POST'])
def addNewLog(request, uuid):
  user = User.objects.get(uuid=uuid)
  product_id = request.data.get('product')
  product = Product.objects.get(id=product_id)
  data = {
    "user": user.pk,
    "product": product.pk,
  }
  serializer = LogSerializer(data=data)
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data)
  else: 
    return Response(serializer.errors)
  
@api_view(['GET'])
def getUsersLoggedProducts(request, uuid):
  try:
    user = User.objects.get(uuid=uuid)
    logs = Product.objects.filter(log__user_id=user)
    serializer = ProductSerializer(logs, many=True)
    return Response(serializer.data)
  except:
    return Response(serializer.errors)

@api_view(['DELETE'])
def removeLog(request, uuid, log_id):
  try:
    user = User.objects.get(uuid=uuid)
    log = Log.objects.get(id=log_id, user=user)
    log.delete()
    return Response("Log Deleted")
  except Exception as e:
    return Response({'error': str(e)})
  
  
@api_view(['PATCH'])
def editReviewData(request, uuid, review_id):
  try:
    user = User.objects.get(uuid=uuid)
    review = Review.objects.get(id=review_id)
    if review.user.pk == user.pk:
      review.rating = request.data.get('rating', review.rating)
      review.comment = request.data.get('comment', review.comment)
      review.save()
    serializer = ProductSerializer(review)
    return Response(serializer.data)
  except Exception as e:
    return Response({'error': str(e)})
