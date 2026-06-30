# Use the official Python 3.11 slim image as the base image
FROM python:3.11-slim

# Set build-time environment variables to optimize Python performance
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file first to leverage Docker caching for dependencies
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose port 8080 (Cloud Run's default port, though it dynamically overrides this via the PORT environment variable)
EXPOSE 8080

# Start Uvicorn, binding to 0.0.0.0 and dynamically reading the PORT environment variable (falling back to 8080 if not set)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
