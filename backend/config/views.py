
from rest_framework_swagger.renderers import OpenAPIRenderer, SwaggerUIRenderer
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from rest_framework import schemas


@api_view()
@renderer_classes([OpenAPIRenderer, SwaggerUIRenderer])
def api_schema_view(request):
    # навигатор по всем эндпоинтам генерируется автоматом, область видимости - все дочерние (по url) endPoint'ы 
    generator = schemas.SchemaGenerator(title='SurveyQuestion swagger test API')
    return Response(generator.get_schema(request=request))
