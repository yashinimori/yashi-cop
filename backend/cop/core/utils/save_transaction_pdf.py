import os
from io import BytesIO

from django.template.loader import get_template
from xhtml2pdf import pisa

from config.settings import base as settings
from cop.utils.storages import PrivateMediaRootS3Boto3Storage
from django.core.files.base import File


def save_transaction_pdf(transaction):
    base_directory = os.path.join(settings.MEDIA_ROOT, 'pdf')
    if not os.path.exists(base_directory):
        os.mkdir(base_directory)

    path_pdf = os.path.join(base_directory, f'{transaction.utrnno}.pdf')
    media_path = os.path.join('pdf', f'{transaction.utrnno}.pdf')

    if not os.path.exists(path_pdf):
        html = render_transaction_for_pdf(transaction)
        with open(path_pdf, 'w+b') as result:
            pdf = pisa.pisaDocument(BytesIO(html.encode('UTF-8')), result)

    media_storage = PrivateMediaRootS3Boto3Storage()
    unified_parts_file_obj = File(open(path_pdf, 'rb'))
    media_storage.save(media_path, unified_parts_file_obj)
    return media_path


def render_transaction_for_pdf(transaction):
    template = get_template('transaction/transaction_details.html')
    html = template.render({'object': transaction})
    return html
