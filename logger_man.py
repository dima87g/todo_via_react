import os
import threading
import datetime
import traceback


class LoggerMan:
    def __init__(self):
        self.mutex = threading.Lock()
        if not os.path.exists("./logs_archive"):
            os.mkdir("logs_archive")

        self.path_to_log = os.path.dirname(__file__) + "/error_log.txt"
        self.log_file = open(self.path_to_log, "a")

    def log(self, exception):
        """
        :param exception: sys.exc_info() object
        """
        self.mutex.acquire()
        try:
            log_size = self.check_size()

            if log_size > 1:
                self.archive_log()

            time = datetime.datetime.now().astimezone()
            self.log_file.write("*" * 20 + "\n")
            self.log_file.write(time.strftime("%Y-%m-%d %H:%M:%S") + "\n")
            traceback.print_exception(*exception, file=self.log_file)
            self.log_file.write("\n")
            self.log_file.flush()
        except Exception:
            pass
        finally:
            self.mutex.release()

    def check_size(self):
        try:
            log_size = os.path.getsize(self.path_to_log)
            return float("{:.2f}".format(log_size / 1024))
        except Exception:
            pass

    def archive_log(self):
        try:
            self.log_file.close()
            time = datetime.datetime.now().astimezone()
            time = time.strftime("%Y-%m-%d_%H:%M:%S")
            path_to_archive = os.path.dirname(__file__) + "/logs_archive/log_" + time + ".txt"

            files_in_archive = os.listdir(path="./logs_archive")

            if len(files_in_archive) > 3:
                files_in_archive.sort(
                    key=lambda x: os.path.getmtime(os.path.join("logs_archive", x)), reverse=True
                )

                log_to_remove = files_in_archive.pop()

                os.remove(os.path.join("logs_archive", log_to_remove))

            os.renames(self.path_to_log, path_to_archive)

            self.log_file = open(self.path_to_log, "a")
        except Exception:
            pass
