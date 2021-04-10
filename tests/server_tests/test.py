import unittest
from server import app
from alchemy_sql import Base, engine

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


class ApiTesting(unittest.TestCase):
    def setUp(self) -> None:
        Base.metadata.create_all(engine)

    def tearDown(self) -> None:
        Base.metadata.drop_all(engine)

    def test_user_register_success(self):
        with app.test_client() as client:
            response = client.post(
                "/user_register",
                json={
                    "userName": "test",
                    "password": "Trcbjyt1"
                },
                follow_redirects=True
            )
            data = response.json
        self.assertEqual(data["ok"], True)

    def test_user_register_integrity_error(self):
        with app.test_client() as client:
            client.post(
                "/user_register",
                json={
                    "userName": "test",
                    "password": "12345"
                },
                follow_redirects=True
            )

            response = client.post(
                "/user_register",
                json={
                    "userName": "test",
                    "password": "12345"
                },
                follow_redirects=True
            )
            data = response.json

            expect = {
                "error_code": 1062,
                "error_message": "Contact admin for log checking...",
                "ok": False
            }
            self.assertEqual(data, expect)


if __name__ == '__main__':
    unittest.main()
