from storages.backends.s3boto3 import S3Boto3Storage


class StaticRootS3Boto3Storage(S3Boto3Storage):
    location = "static"
    default_acl = "public-read"


class MediaRootS3Boto3Storage(S3Boto3Storage):
    location = "media"
    file_overwrite = False


class LogsRootS3Boto3Storage(S3Boto3Storage):
    location = "logs"
    file_overwrite = False
    bucket_name = 'coplogs'
