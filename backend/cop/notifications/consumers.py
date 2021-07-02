#import json
#from channels.generic.websocket import AsyncWebsocketConsumer


#class NotificationConsumer(AsyncWebsocketConsumer):
#    async def connect(self):
#        user = self.scope['user']
#        await self.accept()
#
#    async def disconnect(self, close_code):
#        pass
#
#    async def system_message(self, event):
#        message = event['message']
#        # Send message to WebSocket
#        await self.send(text_data=json.dumps({
#            'message': message
#        }))

