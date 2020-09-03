from storages.backends.s3boto3 import S3Boto3Storage


class StaticRootS3Boto3Storage(S3Boto3Storage):
    location = "static"
    default_acl = "public-read"


class PrivateMediaRootS3Boto3Storage(S3Boto3Storage):
    location = "media"
    default_acl = 'private'
    file_overwrite = False


class LogsRootS3Boto3Storage(S3Boto3Storage):
    bucket_name = 'coplogs'
    location = "logs"
    default_acl = 'private'
    file_overwrite = False
