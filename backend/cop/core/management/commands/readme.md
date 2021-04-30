All migrations must be applied prior to creating licenses.
Before creating licenses, you must delete all licenses, or the Licenses table must be empty. 
This is necessary to avoid duplicate licenses.

Create License:


    python manage.py create_license


After that, in the admin panel, you can see the created licenses in the application "core".
