import os
import configparser
from sqlalchemy import Column, INT, BIGINT, VARCHAR, BOOLEAN, Index, create_engine, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base

config = configparser.ConfigParser()
config.read(os.path.join(os.path.dirname(__file__), "server_config.ini"))

db_config = config["data_base"]

user = db_config["user"]
password = db_config["password"]
database = db_config["database"]
host = db_config["host"]
port = db_config["port"]

Base = declarative_base()

engine = create_engine(
    f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}",
    echo=False,
    pool_size=int(db_config["pool_size"]),
    pool_recycle=int(db_config["pool_recycle"])
)

Session = sessionmaker(bind=engine)


def make_session():
    return Session()


class User(Base):
    __tablename__ = "users"

    id = Column(BIGINT, nullable=False, primary_key=True, unique=True)
    user_text_id = Column(VARCHAR(128), nullable=False, unique=True)
    user_name = Column(VARCHAR(128), nullable=False, unique=True)
    hashed_password = Column(VARCHAR(255), nullable=False)

    def __repr__(self):
        return "<User(user_text_id = '%s', user_name = '%s', " \
               "hashed_password ='%s')>" % (self.user_text_id, self.user_name,
                                            self.hashed_password)


class List(Base):
    __tablename__ = "lists"

    id = Column(BIGINT, nullable=False, primary_key=True, unique=True)
    user_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"),
                     nullable=False)
    name = Column(VARCHAR(255), nullable=False)

    def __repr__(self):
        return "<List(user_id = '%s', name = '%s')>" % \
               (self.user_id, self.name)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(BIGINT, nullable=False, primary_key=True, unique=True)
    user_id = Column(BIGINT, nullable=False)
    text = Column(VARCHAR(255), nullable=False)
    status = Column(INT, nullable=False, default=0)
    parent_id = Column(BIGINT, ForeignKey("tasks.id", ondelete="CASCADE"),
                       nullable=True)
    list_id = Column(BIGINT, ForeignKey("lists.id", ondelete="CASCADE"),
                     nullable=False)
    task_position = Column(BIGINT)

    def __repr__(self):
        return "<Task(user_id = '%s', text = '%s', status = '%s', parent_id " \
               "= '%s', task_position = '%s', list_id = '%s')>" % (
                   self.user_id, self.text, self.status, self.parent_id,
                   self.task_position, self.list_id)


class Setting(Base):
    __tablename__ = "settings"

    id = Column(BIGINT, nullable=False, primary_key=True, unique=True)
    name = Column(VARCHAR(255), nullable=False)

    def __repr__(self):
        return "<Setting(id = '%s', name = '%s')>" % (self.id, self.name)


class UserSetting(Base):
    __tablename__ = 'user_settings'

    id = Column(BIGINT, nullable=False, primary_key=True, unique=True)
    user_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"),
                     nullable=False)
    setting_id = Column(BIGINT, ForeignKey("settings.id", ondelete="CASCADE"),
                        nullable=False)
    string_val = Column(VARCHAR(255), nullable=True)
    int_val = Column(BIGINT, nullable=True)
    bool_val = Column(BOOLEAN, nullable=True)

    def __repr__(self):
        return "<UserSetting(user_id = '%s', setting_id = '%s', string_val = '%s', int_val " \
               "= '%s', bool_val = '%s')>" % (
                   self.user_id, self.setting_id, self.string_val, self.int_val,
                   self.bool_val)


Index("task_position", Task.list_id, Task.task_position, unique=True)
Index("user_settings", UserSetting.user_id, UserSetting.setting_id, unique=True)

# Code above is for development purpose
if __name__ == "__main__":
    Base.metadata.drop_all(engine)

    Base.metadata.create_all(engine)

    session = make_session()

    test_user = User(
        id=1,
        user_text_id="jNDATAMOEE6AZwQCQiW1WWzaJttZoSMHZIBSyyAdEHjdlaptWoiDjl0bUSxjFbfA",
        user_name="test",
        hashed_password="pbkdf2:sha256:150000$IlDIHWhm$0da9b8158cf68227087c17750432cc409d8d1c5abb3f01c405bebe6f98a17fda"
    )

    test_user_2 = User(
        id=2,
        user_text_id="NhjcIK5C5eiANEyWO7ntw-DwNPnMEovn4narbIdu75jZ106bVs6amesUSgn--Bp-",
        user_name="qwerty",
        hashed_password="pbkdf2:sha256:150000$IlDIHWhm$0da9b8158cf68227087c17750432cc409d8d1c5abb3f01c405bebe6f98a17fda"
    )

    test_user_list = List(
        id=1,
        user_id=1,
        name="main"
    )

    test_user_2_list = List(
        id=2,
        user_id=2,
        name="main"
    )

    move_up_setting = Setting(
        name="Move to top by UP button"
    )

    setting_2 = Setting(
        name="Setting2"
    )

    setting_3 = Setting(
        name="setting3"
    )

    test_user_setting = UserSetting(
        user_id=1,
        setting_id=3,
        bool_val=False
    )

    test_user_setting_2 = UserSetting(
        user_id=1,
        setting_id=1,
        bool_val=True
    )

    test_user_2_setting = UserSetting(
        user_id=2,
        setting_id=2,
        bool_val=True
    )

    session.add(test_user)
    session.add(test_user_2)
    session.add(move_up_setting)
    session.add(setting_2)
    session.add(setting_3)

    session.commit()

    session.add(test_user_list)
    session.add(test_user_2_list)
    session.add(test_user_setting)
    session.add(test_user_setting_2)
    session.add(test_user_2_setting)

    session.commit()
