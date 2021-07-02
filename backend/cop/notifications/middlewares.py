#from urllib.parse import parse_qs

#import logging
#from channels.auth import AuthMiddlewareStack
#from channels.db import database_sync_to_async
#from django.contrib.auth import get_user_model
#from django.contrib.auth.models import AnonymousUser
#from rest_framework_simplejwt.state import token_backend

#logger = logging.getLogger(__name__)


#@database_sync_to_async
#def get_user(token):
#    decoded_token = token_backend.decode(token)
#    return get_user_model().objects.get(id=decoded_token['user_id'])


#class TokenAuthMiddleware:
#    """
#    Token authorization middleware for Django Channels 2
#    """
#
#    def __init__(self, app):
#        # Store the ASGI application we were passed
#        self.app = app
#
#    async def __call__(self, scope, receive, send):
#        query_string = scope.get('query_string').decode('UTF-8')
#        qs_data = parse_qs(query_string)
#        if token := qs_data.get('token'):
#            token = token[0]

#        if token is None:
#            logger.exception("Missing token request parameter. Closing channel.")
#            raise ValueError("Missing token request parameter. Closing channel.")

#        try:
#            scope['user'] = await get_user(token)
#        except Exception as e:
#            print(e)
#            logger.exception("Could not decode token or user does not exist. %s" % e)
#            raise ValueError("Could not decode token or user does not exist. %s" % e)

#        if not scope['user']:
#            logger.info('WS Anonymous user')
#            scope['user'] = AnonymousUser()
#        return await self.app(scope, receive, send)


#TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
