import base64
from datetime import datetime

from mastercardapicore import RequestMap, Config, APIException, OAuthAuthentication
from mastercardmastercom import Queues, Claims, Transactions, Chargebacks

from www.settings import MASTERCOM_CONSUMER_KEY, MASTERCOM_KEY, MASTERCOM_KEY_PASSWORD, MASTERCOM_KEY_ALIAS

auth = OAuthAuthentication(MASTERCOM_CONSUMER_KEY, MASTERCOM_KEY,
                           MASTERCOM_KEY_ALIAS, MASTERCOM_KEY_PASSWORD)
Config.setAuthentication(auth)
Config.setDebug(True)    # Enable http wire logging
# This is needed to change the environment to run the sample code. For production: use Config.setSandbox(False)
Config.setEnvironment("sandbox")


def out(response, key):
    print("%s--> %s" % (key, response.get(key)))


def err(message, value):
    print(message % value)


def err_obj(response, key):
    print("%s--> %s" % (key, response.get(key)))


def log_error(e):
    err("HttpStatus: %s", e.getHttpStatus())
    err("Message: %s", e.getMessage())
    err("ReasonCode: %s", e.getReasonCode())
    err("Source: %s", e.getSource())


def list_queues():
    responseList = Queues.retrieveQueueNames()
    return responseList.get("list")


def get_queue_claims(queue_name):
    map_obj = RequestMap()
    map_obj.set("queue-name", queue_name)

    responseList = Queues.retrieveClaimsFromQueue(map_obj)
    return responseList.get("list")


def retrieve_queue_names():
    try:
        responseList = Queues.retrieveQueueNames()
        response = responseList.get("list")
        return response
    except APIException as e:
        log_error(e)


def get_claims_from_queue(queue_name):

    try:
        mapObj = RequestMap()
        mapObj.set("queue-name", queue_name)
        responseList = Queues.retrieveClaimsFromQueue(mapObj)
        response = responseList.get("list")
        return response
    except APIException as e:
        log_error(e)
        if e.getHttpStatus() == 500 and Config.debug:    # sandbox fix
            hardcoded_data = [{'acquirerRefNum': '05103246259000000000126', 'claimId': '200002020654'}]
            return hardcoded_data


def retrieve_claim(claim_id):
    try:
        id = ""
        map = RequestMap()
        map.set("claim-id", claim_id)
        response = Claims.retrieve(id, map)
        return response
    except APIException as e:
        log_error(e)
        if e.getHttpStatus() == 500 and Config.debug:
            hardcoded_data = {
                'primaryAccountNum': '52751494691484000',
                'transactionId': 'FIEaEgnM3bwPijwZgjc3Te+Y0ieLbN9ijUugqNSvJmVbO1xs6Jh5iIlmpOpkbax79L8Yj1rBOWBACx+Vj17rzvOepWobpgWNJNdsgHB4ag',
                'acquirerRefNum': '55306608112341123451234',
                'dueDate': '2017-12-11',
                'chargebackDetails': [
                    {
                        'amount': '196.43',
                        'currency': 'USD',
                        'reasonCode': '4808',
                        'chargebackType': 'CHARGEBACK',
                    },
                    {
                        'amount': '196.43',
                        'currency': 'USD',
                        'reasonCode': '2001',
                        'chargebackType': 'SECOND_PRESENTMENT',
                    },
                    {
                        'amount': '61.64',
                        'currency': 'USD',
                        'reasonCode': '4807',
                        'chargebackType': 'ARB_CHARGEBACK',
                    }
                ]
            }
            return hardcoded_data


def get_authorization_details(claim_id, transaction_id):
    try:
        id = ""
        map = RequestMap()
        map.set("claim-id", claim_id)
        map.set("transaction-id", transaction_id)
        response = Transactions.retrieveAuthorizationDetail(id, map)
        return response
    except APIException as e:
        log_error(e)
        if e.getHttpStatus() == 500 and Config.debug:
            return {
                "banknetReferenceNumber": 'DYP1MRWD',
                "banknetDate": '170719',
                "cardAcceptorTerminalId": 'TERM-041',
                'mccMessageId': 'MCW',
                "cardAcceptorName": 'Test Name',
                "cardholderActivatedTerminalLevel": '6'
            }


def search_for_transactions(pan, acquirer_ref_number, start_date, end_date):
    try:
        mapObj = RequestMap()
        if acquirer_ref_number:
            mapObj.set("acquirerRefNumber", acquirer_ref_number)
        mapObj.set("primaryAccountNum", pan)
        mapObj.set("tranStartDate", start_date.strftime('%Y-%m-%d'))
        mapObj.set("tranEndDate", end_date.strftime('%Y-%m-%d'))

        response = Transactions.searchForTransaction(mapObj)
        return response.get("authorizationSummary")

    except APIException as e:
        log_error(e)


def get_transaction_summary(auth_transaction_id, banknet_reference_number, pan, transaction_date):
    try:
        transaction_date = datetime.strptime(transaction_date, '%d%m%y')
        search_date = f"{transaction_date.year}-{transaction_date.strftime('%m')}-{transaction_date.day}"
        mapObj = RequestMap()
        mapObj.set("bankNetRefNumber", banknet_reference_number)
        mapObj.set("primaryAccountNum", pan)
        mapObj.set("tranStartDate", search_date)
        mapObj.set("tranEndDate", search_date)

        response = Transactions.searchForTransaction(mapObj)
        authorization_summary = None
        clearing_summary = None
        for auth_summary in response.get("authorizationSummary"):
            if Config.debug:
                authorization_summary = auth_summary
            else:
                if auth_summary['transactionId'] == auth_transaction_id:
                    authorization_summary = auth_summary
            for cl_summary in auth_summary.get("clearingSummary"):
                # if Config.debug:
                clearing_summary = cl_summary
                # else:
                #     if item['transactionId'] == clearing_transaction_id:
                #         clearing_summary = item
        return authorization_summary, clearing_summary
    except APIException as e:
        log_error(e)


def grab_chargeback_details(claim_details):
    """Grab amount, currency, reason from every chargebackDetails."""
    chargeback_details = list()
    for item in claim_details.get("chargebackDetails"):
        chargeback_details.append({
            'currency': item.get('currency'),
            'amount': item.get('amount'),
            'reason_code': item.get('reasonCode'),
            'chargeback_type': item.get('chargebackType')
        })
    return chargeback_details


def populate_db(claim_id, claim_details, queue_name, transaction_id, pan):
    from bank.models import Chargeback, ChargebackDetail

    authorization_details = get_authorization_details(claim_id, transaction_id)

    banknet_reference_number = authorization_details.get('banknetReferenceNumber')
    banknet_date = authorization_details.get('banknetDate')

    transaction_summary, clearing_summary = get_transaction_summary(transaction_id, banknet_reference_number, pan, banknet_date)

    chargeback_details_list = grab_chargeback_details(claim_details)

    incoming_chargeback_data = {
        'claim_id': claim_id,
        'queue_name': queue_name,
        'transaction_id': transaction_id,
        'pan': pan,
        'acquirer_ref_num': claim_details.get('acquirerRefNum'),
        'due_date': claim_details.get('dueDate'),
        'card_acceptor_terminal_id': authorization_details.get('cardAcceptorTerminalId'),
        'authorization_date_and_time': clearing_summary.get('dateAndTimeLocal')
    }

    chargeback, created = Chargeback.objects.get_or_create(claim_id=claim_id, defaults=incoming_chargeback_data)
    chargeback_details = []

    if created:
        for d in chargeback_details_list:
            chargeback_details.append(ChargebackDetail(**d, chargeback=chargeback))
        ChargebackDetail.objects.bulk_create(chargeback_details)
    else:
        chargeback, created = Chargeback.objects.update_or_create(claim_id=claim_id, defaults=incoming_chargeback_data)

    if not chargeback.atm_transaction:
        find_atm_transaction(claim_id, pan, transaction_id, chargeback)


def find_atm_transaction(claim_id, pan, transaction_id, chargeback):
    from bank.models import Transaction
    response = get_clearing_details(claim_id, transaction_id)
    transaction = Transaction.objects.filter(card__startswith=pan[0:6], card__endswith=pan[-4:],
                                             auth_code=response.get('approvalCode'))
    chargeback.atm_transaction = transaction.first()
    chargeback.save()


def update_chargebacks():

    queues_data = retrieve_queue_names()

    for queue_data in queues_data:
        if not queue_data:
            continue
        queue_name = queue_data.get('queueName')
        claims = get_claims_from_queue(queue_name)

        for claim in claims:
            claim_id = claim.get('claimId')
            claim_details = retrieve_claim(claim_id)
            pan = claim_details.get('primaryAccountNum')
            transaction_id = claim_details.get('transactionId')
            transaction_id = transaction_id.split('#')[1] if '#' in transaction_id else transaction_id     # <ClearingSummary.transactionId>#<AuthorizationSummary.transactionId>
            populate_db(claim_id, claim_details, queue_name, transaction_id, pan)


def get_clearing_details(claim_id, transaction_id):
    try:
        map = RequestMap()
        map.set("claim-id", claim_id)
        map.set("transaction-id", transaction_id)
        response = Transactions.retrieveClearingDetail(id, map)
        return response
    except APIException as e:
        log_error(e)
        hardcoded_data = {
            "electronicCommerceSecurityLevelIndicator": '0',
            "mastercardMappingServiceAccountNumber": '5154676300000001',
            "cardholderAuthenticationMethod": '9',
            "approvalCode": '111111'
        }
        return hardcoded_data


def create_chargeback(claim_id, currency, message_text, amount, filename,
                      file_path, reason_code, chargeback_type="SECOND_PRESENTMENT"):
    try:
        with open(file_path, "rb") as pdf_file:
            pdf_base64 = base64.b64encode(pdf_file.read())

        doc_indicator = "true" if filename else "false"
        mapObj = RequestMap()
        mapObj.set("claim-id", claim_id)
        mapObj.set("currency", currency)
        mapObj.set("documentIndicator", doc_indicator)
        mapObj.set("messageText", message_text)
        mapObj.set("amount", amount)
        mapObj.set("fileAttachment.filename", filename)
        mapObj.set("fileAttachment.file", pdf_base64.decode())
        mapObj.set("reasonCode", reason_code)
        mapObj.set("chargebackType", chargeback_type)

        response = Chargebacks.create(mapObj)
        return response
    except APIException as e:
        log_error(e)
