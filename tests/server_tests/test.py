import unittest
from server import app

app.testing = True


class MyTestCase(unittest.TestCase):
    def test_main_lang_ru(self):
        with app.test_client() as client:
            client.set_cookie("localhost", "lang", "ru")
            response = client.get("/", follow_redirects=True)
        self.assertEqual(response.status, "200 OK")

    def test_main_lang_en(self):
        with app.test_client() as client:
            client.set_cookie("localhost", "lang", "en")
            response = client.get("/", follow_redirects=True)
        self.assertEqual(response.status, "200 OK")


if __name__ == '__main__':
    unittest.main()
