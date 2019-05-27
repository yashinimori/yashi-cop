from django.conf import settings

from mastercardapicore import RequestMap, Config, APIException, OAuthAuthentication
from os.path import dirname, realpath, join
from mastercardmastercom import Queues


auth = OAuthAuthentication(settings.MASTERCOM_CONSUMER_KEY, settings.MASTERCOM_KEY, 
                           settings.MASTERCOM_KEY_ALIAS, settings.MASTERCOM_KEY_PASSWORD)
Config.setAuthentication(auth)
# Config.setDebug(True) # Enable http wire logging
# This is needed to change the environment to run the sample code. For production: use Config.setSandbox(False)
Config.setEnvironment("sandbox");


def list_queues():
    responseList = Queues.retrieveQueueNames()
    return responseList.get("list")


def get_queue_claims(queue_name):
    map_obj = RequestMap()
    map_obj.set("queue-name", queue_name)
    
    responseList = Queues.retrieveClaimsFromQueue(map_obj)
    return responseList.get("list")