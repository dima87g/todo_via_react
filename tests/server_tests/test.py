import unittest
from server import app
from alchemy_sql import Base, User, engine, make_session

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

    def test_main_lang_default(self):
        with app.test_client() as client:
            response = client.get(
                "/",
                follow_redirects=True
            )
        self.assertEqual(response.status, "200 OK")


class RegisterTests(unittest.TestCase):
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
        session = make_session()
        query = session.query(User).filter(User.user_name == "test")
        user = query.first()
        user_name = user.user_name
        session.close()
        self.assertEqual(data["ok"], True)
        self.assertEqual(user_name, "test")

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


class ApiTesting(unittest.TestCase):
    def setUp(self) -> None:
        Base.metadata.create_all(engine)

    def tearDown(self) -> None:
        Base.metadata.drop_all(engine)

    #
    # def test_user_Login_success(self):
    #     with app.test_client() as client:
    #         client.post(
    #             "/user_register",
    #             json={
    #                 "userName": "test",
    #                 "password": "Trcbjyt1"
    #             },
    #             follow_redirects=True
    #         )
    #         response = client.post(
    #             "/user_login",
    #             json={
    #                 "userName": "test",
    #                 "password": "Trcbjyt1"
    #             },
    #             follow_redirects=True
    #         )
    #         self.assertEqual(response.status, "200 OK")
    #
    # def test_user_login_not_exists(self):
    #     with app.test_client() as client:
    #         response = client.post(
    #             "/user_login",
    #             json={
    #                 "userName": "test",
    #                 "password": "Trcbjyt1"
    #             },
    #             follow_redirects=True
    #         )
    #         self.assertEqual(response.status, "401 UNAUTHORIZED")
    #
    # def test_user_login_wrong_password(self):
    #     with app.test_client() as client:
    #         client.post(
    #             "/user_register",
    #             json={
    #                 "userName": "test",
    #                 "password": "Trcbjyt1"
    #             },
    #             follow_redirects=True
    #         )
    #         response = client.post(
    #             "user_login",
    #             json={
    #                 "userName": "test",
    #                 "password": "trcbjyt1"
    #             },
    #             follow_redirects=True
    #         )
    #         self.assertEqual(response.status, "401 UNAUTHORIZED")
    #
    # def test_change_password_success(self):
    #     with app.test_client() as client:
    #         client.post(
    #             "/user_register",
    #             json={
    #                 "userName": "test",
    #                 "password": "Trcbjyt1"
    #             },
    #             follow_redirects=True
    #         )
    #         client.post(
    #             "/user_login",
    #             json={
    #                 "userName": "test",
    #                 "password": "Trcbjyt1"
    #             },
    #             follow_redirects=True
    #         )
    #         response = client.post(
    #             "/change_password",
    #             json={
    #                 "oldPassword": "Trcbjyt1",
    #                 "newPassword": "trcbjyt1"
    #             },
    #             follow_redirects=True
    #         )
    #         data = response.json
    #         self.assertEqual(data["ok"], True)

    def test_change_password_incorrect_password(self):
        with app.test_client() as client:
            client.post(
                "/user_register",
                json={
                    "userName": "test",
                    "password": "Trcbjyt1"
                },
                follow_redirects=True
            )
            client.post(
                "/user_login",
                json={
                    "userName": "test",
                    "password": "Trcbjyt1"
                },
                follow_redirects=True
            )
            response = client.post(
                "/change_password",
                json={
                    "oldPassword": "trcbjyt1",
                    "newPassword": "trcbjyt1"
                },
                follow_redirects=True
            )
            data = response.json

            expect = {
                         "ok": False,
                         "error_code": None,
                         "error_message": "Your password are incorrect!"
                     }
            self.assertEqual(data, expect)


if __name__ == '__main__':
    unittest.main()
