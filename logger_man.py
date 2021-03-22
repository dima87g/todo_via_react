import os
import datetime
import traceback


class LoggerMan:
    def __init__(self):
        self.file = open(os.path.dirname(__file__) + "/error_log.txt", "a")

    def log(self, exception):
        """
        :param exception: sys.exc_info() object
        """
        try:
            time = datetime.datetime.now().astimezone()
            self.file.write("*" * 20 + "\n")
            self.file.write(time.strftime("%Y-%m-%d %H:%M:%S") + "\n")
            traceback.print_exception(*exception, file=self.file)
            self.file.flush()
        except Exception:
            pass
