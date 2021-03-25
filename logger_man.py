import os
import threading
import datetime
import traceback


class LoggerMan:
    __instance = None
    __log_file = None
    __mutex_create = threading.Lock()
    __mutex_log = threading.Lock()
    __path_to_log = os.path.join(os.path.dirname(__file__), "error_log.txt")

    def __new__(cls):
        with cls.__mutex_create:
            if not cls.__instance:
                cls.__instance = super(LoggerMan, cls).__new__(cls)
            return cls.__instance

    def __init__(self):
        with self.__mutex_log:
            if not self.__log_file:
                self.__log_file = open(self.__path_to_log, "a")

    def log(self, exception):
        """
        :param exception: sys.exc_info() object
        """
        with self.__mutex_log:
            try:
                log_size = self.check_size()

                # Log file size in megabytes
                if log_size > 1:
                    self.archive_log()

                time = datetime.datetime.now().astimezone()

                self.__log_file.write("*" * 20 + "\n")
                self.__log_file.write(time.strftime("%Y-%m-%d %H:%M:%S") + "\n")
                traceback.print_exception(*exception, file=self.__log_file)
                self.__log_file.write("\n")
                self.__log_file.flush()
            except Exception:
                pass

    def check_size(self):
        """
        Check log file size in bytes and return size in megabytes
        :return float: log file size in MB
        """
        try:
            log_size = os.path.getsize(self.__path_to_log)
            return float("{:.2f}".format(log_size / 1024 / 1024))
        except Exception:
            pass

    def archive_log(self):
        try:
            self.__log_file.close()
            if not os.path.exists("./logs_archive"):
                os.mkdir("logs_archive")
            time = datetime.datetime.now().astimezone()
            time = time.strftime("%Y-%m-%d_%H:%M:%S")
            path_to_archive = os.path.dirname(__file__) + "/logs_archive/log_" + time + ".txt"

            files_in_archive = os.listdir(path="./logs_archive")

            # Number of log files in archive
            if len(files_in_archive) > 3:
                files_in_archive.sort(
                    key=lambda x: os.path.getmtime(os.path.join("logs_archive", x)), reverse=True
                )

                log_to_remove = files_in_archive.pop()

                os.remove(os.path.join("logs_archive", log_to_remove))

            os.renames(self.__path_to_log, path_to_archive)

            self.__log_file = open(self.__path_to_log, "a")
        except Exception:
            pass
