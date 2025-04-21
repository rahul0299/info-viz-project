# Base image with Python 3.11
FROM python:3.11-slim

# Set environment vars
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set workdir
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source
COPY . .

# Run FastAPI with uvicorn (use reload=True for dev)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
