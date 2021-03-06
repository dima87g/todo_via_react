import os
import configparser
from sqlalchemy import Column, INT, BIGINT, VARCHAR, create_engine, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base

config = configparser.ConfigParser()
config.read(os.path.dirname(__file__) + "/server_config.ini")
db_config = config["data_base"]

Base = declarative_base()

engine = create_engine(
    "mysql+mysqlconnector://todo_list:12345@localhost/todo",
    echo=False,
    pool_size=int(db_config["pool_size"])
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

    # lists = relationship("List")

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

    # user = relationship("User")
    # tasks = relationship("Task")

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
    task_position = Column(BIGINT, nullable=True)
    list_id = Column(BIGINT, ForeignKey("lists.id", ondelete="CASCADE"),
                     nullable=False)

    # children = relationship("Task", back_populates="")
    # list = relationship("List")

    def __repr__(self):
        return "<Task(user_id = '%s', text = '%s', status = '%s', parent_id " \
               "= '%s', task_position = '%s', list_id = '%s')>" % (
                   self.user_id, self.text, self.status, self.parent_id,
                   self.task_position, self.list_id)


# if __name__ == "__main__":
#     Base.metadata.drop_all(engine)
# #
#     Base.metadata.create_all(engine)
#
#     dima = User(user_text_id="dimaTextId", user_name="dima",
#                 hashed_password="dimaHashedPassword")
#     kman = User(user_text_id="kmanTextId", user_name="kman",
#                 hashed_password="kmanHashedPassword")
#
#     session.add_all([dima, kman])
#
#     time.sleep(5)
#
#     session.commit()
#
#     dima_1st_list = List(user_id=dima.id, name="dima 1st list")
#     dima_2nd_list = List(user_id=dima.id, name="dima 2nd list")
#     kman_1st_list = List(user_id=kman.id, name="kman 1st list")
#
#     session.add_all([dima_1st_list, dima_2nd_list, kman_1st_list])
#
#     session.commit()
#
#     dima_1st_list_1st_task = Task(user_id=dima.id,
#                                   text="dima 1st list 1st task", status=0,
#                                   list_id=dima_1st_list.id)
#     dima_1st_list_2nd_task = Task(user_id=dima.id,
#                                   text="dima 1st list 2nd task", status=0,
#                                   list_id=dima_1st_list.id)
#     dima_1st_list_3rd_task = Task(user_id=dima.id,
#                                   text="dima 1st list 3rd task", status=0,
#                                   list_id=dima_1st_list.id)
#     dima_1st_list_4rs_task = Task(user_id=dima.id,
#                                   text="dima 1st list 4rs task", status=0,
#                                   list_id=dima_1st_list.id)
#     dima_2nd_list_1st_task = Task(user_id=dima.id,
#                                   text="dima 2nd list 1st task", status=0,
#                                   list_id=dima_2nd_list.id)
#
#     session.add_all(
#         [
#             dima_1st_list_1st_task,
#             dima_1st_list_2nd_task,
#             dima_1st_list_3rd_task,
#             dima_1st_list_4rs_task,
#             dima_2nd_list_1st_task
#         ]
#     )
#
#     session.commit()
#
#     dima_1st_list_1st_task.task_position = dima_1st_list_1st_task.id
#     dima_1st_list_2nd_task.task_position = dima_1st_list_2nd_task.id
#     dima_1st_list_3rd_task.task_position = dima_1st_list_3rd_task.id
#     dima_1st_list_4rs_task.task_position = dima_1st_list_4rs_task.id
#     dima_2nd_list_1st_task.task_position = dima_2nd_list_1st_task.id
#     dima_1st_list_2nd_task.parent_id = dima_1st_list_1st_task.id
#     dima_1st_list_4rs_task.parent_id = dima_1st_list_1st_task.id
#
#     session.add_all(
#         [
#             dima_1st_list_1st_task,
#             dima_1st_list_2nd_task
#         ]
#     )
#
#     session.commit()

    # print(dima)
    #
    # print(dima_1st_list)

    # print(f"dima lists: {dima.lists}")
    # print(f"kman lists: {kman.lists}")
    # print(kman_1st_list.user)
    # print(dima_1st_list_1st_task.list)
    # print(dima_1st_list_1st_task.children)
    # print(dima_1st_list_2nd_task.children)
    # print(dima_1st_list.tasks)
    # print(dima_2nd_list.tasks)

    # users = session.query(User).filter(User.user_name == "dima")
    #
    # print(users.first().hashed_password)
