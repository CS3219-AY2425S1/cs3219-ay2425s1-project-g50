FROM python:3.12-slim AS base
WORKDIR /app
COPY requirements.txt .
RUN python -m venv .venv
RUN .venv/bin/pip install --no-cache-dir -r requirements.txt
COPY . .
CMD [".venv/bin/python", "app/main.py"]
