import hashlib


def generate_sha256(file):
    sha = hashlib.sha256()
    file.seek(0)
    while True:
        buf = file.read(104857600)
        if not buf:
            break
        sha.update(buf)
    sha256 = sha.hexdigest()
    file.seek(0)

    return sha256
