import base64
import hashlib
from Crypto.Cipher import AES
import os
import dotenv
#get from env variable
dotenv.load_dotenv()
salt = os.getenv("ENCRYPTION_SALT")
password = os.getenv("SECRET_KEY")


def decrypt(encrypted_data, password, salt):
    salt = base64.b64decode(salt)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 10000, dklen=32)
    data = base64.b64decode(encrypted_data)
    iv = data[:16]
    auth_tag = data[-16:]
    ciphertext = data[16:-16]
    cipher = AES.new(key, AES.MODE_GCM, iv)
    plaintext = cipher.decrypt_and_verify(ciphertext, auth_tag)
    return plaintext.decode('utf-8')

print('salt:', salt, 'password:', password)
encrypted_data = "aF9ktBUbV5ncgmUtzpkVa1QkDjBfoou1asAjAamfLiQ1p+rTEMmKx1ILUeKyU7pBdL24opT4k9ypU5btgQ==" # from Node.js


decrypted_data = decrypt(encrypted_data, password, salt)
print(decrypted_data)