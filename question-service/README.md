Dependencies: Python 12

## Setup
1. In the `question-service` directory, run `python -m venv .venv` to create a virtual environment.
2. Run `source .venv/bin/activate` for mac or `.venv/bin.activate` for windows to activate the virtual environment.
3. Run `pip install -r requirements.txt` to install all necessary dependencies.
4. Ensure you have a `.env` file in `question-service` with the question service mongoDB uri. 
5. To start the service, run `fastapi dev app.py`

Note: For VSCode to properly detect the venv, open the project with `question-service` as the root directory. If not, VSCode will not detect the venv properly and will scream at you for everything. 