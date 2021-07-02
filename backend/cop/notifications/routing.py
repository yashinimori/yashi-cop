#import django
#import os
#
#from channels.auth import AuthMiddlewareStack
#from channels.routing import URLRouter, ProtocolTypeRouter
#from django.urls import path

#from .consumers import NotificationConsumer
#from .middlewares import TokenAuthMiddleware

#application = ProtocolTypeRouter({
#    "websocket": TokenAuthMiddleware(
#        URLRouter([
#            path("", NotificationConsumer.as_asgi()),
#        ]),
#    )
#})
