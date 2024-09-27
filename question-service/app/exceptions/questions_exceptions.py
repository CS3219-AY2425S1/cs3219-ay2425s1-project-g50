class DuplicateQuestionError(Exception):
    """Raised when a question with the same title already exists."""
    pass

class QuestionNotFoundError(Exception):
    """Raised when a question with the given ID is not found."""
    pass
class BatchUploadFailedError(Exception):
    """Raised when batch upload fails to upload any questions successfully"""