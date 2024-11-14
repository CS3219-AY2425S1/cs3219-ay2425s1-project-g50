from pydantic import BeforeValidator
from typing import Annotated

'''
Pydantic does not directly support mapping of MongoDB's id fields. Workaround is used as such to allow for
mapping of this field.

Source:
https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/#the-_id-attribute-and-objectids
'''
PyObjectId = Annotated[str, BeforeValidator(str)]
