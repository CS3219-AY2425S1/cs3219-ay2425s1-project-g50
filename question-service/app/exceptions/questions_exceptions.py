class DuplicateQuestionError(Exception):
    """Raised when a question with the same title already exists."""
    def __init__(self, title):
        self.title = title
        super().__init__(f"A question with the title '{title}' already exists.")

class QuestionNotFoundError(Exception):
    """Raised when a question with the given ID is not found."""
    def __init__(self, question_id):
        self.question_id = question_id
        super().__init__(f"Question with ID '{question_id}' not found.")

class BatchUploadFailedError(Exception):
    """Raised when batch upload fails to upload any questions successfully"""
    def __init__(self):
        super().__init__("No questions were added successfully")