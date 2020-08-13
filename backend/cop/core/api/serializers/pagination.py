from collections import OrderedDict

from django.conf import settings
from rest_framework import pagination
from rest_framework.response import Response


class Pagination(pagination.PageNumberPagination):
    page_size_query_param = 'page_size'
    page_size = settings.REST_FRAMEWORK['PAGE_SIZE']
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('total_pages', self.page.paginator.num_pages),
            ('page_number', self.page.number),
            ('page_size', self.get_page_size(self.request)),
            ('results', data),
        ]))
