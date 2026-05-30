# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
# gcc and python3-dev are sometimes needed for building some Python packages like spacy or its dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Download the spacy model
RUN python -m spacy download en_core_web_sm

# Copy the rest of the application code
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY README.md .

# Expose port 8000 for the FastAPI server
EXPOSE 8000

# Set environment variables for production
ENV APP_ENV=production
ENV APP_HOST=0.0.0.0
ENV APP_PORT=8000

# Run uvicorn when the container launches
# Assuming backend.main:app is the FastAPI instance
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
